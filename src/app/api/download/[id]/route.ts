import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { formatDownloadUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }

    // Atomic increment and retrieve file info
    const updated = await db
      .update(products)
      .set({
        downloadCount: sql`${products.downloadCount} + 1`,
      })
      .where(eq(products.id, id))
      .returning({
        fileUrl: products.fileUrl,
        fileName: products.fileName,
        status: products.status,
      });

    if (!updated || updated.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = updated[0];

    // Only allow download if published
    if (product.status !== 'published') {
      return NextResponse.json({ error: 'Product is not available for download' }, { status: 404 });
    }

    // Generate direct download URL (supports Google Drive, Vercel Blob, direct CDN)
    const targetUrl = formatDownloadUrl(product.fileUrl);

    // 302 Redirect to file download URL
    return NextResponse.redirect(targetUrl, {
      status: 302,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Download redirect error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the download' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products, productImages, categories } from '@/db/schema';
import { productSchema } from '@/lib/validations';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { del } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

function isBlobStorageUrl(url: string): boolean {
  return url.includes('.public.blob.vercel-storage.com');
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    const found = await db
      .select({
        product: products,
        category: categories,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, id))
      .limit(1);

    if (!found || found.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, id))
      .orderBy(productImages.sortOrder);

    return NextResponse.json({
      ...found[0].product,
      category: found[0].category,
      images,
    });
  } catch (error) {
    console.error('Fetch product error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    const existing = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!existing || existing.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    const oldProduct = existing[0];

    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid product payload' },
        { status: 400 }
      );
    }

    const {
      title,
      slug,
      description,
      categoryId,
      tags,
      version,
      fileUrl,
      fileName,
      fileSize,
      fileType,
      coverImageUrl,
      images,
      status,
    } = parsed.data;

    // Check slug collision with other products
    const slugCheck = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    if (slugCheck.length > 0 && slugCheck[0].id !== id) {
      return NextResponse.json(
        { error: 'Another product already uses this URL slug' },
        { status: 409 }
      );
    }

    // Clean up replaced file blob if changed
    const blobsToDelete: string[] = [];
    if (oldProduct.fileUrl !== fileUrl && isBlobStorageUrl(oldProduct.fileUrl)) {
      blobsToDelete.push(oldProduct.fileUrl);
    }
    if (oldProduct.coverImageUrl !== coverImageUrl && isBlobStorageUrl(oldProduct.coverImageUrl)) {
      blobsToDelete.push(oldProduct.coverImageUrl);
    }

    // Existing gallery images
    const oldImages = await db.select().from(productImages).where(eq(productImages.productId, id));
    const newImageSet = new Set(images || []);
    for (const oldImg of oldImages) {
      if (!newImageSet.has(oldImg.url) && isBlobStorageUrl(oldImg.url)) {
        blobsToDelete.push(oldImg.url);
      }
    }

    if (blobsToDelete.length > 0 && process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_READ_WRITE_TOKEN.startsWith('vercel_blob_rw_xxx')) {
      try {
        await del(blobsToDelete);
      } catch (delErr) {
        console.error('Error cleaning up old blobs:', delErr);
      }
    }

    // Update product
    const updated = await db
      .update(products)
      .set({
        title,
        slug,
        description,
        categoryId: categoryId || null,
        tags: tags || [],
        version: version || null,
        fileUrl,
        fileName,
        fileSize,
        fileType,
        coverImageUrl,
        status: status || 'published',
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    // Re-insert product images
    await db.delete(productImages).where(eq(productImages.productId, id));
    if (images && images.length > 0) {
      await db.insert(productImages).values(
        images.map((url, idx) => ({
          productId: id,
          url,
          sortOrder: idx,
        }))
      );
    }

    revalidatePath('/');
    revalidatePath(`/product/${oldProduct.slug}`);
    revalidatePath(`/product/${slug}`);
    revalidatePath('/sitemap.xml');

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    const existing = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!existing || existing.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    const product = existing[0];

    // Collect blobs to delete
    const images = await db.select().from(productImages).where(eq(productImages.productId, id));
    const blobsToDelete: string[] = [];

    if (isBlobStorageUrl(product.fileUrl)) blobsToDelete.push(product.fileUrl);
    if (isBlobStorageUrl(product.coverImageUrl)) blobsToDelete.push(product.coverImageUrl);
    for (const img of images) {
      if (isBlobStorageUrl(img.url)) blobsToDelete.push(img.url);
    }

    if (blobsToDelete.length > 0 && process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_READ_WRITE_TOKEN.startsWith('vercel_blob_rw_xxx')) {
      try {
        await del(blobsToDelete);
      } catch (delErr) {
        console.error('Error deleting blobs from Vercel storage:', delErr);
      }
    }

    // Delete product from database (cascade deletes product_images)
    await db.delete(products).where(eq(products.id, id));

    revalidatePath('/');
    revalidatePath(`/product/${product.slug}`);
    revalidatePath('/sitemap.xml');

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

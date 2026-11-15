import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products, productImages, categories } from '@/db/schema';
import { productSchema } from '@/lib/validations';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { eq, desc, ilike, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    let query = db
      .select({
        product: products,
        category: categories,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(desc(products.createdAt));

    const results = await query;

    let filtered = results;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (item: any) =>
          item.product.title.toLowerCase().includes(q) ||
          item.product.description.toLowerCase().includes(q) ||
          item.product.slug.toLowerCase().includes(q)
      );
    }

    if (status && (status === 'published' || status === 'draft')) {
      filtered = filtered.filter((item: any) => item.product.status === status);
    }

    // Format output
    const formatted = filtered.map((item: any) => ({
      ...item.product,
      category: item.category,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Fetch admin products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
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

    // Check slug uniqueness
    const existing = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'A product with this URL slug already exists' },
        { status: 409 }
      );
    }

    // Insert product
    const inserted = await db
      .insert(products)
      .values({
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
      })
      .returning();

    const newProduct = inserted[0];

    // Insert gallery images if provided
    if (images && images.length > 0) {
      await db.insert(productImages).values(
        images.map((url, idx) => ({
          productId: newProduct.id,
          url,
          sortOrder: idx,
        }))
      );
    }

    revalidatePath('/');
    revalidatePath(`/product/${newProduct.slug}`);
    revalidatePath('/sitemap.xml');

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

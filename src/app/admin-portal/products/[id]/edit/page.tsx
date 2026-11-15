import { db } from '@/db';
import { products, productImages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const secretPath = process.env.ADMIN_SECRET_PATH || 'craftora-hq-7f3k9x';

  const found = await db
    .select()
    .from(products)
    .where(eq(products.id, params.id))
    .limit(1);

  if (!found || found.length === 0) {
    notFound();
  }

  const product = found[0];
  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, product.id))
    .orderBy(productImages.sortOrder);

  return (
    <ProductForm
      initialData={{
        id: product.id,
        title: product.title,
        slug: product.slug,
        description: product.description,
        categoryId: product.categoryId,
        tags: product.tags,
        version: product.version,
        fileUrl: product.fileUrl,
        fileName: product.fileName,
        fileSize: Number(product.fileSize),
        fileType: product.fileType,
        coverImageUrl: product.coverImageUrl,
        images: images.map((img: any) => img.url),
        status: product.status as 'published' | 'draft',
      }}
      mode="edit"
      secretPath={secretPath}
    />
  );
}

import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Navbar } from '@/components/store/Navbar';
import { Footer } from '@/components/store/Footer';
import { StoreClient } from '@/components/store/StoreClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch published products
  const productRows = await db
    .select({
      product: products,
      category: categories,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.status, 'published'))
    .orderBy(desc(products.createdAt));

  const allCategories = await db.select().from(categories);

  const formattedProducts = productRows.map((r: any) => ({
    ...r.product,
    category: r.category,
  }));

  const totalDownloads = formattedProducts.reduce(
    (acc: number, p: any) => acc + (p.downloadCount || 0),
    0
  );

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <StoreClient
          initialProducts={formattedProducts}
          categories={allCategories}
          totalDownloads={totalDownloads}
        />
      </main>
      <Footer />
    </>
  );
}

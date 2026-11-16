import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/store/Navbar';
import { Footer } from '@/components/store/Footer';
import { ProductCard } from '@/components/store/ProductCard';
import { FolderTree, ChevronRight, PackageOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const found = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, params.slug))
    .limit(1);

  if (!found || found.length === 0) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${found[0].name} Digital Assets`,
    description: `Download verified ${found[0].name} digital assets, tools, and code templates.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const catResult = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, params.slug))
    .limit(1);

  if (!catResult || catResult.length === 0) {
    notFound();
  }

  const category = catResult[0];

  const productRows = await db
    .select({
      product: products,
      category: categories,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.categoryId, category.id))
    .orderBy(desc(products.createdAt));

  const published = productRows
    .filter((r: any) => r.product.status === 'published')
    .map((r: any) => ({
      ...r.product,
      category: r.category,
    }));

  return (
    <>
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-mono text-text-muted mb-8">
            <Link href="/" className="hover:text-cyan-accent transition-colors">
              Store
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-cyan-accent">{category.name}</span>
          </nav>

          {/* Category Banner */}
          <div className="p-8 rounded-2xl glass-panel border border-border-subtle bg-radial-glow mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent">
                <FolderTree className="w-6 h-6" />
              </div>
              <h1 className="font-heading text-3xl font-extrabold text-text-primary tracking-wide">
                CATEGORY: <span className="text-cyan-accent">{category.name}</span>
              </h1>
            </div>
            <p className="text-xs font-mono text-text-secondary mt-1">
              Curated collection of {published.length} digital artifact(s) in this sector.
            </p>
          </div>

          {/* Grid */}
          {published.length === 0 ? (
            <div className="py-20 text-center glass-panel rounded-2xl border border-border-subtle p-8 max-w-md mx-auto">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-cyan-accent/10 border border-cyan-accent/30 flex items-center justify-center text-cyan-accent shadow-neon-blue">
                <PackageOpen className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-lg font-bold text-text-primary mb-2">
                NO ARTIFACTS IN THIS SECTOR
              </h3>
              <p className="text-xs font-mono text-text-secondary leading-relaxed mb-6">
                No items have been assigned to this category yet.
              </p>
              <Link
                href="/"
                className="px-4 py-2 rounded-xl bg-cyan-blue-gradient text-white text-xs font-mono font-semibold uppercase tracking-wider"
              >
                Browse All Artifacts
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {published.map((p: any, idx: number) => (
                <ProductCard key={p.id} product={p} category={p.category} index={idx} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

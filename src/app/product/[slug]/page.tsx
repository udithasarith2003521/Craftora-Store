import { db } from '@/db';
import { products, productImages, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/store/Navbar';
import { Footer } from '@/components/store/Footer';
import { GalleryLightbox } from '@/components/store/GalleryLightbox';
import { formatBytes, formatDate } from '@/lib/utils';
import {
  Download,
  FileBox,
  Calendar,
  Layers,
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronRight,
  HardDrive,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const found = await db
    .select()
    .from(products)
    .where(eq(products.slug, params.slug))
    .limit(1);

  if (!found || found.length === 0 || found[0].status !== 'published') {
    return {
      title: 'Product Not Found',
    };
  }

  const product = found[0];
  return {
    title: product.title,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.title} | Craftora Store`,
      description: product.description.slice(0, 160),
      images: product.coverImageUrl ? [{ url: product.coverImageUrl }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productRows = await db
    .select({
      product: products,
      category: categories,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, params.slug))
    .limit(1);

  if (!productRows || productRows.length === 0 || productRows[0].product.status !== 'published') {
    notFound();
  }

  const { product, category } = productRows[0];

  // Fetch gallery images
  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, product.id))
    .orderBy(productImages.sortOrder);

  // Fetch 3 related products in same category or latest
  const related = await db
    .select()
    .from(products)
    .where(eq(products.status, 'published'))
    .limit(4);

  const relatedFiltered = related.filter((p: any) => p.id !== product.id).slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-mono text-text-muted mb-8">
            <Link href="/" className="hover:text-cyan-accent transition-colors">
              Store
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            {category && (
              <>
                <Link
                  href={`/category/${category.slug}`}
                  className="hover:text-cyan-accent transition-colors"
                >
                  {category.name}
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
            <span className="text-cyan-accent truncate max-w-xs">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Gallery & Details (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Image Gallery with Lightbox */}
              <GalleryLightbox
                coverImage={product.coverImageUrl}
                images={images}
                title={product.title}
              />

              {/* Description Block */}
              <div className="p-8 rounded-2xl glass-panel border border-border-subtle space-y-4">
                <h2 className="font-heading text-lg font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-accent" />
                  <span>Artifact Overview & Specs</span>
                </h2>
                <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line font-sans">
                  {product.description}
                </div>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="pt-6 border-t border-border-subtle/50 flex flex-wrap gap-2">
                    {product.tags.map((t: string) => (
                      <span
                        key={t}
                        className="px-3 py-1 rounded-lg bg-background-elevated border border-border-subtle text-xs font-mono text-cyan-accent"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Download & Specs Card (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-2xl glass-panel border border-border-glow shadow-neon-blue space-y-6 sticky top-24">
                {/* Title & Category Header */}
                <div>
                  {category && (
                    <span className="inline-block px-3 py-1 rounded-md text-xs font-mono uppercase tracking-wider bg-primary/20 text-cyan-accent border border-primary/30 mb-3">
                      {category.name}
                    </span>
                  )}
                  <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary tracking-wide">
                    {product.title}
                  </h1>
                  {product.version && (
                    <p className="text-xs font-mono text-text-muted mt-1">
                      Build Version: <span className="text-primary-light">v{product.version}</span>
                    </p>
                  )}
                </div>

                {/* Download CTA Button */}
                <a
                  href={`/api/download/${product.id}`}
                  className="w-full py-4 px-6 rounded-xl bg-cyan-blue-gradient hover:bg-cyan-blue-gradient-hover text-white font-heading text-base font-bold tracking-wider uppercase shadow-neon-blue hover:shadow-neon-cyan transition-all flex items-center justify-center gap-3 group"
                >
                  <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                  <span>Download Package Now</span>
                </a>

                {/* Security badges */}
                <div className="p-3.5 rounded-xl bg-background-deep/60 border border-border-subtle flex items-center justify-between text-xs font-mono text-text-secondary">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" /> Clean & Verified
                  </span>
                  <span className="flex items-center gap-1.5 text-cyan-accent">
                    <Zap className="w-4 h-4" /> Instant CDN Link
                  </span>
                </div>

                {/* Technical Specs List */}
                <div className="space-y-3 pt-4 border-t border-border-subtle text-xs font-mono">
                  <div className="flex items-center justify-between py-1.5 border-b border-border-subtle/30">
                    <span className="text-text-muted flex items-center gap-2">
                      <FileBox className="w-4 h-4 text-cyan-accent" /> Format
                    </span>
                    <span className="text-text-primary uppercase font-semibold">
                      {product.fileType.split('/')[1] || product.fileType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-border-subtle/30">
                    <span className="text-text-muted flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-cyan-accent" /> File Size
                    </span>
                    <span className="text-text-primary font-semibold">
                      {formatBytes(product.fileSize)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-border-subtle/30">
                    <span className="text-text-muted flex items-center gap-2">
                      <Download className="w-4 h-4 text-cyan-accent" /> Total Downloads
                    </span>
                    <span className="text-cyan-accent font-bold">
                      {product.downloadCount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-text-muted flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-accent" /> Released
                    </span>
                    <span className="text-text-primary">
                      {formatDate(product.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related products */}
          {relatedFiltered.length > 0 && (
            <div className="mt-20 pt-10 border-t border-border-subtle">
              <h3 className="font-heading text-xl font-bold text-text-primary uppercase tracking-wider mb-6">
                Similar Artifacts in Matrix
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedFiltered.map((rel: any) => (
                  <Link
                    key={rel.id}
                    href={`/product/${rel.slug}`}
                    className="p-4 rounded-xl glass-panel glass-panel-hover flex items-center gap-4 transition-all"
                  >
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-background-elevated shrink-0">
                      {rel.coverImageUrl && (
                        <Image
                          src={rel.coverImageUrl}
                          alt={rel.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-heading text-sm font-bold text-text-primary truncate">
                        {rel.title}
                      </h4>
                      <p className="text-[11px] font-mono text-cyan-accent mt-0.5">
                        {formatBytes(rel.fileSize)} • {rel.downloadCount} downloads
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Download, FileBox, Eye, Layers } from 'lucide-react';
import { formatBytes } from '@/lib/utils';
import type { Product, Category } from '@/db/schema';

interface ProductCardProps {
  product: Product;
  category?: Category | null;
}

export function ProductCard({ product, category }: ProductCardProps) {
  return (
    <div className="group relative rounded-2xl glass-panel glass-panel-hover flex flex-col overflow-hidden transition-all duration-300">
      {/* Cover Image Container */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-video w-full overflow-hidden bg-background-elevated block"
      >
        {product.coverImageUrl ? (
          <Image
            src={product.coverImageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-background-elevated text-text-muted">
            <Layers className="w-12 h-12 stroke-[1.2]" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

        {/* Category Badge */}
        {category && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium uppercase tracking-wider bg-background-deep/80 text-cyan-accent border border-cyan-accent/30 backdrop-blur-md">
              {category.name}
            </span>
          </div>
        )}

        {/* Version Badge */}
        {product.version && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary/40 text-text-primary border border-primary/40 backdrop-blur-md">
              v{product.version}
            </span>
          </div>
        )}
      </Link>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-text-primary group-hover:text-cyan-accent transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>
          <p className="mt-2 text-xs text-text-secondary line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Meta stats & CTA */}
        <div className="mt-5 pt-4 border-t border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs font-mono text-text-muted">
            <span className="flex items-center gap-1 text-cyan-accent" title="File Size">
              <FileBox className="w-3.5 h-3.5" />
              {formatBytes(product.fileSize)}
            </span>
            <span>•</span>
            <span className="uppercase">{product.fileType.split('/')[1] || product.fileType}</span>
            <span>•</span>
            <span className="flex items-center gap-1" title="Downloads">
              <Download className="w-3.5 h-3.5 text-text-secondary" />
              {product.downloadCount}
            </span>
          </div>

          <Link
            href={`/product/${product.slug}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-cyan-blue-gradient text-cyan-accent hover:text-white border border-primary/30 hover:border-transparent text-xs font-semibold uppercase tracking-wider transition-all duration-200"
          >
            <span>View</span>
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

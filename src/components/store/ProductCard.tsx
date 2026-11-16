'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Download, FileBox, Eye, Layers } from 'lucide-react';
import { formatBytes, formatImageUrl } from '@/lib/utils';
import type { Product, Category } from '@/db/schema';

interface ProductCardProps {
  product: Product;
  category?: Category | null;
  index?: number;
}

export function ProductCard({ product, category, index = 0 }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const rawUrl = product.coverImageUrl && !product.coverImageUrl.startsWith('blob:')
    ? product.coverImageUrl
    : null;
  const imageUrl = formatImageUrl(rawUrl || '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.08, 0.4),
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        y: -7,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      }}
      className="group relative rounded-2xl glass-panel flex flex-col overflow-hidden border border-border-subtle/80 hover:border-cyan-accent/60 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all duration-300"
    >
      {/* Light Sheen Sweep Effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent pointer-events-none z-20" />

      {/* Cover Image Container */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-video w-full overflow-hidden bg-background-elevated block"
      >
        {imageUrl && !imgError ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-background-elevated text-text-muted">
            <Layers className="w-12 h-12 stroke-[1.2]" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-85" />

        {/* Category Badge */}
        {category && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium uppercase tracking-wider bg-background-deep/85 text-cyan-accent border border-cyan-accent/30 backdrop-blur-md group-hover:border-cyan-accent/60 transition-colors">
              {category.name}
            </span>
          </div>
        )}

        {/* Version Badge */}
        {product.version && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary/40 text-text-primary border border-primary/40 backdrop-blur-md">
              v{product.version}
            </span>
          </div>
        )}
      </Link>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between relative z-10">
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
        <div className="mt-5 pt-4 border-t border-border-subtle/80 flex items-center justify-between">
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

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href={`/product/${product.slug}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-cyan-blue-gradient text-cyan-accent hover:text-white border border-primary/30 hover:border-transparent text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-neon-blue"
            >
              <span>View</span>
              <Eye className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

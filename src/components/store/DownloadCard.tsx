'use client';

import { motion } from 'framer-motion';
import { Download, ShieldCheck, Zap, FileBox, HardDrive, Calendar, Sparkles } from 'lucide-react';
import { formatBytes, formatDate } from '@/lib/utils';
import type { Product, Category } from '@/db/schema';

interface DownloadCardProps {
  product: Product;
  category?: Category | null;
}

export function DownloadCard({ product, category }: DownloadCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="p-8 rounded-2xl glass-panel border border-border-glow shadow-neon-blue space-y-6 sticky top-24 relative overflow-hidden group"
    >
      {/* Light sheen sweep */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent pointer-events-none" />

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

      {/* Animated Download CTA Button */}
      <motion.a
        href={`/api/download/${product.id}`}
        whileHover={{ scale: 1.02, boxShadow: '0 0 35px rgba(34, 211, 238, 0.45)' }}
        whileTap={{ scale: 0.97 }}
        className="relative w-full py-4 px-6 rounded-xl bg-cyan-blue-gradient text-white font-heading text-base font-bold tracking-wider uppercase shadow-neon-blue transition-all flex items-center justify-center gap-3 group/btn overflow-hidden"
      >
        <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <Download className="w-5 h-5 group-hover/btn:translate-y-0.5 transition-transform" />
        <span className="relative z-10">Download Package Now</span>
      </motion.a>

      {/* Security & Verification Badges */}
      <div className="p-3.5 rounded-xl bg-background-deep/70 border border-border-subtle flex items-center justify-between text-xs font-mono text-text-secondary">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-4 h-4" /> Clean & Verified
        </span>
        <span className="flex items-center gap-1.5 text-cyan-accent">
          <Zap className="w-4 h-4 animate-pulse" /> Instant CDN Link
        </span>
      </div>

      {/* Technical Specs List with Hover Rows */}
      <div className="space-y-3 pt-4 border-t border-border-subtle/80 text-xs font-mono">
        <div className="flex items-center justify-between py-1.5 border-b border-border-subtle/40 hover:bg-background-elevated/40 px-2 rounded-lg transition-colors">
          <span className="text-text-muted flex items-center gap-2">
            <FileBox className="w-4 h-4 text-cyan-accent" /> Format
          </span>
          <span className="text-text-primary uppercase font-semibold">
            {product.fileType.split('/')[1] || product.fileType}
          </span>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-border-subtle/40 hover:bg-background-elevated/40 px-2 rounded-lg transition-colors">
          <span className="text-text-muted flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-cyan-accent" /> File Size
          </span>
          <span className="text-text-primary font-semibold">
            {formatBytes(product.fileSize)}
          </span>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-border-subtle/40 hover:bg-background-elevated/40 px-2 rounded-lg transition-colors">
          <span className="text-text-muted flex items-center gap-2">
            <Download className="w-4 h-4 text-cyan-accent" /> Total Downloads
          </span>
          <span className="text-cyan-accent font-bold">
            {product.downloadCount.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between py-1.5 hover:bg-background-elevated/40 px-2 rounded-lg transition-colors">
          <span className="text-text-muted flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-accent" /> Released
          </span>
          <span className="text-text-primary">
            {formatDate(product.createdAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

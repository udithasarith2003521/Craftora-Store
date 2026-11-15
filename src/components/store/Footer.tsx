import Link from 'next/link';
import { Layers, ShieldCheck, Zap, Download } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border-subtle bg-background-surface/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-accent p-[1px] shadow-neon-blue">
                <div className="w-full h-full bg-background-deep rounded-[7px] flex items-center justify-center">
                  <Layers className="w-4 h-4 text-cyan-accent" />
                </div>
              </div>
              <span className="font-heading text-lg font-bold tracking-wider text-text-primary">
                CRAFTORA<span className="text-cyan-accent">.</span>STORE
              </span>
            </Link>
            <p className="text-text-secondary text-sm max-w-md leading-relaxed">
              Curated repository of futuristic digital assets, software utilities, 3D components, and developer kits. Direct download, zero registration required.
            </p>
            <div className="flex items-center gap-4 text-xs text-text-muted font-mono">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-accent" /> Malware Scanned
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-accent" /> High-Speed CDN
              </span>
              <span className="flex items-center gap-1.5">
                <Download className="w-4 h-4 text-cyan-accent" /> 100% Direct Links
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-sm font-semibold tracking-wider uppercase text-text-primary mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <Link href="/" className="hover:text-cyan-accent transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <a href="#categories" className="hover:text-cyan-accent transition-colors">
                  Categories
                </a>
              </li>
              <li>
                <a href="#featured" className="hover:text-cyan-accent transition-colors">
                  Popular Downloads
                </a>
              </li>
            </ul>
          </div>

          {/* System Info */}
          <div>
            <h4 className="font-heading text-sm font-semibold tracking-wider uppercase text-text-primary mb-3">
              Network Status
            </h4>
            <div className="space-y-2 text-xs font-mono text-text-secondary">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All Systems Operational</span>
              </div>
              <p className="text-text-muted">Storage: Vercel Edge Blob</p>
              <p className="text-text-muted">Database: Neon Serverless</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border-subtle/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted font-mono">
          <p>© {new Date().getFullYear()} Craftora Store. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Designed for digital creators with electric precision.
          </p>
        </div>
      </div>
    </footer>
  );
}

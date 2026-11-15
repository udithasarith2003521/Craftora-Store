'use client';

import { Sparkles, Terminal, DownloadCloud, ShieldCheck, Cpu } from 'lucide-react';

interface HeroProps {
  totalProducts: number;
  totalDownloads: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Hero({
  totalProducts,
  totalDownloads,
  searchQuery,
  onSearchChange,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 border-b border-border-subtle bg-radial-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Glow badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-accent/30 bg-background-surface/80 backdrop-blur-md shadow-neon-blue mb-6">
          <Sparkles className="w-4 h-4 text-cyan-accent animate-pulse" />
          <span className="text-xs font-mono font-medium text-cyan-accent tracking-wider uppercase">
            Next-Gen Digital Distribution
          </span>
        </div>

        {/* Main Title */}
        <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-primary mb-6">
          DIGITAL ARTIFACTS FOR THE <br />
          <span className="bg-gradient-to-r from-primary-light via-cyan-accent to-white bg-clip-text text-transparent glow-cyan">
            CYBERNETIC AGE
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-text-secondary leading-relaxed mb-10">
          Discover high-performance software utilities, game assets, developer libraries, and cyber UI kits. Instantly accessible with one-click direct downloads.
        </p>

        {/* Search Bar Input */}
        <div className="max-w-xl mx-auto relative mb-12">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search assets, tools, templates, or formats..."
              className="w-full px-5 py-4 pl-12 rounded-xl bg-background-surface/90 border border-border-subtle focus:border-cyan-accent focus:shadow-neon-cyan focus:outline-none text-text-primary placeholder:text-text-muted text-sm backdrop-blur-md transition-all font-sans"
            />
            <div className="absolute left-4 text-cyan-accent">
              <Terminal className="w-5 h-5" />
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-4 text-xs font-mono text-text-muted hover:text-cyan-accent"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* Stats counter strip */}
        <div className="grid grid-cols-3 max-w-2xl mx-auto gap-4 p-4 rounded-2xl glass-panel border border-border-subtle">
          <div className="text-center">
            <div className="font-heading text-2xl sm:text-3xl font-bold text-cyan-accent">
              {totalProducts > 0 ? `${totalProducts}+` : '0'}
            </div>
            <div className="text-[11px] sm:text-xs font-mono text-text-muted uppercase tracking-wider flex items-center justify-center gap-1 mt-1">
              <Cpu className="w-3.5 h-3.5 text-primary-light" />
              <span>Verified Assets</span>
            </div>
          </div>

          <div className="text-center border-x border-border-subtle">
            <div className="font-heading text-2xl sm:text-3xl font-bold text-primary-light">
              {totalDownloads > 0 ? totalDownloads.toLocaleString() : '0'}
            </div>
            <div className="text-[11px] sm:text-xs font-mono text-text-muted uppercase tracking-wider flex items-center justify-center gap-1 mt-1">
              <DownloadCloud className="w-3.5 h-3.5 text-cyan-accent" />
              <span>Total Downloads</span>
            </div>
          </div>

          <div className="text-center">
            <div className="font-heading text-2xl sm:text-3xl font-bold text-emerald-400">
              100%
            </div>
            <div className="text-[11px] sm:text-xs font-mono text-text-muted uppercase tracking-wider flex items-center justify-center gap-1 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct Links</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Layers, Search, Sparkles, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onSearchClick?: () => void;
}

export function Navbar({ onSearchClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-subtle bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-accent p-[1px] shadow-neon-blue group-hover:shadow-neon-cyan transition-all duration-300">
            <div className="w-full h-full bg-background-deep rounded-[11px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-cyan-accent group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-xl font-bold tracking-wider text-text-primary group-hover:text-cyan-accent transition-colors">
              CRAFTORA<span className="text-cyan-accent">.</span>STORE
            </span>
            <span className="text-[10px] uppercase tracking-widest text-text-muted -mt-1 font-mono">
              Digital Artifacts
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-text-secondary hover:text-cyan-accent transition-colors"
          >
            Store
          </Link>
          <a
            href="#categories"
            className="text-sm font-medium text-text-secondary hover:text-cyan-accent transition-colors"
          >
            Categories
          </a>
          <a
            href="#featured"
            className="text-sm font-medium text-text-secondary hover:text-cyan-accent transition-colors"
          >
            Featured
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSearchClick}
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-subtle bg-background-surface/80 hover:border-cyan-accent/50 text-text-secondary hover:text-cyan-accent text-xs font-mono transition-all"
            title="Search products"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-background-deep rounded border border-border-subtle text-text-muted">
              /
            </kbd>
          </button>

          <a
            href="#featured"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-blue-gradient hover:bg-cyan-blue-gradient-hover text-white text-xs font-semibold tracking-wide uppercase shadow-neon-blue hover:shadow-neon-cyan transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Browse Assets</span>
          </a>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-cyan-accent"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border-subtle bg-background-surface/95 backdrop-blur-xl px-4 py-4 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-background-elevated hover:text-cyan-accent"
          >
            Store
          </Link>
          <a
            href="#categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-background-elevated hover:text-cyan-accent"
          >
            Categories
          </a>
          <a
            href="#featured"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-background-elevated hover:text-cyan-accent"
          >
            Featured
          </a>
        </div>
      )}
    </header>
  );
}

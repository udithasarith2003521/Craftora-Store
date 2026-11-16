'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Layers, Search, Sparkles, Menu, X } from 'lucide-react';

interface NavbarProps {
  onSearchClick?: () => void;
}

export function Navbar({ onSearchClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 20);
    });
  }, [scrollY]);

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-background-deep/90 backdrop-blur-xl border-b border-cyan-accent/25 shadow-[0_4px_30px_rgba(2,6,23,0.85)]'
          : 'bg-background/70 backdrop-blur-md border-b border-border-subtle'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo with Interactive Hover Dynamics */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.08, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.4 }}
            className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-accent p-[1px] shadow-neon-blue group-hover:shadow-neon-cyan transition-shadow duration-300"
          >
            <div className="w-full h-full bg-background-deep rounded-[11px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-cyan-accent group-hover:scale-110 transition-transform duration-300" />
            </div>
          </motion.div>
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
            className="text-sm font-medium text-text-secondary hover:text-cyan-accent transition-colors relative py-1 group"
          >
            <span>Store</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-accent group-hover:w-full transition-all duration-300" />
          </Link>
          <a
            href="#categories"
            className="text-sm font-medium text-text-secondary hover:text-cyan-accent transition-colors relative py-1 group"
          >
            <span>Categories</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-accent group-hover:w-full transition-all duration-300" />
          </a>
          <a
            href="#featured"
            className="text-sm font-medium text-text-secondary hover:text-cyan-accent transition-colors relative py-1 group"
          >
            <span>Featured</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-accent group-hover:w-full transition-all duration-300" />
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
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
          </motion.button>

          <motion.a
            href="#featured"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-blue-gradient hover:bg-cyan-blue-gradient-hover text-white text-xs font-semibold tracking-wide uppercase shadow-neon-blue hover:shadow-neon-cyan transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Browse Assets</span>
          </motion.a>

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
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-b border-border-subtle bg-background-surface/95 backdrop-blur-xl px-4 py-4 space-y-3"
        >
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
            className="block px-3 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-background-elevated hover:text-cyan-accent"
          >
            Categories
          </a>
          <a
            href="#featured"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-background-elevated hover:text-cyan-accent"
          >
            Featured
          </a>
        </motion.div>
      )}
    </motion.header>
  );
}

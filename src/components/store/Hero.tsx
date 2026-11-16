'use client';

import { motion } from 'framer-motion';
import { Sparkles, Terminal, DownloadCloud, ShieldCheck, Cpu } from 'lucide-react';

interface HeroProps {
  totalProducts: number;
  totalDownloads: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

// Easing curve inspired by Grilled Pixels / Awwwards (snappy start, ultra smooth ease-out)
const easeSmooth = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemFadeUp = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.85,
      ease: easeSmooth,
    },
  },
};

export function Hero({
  totalProducts,
  totalDownloads,
  searchQuery,
  onSearchChange,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden py-18 sm:py-26 border-b border-border-subtle bg-radial-glow">
      {/* Ambient Breathing Glow Orbs */}
      <motion.div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-primary/20 blur-[130px] rounded-full"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="pointer-events-none absolute top-1/3 -right-20 w-[400px] h-[300px] bg-cyan-accent/15 blur-[120px] rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Floating Glowing Cyber Badge */}
        <motion.div variants={itemFadeUp} className="inline-block mb-6">
          <motion.div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-accent/35 bg-background-surface/80 backdrop-blur-md shadow-neon-blue"
            animate={{
              y: [-4, 4, -4],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-accent animate-pulse" />
            <span className="text-xs font-mono font-medium text-cyan-accent tracking-widest uppercase">
              Next-Gen Digital Distribution
            </span>
          </motion.div>
        </motion.div>

        {/* Main Kinetic Title */}
        <motion.h1
          variants={itemFadeUp}
          className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-primary mb-6"
        >
          <span className="inline-block">DIGITAL ARTIFACTS FOR THE</span> <br />
          <span className="inline-block bg-gradient-to-r from-primary-light via-cyan-accent to-white bg-clip-text text-transparent glow-cyan">
            CYBERNETIC AGE
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemFadeUp}
          className="max-w-2xl mx-auto text-base sm:text-lg text-text-secondary leading-relaxed mb-10"
        >
          Discover high-performance software utilities, game assets, developer libraries, and cyber UI kits. Instantly accessible with one-click direct downloads.
        </motion.p>

        {/* Search Bar Input */}
        <motion.div variants={itemFadeUp} className="max-w-xl mx-auto relative mb-12">
          <div className="relative flex items-center group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search assets, tools, templates, or formats..."
              className="w-full px-5 py-4 pl-12 rounded-xl bg-background-surface/90 border border-border-subtle group-hover:border-cyan-accent/50 focus:border-cyan-accent focus:shadow-neon-cyan focus:outline-none text-text-primary placeholder:text-text-muted text-sm backdrop-blur-md transition-all font-sans"
            />
            <div className="absolute left-4 text-cyan-accent group-focus-within:scale-110 transition-transform">
              <Terminal className="w-5 h-5" />
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-4 text-xs font-mono text-text-muted hover:text-cyan-accent transition-colors"
              >
                CLEAR
              </button>
            )}
          </div>
        </motion.div>

        {/* Stats Counter Strip */}
        <motion.div
          variants={itemFadeUp}
          className="grid grid-cols-3 max-w-2xl mx-auto gap-4 p-4 rounded-2xl glass-panel border border-border-subtle/80 shadow-neon-blue"
        >
          <motion.div
            className="text-center group"
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <div className="font-heading text-2xl sm:text-3xl font-bold text-cyan-accent group-hover:scale-105 transition-transform">
              {totalProducts > 0 ? `${totalProducts}+` : '0'}
            </div>
            <div className="text-[11px] sm:text-xs font-mono text-text-muted uppercase tracking-wider flex items-center justify-center gap-1.5 mt-1">
              <Cpu className="w-3.5 h-3.5 text-primary-light" />
              <span>Verified Assets</span>
            </div>
          </motion.div>

          <motion.div
            className="text-center border-x border-border-subtle/80 group"
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <div className="font-heading text-2xl sm:text-3xl font-bold text-primary-light group-hover:scale-105 transition-transform">
              {totalDownloads > 0 ? totalDownloads.toLocaleString() : '0'}
            </div>
            <div className="text-[11px] sm:text-xs font-mono text-text-muted uppercase tracking-wider flex items-center justify-center gap-1.5 mt-1">
              <DownloadCloud className="w-3.5 h-3.5 text-cyan-accent" />
              <span>Total Downloads</span>
            </div>
          </motion.div>

          <motion.div
            className="text-center group"
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <div className="font-heading text-2xl sm:text-3xl font-bold text-emerald-400 group-hover:scale-105 transition-transform">
              100%
            </div>
            <div className="text-[11px] sm:text-xs font-mono text-text-muted uppercase tracking-wider flex items-center justify-center gap-1.5 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct Links</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

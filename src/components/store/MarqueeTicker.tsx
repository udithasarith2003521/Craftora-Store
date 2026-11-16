'use client';

import { motion } from 'framer-motion';
import { Zap, ShieldCheck, HardDrive, Sparkles, Terminal, Flame } from 'lucide-react';

const TICKER_ITEMS = [
  { icon: Zap, text: 'INSTANT DIRECT DOWNLOADS' },
  { icon: ShieldCheck, text: '100% VERIFIED ARTIFACTS' },
  { icon: HardDrive, text: 'GOOGLE DRIVE HIGH-SPEED CLOUD' },
  { icon: Sparkles, text: 'PREMIUM DIGITAL ASSETS' },
  { icon: Terminal, text: 'DEVELOPER UTILITIES & TOOLS' },
  { icon: Flame, text: 'ZERO DOWNLOAD BANDWIDTH LIMITS' },
];

export function MarqueeTicker() {
  return (
    <div className="relative w-full overflow-hidden border-y border-border-subtle/80 bg-background-deep/60 backdrop-blur-md py-3.5">
      {/* Side gradient fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-background-deep to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-background-deep to-transparent" />

      {/* Infinite scrolling track */}
      <motion.div
        className="flex w-max items-center gap-10 select-none"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 30,
        }}
        whileHover={{ animationPlayState: 'paused' }}
      >
        {/* Repeat list twice for seamless infinite loop */}
        {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 text-xs font-mono font-medium tracking-widest uppercase text-text-secondary/80 hover:text-cyan-accent transition-colors"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-md bg-cyan-accent/10 border border-cyan-accent/25 text-cyan-accent shadow-neon-blue">
                <Icon className="w-3 h-3" />
              </span>
              <span>{item.text}</span>
              <span className="text-cyan-accent/30 font-bold ml-4">•</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

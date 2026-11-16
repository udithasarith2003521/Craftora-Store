'use client';

import { motion } from 'framer-motion';
import type { Category } from '@/db/schema';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const allItems = [
    { id: 'all', name: 'All Artifacts', slug: null },
    ...categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none" id="categories">
      {allItems.map((item) => {
        const isSelected = selectedCategory === item.slug;

        return (
          <motion.button
            key={item.id}
            onClick={() => onSelectCategory(item.slug)}
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className={`relative px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
              isSelected
                ? 'text-background-deep font-bold'
                : 'text-text-secondary hover:text-text-primary bg-background-surface/60 border border-border-subtle hover:border-cyan-accent/40'
            }`}
          >
            {/* Sliding Glowing Pill Indicator */}
            {isSelected && (
              <motion.div
                layoutId="activeCategoryPill"
                className="absolute inset-0 rounded-xl bg-cyan-accent shadow-neon-cyan"
                transition={{
                  type: 'spring',
                  stiffness: 450,
                  damping: 32,
                }}
              />
            )}
            <span className="relative z-10">{item.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

'use client';

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
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none" id="categories">
      <button
        onClick={() => onSelectCategory(null)}
        type="button"
        className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
          selectedCategory === null
            ? 'bg-cyan-accent text-background-deep shadow-neon-cyan'
            : 'bg-background-surface/80 text-text-secondary border border-border-subtle hover:border-cyan-accent/50 hover:text-text-primary'
        }`}
      >
        All Artifacts
      </button>

      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.slug;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.slug)}
            type="button"
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              isSelected
                ? 'bg-cyan-accent text-background-deep shadow-neon-cyan'
                : 'bg-background-surface/80 text-text-secondary border border-border-subtle hover:border-cyan-accent/50 hover:text-text-primary'
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}

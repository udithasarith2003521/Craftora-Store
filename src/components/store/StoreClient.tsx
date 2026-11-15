'use client';

import { useState, useMemo } from 'react';
import { Hero } from '@/components/store/Hero';
import { CategoryFilter } from '@/components/store/CategoryFilter';
import { ProductCard } from '@/components/store/ProductCard';
import type { Product, Category } from '@/db/schema';
import { ArrowUpDown, Search, PackageOpen } from 'lucide-react';

interface StoreClientProps {
  initialProducts: (Product & { category?: Category | null })[];
  categories: Category[];
  totalDownloads: number;
}

export function StoreClient({
  initialProducts,
  categories,
  totalDownloads,
}: StoreClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'downloads' | 'name'>('newest');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by category
    if (selectedCategory) {
      result = result.filter((p) => p.category?.slug === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)) ||
          p.fileType.toLowerCase().includes(q) ||
          (p.category?.name && p.category.name.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'downloads') {
      result.sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  return (
    <>
      {/* Hero Section */}
      <Hero
        totalProducts={initialProducts.length}
        totalDownloads={totalDownloads}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Catalog View */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full" id="featured">
        {/* Filter and Sort Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-8 border-b border-border-subtle">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <span className="text-xs font-mono text-text-muted flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort By:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-background-surface/80 border border-border-subtle focus:border-cyan-accent focus:outline-none text-xs font-mono text-text-primary"
            >
              <option value="newest">Newest First</option>
              <option value="downloads">Most Downloaded</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6 text-xs font-mono text-text-muted">
          <span>
            Displaying <strong className="text-cyan-accent">{filteredProducts.length}</strong> of{' '}
            {initialProducts.length} artifacts
          </span>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-cyan-accent hover:underline"
            >
              Reset category filter
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-2xl border border-border-subtle p-8 max-w-md mx-auto">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-cyan-accent/10 border border-cyan-accent/30 flex items-center justify-center text-cyan-accent shadow-neon-blue">
              <PackageOpen className="w-7 h-7" />
            </div>
            <h3 className="font-heading text-lg font-bold text-text-primary mb-2">
              NO MATCHING ARTIFACTS
            </h3>
            <p className="text-xs font-mono text-text-secondary leading-relaxed mb-6">
              No digital products match your current search and taxonomy filter criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-blue-gradient text-white text-xs font-mono font-semibold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                category={product.category}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

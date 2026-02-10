'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, FilterState } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import FilterPanel from '@/components/product/FilterPanel';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { filterProducts, formatCategoryName } from '@/lib/utils';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import clsx from 'clsx';

const ITEMS_PER_PAGE = 12;

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Best Rated' },
] as const;

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    brand: 'all',
    priceRange: [0, 2000],
    rating: 0,
    sortBy: 'relevance',
    searchQuery: initialSearch,
    page: 1,
  });

  useEffect(() => {
    const newSearch = searchParams.get('search') || '';
    const newCategory = searchParams.get('category') || 'all';
    setFilters(prev => ({
      ...prev,
      searchQuery: newSearch,
      category: newCategory,
      page: 1,
    }));
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetch('/api/products?limit=200')
      .then(r => r.json())
      .then(data => {
        setAllProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    // const cats = [...new Set(allProducts.map(p => p.category))].sort();
    const cats = Array.from(new Set(allProducts.map(p => p.category))).sort();
    return cats;
  }, [allProducts]);

  const brands = useMemo(() => {
    const filtered = filters.category !== 'all'
      ? allProducts.filter(p => p.category === filters.category)
      : allProducts;
    // return [...new Set(filtered.map(p => p.brand).filter(Boolean))].sort();
    return Array.from(new Set(filtered.map(p => p.brand).filter(Boolean))).sort();
  }, [allProducts, filters.category]);

  const filteredProducts = useMemo(() => {
    return filterProducts(allProducts, filters);
  }, [allProducts, filters]);

  const paginatedProducts = useMemo(() => {
    const start = (filters.page - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, filters.page]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 'page' in newFilters ? newFilters.page! : 1 }));
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ searchQuery: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl sm:text-3xl mb-1">
          {filters.category !== 'all'
            ? formatCategoryName(filters.category)
            : filters.searchQuery
            ? `Results for "${filters.searchQuery}"`
            : 'All Products'}
        </h1>
        <p className="text-dark-400 text-sm">
          {loading ? 'Loading...' : `${filteredProducts.length} products found`}
        </p>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="w-full bg-dark-800 border border-dark-600 rounded-xl pl-9 pr-4 py-2.5 text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex gap-3">
          {/* Sort */}
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilters({ sortBy: e.target.value as FilterState['sortBy'] })}
            className="bg-dark-800 border border-dark-600 rounded-xl px-3 py-2.5 text-sm text-dark-100 focus:outline-none focus:border-brand-500 cursor-pointer flex-1 sm:flex-none"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-dark-800 border border-dark-600 rounded-xl px-3 py-2.5 text-sm text-dark-300 hover:border-brand-500 transition-colors"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>

          {/* View mode */}
          <div className="hidden sm:flex bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx('px-3 py-2.5 transition-colors', viewMode === 'grid' ? 'bg-brand-500 text-white' : 'text-dark-400 hover:text-dark-200')}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx('px-3 py-2.5 transition-colors', viewMode === 'list' ? 'bg-brand-500 text-white' : 'text-dark-400 hover:text-dark-200')}
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-6 lg:gap-8">
        {/* Filter Panel (desktop) */}
        <FilterPanel
          filters={filters}
          onFiltersChange={updateFilters}
          categories={categories}
          brands={brands}
          totalProducts={filteredProducts.length}
          isMobileOpen={isMobileFiltersOpen}
          onMobileClose={() => setIsMobileFiltersOpen(false)}
        />

        {/* Products Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <ProductGridSkeleton count={ITEMS_PER_PAGE} />
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-bold text-xl mb-2">No products found</h3>
              <p className="text-dark-400 text-sm mb-6">Try adjusting your filters or search query</p>
              <button
                onClick={() => setFilters(prev => ({
                  ...prev,
                  category: 'all',
                  brand: 'all',
                  priceRange: [0, 2000],
                  rating: 0,
                  searchQuery: '',
                }))}
                className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className={clsx(
                viewMode === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5'
                  : 'flex flex-col gap-3'
              )}>
                {paginatedProducts.map((product, i) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => updateFilters({ page: filters.page - 1 })}
                    disabled={filters.page === 1}
                    className="p-2 rounded-xl bg-dark-800 border border-dark-600 text-dark-400 hover:text-dark-100 hover:border-dark-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                    let page = i + 1;
                    if (totalPages > 7) {
                      if (filters.page <= 4) page = i + 1;
                      else if (filters.page >= totalPages - 3) page = totalPages - 6 + i;
                      else page = filters.page - 3 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => updateFilters({ page })}
                        className={clsx(
                          'w-9 h-9 rounded-xl text-sm font-mono font-medium transition-all',
                          filters.page === page
                            ? 'bg-brand-500 text-white'
                            : 'bg-dark-800 border border-dark-600 text-dark-400 hover:text-dark-100 hover:border-dark-400'
                        )}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => updateFilters({ page: filters.page + 1 })}
                    disabled={filters.page === totalPages}
                    className="p-2 rounded-xl bg-dark-800 border border-dark-600 text-dark-400 hover:text-dark-100 hover:border-dark-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

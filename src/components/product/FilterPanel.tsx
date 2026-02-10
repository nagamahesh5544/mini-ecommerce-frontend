'use client';

import { useState } from 'react';
import { FilterState, Product } from '@/types';
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { formatCategoryName } from '@/lib/utils';
import clsx from 'clsx';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  categories: string[];
  brands: string[];
  totalProducts: number;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const ratingOptions = [4, 3, 2, 1];

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-dark-700/50 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <h3 className="font-semibold text-sm text-dark-100">{title}</h3>
        {open ? <ChevronUp size={14} className="text-dark-400" /> : <ChevronDown size={14} className="text-dark-400" />}
      </button>
      {open && <div className="animate-fade-in">{children}</div>}
    </div>
  );
}

export default function FilterPanel({
  filters,
  onFiltersChange,
  categories,
  brands,
  totalProducts,
  isMobileOpen,
  onMobileClose,
}: FilterPanelProps) {
  const handleClearAll = () => {
    onFiltersChange({
      category: 'all',
      brand: 'all',
      priceRange: [0, 2000],
      rating: 0,
    });
  };

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.brand !== 'all' ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 2000 ||
    filters.rating > 0;

  const panelContent = (
    <div className="p-4 sm:p-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-brand-400" />
          <span className="font-semibold text-sm">{totalProducts} products</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-xs text-brand-400 hover:text-brand-300 underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <FilterSection title="Category">
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="category"
              checked={filters.category === 'all'}
              onChange={() => onFiltersChange({ category: 'all' })}
              className="accent-orange-500"
            />
            <span className="text-sm text-dark-300 group-hover:text-dark-100 transition-colors">All Categories</span>
          </label>
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat}
                onChange={() => onFiltersChange({ category: cat })}
                className="accent-orange-500"
              />
              <span className="text-sm text-dark-300 group-hover:text-dark-100 transition-colors">
                {formatCategoryName(cat)}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Brands */}
      {brands.length > 0 && (
        <FilterSection title="Brand">
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="brand"
                checked={filters.brand === 'all'}
                onChange={() => onFiltersChange({ brand: 'all' })}
                className="accent-orange-500"
              />
              <span className="text-sm text-dark-300 group-hover:text-dark-100 transition-colors">All Brands</span>
            </label>
            {brands.slice(0, 10).map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="brand"
                  checked={filters.brand === brand.toLowerCase()}
                  onChange={() => onFiltersChange({ brand: brand.toLowerCase() })}
                  className="accent-orange-500"
                />
                <span className="text-sm text-dark-300 group-hover:text-dark-100 transition-colors">{brand}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-mono text-dark-400">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
          <input
            type="range"
            min={0}
            max={2000}
            step={10}
            value={filters.priceRange[1]}
            onChange={(e) =>
              onFiltersChange({ priceRange: [filters.priceRange[0], parseInt(e.target.value)] })
            }
            className="w-full"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) =>
                onFiltersChange({ priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]] })
              }
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-2 py-1.5 text-xs text-dark-100 focus:outline-none focus:border-brand-500"
              placeholder="Min"
            />
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) =>
                onFiltersChange({ priceRange: [filters.priceRange[0], parseInt(e.target.value) || 2000] })
              }
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-2 py-1.5 text-xs text-dark-100 focus:outline-none focus:border-brand-500"
              placeholder="Max"
            />
          </div>
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Minimum Rating">
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="rating"
              checked={filters.rating === 0}
              onChange={() => onFiltersChange({ rating: 0 })}
              className="accent-orange-500"
            />
            <span className="text-sm text-dark-300 group-hover:text-dark-100 transition-colors">Any Rating</span>
          </label>
          {ratingOptions.map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === r}
                onChange={() => onFiltersChange({ rating: r })}
                className="accent-orange-500"
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-xs ${i < r ? 'text-yellow-400' : 'text-dark-600'}`}
                  >
                    ★
                  </span>
                ))}
                <span className="text-sm text-dark-400">& up</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  // Mobile overlay
  if (isMobileOpen) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onMobileClose} />
        <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-dark-800 overflow-y-auto shadow-2xl animate-slide-in-right">
          <div className="flex items-center justify-between p-4 border-b border-dark-700/50 sticky top-0 bg-dark-800">
            <span className="font-bold text-sm">Filters</span>
            <button onClick={onMobileClose} className="text-dark-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
          {panelContent}
          <div className="p-4 border-t border-dark-700/50 sticky bottom-0 bg-dark-800">
            <button
              onClick={onMobileClose}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop sidebar
  return (
    <div className="hidden lg:block w-56 flex-shrink-0">
      <div className="sticky top-24">
        {panelContent}
      </div>
    </div>
  );
}

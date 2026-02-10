'use client';

import Link from 'next/link';
import { getCategoryEmoji, formatCategoryName } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const featuredCategories = [
  { slug: 'smartphones', color: '#3B82F6' },
  { slug: 'laptops', color: '#8B5CF6' },
  { slug: 'skincare', color: '#EC4899' },
  { slug: 'fragrances', color: '#F59E0B' },
  { slug: 'furniture', color: '#10B981' },
  { slug: 'mens-watches', color: '#6366F1' },
  { slug: 'womens-bags', color: '#F97316' },
  { slug: 'groceries', color: '#22C55E' },
];

export default function FeaturedCategories() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-brand-500 font-mono text-xs uppercase tracking-widest mb-1">Browse</p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl">Featured Categories</h2>
        </div>
        <Link
          href="/products"
          className="group flex items-center gap-1 text-sm text-dark-400 hover:text-brand-400 transition-colors"
        >
          View all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {featuredCategories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className="group relative bg-dark-800 hover:bg-dark-700 rounded-2xl p-4 sm:p-5 border border-dark-700/50 hover:border-opacity-50 transition-all duration-300 overflow-hidden"
            style={{ ['--cat-color' as string]: cat.color }}
          >
            {/* Background accent */}
            <div
              className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 -translate-y-8 translate-x-8 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500"
              style={{ backgroundColor: cat.color }}
            />

            <div
              className="text-3xl sm:text-4xl mb-3 transition-transform duration-300 group-hover:scale-110 inline-block"
            >
              {getCategoryEmoji(cat.slug)}
            </div>

            <h3 className="font-semibold text-sm text-dark-100 group-hover:text-white transition-colors leading-snug">
              {formatCategoryName(cat.slug)}
            </h3>

            <div
              className="w-0 group-hover:w-6 h-0.5 mt-2 transition-all duration-300 rounded"
              style={{ backgroundColor: cat.color }}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

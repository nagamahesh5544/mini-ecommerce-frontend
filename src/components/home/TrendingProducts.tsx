'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TrendingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?limit=8&skip=0')
      .then((r) => r.json())
      .then((data) => {
        // Sort by rating for "trending"
        const sorted = [...(data.products || [])].sort((a, b) => b.rating - a.rating);
        setProducts(sorted.slice(0, 8));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-brand-500" />
            <p className="text-brand-500 font-mono text-xs uppercase tracking-widest">Hot Right Now</p>
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl">Trending Products</h2>
        </div>
        <Link
          href="/products?sort=rating"
          className="group flex items-center gap-1 text-sm text-dark-400 hover:text-brand-400 transition-colors"
        >
          See all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product, i) => (
            <div
              key={product.id}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

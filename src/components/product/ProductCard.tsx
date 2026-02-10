'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '@/types';
import { formatUSD, calculateDiscountedPrice } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import clsx from 'clsx';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const isWishlisted = useAppSelector((state) =>
    state.wishlist.items.some((item) => item.id === product.id)
  );

  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);
    dispatch(addToCart({ product, quantity: 1 }));
    setTimeout(() => setIsAddingToCart(false), 1000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
  };

  return (
    <div className={clsx('product-card group relative bg-dark-800 rounded-2xl overflow-hidden border border-dark-700/50 hover:border-brand-500/30 transition-colors duration-300', className)}>
      {/* Image Container */}
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-dark-700">
        {!imageError ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-700 text-4xl">
            🛍️
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.discountPercentage > 5 && (
            <span className="bg-brand-500 text-white text-xs font-mono font-bold px-2 py-0.5 rounded-full">
              -{Math.round(product.discountPercentage)}%
            </span>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="bg-yellow-500 text-dark-900 text-xs font-mono font-bold px-2 py-0.5 rounded-full">
              Low Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-dark-600 text-dark-300 text-xs font-mono font-bold px-2 py-0.5 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleToggleWishlist}
          className={clsx(
            'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0',
            isWishlisted
              ? 'bg-brand-500 text-white'
              : 'bg-dark-900/80 backdrop-blur-sm text-dark-300 hover:text-brand-400'
          )}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Quick view hint */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark-900/80 to-transparent py-3 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 justify-center">
          <Eye size={12} className="text-dark-300" />
          <span className="text-dark-300 text-xs font-mono">Quick view</span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-3">
        <Link href={`/products/${product.id}`}>
          <p className="text-dark-400 text-xs font-mono uppercase tracking-wider mb-1">{product.brand}</p>
          <h3 className="text-dark-100 text-sm font-semibold line-clamp-2 mb-2 hover:text-brand-400 transition-colors leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star size={11} className="text-yellow-400 fill-yellow-400" />
          <span className="text-dark-300 text-xs font-mono">{product.rating.toFixed(1)}</span>
          <span className="text-dark-600 text-xs">·</span>
          <span className="text-dark-500 text-xs">{product.stock} in stock</span>
        </div>

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-brand-400 font-bold text-sm sm:text-base font-mono">
              {formatUSD(discountedPrice)}
            </span>
            {product.discountPercentage > 1 && (
              <span className="text-dark-500 text-xs line-through ml-1.5 font-mono">
                {formatUSD(product.price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={clsx(
              'w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0',
              product.stock === 0
                ? 'bg-dark-700 text-dark-600 cursor-not-allowed'
                : isAddingToCart
                ? 'bg-green-500 text-white scale-90'
                : 'bg-brand-500 hover:bg-brand-600 text-white hover:scale-105 active:scale-95'
            )}
            aria-label="Add to cart"
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

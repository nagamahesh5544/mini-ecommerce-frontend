'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { formatUSD } from '@/lib/utils';
import {  Trash2, ShoppingBag, ArrowLeft, Heart,  } from 'lucide-react';

import { clearWishlist, removeFromWishlist } from '@/store/slices/wishlistSlice';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.wishlist.items);
console.log(cartItems)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const isCartEmpty = cartItems.length === 0;


  if (isCartEmpty) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="flex justify-center text-8xl mb-6"><Heart size={100} /></div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl mb-3">Your wishlist is empty</h2>
        <p className="text-dark-400 mb-8 text-base">Looks like you haven't added anything yet. Let's change that!</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-colors"
        >
          <ShoppingBag size={16} />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-28 sm:pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/products" className="text-dark-400 hover:text-brand-400 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl">Shopping Cart</h1>
          <p className="text-dark-400 text-sm">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-3 space-y-4">
          {cartItems.map((item) => {
            const itemTotal = item.price;
            return (
              <div
                key={`${item.id}`}
                className="bg-dark-800 rounded-2xl border border-dark-700/50 p-4 flex gap-4 animate-fade-in"
              >
                {/* Image */}
                <Link
                  href={`/products/${item.id}`}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-dark-700 rounded-xl overflow-hidden"
                >
                  {!imageErrors.has(item.id) ? (
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-contain p-2"
                      onError={() => setImageErrors(prev => new Set(prev).add(item.id))}
                      sizes="96px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-3xl">🛍️</div>
                  )}
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-dark-500 text-xs font-mono uppercase mb-0.5">{item.brand}</p>
                      <Link
                        href={`/products/${item.id}`}
                        className="font-semibold text-sm text-dark-100 hover:text-brand-400 transition-colors line-clamp-2 leading-snug"
                      >
                        {item.title}
                      </Link>
                      {/* {(item.selectedColor || item.selectedSize) && (
                        <p className="text-dark-500 text-xs mt-1">
                          {item.selectedColor && <span>{item.selectedColor}</span>}
                          {item.selectedColor && item.selectedSize && <span> · </span>}
                          {item.selectedSize && <span>{item.selectedSize}</span>}
                        </p>
                      )} */}
                    </div>
                    <button
                      onClick={() => dispatch(removeFromWishlist(item))}
                      className="text-dark-600 hover:text-red-400 transition-colors flex-shrink-0 p-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3 gap-2">
                    {/* Qty controls */}
                    {/* <div className="flex items-center bg-dark-700 rounded-xl overflow-hidden border border-dark-600">
                      <button
                        onClick={() => dispatch(updateQuantity({
                          productId: item.id,
                          quantity: item.quantity - 1,
                          selectedColor: item.selectedColor,
                          selectedSize: item.selectedSize,
                        }))}
                        className="w-8 h-8 flex items-center justify-center text-dark-400 hover:text-white hover:bg-dark-600 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center font-mono font-bold text-sm text-dark-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch(updateQuantity({
                          productId: item.product.id,
                          quantity: item.quantity + 1,
                          selectedColor: item.selectedColor,
                          selectedSize: item.selectedSize,
                        }))}
                        className="w-8 h-8 flex items-center justify-center text-dark-400 hover:text-white hover:bg-dark-600 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div> */}

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold font-mono text-brand-400">{formatUSD(itemTotal)}</p>
                      
                        <p className="text-dark-500 text-xs font-mono">{formatUSD(item.price)} each</p>
                      
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Clear cart */}
          <button
            onClick={() => dispatch(clearWishlist())}
            className="text-dark-500 hover:text-red-400 text-xs transition-colors underline"
          >
            Clear all items
          </button>
        </div>
      </div>
    </div>
  );
}

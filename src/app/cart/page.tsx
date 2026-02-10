'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { removeFromCart, updateQuantity, applyPromoCode, removePromoCode, clearCart } from '@/store/slices/cartSlice';
import { formatUSD, calculateCartTotals, validatePromoCode } from '@/lib/utils';
import { Minus, Plus, Trash2, Tag, ShoppingBag, ArrowLeft, ChevronRight, CheckCircle } from 'lucide-react';
import CheckoutModal from '@/components/cart/CheckoutModal';
import clsx from 'clsx';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);
  const promoCode = useAppSelector(state => state.cart.promoCode);
  const promoDiscount = useAppSelector(state => state.cart.promoDiscount);

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const totals = calculateCartTotals(cartItems, promoDiscount);
  const isCartEmpty = cartItems.length === 0;

  const handleApplyPromo = () => {
    if (!promoInput.trim()) {
      setPromoMessage({ text: 'Enter a promo code', type: 'error' });
      return;
    }
    const result = validatePromoCode(promoInput, totals.subtotal);
    if (result.valid) {
      dispatch(applyPromoCode({ code: promoInput.toUpperCase(), discount: result.discount }));
      setPromoMessage({ text: result.message, type: 'success' });
      setPromoInput('');
    } else {
      setPromoMessage({ text: result.message, type: 'error' });
    }
  };

  const handleRemovePromo = () => {
    dispatch(removePromoCode());
    setPromoMessage(null);
  };

  if (isCartEmpty) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl mb-3">Your cart is empty</h2>
        <p className="text-dark-400 mb-8 text-base">Looks like you haven't added anything yet. Let's change that!</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-colors"
        >
          <ShoppingBag size={16} />
          Start Shopping
        </Link>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <span className="text-dark-500 text-xs">Try promo codes:</span>
          {['SAVE10', 'FLAT20', 'WELCOME15'].map(code => (
            <span key={code} className="font-mono text-xs bg-dark-800 text-brand-400 px-2 py-1 rounded border border-dark-600">
              {code}
            </span>
          ))}
        </div>
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
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const itemTotal = item.product.price * item.quantity;
            return (
              <div
                key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                className="bg-dark-800 rounded-2xl border border-dark-700/50 p-4 flex gap-4 animate-fade-in"
              >
                {/* Image */}
                <Link
                  href={`/products/${item.product.id}`}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-dark-700 rounded-xl overflow-hidden"
                >
                  {!imageErrors.has(item.product.id) ? (
                    <Image
                      src={item.product.thumbnail}
                      alt={item.product.title}
                      fill
                      className="object-contain p-2"
                      onError={() => setImageErrors(prev => new Set(prev).add(item.product.id))}
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
                      <p className="text-dark-500 text-xs font-mono uppercase mb-0.5">{item.product.brand}</p>
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-semibold text-sm text-dark-100 hover:text-brand-400 transition-colors line-clamp-2 leading-snug"
                      >
                        {item.product.title}
                      </Link>
                      {(item.selectedColor || item.selectedSize) && (
                        <p className="text-dark-500 text-xs mt-1">
                          {item.selectedColor && <span>{item.selectedColor}</span>}
                          {item.selectedColor && item.selectedSize && <span> · </span>}
                          {item.selectedSize && <span>{item.selectedSize}</span>}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => dispatch(removeFromCart({
                        productId: item.product.id,
                        selectedColor: item.selectedColor,
                        selectedSize: item.selectedSize,
                      }))}
                      className="text-dark-600 hover:text-red-400 transition-colors flex-shrink-0 p-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3 gap-2">
                    {/* Qty controls */}
                    <div className="flex items-center bg-dark-700 rounded-xl overflow-hidden border border-dark-600">
                      <button
                        onClick={() => dispatch(updateQuantity({
                          productId: item.product.id,
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
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold font-mono text-brand-400">{formatUSD(itemTotal)}</p>
                      {item.quantity > 1 && (
                        <p className="text-dark-500 text-xs font-mono">{formatUSD(item.product.price)} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Clear cart */}
          <button
            onClick={() => dispatch(clearCart())}
            className="text-dark-500 hover:text-red-400 text-xs transition-colors underline"
          >
            Clear all items
          </button>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {/* Promo Code */}
          <div className="bg-dark-800 rounded-2xl border border-dark-700/50 p-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Tag size={14} className="text-brand-400" />
              Promo Code
            </h3>

            {promoCode ? (
              <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-xl px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-400" />
                  <span className="font-mono text-sm text-green-400 font-bold">{promoCode}</span>
                  <span className="text-green-300 text-xs">applied!</span>
                </div>
                <button
                  onClick={handleRemovePromo}
                  className="text-green-600 hover:text-red-400 text-xs transition-colors underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoMessage(null); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                    placeholder="Enter code..."
                    className="flex-1 bg-dark-700 border border-dark-600 rounded-xl px-3 py-2 text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:border-brand-500 font-mono uppercase"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="bg-brand-500 hover:bg-brand-600 text-white px-3 py-2 rounded-xl text-sm font-bold transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {promoMessage && (
                  <p className={clsx(
                    'text-xs',
                    promoMessage.type === 'success' ? 'text-green-400' : 'text-red-400'
                  )}>
                    {promoMessage.text}
                  </p>
                )}

                <p className="text-dark-600 text-xs">
                  Try: <span className="font-mono text-dark-500">SAVE10</span> · <span className="font-mono text-dark-500">FLAT20</span> · <span className="font-mono text-dark-500">WELCOME15</span>
                </p>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="bg-dark-800 rounded-2xl border border-dark-700/50 p-4">
            <h3 className="font-semibold text-sm mb-4">Price Breakdown</h3>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-dark-400">
                <span>MRP Total</span>
                <span className="font-mono line-through">{formatUSD(totals.mrp)}</span>
              </div>
              <div className="flex justify-between text-green-400">
                <span>Product Discount</span>
                <span className="font-mono">-{formatUSD(totals.productDiscount)}</span>
              </div>
              <div className="flex justify-between text-dark-300">
                <span>Subtotal</span>
                <span className="font-mono">{formatUSD(totals.subtotal)}</span>
              </div>
              {totals.promoDiscount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Promo Discount</span>
                  <span className="font-mono">-{formatUSD(totals.promoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-dark-400">
                <span>Tax (18% GST)</span>
                <span className="font-mono">{formatUSD(totals.tax)}</span>
              </div>
              <div className="flex justify-between text-dark-400">
                <span>Delivery</span>
                <span className="font-mono text-green-400">
                  {totals.subtotal > 50 ? 'FREE' : formatUSD(5.99)}
                </span>
              </div>

              <div className="h-px bg-dark-700/50 my-2" />

              <div className="flex justify-between text-lg font-bold text-dark-50">
                <span>Total</span>
                <span className="font-mono text-brand-400">{formatUSD(totals.total)}</span>
              </div>

              {totals.savings > 0 && (
                <div className="text-center text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg py-2 font-medium">
                  🎉 You save {formatUSD(totals.savings)} on this order!
                </div>
              )}
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white py-3.5 px-6 rounded-xl font-bold text-sm mt-4 transition-all duration-200 hover:shadow-lg hover:shadow-brand-500/20 active:scale-95"
            >
              Proceed to Checkout
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-dark-900/95 backdrop-blur-md border-t border-dark-700/50 p-4 z-40">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div>
            <p className="text-dark-400 text-xs">Total Amount</p>
            <p className="font-display font-bold text-lg text-brand-400 font-mono">{formatUSD(totals.total)}</p>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white py-3 px-6 rounded-xl font-bold text-sm transition-colors flex-shrink-0"
          >
            Checkout <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={totals.total}
      />
    </div>
  );
}

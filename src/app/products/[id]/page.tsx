'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/types';
import ImageCarousel from '@/components/product/ImageCarousel';
import ProductCard from '@/components/product/ProductCard';
import RatingStars from '@/components/ui/RatingStars';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { formatUSD, calculateDiscountedPrice, getMRPPrice, COLORS, SIZES } from '@/lib/utils';
import {
  ShoppingCart, Heart, ArrowLeft, Minus, Plus, Check,
  Truck, ShieldCheck, RotateCcw, Share2, Star, Package
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].name);
  const [selectedSize, setSelectedSize] = useState(SIZES[2]);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  const isWishlisted = useAppSelector(state =>
    state.wishlist.items.some(item => item.id === Number(id))
  );

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/products/${id}`).then(r => r.json()),
      fetch(`/api/related-products/${id}`).then(r => r.json()),
    ]).then(([productData, relatedData]) => {
      setProduct(productData);
      setRelatedProducts(relatedData.products || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ product, quantity, selectedColor, selectedSize }));
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    dispatch(toggleWishlist(product));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">😔</div>
        <h2 className="font-bold text-xl mb-2">Product not found</h2>
        <Link href="/products" className="text-brand-400 hover:underline">Browse all products</Link>
      </div>
    );
  }

  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);
  const mrpPrice = getMRPPrice(product.price, product.discountPercentage);
  const savings = mrpPrice - discountedPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-dark-500 mb-8">
        <Link href="/" className="hover:text-brand-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-brand-400 transition-colors">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-brand-400 transition-colors capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-dark-300 truncate max-w-[200px]">{product.title}</span>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Images */}
        <div>
          <ImageCarousel images={product.images} title={product.title} />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand & Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-brand-400 uppercase tracking-widest bg-brand-500/10 px-2 py-1 rounded-lg border border-brand-500/20">
              {product.brand}
            </span>
            <span className="font-mono text-xs text-dark-400 bg-dark-800 px-2 py-1 rounded-lg capitalize">
              {product.category}
            </span>
            {product.stock < 10 && product.stock > 0 && (
              <span className="font-mono text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-lg border border-yellow-400/20">
                Only {product.stock} left!
              </span>
            )}
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-3xl leading-snug">{product.title}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <RatingStars rating={product.rating} size={16} showValue />
            <span className="text-dark-500 text-sm">|</span>
            <span className="text-dark-400 text-sm">{product.stock} in stock</span>
            {product.sku && <span className="text-dark-600 text-xs font-mono">SKU: {product.sku}</span>}
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 flex-wrap">
            <span className="font-display font-black text-3xl sm:text-4xl text-brand-400 font-mono">
              {formatUSD(discountedPrice)}
            </span>
            {product.discountPercentage > 1 && (
              <>
                <span className="text-dark-500 text-lg line-through font-mono">{formatUSD(mrpPrice)}</span>
                <span className="bg-green-500/15 text-green-400 text-sm font-mono font-bold px-2 py-0.5 rounded-lg border border-green-500/20">
                  Save {formatUSD(savings)} ({Math.round(product.discountPercentage)}% OFF)
                </span>
              </>
            )}
          </div>

          <div className="h-px bg-dark-700/50" />

          {/* Color Selector */}
          <div>
            <p className="text-sm font-medium text-dark-200 mb-2">
              Color: <span className="text-brand-400">{selectedColor}</span>
            </p>
            <div className="flex gap-2 flex-wrap">
              {COLORS.slice(0, 6).map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  title={color.name}
                  className={clsx(
                    'w-8 h-8 rounded-full border-2 transition-all duration-200 relative',
                    selectedColor === color.name
                      ? 'border-brand-500 scale-110'
                      : 'border-dark-600 hover:border-dark-400'
                  )}
                  style={{ backgroundColor: color.value }}
                >
                  {selectedColor === color.name && (
                    <Check
                      size={12}
                      className={clsx(
                        'absolute inset-0 m-auto',
                        color.name === 'White' ? 'text-dark-900' : 'text-white'
                      )}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <p className="text-sm font-medium text-dark-200 mb-2">
              Size: <span className="text-brand-400">{selectedSize}</span>
            </p>
            <div className="flex gap-2 flex-wrap">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={clsx(
                    'w-11 h-11 rounded-xl text-sm font-mono font-medium border-2 transition-all duration-200',
                    selectedSize === size
                      ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                      : 'border-dark-600 text-dark-400 hover:border-dark-400 hover:text-dark-200'
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Cart */}
          <div className="flex gap-3">
            {/* Quantity */}
            <div className="flex items-center bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-12 flex items-center justify-center text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 h-12 flex items-center justify-center font-mono font-bold text-dark-100">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="w-10 h-12 flex items-center justify-center text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={clsx(
                'flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm transition-all duration-200',
                product.stock === 0
                  ? 'bg-dark-700 text-dark-500 cursor-not-allowed'
                  : isAddedToCart
                  ? 'bg-green-500 text-white'
                  : 'bg-brand-500 hover:bg-brand-600 text-white active:scale-95'
              )}
            >
              {isAddedToCart ? (
                <><Check size={16} /> Added to Cart!</>
              ) : (
                <><ShoppingCart size={16} /> Add to Cart</>
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={handleToggleWishlist}
              className={clsx(
                'w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-200',
                isWishlisted
                  ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                  : 'border-dark-600 text-dark-400 hover:border-brand-500/50 hover:text-brand-400'
              )}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Buy Now */}
          <Link
            href="/cart"
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm bg-dark-700 hover:bg-dark-600 text-dark-100 border border-dark-600 hover:border-dark-400 transition-all duration-200"
          >
            Buy Now — {formatUSD(discountedPrice * quantity)}
          </Link>

          {/* Trust Signals */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: Truck, label: 'Free Delivery', sub: 'On orders $50+' },
              { icon: ShieldCheck, label: 'Secure', sub: 'SSL Protected' },
              { icon: RotateCcw, label: '30-day Return', sub: 'Hassle-free' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="text-center p-2 bg-dark-800 rounded-xl border border-dark-700/50">
                <Icon size={16} className="text-brand-400 mx-auto mb-1" />
                <p className="text-xs font-semibold text-dark-200">{label}</p>
                <p className="text-xs text-dark-500">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-12">
        <div className="flex gap-1 bg-dark-800 rounded-xl p-1 mb-6 w-fit">
          {(['description', 'specs', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200',
                activeTab === tab
                  ? 'bg-brand-500 text-white'
                  : 'text-dark-400 hover:text-dark-200'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'description' && (
          <div className="max-w-3xl">
            <p className="text-dark-300 leading-relaxed text-base">{product.description}</p>
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map(tag => (
                  <span key={tag} className="text-xs font-mono bg-dark-800 text-dark-400 px-3 py-1 rounded-full border border-dark-700/50">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="max-w-2xl bg-dark-800 rounded-2xl border border-dark-700/50 overflow-hidden">
            {[
              ['Brand', product.brand],
              ['Category', product.category],
              ['SKU', product.sku || 'N/A'],
              ['Weight', product.weight ? `${product.weight} kg` : 'N/A'],
              ['Stock', `${product.stock} units`],
              ['Min Order', product.minimumOrderQuantity ? `${product.minimumOrderQuantity} units` : '1 unit'],
              ['Availability', product.availabilityStatus || (product.stock > 0 ? 'In Stock' : 'Out of Stock')],
            ].map(([label, value], i) => (
              <div
                key={label}
                className={clsx(
                  'flex gap-4 px-5 py-3 text-sm',
                  i % 2 === 0 ? 'bg-dark-800' : 'bg-dark-700/50'
                )}
              >
                <span className="text-dark-400 w-32 flex-shrink-0 font-medium">{label}</span>
                <span className="text-dark-200">{value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-4 p-4 bg-dark-800 rounded-2xl border border-dark-700/50">
              <div className="text-4xl font-mono font-black text-brand-400">{product.rating.toFixed(1)}</div>
              <div>
                <RatingStars rating={product.rating} size={18} />
                <p className="text-dark-400 text-sm mt-1">Based on {Math.floor(product.stock * 4.3)} reviews</p>
              </div>
            </div>
            {/* Mock reviews */}
            {[
              { name: 'Alex M.', rating: 5, text: 'Excellent product! Exactly as described. Fast shipping and great quality.', date: '2 days ago' },
              { name: 'Sam K.', rating: 4, text: 'Good value for money. Would recommend to friends and family.', date: '1 week ago' },
              { name: 'Jordan L.', rating: 5, text: 'Love it! The quality exceeded my expectations. Will buy again.', date: '2 weeks ago' },
            ].map((review) => (
              <div key={review.name} className="p-4 bg-dark-800 rounded-xl border border-dark-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold">
                      {review.name[0]}
                    </div>
                    <span className="font-semibold text-sm">{review.name}</span>
                  </div>
                  <span className="text-dark-500 text-xs">{review.date}</span>
                </div>
                <RatingStars rating={review.rating} size={12} className="mb-2" />
                <p className="text-dark-400 text-sm">{review.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-display font-bold text-xl sm:text-2xl">Similar Products</h2>
            <Link href={`/products?category=${product.category}`} className="text-brand-400 text-sm hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {relatedProducts.slice(0, 6).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

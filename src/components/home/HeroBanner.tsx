'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

const slides = [
  {
    id: 1,
    tag: 'New Arrivals',
    headline: 'Next-Gen Gadgets',
    subheadline: 'That Power Your World',
    description: 'Shop the latest in smartphones, laptops, and wearables from top brands.',
    cta: 'Shop Electronics',
    href: '/products?category=smartphones',
    accent: '#f97316',
    bg: 'from-dark-900 via-dark-800 to-dark-900',
    emoji: '📱',
    badge: 'Up to 40% OFF',
  },
  {
    id: 2,
    tag: 'Flash Sale',
    headline: 'Style Without',
    subheadline: 'Compromise',
    description: 'Discover the latest fashion trends. Tops, dresses, shoes, and accessories.',
    cta: 'Explore Fashion',
    href: '/products?category=womens-dresses',
    accent: '#ec4899',
    bg: 'from-dark-900 via-pink-950 to-dark-900',
    emoji: '👗',
    badge: 'Starts at $9.99',
  },
  {
    id: 3,
    tag: 'Best Sellers',
    headline: 'Beauty &',
    subheadline: 'Self Care Essentials',
    description: 'Premium skincare, fragrances, and beauty products for your daily ritual.',
    cta: 'Shop Beauty',
    href: '/products?category=skincare',
    accent: '#a855f7',
    bg: 'from-dark-900 via-purple-950 to-dark-900',
    emoji: '✨',
    badge: 'Free Shipping',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => goToNext(), 5000);
    return () => clearInterval(timer);
  }, [current]);

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] flex items-center">
      {/* Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${slide.bg} transition-all duration-700`}
      />

      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Decorative orbs */}
      <div
        className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-700"
        style={{ background: `radial-gradient(circle, ${slide.accent}, transparent)` }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-10 blur-3xl transition-all duration-700"
        style={{ background: `radial-gradient(circle, ${slide.accent}, transparent)` }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 w-full">
        <div className="max-w-2xl">
          {/* Tag */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest mb-6 border"
            style={{ 
              color: slide.accent, 
              borderColor: `${slide.accent}40`,
              backgroundColor: `${slide.accent}15`
            }}
          >
            <Zap size={10} fill="currentColor" />
            {slide.tag}
          </div>

          {/* Headline */}
          <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-7xl leading-none mb-1">
              {slide.headline}
            </h1>
            <h1
              className="font-display font-black text-4xl sm:text-5xl lg:text-7xl leading-none mb-6"
              style={{ color: slide.accent }}
            >
              {slide.subheadline}
            </h1>
          </div>

          <p className={`text-dark-300 text-base sm:text-lg mb-8 max-w-lg leading-relaxed transition-all duration-500 delay-100 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            {slide.description}
          </p>

          {/* CTA */}
          <div className={`flex flex-wrap items-center gap-4 transition-all duration-500 delay-200 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <Link
              href={slide.href}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all duration-200 hover:gap-3"
              style={{ backgroundColor: slide.accent }}
            >
              {slide.cta}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <span
              className="text-xs font-mono font-bold px-3 py-2 rounded-lg border"
              style={{ 
                color: slide.accent,
                borderColor: `${slide.accent}30`,
                backgroundColor: `${slide.accent}10`
              }}
            >
              {slide.badge}
            </span>
          </div>
        </div>

        {/* Big emoji decoration */}
        <div
          className={`absolute right-4 sm:right-16 lg:right-24 top-1/2 -translate-y-1/2 text-8xl sm:text-[140px] lg:text-[200px] transition-all duration-700 pointer-events-none select-none ${isAnimating ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
          style={{ filter: 'drop-shadow(0 0 60px rgba(0,0,0,0.5))' }}
        >
          {slide.emoji}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={goToPrev}
          className="w-8 h-8 rounded-full bg-dark-800/80 border border-dark-600 flex items-center justify-center text-dark-400 hover:text-white hover:border-brand-500 transition-all"
        >
          <ChevronLeft size={14} />
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current ? 'w-6 h-2 bg-brand-500' : 'w-2 h-2 bg-dark-600 hover:bg-dark-400'
              }`}
            />
          ))}
        </div>
        <button
          onClick={goToNext}
          className="w-8 h-8 rounded-full bg-dark-800/80 border border-dark-600 flex items-center justify-center text-dark-400 hover:text-white hover:border-brand-500 transition-all"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </section>
  );
}

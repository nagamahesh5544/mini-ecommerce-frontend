'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import clsx from 'clsx';

interface ImageCarouselProps {
  images: string[];
  title: string;
}

export default function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState<Set<number>>(new Set());

  const allImages = images.length >= 3 ? images : [...images, ...images, ...images].slice(0, 4);

  const goTo = (index: number) => {
    setCurrent(((index % allImages.length) + allImages.length) % allImages.length);
  };

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div
        className="relative aspect-square bg-dark-800 rounded-2xl overflow-hidden group cursor-zoom-in"
        onClick={() => setIsZoomed(true)}
      >
        {!imageError.has(current) ? (
          <Image
            src={allImages[current]}
            alt={`${title} - Image ${current + 1}`}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(prev => new Set(prev).add(current))}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl">🛍️</div>
        )}

        {/* Navigation arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goTo(current - 1); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-dark-900/70 hover:bg-dark-900/90 backdrop-blur-sm rounded-full flex items-center justify-center text-dark-200 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200 border border-dark-600/50"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goTo(current + 1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-dark-900/70 hover:bg-dark-900/90 backdrop-blur-sm rounded-full flex items-center justify-center text-dark-200 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200 border border-dark-600/50"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Zoom hint */}
        <div className="absolute top-3 right-3 w-8 h-8 bg-dark-900/60 backdrop-blur-sm rounded-lg flex items-center justify-center text-dark-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={14} />
        </div>

        {/* Image count */}
        <div className="absolute bottom-3 right-3 bg-dark-900/70 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-mono text-dark-300">
          {current + 1}/{allImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={clsx(
                'relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 bg-dark-800',
                i === current
                  ? 'border-brand-500 opacity-100'
                  : 'border-dark-600 opacity-60 hover:opacity-80 hover:border-dark-400'
              )}
            >
              {!imageError.has(i) ? (
                <Image
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  className="object-contain p-1"
                  onError={() => setImageError(prev => new Set(prev).add(i))}
                  sizes="80px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-xl">🛍️</div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-2xl w-full aspect-square">
            {!imageError.has(current) && (
              <Image
                src={allImages[current]}
                alt={title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-dark-800 rounded-full flex items-center justify-center text-dark-300 hover:text-white"
            onClick={() => setIsZoomed(false)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

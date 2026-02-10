import { Star } from 'lucide-react';
import clsx from 'clsx';

interface RatingStarsProps {
  rating: number;
  size?: number;
  showValue?: boolean;
  count?: number;
  className?: string;
}

export default function RatingStars({ rating, size = 14, showValue = false, count, className }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className={clsx('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} size={size} className="text-yellow-400 fill-yellow-400" />
        ))}
        {hasHalf && (
          <div className="relative">
            <Star size={size} className="text-dark-600 fill-dark-600" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star size={size} className="text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="text-dark-600 fill-dark-600" />
        ))}
      </div>
      {showValue && (
        <span className="text-dark-300 text-sm font-mono ml-1">{rating.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="text-dark-500 text-xs ml-0.5">({count.toLocaleString()})</span>
      )}
    </div>
  );
}

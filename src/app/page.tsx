import HeroBanner from '@/components/home/HeroBanner';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import TrendingProducts from '@/components/home/TrendingProducts';
import PromoStrip from '@/components/home/PromoStrip';

export default function HomePage() {
  return (
    <div>
      <HeroBanner />
      <PromoStrip />
      <FeaturedCategories />
      <TrendingProducts />
    </div>
  );
}

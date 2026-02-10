import { Product, FilterState, PromoCode } from '@/types';

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price * 84); // USD to INR conversion
};

export const formatUSD = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(price);
};

export const calculateDiscountedPrice = (price: number, discountPercentage: number): number => {
  return price * (1 - discountPercentage / 100);
};

export const getMRPPrice = (price: number, discountPercentage: number): number => {
  return price / (1 - discountPercentage / 100);
};

export const filterProducts = (products: Product[], filters: FilterState): Product[] => {
  let filtered = [...products];

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }

  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter((p) => p.category === filters.category);
  }

  if (filters.brand && filters.brand !== 'all') {
    filtered = filtered.filter((p) => p.brand?.toLowerCase() === filters.brand.toLowerCase());
  }

  filtered = filtered.filter(
    (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
  );

  if (filters.rating > 0) {
    filtered = filtered.filter((p) => p.rating >= filters.rating);
  }

  switch (filters.sortBy) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      filtered.sort((a, b) => b.id - a.id);
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  return filtered;
};

export const PROMO_CODES: PromoCode[] = [
  { code: 'SAVE10', discount: 10, type: 'percentage' },
  { code: 'FLAT20', discount: 20, type: 'fixed' },
  { code: 'WELCOME15', discount: 15, type: 'percentage' },
  { code: 'SUMMER30', discount: 30, type: 'percentage' },
  { code: 'NEWUSER50', discount: 50, type: 'fixed' },
];

export const validatePromoCode = (code: string, subtotal: number): { valid: boolean; discount: number; message: string } => {
  const promo = PROMO_CODES.find((p) => p.code === code.toUpperCase());
  if (!promo) {
    return { valid: false, discount: 0, message: 'Invalid promo code' };
  }
  
  const discount = promo.type === 'percentage' 
    ? (subtotal * promo.discount) / 100 
    : promo.discount;
  
  return { 
    valid: true, 
    discount: Math.min(discount, subtotal), 
    message: `${promo.type === 'percentage' ? `${promo.discount}%` : `$${promo.discount}`} discount applied!` 
  };
};

export const TAX_RATE = 0.18;

export const calculateCartTotals = (items: { product: { price: number; discountPercentage: number }; quantity: number }[], promoDiscount: number = 0) => {
  const mrp = items.reduce((sum, item) => {
    const originalPrice = getMRPPrice(item.product.price, item.product.discountPercentage);
    return sum + originalPrice * item.quantity;
  }, 0);

  const subtotal = items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const productDiscount = mrp - subtotal;
  const afterPromo = Math.max(0, subtotal - promoDiscount);
  const tax = afterPromo * TAX_RATE;
  const total = afterPromo + tax;

  return {
    mrp,
    subtotal,
    productDiscount,
    promoDiscount,
    tax,
    total,
    savings: productDiscount + promoDiscount,
  };
};

export const COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#22C55E' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Purple', value: '#A855F7' },
  { name: 'Pink', value: '#EC4899' },
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const getCategoryEmoji = (category: string): string => {
  const map: Record<string, string> = {
    'smartphones': '📱',
    'laptops': '💻',
    'fragrances': '🌸',
    'skincare': '✨',
    'groceries': '🛒',
    'home-decoration': '🏠',
    'furniture': '🪑',
    'tops': '👕',
    'womens-dresses': '👗',
    'womens-shoes': '👠',
    'mens-shirts': '👔',
    'mens-shoes': '👟',
    'mens-watches': '⌚',
    'womens-watches': '⌚',
    'womens-bags': '👜',
    'womens-jewellery': '💍',
    'sunglasses': '🕶️',
    'automotive': '🚗',
    'motorcycle': '🏍️',
    'lighting': '💡',
    'beauty': '💄',
    'sports-accessories': '⚽',
    'tablets': '📱',
    'vehicle': '🚙',
  };
  return map[category] || '🛍️';
};

export const formatCategoryName = (slug: string): string => {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

export const getRatingStars = (rating: number): { full: number; half: boolean; empty: number } => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return { full, half, empty };
};

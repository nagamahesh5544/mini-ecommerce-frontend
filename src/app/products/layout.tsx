import { Suspense } from 'react';
import ProductsPage from './page';

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-12 text-center text-dark-400">Loading products...</div>}>
      {children}
    </Suspense>
  );
}

'use client'
import Link from 'next/link';
import { Zap, Twitter, Instagram, Github, Youtube } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 border-t border-dark-700/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
                <Zap size={14} className="text-white" fill="white" />
              </div>
              <span className="text-lg font-display font-bold">
                Shop<span className="text-brand-500">zilla</span>
              </span>
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed mb-4">
              Your go-to destination for the best products at unbeatable prices.
            </p>
            <div className="flex gap-3">
              {[Twitter, Instagram, Github, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 bg-dark-800 hover:bg-brand-500 rounded-lg flex items-center justify-center text-dark-400 hover:text-white transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-dark-100 mb-4 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2">
              {['All Products', 'Electronics', 'Fashion', 'Beauty', 'Furniture', 'Smartphones'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/products?category=${item.toLowerCase().replace(' ', '-')}`}
                    className="text-dark-400 hover:text-brand-400 text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-dark-100 mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2">
              {['FAQ', 'Shipping Info', 'Returns', 'Track Order', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-dark-400 hover:text-brand-400 text-sm transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-semibold text-dark-100 mb-4 text-sm uppercase tracking-wider">Stay Updated</h4>
            <p className="text-dark-400 text-sm mb-4">Get exclusive deals straight to your inbox.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:border-brand-500 min-w-0"
              />
              <button
                type="submit"
                className="bg-brand-500 hover:bg-brand-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                Join
              </button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              {['SAVE10', 'WELCOME15'].map((code) => (
                <span key={code} className="font-mono text-xs bg-dark-800 border border-dark-600 px-2 py-1 rounded text-brand-400">
                  {code}
                </span>
              ))}
              <span className="text-dark-500 text-xs py-1">← Try these promo codes!</span>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-700/50 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-dark-500 text-sm">
            © {currentYear} Shopzilla. Built with Next.js & ❤️
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map((item) => (
              <a key={item} href="#" className="text-dark-500 hover:text-dark-300 text-xs transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

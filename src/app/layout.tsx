import type { Metadata } from 'next';
import './globals.css';
import { ReduxProvider } from '@/store/provider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Shopzilla — Modern E-Commerce',
  description: 'Discover the best products at unbeatable prices. Shop electronics, fashion, beauty, and more.',
  keywords: 'ecommerce, shopping, electronics, fashion, deals',
  openGraph: {
    title: 'Shopzilla — Modern E-Commerce',
    description: 'Discover the best products at unbeatable prices.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-dark-900 text-dark-50 font-sans antialiased">
        <ReduxProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}

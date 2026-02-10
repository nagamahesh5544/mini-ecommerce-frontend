# 🛍️ Shopzilla — Modern E-Commerce Application

A production-ready e-commerce application built with **Next.js 14**, **Tailwind CSS**, and **Redux Toolkit**, featuring a dark-theme design aesthetic.

> **Live Demo**: [Deploy to Vercel — see instructions below]  
> **API**: Powered by [dummyjson.com](https://dummyjson.com)

---

## 📸 Screenshots

| Page | Description |
|------|-------------|
| 🏠 Home | Hero carousel, category grid, trending products |
| 🛒 PLP | Filter sidebar, search, sort, pagination |
| 📦 PDP | Image carousel, variant selector, cart actions |
| 🛍️ Cart | Item management, promo codes, price breakdown |
| ✅ Checkout | Multi-step form with order confirmation |

---

## ✨ Features

### Pages
- **Home Page** — Animated hero carousel, 8 featured categories, trending products section, trust-signal strip
- **Product Listing Page (PLP)** — Filter by category/brand/price/rating, sort by 5 criteria, client-side search, pagination (12/page), grid/list toggle
- **Product Detail Page (PDP)** — Image carousel with lightbox, color/size variant selector, quantity picker, add-to-cart/wishlist, related products
- **Cart Page** — Quantity controls, remove items, promo code system, full price breakdown, mobile sticky checkout bar
- **Checkout Modal** — Multi-field form with validation, processing animation, success confirmation with order ID

### Technical Features
- 🔴 **Redux Toolkit** for cart & wishlist state management
- 💾 **Redux Persist** — cart and wishlist survive page refreshes (localStorage)
- 📱 **Mobile-first** responsive design throughout
- ⚡ **Next.js App Router** with server-side API routes
- 🎨 **Dark theme** with Syne + Space Mono fonts
- 🏷️ Full **TypeScript** coverage
- 🔍 **Client-side filtering** with debounced search
- 🎭 **Skeleton loading** states

---

## 🧰 Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 14 | Framework (App Router) |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Redux Toolkit | State management |
| Redux Persist | LocalStorage persistence |
| Lucide React | Icons |
| dummyjson.com | Product data API |

---

## 📁 Folder Structure

```
shopzilla/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API route handlers
│   │   │   ├── products/       # GET /api/products
│   │   │   │   └── [id]/       # GET /api/products/:id
│   │   │   ├── categories/     # GET /api/categories
│   │   │   ├── related-products/[id]/  # GET /api/related-products/:id
│   │   │   └── promocodes/     # POST /api/promocodes
│   │   ├── products/
│   │   │   ├── page.tsx        # Product Listing Page
│   │   │   └── [id]/page.tsx   # Product Detail Page
│   │   ├── cart/
│   │   │   └── page.tsx        # Cart Page
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx      # Sticky nav with cart/wishlist counts
│   │   │   └── Footer.tsx      # Footer with links + promo hints
│   │   ├── home/
│   │   │   ├── HeroBanner.tsx  # Auto-play carousel with 3 slides
│   │   │   ├── FeaturedCategories.tsx  # 8-item category grid
│   │   │   ├── TrendingProducts.tsx    # Top-rated products
│   │   │   └── PromoStrip.tsx  # 4 trust signals
│   │   ├── product/
│   │   │   ├── ProductCard.tsx  # Reusable card (used everywhere)
│   │   │   ├── FilterPanel.tsx  # Desktop sidebar + mobile drawer
│   │   │   └── ImageCarousel.tsx  # PDP image gallery + lightbox
│   │   ├── cart/
│   │   │   └── CheckoutModal.tsx  # Full checkout flow
│   │   └── ui/
│   │       ├── RatingStars.tsx  # ⭐ Reusable rating display
│   │       ├── Skeleton.tsx     # Loading skeletons
│   │       └── Toast.tsx        # Notification toasts
│   │
│   ├── hooks/
│   │   └── useRedux.ts          # Typed dispatch/selector hooks
│   │
│   ├── store/
│   │   ├── index.ts             # Redux store + persistor
│   │   ├── provider.tsx         # ReduxProvider component
│   │   └── slices/
│   │       ├── cartSlice.ts     # Cart CRUD + promo logic
│   │       └── wishlistSlice.ts # Wishlist toggle
│   │
│   ├── lib/
│   │   └── utils.ts             # Price calc, filters, promo validation
│   │
│   └── types/
│       └── index.ts             # TypeScript interfaces
│
├── public/                      # Static assets
├── tailwind.config.ts           # Custom theme (dark palette + Syne font)
├── next.config.mjs              # Image domains config
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/shopzilla.git
cd shopzilla

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 🌐 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect your GitHub repo at vercel.com/new
```

No environment variables required — the app uses public APIs.

---

## 🎟️ Promo Codes

Test the promo code system with these codes at checkout:

| Code | Discount |
|------|----------|
| `SAVE10` | 10% off |
| `FLAT20` | $20 flat off |
| `WELCOME15` | 15% off |
| `SUMMER30` | 30% off |
| `NEWUSER50` | $50 flat off |

---

## 🔌 API Endpoints

All routes proxy to dummyjson.com with caching:

| Endpoint | Description |
|----------|-------------|
| `GET /api/products?limit=100` | All products |
| `GET /api/products/:id` | Single product |
| `GET /api/categories` | All categories |
| `GET /api/related-products/:id` | Related products by category |
| `POST /api/promocodes` | Validate promo code |

---

## 🎨 Design Choices

- **Dark theme first** — The `#0a0a0a` base with brand orange (`#f97316`) accent creates a premium feel
- **Syne font** — Distinctive geometric display font, avoids generic Inter/Roboto look
- **Space Mono** — Used for prices, codes, and data — adds editorial character
- **Micro-interactions** — Hover states, scale transforms, and staggered animations throughout
- **Mobile sticky bar** — Cart page shows total + checkout button at bottom on mobile
- **Filter drawer on mobile** — Slides in from right, full-height overlay on small screens

---

## 📝 Future Improvements

- [ ] Auth with NextAuth.js
- [ ] Real payment gateway (Stripe/Razorpay)
- [ ] User reviews & ratings
- [ ] Product comparison tool
- [ ] Recently viewed products
- [ ] Email order confirmation
- [ ] Advanced image zoom on PDP
- [ ] Infinite scroll alternative to pagination
- [ ] Server-side rendering for SEO
- [ ] PWA support

---

## 📄 License

MIT License — feel free to use for learning or building your own project.

---

Made with ⚡ Next.js + ❤️ by the Shopzilla team

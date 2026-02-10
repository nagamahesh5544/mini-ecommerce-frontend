import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

const perks = [
  { icon: Truck, label: 'Free Shipping', sublabel: 'On orders over $50' },
  { icon: ShieldCheck, label: 'Secure Payment', sublabel: '100% Protected' },
  { icon: RotateCcw, label: 'Easy Returns', sublabel: '30-day policy' },
  { icon: Headphones, label: '24/7 Support', sublabel: 'Always here for you' },
];

export default function PromoStrip() {
  return (
    <div className="bg-dark-800 border-y border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {perks.map(({ icon: Icon, label, sublabel }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-brand-400" />
              </div>
              <div>
                <p className="font-semibold text-sm text-dark-100">{label}</p>
                <p className="text-dark-500 text-xs">{sublabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

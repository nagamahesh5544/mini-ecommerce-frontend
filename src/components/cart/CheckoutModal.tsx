'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/hooks/useRedux';
import { clearCart } from '@/store/slices/cartSlice';
import { formatUSD } from '@/lib/utils';
import { X, Package, CheckCircle, ChevronRight, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'card' | 'upi' | 'cod';
}

export default function CheckoutModal({ isOpen, onClose, total }: CheckoutModalProps) {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [errors, setErrors] = useState<Partial<FormData>>({});
const router = useRouter();
  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'card',
  });

  const [orderId] = useState(() => `SZ${Date.now().toString().slice(-8)}`);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.firstName.trim()) newErrors.firstName = 'Required';
    if (!form.lastName.trim()) newErrors.lastName = 'Required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email required';
    if (!form.phone.match(/^\d{10}$/)) newErrors.phone = '10-digit number required';
    if (!form.address.trim()) newErrors.address = 'Required';
    if (!form.city.trim()) newErrors.city = 'Required';
    if (!form.pincode.match(/^\d{5,6}$/)) newErrors.pincode = 'Valid pincode required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStep('processing');
    setTimeout(() => {
      setStep('success');
      
    }, 2000);
  };

  const handleClose = () => {
    if (step === 'success') {
      setStep('form');
      setForm({
        firstName: '', lastName: '', email: '', phone: '',
        address: '', city: '', state: '', pincode: '', paymentMethod: 'card',
      });
      setErrors({});
      dispatch(clearCart());
      router.push('/products');
    }
    onClose();
  };

  const update = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const InputField = ({ label, field, type = 'text', placeholder }: {
    label: string; field: keyof FormData; type?: string; placeholder?: string;
  }) => (
    <div>
      <label className="text-xs text-dark-400 font-medium mb-1 block">{label}</label>
      <input
        type={type}
        value={form[field]}
        onChange={(e) => update(field, e.target.value)}
        placeholder={placeholder}
        className={clsx(
          'w-full bg-dark-700 border rounded-xl px-3 py-2.5 text-sm text-dark-100 placeholder-dark-600 focus:outline-none transition-colors',
          errors[field] ? 'border-red-500/50 focus:border-red-500' : 'border-dark-600 focus:border-brand-500'
        )}
      />
      {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-dark-800 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg border border-dark-700/50 shadow-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-dark-700/50">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-brand-400" />
            <span className="font-bold text-sm">
              {step === 'success' ? 'Order Confirmed!' : 'Checkout'}
            </span>
          </div>
          <button onClick={handleClose} className="text-dark-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="bg-dark-700/50 rounded-xl p-3 flex items-center justify-between">
                <span className="text-sm text-dark-300">Order Total</span>
                <span className="font-mono font-bold text-brand-400">{formatUSD(total)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InputField label="First Name *" field="firstName" placeholder="John" />
                <InputField label="Last Name *" field="lastName" placeholder="Doe" />
              </div>

              <InputField label="Email *" field="email" type="email" placeholder="john@example.com" />
              <InputField label="Phone *" field="phone" type="tel" placeholder="9876543210" />

              <div>
                <label className="text-xs text-dark-400 font-medium mb-1 block">Address *</label>
                <textarea
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  rows={2}
                  placeholder="Street address, apartment, building..."
                  className={clsx(
                    'w-full bg-dark-700 border rounded-xl px-3 py-2.5 text-sm text-dark-100 placeholder-dark-600 focus:outline-none transition-colors resize-none',
                    errors.address ? 'border-red-500/50' : 'border-dark-600 focus:border-brand-500'
                  )}
                />
                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <InputField label="City *" field="city" placeholder="Mumbai" />
                </div>
                <div className="col-span-1">
                  <InputField label="State" field="state" placeholder="MH" />
                </div>
                <div className="col-span-1">
                  <InputField label="Pincode *" field="pincode" placeholder="400001" />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-xs text-dark-400 font-medium mb-2 block">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'card', label: '💳 Card' },
                    { value: 'upi', label: '📱 UPI' },
                    { value: 'cod', label: '💵 COD' },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => update('paymentMethod', value)}
                      className={clsx(
                        'py-2.5 px-3 rounded-xl text-xs font-medium border-2 transition-all duration-200',
                        form.paymentMethod === value
                          ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                          : 'border-dark-600 text-dark-400 hover:border-dark-400'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-brand-500/20"
              >
                Place Order — {formatUSD(total)}
                <ChevronRight size={16} />
              </button>

              <p className="text-center text-dark-600 text-xs">
                🔒 Secure checkout · This is a demo app
              </p>
            </form>
          )}

          {step === 'processing' && (
            <div className="p-12 text-center">
              <Loader2 size={48} className="text-brand-400 mx-auto animate-spin mb-4" />
              <h3 className="font-bold text-lg mb-2">Processing your order...</h3>
              <p className="text-dark-400 text-sm">Please don't close this window</p>
            </div>
          )}

          {step === 'success' && (
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={36} className="text-green-400" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">Order Placed! 🎉</h3>
              <p className="text-dark-400 text-sm mb-1">Thank you, {form.firstName}!</p>
              <p className="text-dark-500 text-xs mb-4">
                A confirmation has been sent to {form.email}
              </p>

              <div className="bg-dark-700/50 rounded-xl p-4 mb-6 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Order ID</span>
                  <span className="font-mono font-bold text-brand-400">#{orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Amount Paid</span>
                  <span className="font-mono font-bold">{formatUSD(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Delivery to</span>
                  <span className="text-dark-200">{form.city}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Expected Delivery</span>
                  <span className="text-green-400 font-medium">3-5 Business Days</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-xl font-bold text-sm transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

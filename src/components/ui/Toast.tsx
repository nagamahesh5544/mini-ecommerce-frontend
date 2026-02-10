'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import clsx from 'clsx';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={clsx(
              'toast-enter flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border pointer-events-auto max-w-sm',
              toast.type === 'success' && 'bg-dark-800 border-green-500/30 text-dark-100',
              toast.type === 'error' && 'bg-dark-800 border-red-500/30 text-dark-100',
              toast.type === 'info' && 'bg-dark-800 border-brand-500/30 text-dark-100'
            )}
          >
            {toast.type === 'success' && <CheckCircle size={16} className="text-green-400 flex-shrink-0" />}
            {toast.type === 'error' && <XCircle size={16} className="text-red-400 flex-shrink-0" />}
            {toast.type === 'info' && <AlertCircle size={16} className="text-brand-400 flex-shrink-0" />}
            <span className="text-sm flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-dark-500 hover:text-dark-300 flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

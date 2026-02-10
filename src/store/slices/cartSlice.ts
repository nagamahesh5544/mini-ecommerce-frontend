import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartState, CartItem, Product } from '@/types';

const initialState: CartState = {
  items: [],
  promoCode: null,
  promoDiscount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number; selectedColor?: string; selectedSize?: string }>) => {
      const { product, quantity = 1, selectedColor, selectedSize } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id && 
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize
      );
      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({ product, quantity, selectedColor, selectedSize });
      }
    },
    removeFromCart: (state, action: PayloadAction<{ productId: number; selectedColor?: string; selectedSize?: string }>) => {
      const { productId, selectedColor, selectedSize } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.product.id === productId && 
          item.selectedColor === selectedColor && 
          item.selectedSize === selectedSize)
      );
    },
    updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number; selectedColor?: string; selectedSize?: string }>) => {
      const { productId, quantity, selectedColor, selectedSize } = action.payload;
      const item = state.items.find(
        (item) => item.product.id === productId && 
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize
      );
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            (i) => !(i.product.id === productId && 
              i.selectedColor === selectedColor && 
              i.selectedSize === selectedSize)
          );
        } else {
          item.quantity = quantity;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.promoCode = null;
      state.promoDiscount = 0;
    },
    applyPromoCode: (state, action: PayloadAction<{ code: string; discount: number }>) => {
      state.promoCode = action.payload.code;
      state.promoDiscount = action.payload.discount;
    },
    removePromoCode: (state) => {
      state.promoCode = null;
      state.promoDiscount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, applyPromoCode, removePromoCode } = cartSlice.actions;
export default cartSlice.reducer;

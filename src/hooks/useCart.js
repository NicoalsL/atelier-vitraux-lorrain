import { useContext } from 'react';
import { CartContext } from '../context/CartContext.jsx';

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart doit être utilisé à l\'intérieur d\'un <CartProvider>');
  }
  return ctx;
}

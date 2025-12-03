import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { CartItem, Product, PriceTier } from "@shared/schema";
import {
  loadCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart as clearCartStorage,
  getCartItemCount,
  getCartTotal,
  generateProductsSummary
} from "@/lib/cartStore";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: string, quantity: number) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number, priceTiers: PriceTier[]) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
  productsSummary: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(loadCart());
  }, []);

  const addItem = (product: Product, size: string, quantity: number) => {
    setItems(current => addToCart(current, product, size, quantity));
  };

  const removeItem = (productId: string, size: string) => {
    setItems(current => removeFromCart(current, productId, size));
  };

  const updateQuantity = (productId: string, size: string, quantity: number, priceTiers: PriceTier[]) => {
    setItems(current => updateCartQuantity(current, productId, size, quantity, priceTiers));
  };

  const clearCart = () => {
    setItems(clearCartStorage());
  };

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount: getCartItemCount(items),
    total: getCartTotal(items),
    productsSummary: generateProductsSummary(items)
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

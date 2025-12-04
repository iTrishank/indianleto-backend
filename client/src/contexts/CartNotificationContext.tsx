import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from "react";

interface CartNotificationContextType {
  notifiedProductId: string | null;
  notifyAddedToCart: (productId: string, quantity: number) => void;
  getNotificationQuantity: (productId: string) => number | null;
}

const CartNotificationContext = createContext<CartNotificationContextType | undefined>(undefined);

export function CartNotificationProvider({ children }: { children: ReactNode }) {
  const [notifiedProductId, setNotifiedProductId] = useState<string | null>(null);
  const [notificationQuantity, setNotificationQuantity] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const notifyAddedToCart = useCallback((productId: string, quantity: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setNotifiedProductId(productId);
    setNotificationQuantity(quantity);
    
    timeoutRef.current = setTimeout(() => {
      setNotifiedProductId(null);
      setNotificationQuantity(null);
    }, 2000);
  }, []);

  const getNotificationQuantity = useCallback((productId: string): number | null => {
    if (notifiedProductId === productId) {
      return notificationQuantity;
    }
    return null;
  }, [notifiedProductId, notificationQuantity]);

  return (
    <CartNotificationContext.Provider value={{ notifiedProductId, notifyAddedToCart, getNotificationQuantity }}>
      {children}
    </CartNotificationContext.Provider>
  );
}

export function useCartNotification() {
  const context = useContext(CartNotificationContext);
  if (context === undefined) {
    throw new Error("useCartNotification must be used within a CartNotificationProvider");
  }
  return context;
}

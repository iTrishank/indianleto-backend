import type { CartItem, Product, PriceTier } from "@shared/schema";
import { getPriceForQuantity } from "@shared/schema";

const CART_STORAGE_KEY = "indianleto_cart_v1";

export interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size: string, quantity: number) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number, priceTiers: PriceTier[]) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: () => number;
}

// Load cart from localStorage
export function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load cart:", e);
  }
  return [];
}

// Save cart to localStorage
export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save cart:", e);
  }
}

// Add item to cart
export function addToCart(
  currentItems: CartItem[],
  product: Product,
  size: string,
  quantity: number
): CartItem[] {
  const existingIndex = currentItems.findIndex(
    item => item.productId === product.id && item.variant.size === size
  );

  const unitPrice = getPriceForQuantity(product.priceTiers, quantity);

  if (existingIndex >= 0) {
    // Update existing item
    const newItems = [...currentItems];
    const newQuantity = newItems[existingIndex].quantity + quantity;
    newItems[existingIndex] = {
      ...newItems[existingIndex],
      quantity: newQuantity,
      unitPrice: getPriceForQuantity(product.priceTiers, newQuantity)
    };
    saveCart(newItems);
    return newItems;
  }

  // Add new item
  const newItem: CartItem = {
    productId: product.id,
    productTitle: product.title,
    productImage: product.images[0] || "",
    variant: {
      size,
      color: product.attributes.color
    },
    unitPrice,
    quantity
  };

  const newItems = [...currentItems, newItem];
  saveCart(newItems);
  return newItems;
}

// Remove item from cart
export function removeFromCart(
  currentItems: CartItem[],
  productId: string,
  size: string
): CartItem[] {
  const newItems = currentItems.filter(
    item => !(item.productId === productId && item.variant.size === size)
  );
  saveCart(newItems);
  return newItems;
}

// Update item quantity
export function updateCartQuantity(
  currentItems: CartItem[],
  productId: string,
  size: string,
  quantity: number,
  priceTiers: PriceTier[]
): CartItem[] {
  if (quantity <= 0) {
    return removeFromCart(currentItems, productId, size);
  }

  const newItems = currentItems.map(item => {
    if (item.productId === productId && item.variant.size === size) {
      return {
        ...item,
        quantity,
        unitPrice: getPriceForQuantity(priceTiers, quantity)
      };
    }
    return item;
  });

  saveCart(newItems);
  return newItems;
}

// Clear cart
export function clearCart(): CartItem[] {
  saveCart([]);
  return [];
}

// Get total item count
export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

// Get cart total
export function getCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
}

// Generate products summary for quotation form
export function generateProductsSummary(items: CartItem[]): string {
  if (items.length === 0) return "No items in cart";
  
  return items.map(item => 
    `${item.productTitle} | Size: ${item.variant.size} | Color: ${item.variant.color} | Qty: ${item.quantity} | INR${item.unitPrice.toFixed(2)}/pc`
  ).join("\n");
}

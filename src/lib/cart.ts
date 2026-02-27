import { Cart, CartItem } from "@/types";

const CART_KEY = "pv-cart";

export function loadCart(): Cart {
  if (typeof window === "undefined") return { items: [], updatedAt: "" };
  try {
    const data = localStorage.getItem(CART_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return { items: [], updatedAt: "" };
}

export function saveCart(cart: Cart): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateTax(subtotal: number): number {
  return Math.round(subtotal * 0.0825 * 100) / 100;
}

export function calculateShipping(subtotal: number): number {
  return subtotal >= 35 ? 0 : 5.99;
}

export function calculateTotal(
  subtotal: number,
  tax: number,
  shipping: number
): number {
  return Math.round((subtotal + tax + shipping) * 100) / 100;
}

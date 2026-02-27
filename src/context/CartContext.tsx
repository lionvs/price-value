"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Cart, CartItem } from "@/types";
import { loadCart, saveCart, calculateSubtotal, calculateTax, calculateShipping, calculateTotal } from "@/lib/cart";

type CartAction =
  | { type: "HYDRATE"; payload: Cart }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" };

function cartReducer(state: Cart, action: CartAction): Cart {
  const now = new Date().toISOString();
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "ADD_ITEM": {
      const existing = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
          updatedAt: now,
        };
      }
      return {
        items: [...state.items, action.payload],
        updatedAt: now,
      };
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter((item) => item.productId !== action.payload),
        updatedAt: now,
      };
    case "UPDATE_QUANTITY":
      if (action.payload.quantity <= 0) {
        return {
          items: state.items.filter(
            (item) => item.productId !== action.payload.productId
          ),
          updatedAt: now,
        };
      }
      return {
        items: state.items.map((item) =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        updatedAt: now,
      };
    case "CLEAR_CART":
      return { items: [], updatedAt: now };
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  isHydrated: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  itemCount: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  isHydrated: false,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
    updatedAt: "",
  });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = loadCart();
    if (saved.items.length > 0) {
      dispatch({ type: "HYDRATE", payload: saved });
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      saveCart(cart);
    }
  }, [cart, isHydrated]);

  const subtotal = calculateSubtotal(cart.items);
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = calculateTotal(subtotal, tax, shipping);

  return (
    <CartContext.Provider
      value={{
        items: cart.items,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
        tax,
        shipping,
        total,
        isHydrated,
        addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
        removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
        updateQuantity: (productId, quantity) =>
          dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } }),
        clearCart: () => dispatch({ type: "CLEAR_CART" }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

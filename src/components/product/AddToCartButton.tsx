"use client";

import { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface AddToCartButtonProps {
  product: Product;
  compact?: boolean;
}

export default function AddToCartButton({
  product,
  compact = false,
}: AddToCartButtonProps) {
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);

  const inCart = items.some((item) => item.productId === product.id);

  const handleAdd = () => {
    if (!product.inStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price: product.salePrice ?? product.price,
      quantity,
      image: product.images[0] || "/images/products/placeholder.svg",
      slug: product.slug,
      categorySlug: product.categorySlug,
    });
    setQuantity(1);
  };

  if (!product.inStock) {
    return (
      <button
        disabled
        className="w-full bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded-md cursor-not-allowed text-sm"
      >
        Sold Out
      </button>
    );
  }

  if (compact) {
    return (
      <button
        onClick={handleAdd}
        className={`w-full font-bold py-2 px-4 rounded-md text-sm transition-colors ${
          inCart
            ? "bg-pv-green text-white"
            : "bg-pv-yellow text-pv-gray-900 hover:bg-pv-yellow-dark"
        }`}
      >
        {inCart ? "Added!" : "Add to Cart"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border border-pv-gray-300 rounded-md">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-3 py-2 text-pv-gray-900 hover:bg-pv-gray-100"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="px-3 py-2 text-sm font-medium min-w-[2rem] text-center">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(Math.min(10, quantity + 1))}
          className="px-3 py-2 text-pv-gray-900 hover:bg-pv-gray-100"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        onClick={handleAdd}
        className={`flex-1 font-bold py-3 px-6 rounded-md text-sm transition-colors ${
          inCart
            ? "bg-pv-green text-white"
            : "bg-pv-yellow text-pv-gray-900 hover:bg-pv-yellow-dark"
        }`}
      >
        {inCart ? "Added to Cart!" : "Add to Cart"}
      </button>
    </div>
  );
}

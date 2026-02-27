"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/formatters";
import ProductImage from "@/components/product/ProductImage";

export default function CartPage() {
  const {
    items,
    subtotal,
    tax,
    shipping,
    total,
    isHydrated,
    updateQuantity,
    removeItem,
  } = useCart();

  if (!isHydrated) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-pv-gray-300 rounded w-48" />
          <div className="h-24 bg-pv-gray-300 rounded" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <svg
          className="w-24 h-24 mx-auto text-pv-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
          />
        </svg>
        <h1 className="text-2xl font-bold text-pv-gray-900 mb-2">
          Your cart is empty
        </h1>
        <p className="text-pv-gray-500 mb-6">
          Looks like you haven&apos;t added any items yet.
        </p>
        <Link
          href="/"
          className="inline-block bg-pv-yellow text-pv-gray-900 font-bold px-6 py-3 rounded-md hover:bg-pv-yellow-dark transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-pv-gray-900 mb-6">
        Shopping Cart ({items.length} item{items.length !== 1 ? "s" : ""})
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-lg border border-gray-200 p-4 flex gap-4"
            >
              {/* Product Image */}
              <div className="w-24 h-24 shrink-0">
                <ProductImage productId={item.productId} categorySlug={item.categorySlug} name={item.name} size="sm" />
              </div>

              {/* Item details */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/product/${item.productId}`}
                  className="text-sm font-medium text-pv-gray-900 hover:text-pv-blue line-clamp-2"
                >
                  {item.name}
                </Link>
                <p className="text-xs text-pv-gray-500 mt-0.5">{item.brand}</p>
                <p className="text-lg font-bold text-pv-gray-900 mt-1">
                  {formatPrice(item.price)}
                </p>

                {/* Quantity controls */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-pv-gray-300 rounded">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="px-2 py-1 text-sm hover:bg-pv-gray-100"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="px-2 py-1 text-sm hover:bg-pv-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-pv-red text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Line total */}
              <div className="text-right shrink-0">
                <p className="font-bold text-pv-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-32">
            <h2 className="font-bold text-lg text-pv-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-pv-gray-500">Subtotal</span>
                <span className="text-pv-gray-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-pv-gray-500">Estimated Tax</span>
                <span className="text-pv-gray-900">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-pv-gray-500">Shipping</span>
                <span className="text-pv-gray-900">
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-pv-green">
                  Free shipping on orders over $35
                </p>
              )}
              <hr className="border-pv-gray-300 my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-pv-yellow text-pv-gray-900 font-bold py-3 rounded-md text-center mt-4 hover:bg-pv-yellow-dark transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/"
              className="block text-center text-sm text-pv-blue hover:underline mt-3"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

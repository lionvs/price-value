"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Order } from "@/types";
import { formatPrice, formatDate } from "@/lib/formatters";

function getDeliveryDates() {
  const now = new Date();
  const earliest = new Date(now);
  earliest.setDate(now.getDate() + 3);
  const latest = new Date(now);
  latest.setDate(now.getDate() + 7);
  const expressDate = new Date(now);
  expressDate.setDate(now.getDate() + 2);

  const format = (d: Date) =>
    d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

  return {
    standard: `${format(earliest)} - ${format(latest)}`,
    express: format(expressDate),
  };
}

export default function ConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [deliveryDates] = useState(getDeliveryDates);

  useEffect(() => {
    try {
      const data = localStorage.getItem("pv-last-order");
      if (data) setOrder(JSON.parse(data));
    } catch {}
  }, []);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-pv-gray-900 mb-4">
          No Order Found
        </h1>
        <p className="text-pv-gray-500 mb-6">
          It looks like you don&apos;t have a recent order.
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
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-pv-green rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-pv-gray-900">
          Thank You for Your Order!
        </h1>
        <p className="text-pv-gray-500 mt-1">
          A confirmation email has been sent to your email address.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Order details */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-pv-gray-500">Order Number</p>
            <p className="font-bold text-pv-gray-900">{order.orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-pv-gray-500">Order Date</p>
            <p className="text-sm text-pv-gray-900">
              {formatDate(order.placedAt)}
            </p>
          </div>
        </div>

        <hr className="border-pv-gray-300" />

        {/* Delivery estimate */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-pv-green shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <div>
              <h3 className="font-semibold text-sm text-pv-gray-900">
                Estimated Delivery
              </h3>
              <p className="text-sm text-pv-green font-medium mt-1">
                {deliveryDates.standard}
              </p>
              <p className="text-xs text-pv-gray-500 mt-1">
                Standard Shipping (FREE)
              </p>
            </div>
          </div>
        </div>

        {/* Tracking info */}
        <div className="flex items-center gap-3 p-4 bg-pv-gray-100 rounded-lg">
          <svg className="w-5 h-5 text-pv-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-pv-gray-700">
            You&apos;ll receive a shipping confirmation with tracking information once your order ships.
          </p>
        </div>

        <hr className="border-pv-gray-300" />

        {/* Items */}
        <div>
          <h3 className="font-semibold text-sm mb-3">
            Items ({order.items.length})
          </h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between items-center text-sm"
              >
                <div>
                  <p className="text-pv-gray-900">{item.name}</p>
                  <p className="text-pv-gray-500 text-xs">
                    Qty: {item.quantity} x {formatPrice(item.price)}
                  </p>
                </div>
                <span className="font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-pv-gray-300" />

        {/* Totals */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-pv-gray-500">Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-pv-gray-500">Tax</span>
            <span>{formatPrice(order.tax)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-pv-gray-500">Shipping</span>
            <span>
              {order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}
            </span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-pv-gray-300">
            <span>Total Charged</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <hr className="border-pv-gray-300" />

        {/* Shipping address */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-sm mb-1">Shipping Address</h3>
            <p className="text-sm text-pv-gray-700">
              {order.shippingAddress.street}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zipCode}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-1">Payment Method</h3>
            <p className="text-sm text-pv-gray-700">
              Visa ending in {order.paymentLast4}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
        <Link
          href="/"
          className="inline-block bg-pv-yellow text-pv-gray-900 font-bold px-8 py-3 rounded-md hover:bg-pv-yellow-dark transition-colors text-center"
        >
          Continue Shopping
        </Link>
        <Link
          href="/account"
          className="inline-block border border-pv-blue text-pv-blue font-bold px-8 py-3 rounded-md hover:bg-blue-50 transition-colors text-center"
        >
          View Account
        </Link>
      </div>
    </div>
  );
}

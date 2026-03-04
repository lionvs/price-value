"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { getUserById } from "@/lib/users";
import { formatPrice, generateOrderId } from "@/lib/formatters";
import { Order } from "@/types";
import Link from "next/link";
import { verifyCaptcha, TransactionData } from "@/app/actions";
import { useReCaptcha } from "@/components/auth/ReCaptchaProvider";

export default function CheckoutPage() {
  const { user, isHydrated: authHydrated } = useAuth();
  const {
    items,
    subtotal,
    tax,
    shipping,
    total,
    isHydrated: cartHydrated,
    clearCart,
  } = useCart();
  const router = useRouter();
  const orderPlacedRef = useRef(false);

  const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping");
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [prefilled, setPrefilled] = useState(false);
  const { executeRecaptcha } = useReCaptcha();

  useEffect(() => {
    if (cartHydrated && items.length === 0 && !orderPlacedRef.current) {
      router.push("/cart");
      return;
    }
    if (user && !prefilled) {
      const found = getUserById(user.userId);
      if (found) {
        setPrefilled(true);
        setShippingInfo({
          firstName: found.firstName,
          lastName: found.lastName,
          email: found.email,
          street: found.address.street,
          city: found.address.city,
          state: found.address.state,
          zipCode: found.address.zipCode,
          phone: found.phone,
        });
        setPaymentInfo((prev) => ({
          ...prev,
          nameOnCard: `${found.firstName} ${found.lastName}`,
        }));
      }
    }
  }, [user, cartHydrated, items.length, router, prefilled]);

  if (!authHydrated || !cartHydrated || items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-pv-gray-300 rounded w-48" />
          <div className="h-64 bg-pv-gray-300 rounded" />
        </div>
      </div>
    );
  }

  const validateShipping = () => {
    const errs: Record<string, string> = {};
    if (!shippingInfo.firstName.trim()) errs.firstName = "Required";
    if (!shippingInfo.lastName.trim()) errs.lastName = "Required";
    if (!shippingInfo.email.trim()) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email))
      errs.email = "Enter a valid email address";
    if (!shippingInfo.street.trim()) errs.street = "Required";
    if (!shippingInfo.city.trim()) errs.city = "Required";
    if (!shippingInfo.state.trim()) errs.state = "Required";
    if (!/^\d{5}(-\d{4})?$/.test(shippingInfo.zipCode))
      errs.zipCode = "Enter a valid zip code";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePayment = () => {
    const errs: Record<string, string> = {};
    const cardDigits = paymentInfo.cardNumber.replace(/\s/g, "");
    if (!/^\d{15,16}$/.test(cardDigits)) errs.cardNumber = "Enter a valid card number (15-16 digits)";
    if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiry)) errs.expiry = "Use MM/YY format";
    if (!/^\d{3,4}$/.test(paymentInfo.cvv)) errs.cvv = "Enter 3 or 4 digits";
    if (!paymentInfo.nameOnCard.trim()) errs.nameOnCard = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!executeRecaptcha) {
      setErrors((prev) => ({ ...prev, submit: "Recaptcha not ready" }));
      return;
    }

    const token = await executeRecaptcha("checkout");
    
    const cardDigits = paymentInfo.cardNumber.replace(/\s/g, "");
    const cardBin = cardDigits.slice(0, 6); // First 6 digits
    const cardLastFour = cardDigits.slice(-4);
    
    // Prepare transaction data for reCAPTCHA Fraud Prevention
    const transactionData = {
      transactionId: `txn-${Date.now()}`,
      paymentMethod: "credit-card",
      cardBin,
      cardLastFour,
      currencyCode: "USD",
      value: total,
      user: {
        email: shippingInfo.email,
        phoneNumber: shippingInfo.phone,
      },
      billingAddress: {
        recipient: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        address: [shippingInfo.street],
        locality: shippingInfo.city,
        administrativeArea: shippingInfo.state,
        regionCode: "USA",
        postalCode: shippingInfo.zipCode,
      },
    };
    
    const captchaVerification = await verifyCaptcha(token, "checkout", transactionData, {
      accountId: user?.userId,
      email: shippingInfo.email,
      phoneNumber: shippingInfo.phone || undefined,
    });

    if (!captchaVerification.success) {
      setErrors((prev) => ({
        ...prev,
        submit: captchaVerification.message || "Captcha verification failed",
      }));
      return;
    }

    // Log fraud prevention assessment if available
    if (captchaVerification.fraudPrevention) {
      console.log("Fraud Prevention Assessment:", captchaVerification.fraudPrevention);
    }

    orderPlacedRef.current = true;
    const order: Order = {
      orderId: generateOrderId(),
      items: [...items],
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress: {
        street: shippingInfo.street,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zipCode: shippingInfo.zipCode,
        country: "US",
      },
      paymentLast4: cardLastFour,
      placedAt: new Date().toISOString(),
    };
    localStorage.setItem("pv-last-order", JSON.stringify(order));
    clearCart();
    router.push("/checkout/confirmation");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-pv-gray-900 mb-6">Checkout</h1>

      {/* Guest checkout notice */}
      {!user && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-pv-gray-700 mb-6 flex items-center justify-between">
          <span>Checking out as a guest.</span>
          <Link href="/login" className="text-pv-blue font-medium hover:underline">
            Sign in for faster checkout
          </Link>
        </div>
      )}

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {["shipping", "payment", "review"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === s
                  ? "bg-pv-blue text-white"
                  : ["shipping", "payment", "review"].indexOf(step) > i
                  ? "bg-pv-green text-white"
                  : "bg-pv-gray-300 text-pv-gray-500"
              }`}
            >
              {["shipping", "payment", "review"].indexOf(step) > i ? "✓" : i + 1}
            </div>
            <span
              className={`text-sm capitalize ${
                step === s ? "font-bold text-pv-gray-900" : "text-pv-gray-500"
              }`}
            >
              {s}
            </span>
            {i < 2 && <div className="w-8 h-px bg-pv-gray-300 mx-1" />}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          {/* Shipping Step */}
          {step === "shipping" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="font-bold text-lg mb-4">Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    First Name
                  </label>
                  <input
                    value={shippingInfo.firstName}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, firstName: e.target.value })
                    }
                    className="w-full border border-pv-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pv-blue"
                  />
                  {errors.firstName && (
                    <p className="text-pv-red text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last Name
                  </label>
                  <input
                    value={shippingInfo.lastName}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, lastName: e.target.value })
                    }
                    className="w-full border border-pv-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pv-blue"
                  />
                  {errors.lastName && (
                    <p className="text-pv-red text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, email: e.target.value })
                    }
                    placeholder="Enter your email"
                    className="w-full border border-pv-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pv-blue"
                  />
                  {errors.email && (
                    <p className="text-pv-red text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Street Address
                  </label>
                  <input
                    value={shippingInfo.street}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, street: e.target.value })
                    }
                    className="w-full border border-pv-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pv-blue"
                  />
                  {errors.street && (
                    <p className="text-pv-red text-xs mt-1">{errors.street}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    value={shippingInfo.city}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, city: e.target.value })
                    }
                    className="w-full border border-pv-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pv-blue"
                  />
                  {errors.city && (
                    <p className="text-pv-red text-xs mt-1">{errors.city}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      State
                    </label>
                    <input
                      value={shippingInfo.state}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          state: e.target.value,
                        })
                      }
                      className="w-full border border-pv-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pv-blue"
                    />
                    {errors.state && (
                      <p className="text-pv-red text-xs mt-1">{errors.state}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Zip</label>
                    <input
                      value={shippingInfo.zipCode}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          zipCode: e.target.value,
                        })
                      }
                      className="w-full border border-pv-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pv-blue"
                    />
                    {errors.zipCode && (
                      <p className="text-pv-red text-xs mt-1">{errors.zipCode}</p>
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    value={shippingInfo.phone}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, phone: e.target.value })
                    }
                    className="w-full border border-pv-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pv-blue"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  if (validateShipping()) setStep("payment");
                }}
                className="w-full bg-pv-yellow text-pv-gray-900 font-bold py-3 rounded-md mt-6 hover:bg-pv-yellow-dark transition-colors"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Payment Step */}
          {step === "payment" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="font-bold text-lg mb-4">Payment Information</h2>
              <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-pv-blue mb-4">
                All major credit and debit cards accepted. Your payment information is encrypted and secure.
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Card Number
                  </label>
                  <input
                    value={paymentInfo.cardNumber}
                    onChange={(e) =>
                      setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })
                    }
                    placeholder="Enter card number"
                    className="w-full border border-pv-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pv-blue font-mono"
                  />
                  {errors.cardNumber && (
                    <p className="text-pv-red text-xs mt-1">{errors.cardNumber}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      value={paymentInfo.expiry}
                      onChange={(e) =>
                        setPaymentInfo({ ...paymentInfo, expiry: e.target.value })
                      }
                      placeholder="MM/YY"
                      className="w-full border border-pv-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pv-blue font-mono"
                    />
                    {errors.expiry && (
                      <p className="text-pv-red text-xs mt-1">{errors.expiry}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CVV</label>
                    <input
                      value={paymentInfo.cvv}
                      onChange={(e) =>
                        setPaymentInfo({ ...paymentInfo, cvv: e.target.value })
                      }
                      placeholder="CVV"
                      className="w-full border border-pv-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pv-blue font-mono"
                    />
                    {errors.cvv && (
                      <p className="text-pv-red text-xs mt-1">{errors.cvv}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Name on Card
                  </label>
                  <input
                    value={paymentInfo.nameOnCard}
                    onChange={(e) =>
                      setPaymentInfo({
                        ...paymentInfo,
                        nameOnCard: e.target.value,
                      })
                    }
                    className="w-full border border-pv-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pv-blue"
                  />
                  {errors.nameOnCard && (
                    <p className="text-pv-red text-xs mt-1">{errors.nameOnCard}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep("shipping")}
                  className="px-6 py-3 border border-pv-gray-300 rounded-md text-sm font-medium hover:bg-pv-gray-100 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (validatePayment()) setStep("review");
                  }}
                  className="flex-1 bg-pv-yellow text-pv-gray-900 font-bold py-3 rounded-md hover:bg-pv-yellow-dark transition-colors"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

          {/* Review Step */}
          {step === "review" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="font-bold text-lg mb-4">Review Your Order</h2>

              <div className="space-y-4">
                {/* Shipping summary */}
                <div className="p-4 bg-pv-gray-100 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-sm">Ship to:</h3>
                      <p className="text-sm text-pv-gray-700 mt-1">
                        {shippingInfo.firstName} {shippingInfo.lastName}
                        <br />
                        {shippingInfo.street}
                        <br />
                        {shippingInfo.city}, {shippingInfo.state}{" "}
                        {shippingInfo.zipCode}
                      </p>
                      <p className="text-xs text-pv-gray-500 mt-1">
                        {shippingInfo.email}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep("shipping")}
                      className="text-xs text-pv-blue hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Payment summary */}
                <div className="p-4 bg-pv-gray-100 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-sm">Payment:</h3>
                      <p className="text-sm text-pv-gray-700 mt-1">
                        Card ending in{" "}
                        {paymentInfo.cardNumber.replace(/\s/g, "").slice(-4)}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep("payment")}
                      className="text-xs text-pv-blue hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold text-sm mb-2">
                    Items ({items.length})
                  </h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-pv-gray-700">
                          {item.name} x{item.quantity}
                        </span>
                        <span className="font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {errors.submit && (
                <div className="mt-6 border-t border-pv-gray-300 pt-4">
                  <p className="text-pv-red text-sm text-center mt-2">
                    {errors.submit}
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep("payment")}
                  className="px-6 py-3 border border-pv-gray-300 rounded-md text-sm font-medium hover:bg-pv-gray-100 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 bg-pv-yellow text-pv-gray-900 font-bold py-3 rounded-md hover:bg-pv-yellow-dark transition-colors"
                >
                  Place Order - {formatPrice(total)}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:w-72 shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-32">
            <h3 className="font-bold text-sm mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-pv-gray-500">
                  Items ({items.reduce((s, i) => s + i.quantity, 0)})
                </span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-pv-gray-500">Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-pv-gray-500">Shipping</span>
                <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
              </div>
              <hr className="border-pv-gray-300" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

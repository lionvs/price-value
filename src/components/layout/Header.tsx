"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import CategoryNav from "./CategoryNav";
import MobileMenu from "./MobileMenu";
import UserMenu from "@/components/auth/UserMenu";
import SearchBar from "@/components/ui/SearchBar";

export default function Header() {
  const { user, isHydrated: authHydrated } = useAuth();
  const { itemCount, isHydrated: cartHydrated } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Top utility bar */}
      <div className="bg-pv-navy text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-8">
          <div className="flex gap-4">
            <span className="hidden sm:inline">Price Value - Your Tech Destination</span>
          </div>
          <div className="flex gap-4">
            <span>Order Status</span>
            <span className="hidden sm:inline">Blog</span>
          </div>
        </div>
      </div>

      {/* Main header bar */}
      <div className="bg-pv-blue">
        <div className="max-w-7xl mx-auto px-4 flex items-center h-16 gap-4">
          {/* Mobile menu button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-pv-yellow text-pv-navy font-black text-xl px-2 py-1 rounded">
              PV
            </div>
            <span className="text-white font-bold text-lg hidden sm:inline">
              Price Value
            </span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl">
            <SearchBar />
          </div>

          {/* Right side: Account + Cart */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Account */}
            {authHydrated && (
              user ? (
                <UserMenu />
              ) : (
                <Link
                  href="/login"
                  className="text-white hover:text-pv-yellow flex items-center gap-1 text-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="text-white hover:text-pv-yellow relative flex items-center gap-1 text-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {cartHydrated && itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pv-yellow text-pv-navy text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
              <span className="hidden sm:inline">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Category navigation */}
      <CategoryNav />

      {/* Mobile menu */}
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}

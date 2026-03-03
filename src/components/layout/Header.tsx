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
      {/* Main header bar — white with subtle shadow */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center h-16 gap-4">
          {/* Mobile menu button */}
          <button
            className="lg:hidden text-pv-gray-700 p-2 hover:bg-gray-100 rounded-full"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo — multi-color Google-style */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <text x="1" y="27" fontFamily="Inter, Arial, sans-serif" fontWeight="900" fontSize="26" fill="#4285F4">P</text>
              <text x="18" y="27" fontFamily="Inter, Arial, sans-serif" fontWeight="900" fontSize="26" fill="#EA4335">V</text>
              <rect x="1" y="30" width="14" height="3" rx="1.5" fill="#34A853" />
              <rect x="18" y="30" width="16" height="3" rx="1.5" fill="#FBBC05" />
            </svg>
            <span className="text-pv-gray-900 font-bold text-lg hidden sm:inline tracking-tight">
              Price Value
            </span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl">
            <SearchBar />
          </div>

          {/* Right side: Account + Cart */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Account */}
            {authHydrated && (
              user ? (
                <UserMenu />
              ) : (
                <Link
                  href="/login"
                  className="text-pv-blue hover:bg-blue-50 flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-full transition-colors"
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
              className="text-pv-gray-700 hover:bg-gray-100 relative flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {cartHydrated && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pv-blue text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
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

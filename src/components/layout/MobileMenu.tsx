"use client";

import Link from "next/link";
import categoriesData from "@/data/categories.json";
import { Category } from "@/types";
import { useAuth } from "@/context/AuthContext";

const categories = categoriesData as Category[];

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { user, logout } = useAuth();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <span className="font-bold text-lg text-pv-gray-900">Menu</span>
          <button onClick={onClose} aria-label="Close menu" className="text-pv-gray-700 hover:bg-gray-100 rounded-full p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Account section */}
        <div className="p-4 border-b border-pv-gray-300">
          {user ? (
            <div>
              <p className="font-semibold">Hi, {user.firstName}!</p>
              <div className="mt-2 flex gap-2">
                <Link
                  href="/account"
                  onClick={onClose}
                  className="text-sm text-pv-blue hover:underline"
                >
                  My Account
                </Link>
                <button
                  onClick={() => { logout(); onClose(); }}
                  className="text-sm text-pv-red hover:underline"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="inline-block bg-pv-blue text-white font-semibold px-4 py-2 rounded-full text-sm hover:bg-pv-blue-dark transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Categories */}
        <nav className="p-4">
          <h3 className="text-xs font-bold uppercase text-pv-gray-500 mb-2">
            Categories
          </h3>
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/category/${cat.slug}`}
                  onClick={onClose}
                  className="block px-3 py-2 text-sm text-pv-gray-900 hover:bg-pv-gray-100 rounded"
                >
                  {cat.icon} {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

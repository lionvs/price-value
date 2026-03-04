"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-pv-gray-700 hover:bg-gray-100 flex items-center gap-1 text-sm px-2 py-1 rounded-full transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-pv-blue text-white font-bold text-xs flex items-center justify-center">
          {user.firstName[0]}
          {user.lastName[0]}
        </div>
        <span className="hidden sm:inline text-pv-gray-700">Hi, {user.firstName}</span>
        <svg className="w-4 h-4 text-pv-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-pv-gray-300 py-1 z-50">
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-pv-gray-900 hover:bg-pv-gray-100"
          >
            My Account
          </Link>
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-pv-gray-900 hover:bg-pv-gray-100"
          >
            My Cart
          </Link>
          <hr className="my-1 border-pv-gray-300" />
          <button
            onClick={() => { logout(); setOpen(false); }}
            className="block w-full text-left px-4 py-2 text-sm text-pv-red hover:bg-pv-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

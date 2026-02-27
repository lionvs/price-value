"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      setQuery("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full h-10 pl-4 pr-12 rounded-md bg-white text-pv-gray-900 text-sm placeholder-pv-gray-500 focus:outline-none focus:ring-2 focus:ring-pv-yellow"
      />
      <button
        type="submit"
        className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center bg-pv-yellow rounded-r-md hover:bg-pv-yellow-dark transition-colors"
        aria-label="Search"
      >
        <svg className="w-5 h-5 text-pv-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  );
}

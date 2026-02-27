"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function ProductSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentSort = searchParams.get("sort") || "";

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm text-pv-gray-500 whitespace-nowrap">
        Sort by:
      </label>
      <select
        id="sort"
        value={currentSort}
        onChange={(e) => handleSort(e.target.value)}
        className="border border-pv-gray-300 rounded px-3 py-1.5 text-sm bg-white"
      >
        <option value="">Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Best Rating</option>
        <option value="name">Name A-Z</option>
      </select>
    </div>
  );
}

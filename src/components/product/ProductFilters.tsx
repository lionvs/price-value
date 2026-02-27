"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

interface ProductFiltersProps {
  brands: string[];
  subcategories: string[];
}

export default function ProductFilters({
  brands,
  subcategories,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const selectedBrands = searchParams.getAll("brand");
  const selectedSubcategory = searchParams.get("subcategory") || "";
  const minRating = searchParams.get("minRating") || "";

  const updateParams = useCallback(
    (key: string, value: string | string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else if (value) {
        params.set(key, value);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, searchParams, pathname]
  );

  const toggleBrand = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    updateParams("brand", newBrands);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    const sort = searchParams.get("sort");
    if (sort) params.set("sort", sort);
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasFilters =
    selectedBrands.length > 0 || selectedSubcategory || minRating;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-sm">Filters</h3>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-pv-blue hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Subcategory filter */}
      {subcategories.length > 1 && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold uppercase text-pv-gray-500 mb-2">
            Type
          </h4>
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="subcategory"
                checked={!selectedSubcategory}
                onChange={() => updateParams("subcategory", "")}
                className="accent-pv-blue"
              />
              All
            </label>
            {subcategories.map((sub) => (
              <label
                key={sub}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="radio"
                  name="subcategory"
                  checked={selectedSubcategory === sub}
                  onChange={() => updateParams("subcategory", sub)}
                  className="accent-pv-blue"
                />
                {sub}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Brand filter */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold uppercase text-pv-gray-500 mb-2">
          Brand
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="accent-pv-blue"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Rating filter */}
      <div>
        <h4 className="text-xs font-semibold uppercase text-pv-gray-500 mb-2">
          Min Rating
        </h4>
        <select
          value={minRating}
          onChange={(e) => updateParams("minRating", e.target.value)}
          className="w-full border border-pv-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="">Any</option>
          <option value="4">4+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
        </select>
      </div>
    </div>
  );
}

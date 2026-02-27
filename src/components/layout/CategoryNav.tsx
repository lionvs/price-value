"use client";

import Link from "next/link";
import categoriesData from "@/data/categories.json";
import { Category } from "@/types";

const categories = categoriesData as Category[];

export default function CategoryNav() {
  return (
    <nav className="bg-white border-b border-pv-gray-300 hidden lg:block">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex items-center gap-0 overflow-x-auto">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/category/${cat.slug}`}
                className="block px-4 py-3 text-sm font-medium text-pv-gray-900 hover:text-pv-blue hover:border-b-2 hover:border-pv-blue whitespace-nowrap transition-colors"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

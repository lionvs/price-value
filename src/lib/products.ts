import { Product } from "@/types";

import appliancesData from "@/data/products/appliances.json";
import computersData from "@/data/products/computers.json";
import cellPhonesData from "@/data/products/cell-phones.json";
import tvsData from "@/data/products/tvs.json";
import audioData from "@/data/products/audio.json";
import gamingData from "@/data/products/gaming.json";
import smartHomeData from "@/data/products/smart-home.json";
import camerasData from "@/data/products/cameras.json";

const allProducts: Product[] = [
  ...(appliancesData as unknown as Product[]),
  ...(computersData as unknown as Product[]),
  ...(cellPhonesData as unknown as Product[]),
  ...(tvsData as unknown as Product[]),
  ...(audioData as unknown as Product[]),
  ...(gamingData as unknown as Product[]),
  ...(smartHomeData as unknown as Product[]),
  ...(camerasData as unknown as Product[]),
];

export function getAllProducts(): Product[] {
  return allProducts;
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return allProducts.filter((p) => p.categorySlug === categorySlug);
}

export function getProductById(id: string): Product | undefined {
  return allProducts.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find((p) => p.slug === slug);
}

export interface ProductFilters {
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  subcategory?: string;
  inStock?: boolean;
}

export function filterProducts(
  products: Product[],
  filters: ProductFilters
): Product[] {
  return products.filter((p) => {
    if (filters.brands && filters.brands.length > 0) {
      if (!filters.brands.includes(p.brand)) return false;
    }
    if (filters.minPrice !== undefined) {
      const effectivePrice = p.salePrice ?? p.price;
      if (effectivePrice < filters.minPrice) return false;
    }
    if (filters.maxPrice !== undefined) {
      const effectivePrice = p.salePrice ?? p.price;
      if (effectivePrice > filters.maxPrice) return false;
    }
    if (filters.minRating !== undefined) {
      if (p.rating < filters.minRating) return false;
    }
    if (filters.subcategory) {
      if (p.subcategory !== filters.subcategory) return false;
    }
    if (filters.inStock !== undefined) {
      if (p.inStock !== filters.inStock) return false;
    }
    return true;
  });
}

export type SortOption =
  | "price-asc"
  | "price-desc"
  | "rating"
  | "name"
  | "newest";

export function sortProducts(
  products: Product[],
  sortBy: SortOption
): Product[] {
  const sorted = [...products];
  switch (sortBy) {
    case "price-asc":
      return sorted.sort(
        (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price)
      );
    case "price-desc":
      return sorted.sort(
        (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price)
      );
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

export function searchProducts(query: string): Product[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  return allProducts
    .map((product) => {
      const searchableText = [
        product.name,
        product.brand,
        product.description,
        product.subcategory,
        ...product.tags,
      ]
        .join(" ")
        .toLowerCase();

      let score = 0;
      for (const term of terms) {
        if (product.name.toLowerCase().includes(term)) score += 10;
        else if (product.brand.toLowerCase() === term) score += 8;
        else if (product.tags.some((t) => t.toLowerCase().includes(term)))
          score += 5;
        else if (searchableText.includes(term)) score += 2;
      }
      return { product, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product);
}

export function getDeals(): Product[] {
  return allProducts.filter((p) => p.salePrice !== null).slice(0, 8);
}

export function getTrending(): Product[] {
  return [...allProducts].sort((a, b) => b.rating - a.rating).slice(0, 8);
}

export function getBrandsForCategory(categorySlug: string): string[] {
  const products = getProductsByCategory(categorySlug);
  const brands = new Set(products.map((p) => p.brand));
  return Array.from(brands).sort();
}

export function getSubcategoriesForCategory(categorySlug: string): string[] {
  const products = getProductsByCategory(categorySlug);
  const subcategories = new Set(products.map((p) => p.subcategory));
  return Array.from(subcategories).sort();
}

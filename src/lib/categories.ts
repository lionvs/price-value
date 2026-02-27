import categoriesData from "@/data/categories.json";
import { Category } from "@/types";

export function getAllCategories(): Category[] {
  return categoriesData as Category[];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return (categoriesData as Category[]).find((cat) => cat.slug === slug);
}

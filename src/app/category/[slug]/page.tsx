import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCategoryBySlug, getAllCategories } from "@/lib/categories";
import {
  getProductsByCategory,
  filterProducts,
  sortProducts,
  getBrandsForCategory,
  getSubcategoriesForCategory,
  SortOption,
} from "@/lib/products";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ProductGrid from "@/components/product/ProductGrid";
import ProductFilters from "@/components/product/ProductFilters";
import ProductSort from "@/components/product/ProductSort";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  let products = getProductsByCategory(slug);
  const brands = getBrandsForCategory(slug);
  const subcategories = getSubcategoriesForCategory(slug);

  // Apply filters
  const brandFilter = sp.brand
    ? Array.isArray(sp.brand)
      ? sp.brand
      : [sp.brand]
    : [];
  const subcategoryFilter = (sp.subcategory as string) || "";
  const minRating = sp.minRating ? parseFloat(sp.minRating as string) : undefined;

  products = filterProducts(products, {
    brands: brandFilter.length > 0 ? brandFilter : undefined,
    subcategory: subcategoryFilter || undefined,
    minRating,
  });

  // Apply sort
  const sort = (sp.sort as SortOption) || undefined;
  if (sort) {
    products = sortProducts(products, sort);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: category.name }]} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-pv-gray-900">
            {category.name}
          </h1>
          <p className="text-sm text-pv-gray-500 mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Suspense fallback={null}>
          <ProductSort />
        </Suspense>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters - hidden on mobile */}
        <aside className="hidden lg:block w-64 shrink-0">
          <Suspense fallback={null}>
            <ProductFilters brands={brands} subcategories={subcategories} />
          </Suspense>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}

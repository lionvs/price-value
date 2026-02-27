import { Metadata } from "next";
import { searchProducts } from "@/lib/products";
import ProductGrid from "@/components/product/ProductGrid";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : "Search",
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q || "";
  const results = query ? searchProducts(query) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-pv-gray-900">
          {query ? `Search results for "${query}"` : "Search"}
        </h1>
        {query && (
          <p className="text-sm text-pv-gray-500 mt-1">
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {!query ? (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-pv-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="text-pv-gray-500 text-lg">
            Enter a search term to find products
          </p>
        </div>
      ) : (
        <ProductGrid products={results} />
      )}
    </div>
  );
}

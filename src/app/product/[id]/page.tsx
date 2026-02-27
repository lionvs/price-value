import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductById, getAllProducts } from "@/lib/products";
import { getCategoryBySlug } from "@/lib/categories";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ProductRating from "@/components/product/ProductRating";
import ProductSpecs from "@/components/product/ProductSpecs";
import PriceDisplay from "@/components/ui/PriceDisplay";
import AddToCartButton from "@/components/product/AddToCartButton";
import ProductImage from "@/components/product/ProductImage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) notFound();

  const category = getCategoryBySlug(product.categorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs
        items={[
          ...(category
            ? [{ label: category.name, href: `/category/${category.slug}` }]
            : []),
          { label: product.name },
        ]}
      />

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative">
            <ProductImage productId={product.id} categorySlug={product.categorySlug} name={product.name} size="lg" />
            {product.salePrice && (
              <span className="absolute top-4 left-4 bg-pv-red text-white text-sm font-bold px-3 py-1.5 rounded z-20">
                SALE
              </span>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm text-pv-gray-500 mb-1">{product.brand}</p>
            <h1 className="text-xl md:text-2xl font-bold text-pv-gray-900 mb-3">
              {product.name}
            </h1>

            <div className="mb-4">
              <ProductRating
                rating={product.rating}
                reviewCount={product.reviewCount}
              />
            </div>

            <div className="mb-4">
              <PriceDisplay
                price={product.price}
                salePrice={product.salePrice}
                size="lg"
              />
            </div>

            {/* Stock status */}
            <div className="mb-4">
              {product.inStock ? (
                <span className="text-pv-green font-semibold text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  In Stock
                </span>
              ) : (
                <span className="text-pv-red font-semibold text-sm">
                  Out of Stock
                </span>
              )}
            </div>

            <p className="text-sm text-pv-gray-700 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Add to Cart */}
            <div className="mb-6">
              <AddToCartButton product={product} />
            </div>

            {/* Features */}
            {product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-sm mb-2">Key Features</h3>
                <ul className="space-y-1">
                  {product.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-pv-gray-700 flex items-start gap-2"
                    >
                      <span className="text-pv-blue mt-0.5">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs text-pv-gray-500">
              SKU: {product.sku}
            </p>
          </div>
        </div>

        {/* Specs section */}
        <div className="mt-8">
          <ProductSpecs specs={product.specs} />
        </div>
      </div>
    </div>
  );
}

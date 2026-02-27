import Link from "next/link";
import { Product } from "@/types";
import ProductRating from "./ProductRating";
import PriceDisplay from "@/components/ui/PriceDisplay";
import AddToCartButton from "./AddToCartButton";
import ProductImage from "./ProductImage";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow flex flex-col h-full">
      <Link href={`/product/${product.id}`} className="block p-4">
        {/* Product Image */}
        <div className="relative mb-3">
          <ProductImage productId={product.id} categorySlug={product.categorySlug} name={product.name} size="sm" />
          {product.salePrice && (
            <span className="absolute top-2 left-2 bg-pv-red text-white text-xs font-bold px-2 py-1 rounded z-20">
              SALE
            </span>
          )}
          {!product.inStock && (
            <span className="absolute top-2 right-2 bg-pv-gray-500 text-white text-xs font-bold px-2 py-1 rounded z-20">
              Out of Stock
            </span>
          )}
        </div>

        {/* Product info */}
        <p className="text-xs text-pv-gray-500 mb-1">{product.brand}</p>
        <h3 className="text-sm font-medium text-pv-gray-900 line-clamp-2 min-h-[2.5rem] mb-2">
          {product.name}
        </h3>
        <ProductRating rating={product.rating} reviewCount={product.reviewCount} />
        <div className="mt-2">
          <PriceDisplay price={product.price} salePrice={product.salePrice} size="sm" />
        </div>
      </Link>

      {/* Add to Cart */}
      <div className="mt-auto p-4 pt-0">
        <AddToCartButton product={product} compact />
      </div>
    </div>
  );
}

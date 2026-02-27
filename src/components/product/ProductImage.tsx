import { getProductImageUrl } from "@/lib/images";

interface ProductImageProps {
  productId: string;
  categorySlug: string;
  name: string;
  size?: "sm" | "md" | "lg";
}

function getIndexFromId(productId: string): number {
  const match = productId.match(/(\d+)$/);
  return match ? parseInt(match[1], 10) - 1 : 0;
}

export default function ProductImage({
  productId,
  categorySlug,
  name,
  size = "md",
}: ProductImageProps) {
  const index = getIndexFromId(productId);
  const imageUrl = getProductImageUrl(categorySlug, index);

  const sizeClasses = {
    sm: "w-full aspect-square",
    md: "w-full aspect-square",
    lg: "w-full aspect-square",
  };

  return (
    <div className={`${sizeClasses[size]} rounded-md overflow-hidden bg-pv-gray-100`}>
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

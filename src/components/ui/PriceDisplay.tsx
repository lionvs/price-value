import { formatPrice } from "@/lib/formatters";

interface PriceDisplayProps {
  price: number;
  salePrice: number | null;
  size?: "sm" | "md" | "lg";
}

export default function PriceDisplay({
  price,
  salePrice,
  size = "md",
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  if (salePrice !== null) {
    return (
      <div className="flex items-baseline gap-2">
        <span className={`font-bold text-pv-red ${sizeClasses[size]}`}>
          {formatPrice(salePrice)}
        </span>
        <span className="text-pv-gray-500 line-through text-sm">
          {formatPrice(price)}
        </span>
        <span className="text-xs bg-pv-red text-white px-1.5 py-0.5 rounded font-semibold">
          Save {formatPrice(price - salePrice)}
        </span>
      </div>
    );
  }

  return (
    <span className={`font-bold text-pv-gray-900 ${sizeClasses[size]}`}>
      {formatPrice(price)}
    </span>
  );
}

import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function PriceDisplay({
  price,
  originalPrice,
  className,
  size = "md",
}: PriceDisplayProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0, // usually INR looks cleaner without decimals
    }).format(amount);
  };

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg md:text-xl",
    xl: "text-2xl md:text-3xl",
  };

  const fontSizes = sizeClasses[size];

  return (
    <div className={cn("flex flex-wrap items-baseline gap-2 font-semibold", className)}>
      <span className={cn("text-foreground", fontSizes)}>
        {formatPrice(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <>
          <span className="text-sm font-normal text-muted-foreground line-through">
            {formatPrice(originalPrice)}
          </span>
          <span className="text-xs font-semibold text-flownexa-lime bg-flownexa-lime-muted px-2 py-0.5 rounded-full border border-flownexa-lime/20">
            -{discount}% OFF
          </span>
        </>
      )}
    </div>
  );
}

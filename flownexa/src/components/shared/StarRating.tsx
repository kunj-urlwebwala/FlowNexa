import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
  size?: number;
  showText?: boolean;
  reviewCount?: number;
}

export default function StarRating({
  rating,
  maxRating = 5,
  className,
  size = 16,
  showText = false,
  reviewCount,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center text-flownexa-lime">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} size={size} fill="currentColor" strokeWidth={0} />
        ))}
        {hasHalf && <StarHalf size={size} fill="currentColor" strokeWidth={0} />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="text-muted/40" strokeWidth={1.5} />
        ))}
      </div>
      {showText && (
        <span className="text-xs text-muted-foreground font-medium">
          {rating.toFixed(1)}
          {reviewCount !== undefined && ` (${reviewCount} reviews)`}
        </span>
      )}
    </div>
  );
}

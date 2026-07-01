import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

export default function QuantityStepper({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  disabled = false,
  className,
}: QuantityStepperProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card p-1 shadow-sm",
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="size-7 rounded-full text-foreground hover:bg-muted focus-visible:ring-1"
        onClick={onDecrease}
        disabled={quantity <= min || disabled}
      >
        <Minus size={14} />
        <span className="sr-only">Decrease quantity</span>
      </Button>
      <span className="w-8 text-center text-sm font-semibold select-none">
        {quantity}
      </span>
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="size-7 rounded-full text-foreground hover:bg-muted focus-visible:ring-1"
        onClick={onIncrease}
        disabled={quantity >= max || disabled}
      >
        <Plus size={14} />
        <span className="sr-only">Increase quantity</span>
      </Button>
    </div>
  );
}

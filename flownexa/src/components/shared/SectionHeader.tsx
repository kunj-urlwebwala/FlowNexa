import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  badge,
  align = "left",
  className,
}: SectionHeaderProps) {
  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <div className={cn("flex flex-col mb-10 md:mb-12", alignmentClasses[align], className)}>
      {badge && (
        <span className="text-xs font-bold uppercase tracking-widest text-flownexa-lime mb-2 bg-flownexa-lime-muted px-3 py-1 rounded-full border border-flownexa-lime/20">
          {badge}
        </span>
      )}
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-heading text-foreground mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-sm md:text-base text-muted-foreground font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

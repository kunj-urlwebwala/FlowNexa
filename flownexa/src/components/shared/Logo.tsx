import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  theme?: "light" | "dark" | "default";
}

export default function Logo({ className, iconOnly = false, theme = "default" }: LogoProps) {
  const isDarkTheme = theme === "dark";

  return (
    <Link href="/" className={cn("flex items-center gap-2.5 group select-none", className)}>
      {/* FlowNexa Icon (Curved 4-point flowing star) */}
      <svg
        width="34"
        height="34"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        {/* Core flowing star body shape */}
        <path
          d="M50 5C50 29.8528 29.8528 50 5 50C29.8528 50 50 70.1472 50 95C50 70.1472 70.1472 50 95 50C70.1472 50 50 29.8528 50 5Z"
          fill={isDarkTheme ? "#FFFFFF" : "#0F1117"}
          className="transition-colors duration-300"
        />
        {/* Lime Accent curve stripes (recreating the signature look) */}
        <path
          d="M50 15C50 34.33 34.33 50 15 50"
          stroke="#E1FF4B"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M50 85C50 65.67 65.67 50 85 50"
          stroke="#E1FF4B"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>

      {/* Brand Text */}
      {!iconOnly && (
        <span
          className={cn(
            "font-heading font-bold text-lg md:text-xl tracking-tight transition-colors duration-300",
            isDarkTheme ? "text-white" : "text-foreground group-hover:text-foreground/90"
          )}
        >
          Flow<span className="text-flownexa-lime font-extrabold">Nexa</span>
        </span>
      )}
    </Link>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export default function AdminBreadcrumb() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const pathSegments = pathname.split("/").filter((x) => x);

  return (
    <nav className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider select-none">
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-white transition-colors"
      >
        <Home size={11} />
        <span>Hub</span>
      </Link>

      {pathSegments.map((segment, index) => {
        const url = `/${pathSegments.slice(0, index + 1).join("/")}`;
        const isLast = index === pathSegments.length - 1;
        const formattedName = segment.replace(/-/g, " ");

        return (
          <React.Fragment key={url}>
            <ChevronRight size={11} className="text-white/20 shrink-0" />
            {isLast ? (
              <span className="text-flownexa-lime font-bold truncate max-w-[120px] sm:max-w-none">
                {formattedName}
              </span>
            ) : (
              <Link
                href={url}
                className="hover:text-white transition-colors truncate max-w-[120px] sm:max-w-none"
              >
                {formattedName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

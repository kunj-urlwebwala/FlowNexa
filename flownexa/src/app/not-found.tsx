"use client";

import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Compass, ArrowRight } from "lucide-react";
export default function NotFound() {
  return (
    <div className="bg-flownexa-black text-white min-h-screen font-sans flex flex-col justify-between p-6 md:p-8">
      {/* Top Header */}
      <header className="max-w-7xl mx-auto w-full flex items-center">
        <Logo />
      </header>

      {/* Main 404 Area */}
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto py-12">
        <div className="size-16 rounded-full bg-flownexa-lime-muted border border-flownexa-lime/25 flex items-center justify-center text-flownexa-lime mb-6">
          <Compass size={28} className="animate-spin-slow" />
        </div>

        <h1 className="text-7xl font-extrabold font-heading text-white tracking-tight leading-none mb-4">
          404
        </h1>

        <h2 className="text-xl font-bold font-heading text-white mb-2">
          Out of Flow State
        </h2>

        <p className="text-xs text-muted-foreground leading-relaxed mb-8">
          The page you are looking for does not exist, has been moved, or resides in another dimension. Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link href="/" className="flex-1">
            <Button className="w-full rounded-full h-11 bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover shadow-lg shadow-flownexa-lime/10 text-xs">
              Go to Homepage
            </Button>
          </Link>
          <Link href="/products" className="flex-1">
            <Button variant="outline" className="w-full rounded-full h-11 border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs flex items-center gap-1.5 justify-center">
              Browse Catalogue
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full text-center text-xs text-muted-foreground border-t border-white/5 pt-6">
        <p>© {new Date().getFullYear()} FlowNexa Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

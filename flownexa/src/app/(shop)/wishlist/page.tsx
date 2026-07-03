"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import ProductCard from "@/components/product/ProductCard";
import SectionHeader from "@/components/shared/SectionHeader";
import PageTransition from "@/components/shared/PageTransition";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { items } = useWishlistStore();

  return (
    <PageTransition>
      <div className="bg-flownexa-black text-white min-h-screen py-10 font-sans">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          
          <SectionHeader
            title="My Wishlist"
            subtitle="Keep track of the flagship releases and premium items you love."
            badge="Personal Board"
          />

          {items.length === 0 ? (
            <div className="bg-zinc-900 border border-white/5 rounded-3xl py-20 px-6 text-center flex flex-col items-center justify-center max-w-xl mx-auto">
              <div className="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground mb-4">
                <Heart size={26} />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Your wishlist is empty</h3>
              <p className="text-sm text-muted-foreground max-w-xs mb-6">
                You haven&apos;t favorited any products on FlowNexa yet. Explore our catalogue to bookmark items.
              </p>
              <Link href="/products">
                <Button className="rounded-full bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover shadow-lg shadow-flownexa-lime/10 px-6 py-5">
                  Browse Catalog
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>
      </div>
    </PageTransition>
  );
}

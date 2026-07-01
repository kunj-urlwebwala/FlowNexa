"use client";

import { products } from "@/data/products";
import SectionHeader from "@/components/shared/SectionHeader";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturedProducts() {
  const featured = products.filter((product) => product.featured).slice(0, 4);

  return (
    <section className="bg-flownexa-black py-16 lg:py-24 font-sans relative z-10 border-b border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Section Header with "See All" CTA */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <SectionHeader
            title="Featured Releases"
            subtitle="The absolute pinnacle of acoustics, styling, and engineering. Discover our flagship releases."
            badge="Spotlight"
            className="mb-0!"
          />
          <Link href="/products?featured=true" className="shrink-0">
            <Button
              variant="outline"
              className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 gap-2 font-semibold"
            >
              See All Flagships
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

        {/* Staggered Grid of Featured Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}

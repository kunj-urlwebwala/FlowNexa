"use client";

import Link from "next/link";
import { categories } from "@/data/categories";
import SectionHeader from "@/components/shared/SectionHeader";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CategoryCards() {
  // Map slugs to placeholder or Unsplash images since categories.ts has placeholder paths
  const categoryImages: Record<string, string> = {
    audio: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80",
    wearables: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=80",
    accessories: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80",
    electronics: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=500&auto=format&fit=crop&q=80",
    "smart-home": "https://images.unsplash.com/photo-1558002038-1055907df827?w=500&auto=format&fit=crop&q=80",
    gaming: "https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?w=500&auto=format&fit=crop&q=80",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
  };

  return (
    <section className="bg-flownexa-black text-white py-16 lg:py-24 font-sans relative z-10 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        
        <SectionHeader
          title="Browse by Category"
          subtitle="Explore our curated collections of premium tech devices, built to seamlessly integrate into your daily life."
          badge="Collections"
          align="center"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category) => {
            const imageSrc = categoryImages[category.slug] || category.image;
            return (
              <motion.div key={category.id} variants={itemVariants}>
                <Link
                  href={`/products?category=${category.slug}`}
                  className="group relative h-[260px] rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-end p-6 cursor-pointer block select-none bg-zinc-900"
                >
                  {/* Category Image Background */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt={category.name}
                    className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:blur-[1px] opacity-60"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-flownexa-black via-flownexa-black/40 to-transparent z-10" />

                  {/* Content Overlay */}
                  <div className="relative z-20 flex justify-between items-end">
                    <div>
                      <h3 className="font-heading font-bold text-xl text-white group-hover:text-flownexa-lime transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {category.productCount} Items Available
                      </p>
                    </div>
                    <div className="size-9 rounded-full bg-white/10 group-hover:bg-flownexa-lime group-hover:text-flownexa-black flex items-center justify-center text-white transition-all shrink-0">
                      <ArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}

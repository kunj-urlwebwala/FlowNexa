"use client";

import Link from "next/link";
import { ArrowRight, Flame, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PriceDisplay from "@/components/shared/PriceDisplay";
import StarRating from "@/components/shared/StarRating";
import { products } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

export default function TrendingGrid() {
  const { addItem } = useCartStore();

  // Pick specific products for the bento layout
  const vrProduct = products.find((p) => p.slug === "flownexa-orizon-vr") || products[0];
  const budsProduct = products.find((p) => p.slug === "aural-x-buds-pro") || products[0];
  const keyboardProduct = products.find((p) => p.slug === "apex-gaming-keyboard-v2") || products[0];

  const handleAddToCart = (e: React.MouseEvent, product: typeof vrProduct) => {
    e.preventDefault();
    e.stopPropagation();
    
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : undefined;
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined;
    
    addItem(product, 1, defaultColor, defaultSize);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <section className="bg-flownexa-black text-white py-16 lg:py-24 font-sans relative z-10 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex items-center gap-2 mb-10">
          <div className="size-8 rounded-full bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400">
            <Flame size={16} fill="currentColor" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-heading">
            Trending Now
          </h2>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Large Card (Left 7 Columns) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-zinc-900 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 justify-between relative overflow-hidden group min-h-[380px]"
          >
            {/* Ambient Background Gradient Glow */}
            <div className="absolute right-[-10%] top-[-10%] size-[280px] rounded-full bg-flownexa-lime/5 blur-3xl group-hover:bg-flownexa-lime/10 transition-colors" />

            <div className="flex-1 flex flex-col justify-between relative z-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-flownexa-lime bg-flownexa-lime-muted px-2.5 py-1 rounded-md border border-flownexa-lime/20">
                  Hot Release
                </span>
                <Link href={`/products/${vrProduct.slug}`}>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mt-4 hover:text-flownexa-lime transition-colors leading-tight">
                    {vrProduct.name}
                  </h3>
                </Link>
                <p className="text-xs text-muted-foreground mt-2.5 max-w-sm leading-relaxed line-clamp-3">
                  {vrProduct.description}
                </p>
                <StarRating rating={vrProduct.rating} showText reviewCount={vrProduct.reviewCount} className="mt-3.5" />
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-5">
                <PriceDisplay price={vrProduct.price} originalPrice={vrProduct.originalPrice} size="lg" />
                <Button
                  onClick={(e) => handleAddToCart(e, vrProduct)}
                  className="rounded-full bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover shadow-lg shadow-flownexa-lime/10 px-5 gap-2"
                >
                  <ShoppingBag size={14} />
                  Add to Cart
                </Button>
              </div>
            </div>

            {/* Product Image Placement */}
            <div className="w-[180px] sm:w-[220px] aspect-square flex items-center justify-center self-center md:self-end shrink-0 relative select-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={vrProduct.images[0]}
                alt={vrProduct.name}
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>

          {/* Right Stack Column (Right 5 Columns) - Contain 2 smaller stacked cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Card 1: X-Buds Pro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-zinc-900 border border-white/5 rounded-3xl p-5 sm:p-6 flex items-center justify-between gap-4 overflow-hidden group relative min-h-[177px]"
            >
              <div className="flex-1 flex flex-col justify-between h-full relative z-10">
                <div>
                  <Link href={`/products/${budsProduct.slug}`}>
                    <h4 className="font-bold text-base text-white group-hover:text-flownexa-lime transition-colors leading-tight">
                      {budsProduct.name}
                    </h4>
                  </Link>
                  <p className="text-[10px] text-muted-foreground mt-1 capitalize">{budsProduct.category}</p>
                  <StarRating rating={budsProduct.rating} size={10} showText className="mt-2" />
                </div>
                
                <div className="mt-4 flex items-center gap-3">
                  <PriceDisplay price={budsProduct.price} originalPrice={budsProduct.originalPrice} size="sm" />
                  <Button
                    onClick={(e) => handleAddToCart(e, budsProduct)}
                    size="xs"
                    className="rounded-full bg-white/5 border border-white/10 text-white hover:bg-flownexa-lime hover:text-flownexa-black hover:border-flownexa-lime font-semibold"
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className="size-24 sm:size-28 flex items-center justify-center shrink-0 relative select-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={budsProduct.images[0]}
                  alt={budsProduct.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_15px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>

            {/* Card 2: Mechanical Keyboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-zinc-900 border border-white/5 rounded-3xl p-5 sm:p-6 flex items-center justify-between gap-4 overflow-hidden group relative min-h-[177px]"
            >
              <div className="flex-1 flex flex-col justify-between h-full relative z-10">
                <div>
                  <Link href={`/products/${keyboardProduct.slug}`}>
                    <h4 className="font-bold text-base text-white group-hover:text-flownexa-lime transition-colors leading-tight">
                      {keyboardProduct.name}
                    </h4>
                  </Link>
                  <p className="text-[10px] text-muted-foreground mt-1 capitalize">{keyboardProduct.category}</p>
                  <StarRating rating={keyboardProduct.rating} size={10} showText className="mt-2" />
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <PriceDisplay price={keyboardProduct.price} originalPrice={keyboardProduct.originalPrice} size="sm" />
                  <Button
                    onClick={(e) => handleAddToCart(e, keyboardProduct)}
                    size="xs"
                    className="rounded-full bg-white/5 border border-white/10 text-white hover:bg-flownexa-lime hover:text-flownexa-black hover:border-flownexa-lime font-semibold"
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className="size-24 sm:size-28 flex items-center justify-center shrink-0 relative select-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={keyboardProduct.images[0]}
                  alt={keyboardProduct.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_15px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}

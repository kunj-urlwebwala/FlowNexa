"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import StarRating from "@/components/shared/StarRating";
import PriceDisplay from "@/components/shared/PriceDisplay";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isLiked = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // For products with colors, default to first color if available
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : undefined;
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined;
    
    addItem(product, 1, defaultColor, defaultSize);
    
    toast.success(`${product.name} added to cart!`, {
      description: `Quantity: 1${defaultColor ? `, Color: ${defaultColor}` : ""}`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    
    if (!isLiked) {
      toast.success(`Added ${product.name} to wishlist`);
    } else {
      toast.info(`Removed ${product.name} from wishlist`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-md select-none font-sans flex flex-col h-full"
    >
      {/* Product Image and Overlay Controls */}
      <div className="relative aspect-square bg-white/3 border-b border-white/5 flex items-center justify-center p-4 overflow-hidden shrink-0">
        
        {/* Out of Stock Ribbon */}
        {!product.inStock && (
          <span className="absolute top-3 left-3 bg-red-500/90 text-white font-bold text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-md z-20">
            Out of Stock
          </span>
        )}

        {/* Product Photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="max-h-[170px] max-w-full object-contain filter drop-shadow-[0_8px_15px_rgba(0,0,0,0.3)] transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1"
        />

        {/* Wishlist Heart Icon */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 size-8 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md transition-all duration-300 z-20 cursor-pointer ${
            isLiked 
              ? "bg-flownexa-lime text-flownexa-black border-flownexa-lime shadow-md shadow-flownexa-lime/20" 
              : "bg-black/40 text-white hover:bg-white/10 hover:border-white/20"
          }`}
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={14} fill={isLiked ? "currentColor" : "none"} strokeWidth={2} />
        </button>

        {/* Quick Hover Controls Overlay (Desktop only) */}
        <div className="absolute inset-0 bg-flownexa-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 z-10">
          <Link href={`/products/${product.slug}`}>
            <Button
              variant="outline"
              size="icon"
              className="size-10 rounded-full border-white/10 bg-black/60 text-white hover:bg-flownexa-lime hover:text-flownexa-black hover:border-flownexa-lime"
              title="View Details"
            >
              <Eye size={16} />
            </Button>
          </Link>
          {product.inStock && (
            <Button
              onClick={handleAddToCart}
              size="icon"
              className="size-10 rounded-full bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover shadow-lg shadow-flownexa-lime/20"
              title="Add to Cart"
            >
              <ShoppingBag size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-flownexa-lime/80 capitalize">
            {product.category}
          </span>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-sm text-white line-clamp-1 mt-1 group-hover:text-flownexa-lime transition-colors cursor-pointer">
              {product.name}
            </h3>
          </Link>
          <StarRating rating={product.rating} size={12} showText className="mt-2" />
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="sm" />
          
          {/* Mobile visible direct Add to Cart (hidden on desktop if hovered, but fallback) */}
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            size="xs"
            className="rounded-full bg-white/5 border border-white/10 text-white hover:bg-flownexa-lime hover:text-flownexa-black hover:border-flownexa-lime lg:hidden font-semibold transition-all px-3"
          >
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

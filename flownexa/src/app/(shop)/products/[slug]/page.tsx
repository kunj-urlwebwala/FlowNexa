"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, CreditCard, Heart, CheckCircle2, ShieldCheck, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import StarRating from "@/components/shared/StarRating";
import PriceDisplay from "@/components/shared/PriceDisplay";
import QuantityStepper from "@/components/shared/QuantityStepper";
import PageTransition from "@/components/shared/PageTransition";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const router = useRouter();
  const { slug } = use(params);
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await api.get<Product>(`/products/${slug}`);
        setProduct(data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>(product?.images?.[0] ?? "");

  useEffect(() => {
    if (product) {
      if (product.images?.[0]) setActiveImage(product.images[0]); // eslint-disable-line react-hooks/set-state-in-effect
      if (product.colors && product.colors.length > 0) setSelectedColor(product.colors[0]);
      if (product.sizes && product.sizes.length > 0) setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="bg-flownexa-black text-white min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-flownexa-lime size-8" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-flownexa-black text-white min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-bold font-heading mb-2">Product Not Found</h2>
        <p className="text-sm text-muted-foreground mb-6">
          The requested product does not exist or has been removed from our listings.
        </p>
        <Link href="/products">
          <Button className="rounded-full bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover">
            Return to Shop
          </Button>
        </Link>
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedColor || undefined, selectedSize || undefined);
    toast.success(`Added ${quantity}x ${product.name} to cart!`, {
      description: selectedColor ? `Color: ${selectedColor}` : undefined,
    });
  };

  const handleBuyNow = () => {
    addItem(product, quantity, selectedColor || undefined, selectedSize || undefined);
    router.push("/checkout");
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product);
    if (!isLiked) {
      toast.success(`Added ${product.name} to wishlist`);
    } else {
      toast.info(`Removed ${product.name} from wishlist`);
    }
  };

  return (
    <PageTransition>
      <div className="bg-flownexa-black text-white py-8 md:py-12 font-sans">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          
          {/* Back button */}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            Back to Catalog
          </Link>

          {/* Product Hero Block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Gallery (Left 5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="relative aspect-square rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center p-6 overflow-hidden">
                {/* Floating Active Image */}
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="size-full flex items-center justify-center relative select-none"
                >
                  {activeImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={activeImage}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
                    />
                  )}
                </motion.div>

                {/* Floating Wishlist Button */}
                <button
                  onClick={handleWishlistToggle}
                  className={`absolute top-4 right-4 size-10 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md transition-all duration-300 z-10 cursor-pointer ${
                    isLiked
                      ? "bg-flownexa-lime text-flownexa-black border-flownexa-lime shadow-md shadow-flownexa-lime/20"
                      : "bg-black/40 text-white hover:bg-white/10 hover:border-white/20"
                  }`}
                  aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={16} fill={isLiked ? "currentColor" : "none"} strokeWidth={2} />
                </button>
              </div>

              {/* Thumbnails list */}
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`size-16 rounded-xl bg-zinc-900 border overflow-hidden p-2 flex items-center justify-center cursor-pointer transition-all ${
                        activeImage === img ? "border-flownexa-lime" : "border-white/5 hover:border-white/20"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="max-h-full max-w-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Info (Right 7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-flownexa-lime">
                  {product.category} Collection
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mt-2 leading-snug">
                  {product.name}
                </h1>
                
                {/* Rating summary */}
                <div className="flex items-center gap-4 mt-3">
                  <StarRating rating={product.rating} size={14} />
                  <span className="text-xs text-muted-foreground font-medium">
                    {product.rating.toFixed(1)} / 5.0 ({product.reviewCount} Reviews)
                  </span>
                </div>
              </div>

              <Separator className="bg-white/5" />

              {/* Price Panel */}
              <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="xl" />

              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Product variants selection */}
              <div className="flex flex-col gap-5 pt-2">
                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Select Color
                    </span>
                    <div className="flex items-center gap-3">
                      {product.colors.map((hex) => (
                        <button
                          key={hex}
                          onClick={() => setSelectedColor(hex)}
                          className={`size-7 rounded-full p-0.5 border cursor-pointer transition-all hover:scale-105 ${
                            selectedColor === hex ? "border-flownexa-lime" : "border-white/10"
                          }`}
                        >
                          <span
                            className="size-full rounded-full block"
                            style={{ backgroundColor: hex }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Select Size
                    </span>
                    <div className="flex items-center gap-2">
                      {product.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`min-w-10 h-9 px-3 rounded-lg border font-semibold text-xs transition-all cursor-pointer ${
                            selectedSize === sz
                              ? "bg-flownexa-lime text-flownexa-black border-flownexa-lime font-bold"
                              : "border-white/10 text-white hover:bg-white/5 hover:border-white/20"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity + Stepper */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Quantity
                  </span>
                  <QuantityStepper
                    quantity={quantity}
                    onIncrease={() => setQuantity(quantity + 1)}
                    onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!product.inStock}
                    className="bg-zinc-900 border-white/5"
                  />
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-2">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 rounded-full h-12 bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 gap-2.5 transition-all text-sm"
                >
                  <ShoppingBag size={16} />
                  Add to Shopping Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="flex-1 rounded-full h-12 bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover gap-2.5 transition-all text-sm shadow-lg shadow-flownexa-lime/10"
                >
                  <CreditCard size={16} />
                  Purchase Now
                </Button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5 mt-4 text-[10px] sm:text-xs text-muted-foreground text-center">
                <div className="flex flex-col items-center gap-1.5 p-2 bg-white/3 rounded-xl border border-white/5">
                  <ShieldCheck size={16} className="text-flownexa-lime" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2 bg-white/3 rounded-xl border border-white/5">
                  <CheckCircle2 size={16} className="text-flownexa-lime" />
                  <span>2 Year Warranty</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2 bg-white/3 rounded-xl border border-white/5">
                  <RefreshCw size={16} className="text-flownexa-lime" />
                  <span>30-Day Returns</span>
                </div>
              </div>

            </div>

          </div>

          {/* Lower Tabs Section (Description, Specs, Reviews) */}
          <div className="mt-16 md:mt-24">
            <Tabs defaultValue="specifications" className="w-full">
              <TabsList className="bg-zinc-900 border border-white/5 p-1 rounded-full flex max-w-md mb-8">
                <TabsTrigger
                  value="specifications"
                  className="flex-1 rounded-full text-xs font-semibold py-2 data-[state=active]:bg-flownexa-lime data-[state=active]:text-flownexa-black"
                >
                  Technical Specifications
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="flex-1 rounded-full text-xs font-semibold py-2 data-[state=active]:bg-flownexa-lime data-[state=active]:text-flownexa-black"
                >
                  Customer Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="specifications" className="bg-zinc-900 border border-white/5 rounded-3xl p-6 sm:p-8 animate-fade-in outline-none">
                <h3 className="font-heading font-bold text-lg mb-6">Technical Specifications</h3>
                <div className="divide-y divide-white/5 max-w-2xl">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="grid grid-cols-3 py-3.5 text-sm">
                      <span className="font-medium text-muted-foreground">{key}</span>
                      <span className="col-span-2 text-white font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="bg-zinc-900 border border-white/5 rounded-3xl p-6 sm:p-8 animate-fade-in outline-none">
                <div className="flex flex-col md:flex-row justify-between gap-8 mb-8 pb-6 border-b border-white/5">
                  <div>
                    <h3 className="font-heading font-bold text-lg mb-2">Customer Feedback</h3>
                    <p className="text-xs text-muted-foreground">
                      Based on {product.reviewCount} user verified reviews
                    </p>
                  </div>
                  <div className="flex items-center gap-4 bg-white/3 border border-white/5 px-6 py-4 rounded-2xl shrink-0">
                    <span className="text-3xl font-extrabold text-white">{product.rating.toFixed(1)}</span>
                    <div>
                      <StarRating rating={product.rating} size={14} />
                      <p className="text-[10px] text-muted-foreground mt-1">Global Average Rating</p>
                    </div>
                  </div>
                </div>

                {/* Mock Review List */}
                <div className="flex flex-col gap-6">
                  {[
                    {
                      name: "Liam O'Connor",
                      date: "March 15, 2026",
                      rating: 5,
                      title: "Absolute Masterpiece",
                      body: "I am incredibly picky about sound quality, but these exceeded all my expectations. The acoustics are rich, detailed, and perfectly balanced. The ANC blocks out my noisy office completely.",
                    },
                    {
                      name: "Sophia Chen",
                      date: "February 28, 2026",
                      rating: 4,
                      title: "Great Design & Comfort",
                      body: "Beautiful matte finish and very comfortable to wear for 6+ hour sessions. The battery life is stellar, easily lasts me the whole week. Knocked off one star because the Bluetooth range is standard.",
                    },
                  ].map((rev, i) => (
                    <div key={i} className="flex flex-col gap-2 p-5 bg-white/3 border border-white/5 rounded-2xl">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-bold text-sm text-white">{rev.title}</p>
                          <StarRating rating={rev.rating} size={12} className="mt-1" />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{rev.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                        {rev.body}
                      </p>
                      <p className="text-[10px] text-flownexa-lime font-bold mt-1">Verified Buyer: {rev.name}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}

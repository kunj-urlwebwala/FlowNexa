"use client";

import { use, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Tag, Warehouse, CircleDollarSign, Percent, Loader2 } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/shared/StatusBadge";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  stock: number;
  isActive: boolean;
  category?: { id: string; name: string; slug: string };
  brand?: { id: string; name: string; slug: string };
  variants?: { id: string; name: string; stock: number }[];
  stocks?: { warehouse: { name: string }; quantity: number }[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage(props: PageProps) {
  const params = use(props.params);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.get<ProductDetail>(`/products/${params.id}`);
        setProduct(data);
      } catch {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-flownexa-lime size-8" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-flownexa-black text-white min-h-[400px] flex flex-col items-center justify-center text-center p-6 font-sans">
        <h2 className="text-xl font-bold font-heading mb-2">Product Not Found</h2>
        <p className="text-sm text-muted-foreground mb-6">This product does not exist or has been removed.</p>
        <Link href="/catalog/products">
          <Button className="rounded-full bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover">Return to Catalogue</Button>
        </Link>
      </div>
    );
  }

  const productStock = product.stocks?.reduce((sum, s) => sum + s.quantity, 0) || product.stock;
  const primaryWarehouse = product.stocks?.[0]?.warehouse?.name || "—";

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <Link href="/catalog/products">
          <Button variant="outline" size="sm" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs gap-1.5 cursor-pointer">
            <ArrowLeft size={14} /> Back to Catalog
          </Button>
        </Link>
        <span className="text-[9px] bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-full text-muted-foreground font-extrabold uppercase">
          Product Details
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl overflow-hidden shadow-lg">
            <CardContent className="p-6 flex flex-col sm:flex-row gap-6">
              <div className="size-36 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-2 overflow-hidden shrink-0 mx-auto sm:mx-0">
                {product.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.images[0]} alt={product.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-[10px] text-muted-foreground">No image</span>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl font-bold text-white font-heading">{product.name}</h2>
                    <StatusBadge status={product.isActive ? (productStock > 0 ? "Active" : "Out of Stock") : "Draft"} />
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground mt-0.5">ID: {product.id.slice(0, 8)}...</p>
                </div>
                <div className="flex flex-wrap gap-4 items-center mt-4">
                  {product.brand && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Tag size={14} className="text-flownexa-lime" />
                      <span>{product.brand.name}</span>
                    </div>
                  )}
                  {primaryWarehouse !== "—" && (
                    <>
                      <div className="w-px h-3 bg-white/10" />
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Warehouse size={14} className="text-flownexa-lime" />
                        <span>{primaryWarehouse}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {product.description && (
            <Card className="bg-flownexa-surface border-white/5 rounded-3xl">
              <CardContent className="p-6">
                <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2 mb-3">Product Description</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>
          )}

          {product.variants && product.variants.length > 0 && (
            <Card className="bg-flownexa-surface border-white/5 rounded-3xl">
              <CardContent className="p-6">
                <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2 mb-3">Variants</h3>
                <div className="flex flex-col gap-2">
                  {product.variants.map((v) => (
                    <div key={v.id} className="flex justify-between items-center bg-white/3 border border-white/5 p-3 rounded-xl text-xs">
                      <span className="text-white font-semibold">{v.name}</span>
                      <span className={`font-bold ${v.stock === 0 ? "text-red-400" : "text-white"}`}>{v.stock} units</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl">
            <CardContent className="p-6 flex flex-col gap-4">
              <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2 flex items-center gap-1.5">
                <CircleDollarSign size={14} className="text-flownexa-lime" /> Pricing
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Selling Price:</span>
                  <span className="font-bold text-flownexa-lime text-sm">₹{product.price.toFixed(2)}</span>
                </div>
                {product.compareAtPrice && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Compare At:</span>
                    <span className="text-muted-foreground line-through">₹{product.compareAtPrice.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-flownexa-surface border-white/5 rounded-3xl">
            <CardContent className="p-6 flex flex-col gap-4">
              <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2 flex items-center gap-1.5">
                <Percent size={14} className="text-flownexa-lime" /> Inventory
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Total Stock:</span>
                  <span className={`font-bold ${productStock === 0 ? "text-red-400" : "text-white"}`}>{productStock} units</span>
                </div>
                {product.category && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-semibold text-white">{product.category.name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { use, useState } from "react";
import { mockAdminProducts, AdminProductRecord } from "@/data/admin-products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Tag, Warehouse, CircleDollarSign, Percent, ShieldCheck } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/shared/StatusBadge";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage(props: PageProps) {
  const params = use(props.params);
  const product = mockAdminProducts.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="bg-flownexa-black text-white min-h-[400px] flex flex-col items-center justify-center text-center p-6 font-sans">
        <h2 className="text-xl font-bold font-heading mb-2">Product Not Discovered</h2>
        <p className="text-sm text-muted-foreground mb-6">
          The requested product ID does not exist in the catalog directory.
        </p>
        <Link href="/catalog/products">
          <Button className="rounded-full bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover">
            Return to Catalogue
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      
      {/* Top navigation */}
      <div className="flex justify-between items-center select-none">
        <Link href="/catalog/products">
          <Button variant="outline" size="sm" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs gap-1.5 cursor-pointer">
            <ArrowLeft size={14} />
            Back to Catalog
          </Button>
        </Link>
        <span className="text-[9px] bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-full text-muted-foreground font-extrabold uppercase">
          Product Preview details
        </span>
      </div>

      {/* Main product presentation block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Product preview card & specifications (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Card Presentation */}
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl overflow-hidden shadow-lg">
            <CardContent className="p-6 flex flex-col sm:flex-row gap-6">
              
              {/* Product Thumbnail wrapper */}
              <div className="size-36 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-2 overflow-hidden shrink-0 mx-auto sm:mx-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
              </div>

              {/* Title & info details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl font-bold text-white font-heading">{product.name}</h2>
                    <StatusBadge status={product.status} />
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground mt-0.5">SKU: {product.sku}</p>
                </div>

                <div className="flex flex-wrap gap-4 items-center mt-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Tag size={14} className="text-flownexa-lime" />
                    <span>{product.brand}</span>
                  </div>
                  <div className="w-px h-3 bg-white/10" />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Warehouse size={14} className="text-flownexa-lime" />
                    <span>{product.warehouse}</span>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Description rich block */}
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl">
            <CardContent className="p-6">
              <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2 mb-3">
                Product Description
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Discover next-level performance designed with precision engineering and high-fidelity internal components. Features advanced active noise dampening and ergonomic comfort bands for professional B2B or customer deployments.
              </p>
            </CardContent>
          </Card>

        </div>

        {/* Right Side: Pricing / Inventory metadata (1/3 width) */}
        <div className="flex flex-col gap-6">
          
          {/* Pricing brackets */}
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl">
            <CardContent className="p-6 flex flex-col gap-4">
              <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2 flex items-center gap-1.5">
                <CircleDollarSign size={14} className="text-flownexa-lime" />
                Pricing Base
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Selling Price:</span>
                  <span className="font-bold text-flownexa-lime text-sm">₹{product.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Original Price:</span>
                  <span className="text-muted-foreground line-through">₹{product.originalPrice ? product.originalPrice.toFixed(2) : "N/A"}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-white/5 pt-2.5">
                  <span className="text-muted-foreground">Cost Price:</span>
                  <span className="font-bold text-white">₹{product.costPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Markup Profit:</span>
                  <span className="font-bold text-emerald-400">+₹{(product.price - product.costPrice).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logistics limits */}
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl">
            <CardContent className="p-6 flex flex-col gap-4">
              <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2 flex items-center gap-1.5">
                <Percent size={14} className="text-flownexa-lime" />
                Inventory & Tax Bracket
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Current Stock:</span>
                  <span className="font-bold text-white">{product.stock} units</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Tax Rate Category:</span>
                  <span className="font-semibold text-white">{product.taxRate}% GST</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-white/5 pt-2.5">
                  <span className="text-muted-foreground">Min Alert Level:</span>
                  <span className="font-bold text-amber-400">{product.minStock} units</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Max Capacity:</span>
                  <span className="font-bold text-white">{product.maxStock} units</span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
}

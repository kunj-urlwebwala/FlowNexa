"use client";

import React, { useState, useEffect, useCallback } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

interface ProductRecord {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  stock: number;
  isActive: boolean;
  category?: { name: string; slug: string };
  brand?: { name: string; slug: string };
  createdAt: string;
}

export default function ProductsListPage() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "draft" | "outofstock">("all");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<ProductRecord | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.get<ProductRecord[]>("/products?page=1&limit=100");
      setProducts(Array.isArray(result) ? result : []);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [fetchProducts]);

  const filteredProducts = products.filter((p) => {
    switch (activeTab) {
      case "active": return p.isActive && p.stock > 0;
      case "draft": return !p.isActive;
      case "outofstock": return p.stock === 0;
      default: return true;
    }
  });

  const handleDelete = (prod: ProductRecord) => {
    setActiveProduct(prod);
    setConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!activeProduct) return;
    try {
      await api.delete(`/products/${activeProduct.id}`);
      setProducts(products.filter((p) => p.id !== activeProduct.id));
      toast.success("Product Deleted", { description: `${activeProduct.name} has been removed.` });
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const columns: Column<ProductRecord>[] = [
    {
      header: "Product Details",
      accessorKey: "name",
      cell: (row) => (
        <div className="flex items-center gap-3 text-left">
          <div className="size-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center p-1 overflow-hidden shrink-0">
            {row.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.images[0]} alt="" className="max-h-full max-w-full object-contain" />
            ) : (
              <span className="text-[8px] text-muted-foreground">No img</span>
            )}
          </div>
          <div className="flex flex-col truncate">
            <span className="font-bold text-white text-xs truncate max-w-[180px]">{row.name}</span>
            <span className="text-[9px] font-mono text-muted-foreground">{row.slug}</span>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (row) => (
        <div className="flex flex-col text-left">
          <span className="text-xs text-white">{row.category?.name || "—"}</span>
          <span className="text-[9px] text-muted-foreground">{row.brand?.name || ""}</span>
        </div>
      ),
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (row) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-xs text-flownexa-lime">₹{row.price.toFixed(2)}</span>
          {row.compareAtPrice ? <span className="text-[9px] text-muted-foreground line-through">₹{row.compareAtPrice.toFixed(2)}</span> : null}
        </div>
      ),
      sortable: true,
    },
    {
      header: "Stock",
      accessorKey: "stock",
      cell: (row) => (
        <span className={`font-bold text-xs ${row.stock === 0 ? "text-red-400" : row.stock < 10 ? "text-yellow-400" : "text-white"}`}>
          {row.stock} units
        </span>
      ),
      sortable: true,
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: (row) => <StatusBadge status={row.isActive ? (row.stock > 0 ? "Active" : "Out of Stock") : "Draft"} />,
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (row) => (
        <div className="flex gap-1.5 justify-end">
          <Link href={`/catalog/products/${row.id}`}>
            <Button variant="outline" size="xs" className="size-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] flex items-center justify-center p-0 cursor-pointer">
              <Eye size={12} className="text-white" />
            </Button>
          </Link>
          <Button variant="outline" size="xs" onClick={() => handleDelete(row)}
            className="size-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] flex items-center justify-center p-0 cursor-pointer">
            <Trash2 size={12} className="text-red-400" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Product Catalogue</h1>
          <p className="text-xs text-muted-foreground">Manage storefront products, inventory stock counts, and SKU dimensions.</p>
        </div>
        <Link href="/catalog/products/create">
          <Button className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer">
            <Plus size={16} />
            Create Product
          </Button>
        </Link>
      </div>

      <div className="flex border-b border-white/5 select-none overflow-x-auto no-scrollbar">
        {[
          { id: "all", label: "Total Products", count: products.length },
          { id: "active", label: "Active", count: products.filter((p) => p.isActive && p.stock > 0).length },
          { id: "draft", label: "Drafts", count: products.filter((p) => !p.isActive).length },
          { id: "outofstock", label: "Out of Stock", count: products.filter((p) => p.stock === 0).length },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`py-3 px-4 text-xs font-bold transition-all relative cursor-pointer whitespace-nowrap ${activeTab === tab.id ? "text-flownexa-lime" : "text-muted-foreground hover:text-white"}`}>
            <span className="flex items-center gap-1.5">
              {tab.label}
              <Badge className={`rounded-full px-1.5 py-0.5 text-[9px] font-black ${activeTab === tab.id ? "bg-flownexa-lime text-flownexa-black" : "bg-white/5 border border-white/5 text-muted-foreground"}`}>
                {tab.count}
              </Badge>
            </span>
            {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-flownexa-lime" />}
          </button>
        ))}
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-flownexa-lime size-8" />
          </div>
        ) : (
          <DataTable data={filteredProducts} columns={columns} searchKey="name" searchPlaceholder="Search products..." />
        )}
      </div>

      {activeProduct && (
        <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Delete Product"
          description={`Are you sure you want to delete ${activeProduct.name}?`}
          confirmLabel="Yes, Delete" onConfirm={executeDelete} variant="destructive" />
      )}
    </div>
  );
}

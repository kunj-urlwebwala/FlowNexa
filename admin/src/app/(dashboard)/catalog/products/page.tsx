"use client";

import React, { useState, useMemo } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import { mockAdminProducts, AdminProductRecord } from "@/data/admin-products";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit3, Trash2, Tag, Archive } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Badge } from "@/components/ui/badge";

export default function ProductsListPage() {
  const [productsList, setProductsList] = useState<AdminProductRecord[]>(mockAdminProducts);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "draft" | "outofstock">("all");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<AdminProductRecord | null>(null);

  // Tab filtering logic
  const filteredProducts = useMemo(() => {
    switch (activeTab) {
      case "active":
        return productsList.filter((p) => p.status === "Active");
      case "draft":
        return productsList.filter((p) => p.status === "Draft");
      case "outofstock":
        return productsList.filter((p) => p.status === "Out of Stock");
      default:
        return productsList;
    }
  }, [productsList, activeTab]);

  const handleDelete = (prod: AdminProductRecord) => {
    setActiveProduct(prod);
    setConfirmOpen(true);
  };

  const executeDelete = () => {
    if (!activeProduct) return;
    setProductsList(productsList.filter((p) => p.id !== activeProduct.id));
    toast.success("Product Deleted", {
      description: `${activeProduct.name} has been removed from catalogue.`,
    });
  };

  const columns: Column<AdminProductRecord>[] = [
    {
      header: "Product Details",
      accessorKey: "name",
      cell: (row) => (
        <div className="flex items-center gap-3 text-left">
          <div className="size-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center p-1 overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={row.image} alt="" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="flex flex-col truncate">
            <span className="font-bold text-white text-xs truncate max-w-[180px]">{row.name}</span>
            <span className="text-[9px] font-mono text-muted-foreground">{row.sku}</span>
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
          <span className="text-xs text-white">{row.category}</span>
          <span className="text-[9px] text-muted-foreground">{row.subCategory}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Pricing base",
      accessorKey: "price",
      cell: (row) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-xs text-flownexa-lime">${row.price}</span>
          <span className="text-[9px] text-muted-foreground">Cost: ${row.costPrice}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "GST Tax %",
      accessorKey: "taxRate",
      cell: (row) => <span>{row.taxRate}% GST</span>,
      sortable: true,
    },
    {
      header: "Inventory Stock",
      accessorKey: "stock",
      cell: (row) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-xs">{row.stock} units</span>
          <span className="text-[9px] text-muted-foreground">{row.warehouse.split(" ")[0]}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Listing status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
      sortable: true,
    },
    {
      header: "Controls",
      accessorKey: "id",
      cell: (row) => (
        <div className="flex gap-1.5 justify-end">
          <Link href={`/catalog/products/${row.id}`}>
            <Button
              variant="outline"
              size="xs"
              className="size-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] flex items-center justify-center p-0 cursor-pointer"
              title="View Preview Card"
            >
              <Eye size={12} className="text-white" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="xs"
            onClick={() => handleDelete(row)}
            className="size-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] flex items-center justify-center p-0 cursor-pointer"
            title="Remove Product"
          >
            <Trash2 size={12} className="text-red-400" />
          </Button>
        </div>
      ),
    },
  ];

  const bulkActions = [
    {
      label: "Archive Listings",
      action: (items: AdminProductRecord[]) => {
        const archivedNames = items.map((i) => i.name).join(", ");
        toast.success("Products Archived", {
          description: `Archived ${archivedNames} visibility parameters.`,
        });
      },
      icon: Archive,
      variant: "outline" as const,
    },
    {
      label: "Delete Listings",
      action: (items: AdminProductRecord[]) => {
        const deletedNames = items.map((i) => i.name).join(", ");
        const idsToDelete = new Set(items.map((i) => i.id));
        setProductsList(productsList.filter((p) => !idsToDelete.has(p.id)));
        toast.success("Products Deleted", {
          description: `Permanently removed ${deletedNames} from warehouse data.`,
        });
      },
      icon: Trash2,
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Page Title & CTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Product Catalogue</h1>
          <p className="text-xs text-muted-foreground">
            Manage storefront products, inventory stock counts, and SKU dimensions.
          </p>
        </div>
        <Link href="/catalog/products/create">
          <Button className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer">
            <Plus size={16} />
            Create Product
          </Button>
        </Link>
      </div>

      {/* Tabs list selector */}
      <div className="flex border-b border-white/5 select-none overflow-x-auto no-scrollbar">
        {[
          { id: "all", label: "Total Products", count: productsList.length },
          { id: "active", label: "Active", count: productsList.filter((p) => p.status === "Active").length },
          { id: "draft", label: "Drafts", count: productsList.filter((p) => p.status === "Draft").length },
          { id: "outofstock", label: "Out of Stock", count: productsList.filter((p) => p.status === "Out of Stock").length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-4 text-xs font-bold transition-all relative cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? "text-flownexa-lime"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <span className="flex items-center gap-1.5">
              {tab.label}
              <Badge className={`rounded-full px-1.5 py-0.5 text-[9px] font-black ${
                activeTab === tab.id
                  ? "bg-flownexa-lime text-flownexa-black"
                  : "bg-white/5 border border-white/5 text-muted-foreground"
              }`}>
                {tab.count}
              </Badge>
            </span>
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-flownexa-lime" />
            )}
          </button>
        ))}
      </div>

      {/* DataTable */}
      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable
          data={filteredProducts}
          columns={columns}
          searchKey="name"
          searchPlaceholder="Search product database by name or SKU..."
          bulkActions={bulkActions}
        />
      </div>

      {/* Confirmation delete modal */}
      {activeProduct && (
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Delete Product Listing"
          description={`Are you sure you want to remove ${activeProduct.name} from FlowNexa catalogue? This will delete all variants and stocks records permanently.`}
          confirmLabel="Yes, Delete Listing"
          onConfirm={executeDelete}
          variant="destructive"
        />
      )}

    </div>
  );
}

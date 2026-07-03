"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SubCategoryRecord {
  id: string;
  name: string;
  parentCategory: string;
  productCount: number;
}

export default function SubCategoriesPage() {
  const [subCategories, setSubCategories] = useState<SubCategoryRecord[]>([
    { id: "sub-1", name: "Headphones", parentCategory: "Audio & Acoustics", productCount: 22 },
    { id: "sub-2", name: "Earbuds", parentCategory: "Audio & Acoustics", productCount: 26 },
    { id: "sub-3", name: "Chargers", parentCategory: "Tech Accessories", productCount: 14 },
    { id: "sub-4", name: "Virtual Reality", parentCategory: "Premium Devices", productCount: 18 },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newParentCategory, setNewParentCategory] = useState("Audio & Acoustics");
  const [newProductCount, setNewProductCount] = useState(0);

  const columns: Column<SubCategoryRecord>[] = [
    {
      header: "Sub Category",
      accessorKey: "name",
      cell: (row) => <span className="font-bold text-white text-xs">{row.name}</span>,
      sortable: true,
    },
    {
      header: "Parent Category",
      accessorKey: "parentCategory",
      sortable: true,
    },
    {
      header: "Listed Products",
      accessorKey: "productCount",
      cell: (row) => <span className="font-bold text-xs">{row.productCount} Items</span>,
      sortable: true,
    },
    {
      header: "Controls",
      accessorKey: "id",
      cell: (row) => (
        <div className="flex gap-1.5 justify-end">
          <Button
            variant="outline"
            size="xs"
            onClick={() => toast.info(`Viewing details of ${row.name}`)}
            className="size-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] flex items-center justify-center p-0 cursor-pointer"
          >
            <Eye size={12} className="text-white" />
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => {
              setSubCategories(subCategories.filter((s) => s.id !== row.id));
              toast.success("Sub-category deleted", { description: `${row.name} has been removed.` });
            }}
            className="size-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] flex items-center justify-center p-0 cursor-pointer"
          >
            <Trash2 size={12} className="text-red-400" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Sub Categories</h1>
          <p className="text-xs text-muted-foreground">Manage nested classifications linked to parent categories.</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer"
        >
          <Plus size={16} />
          Create Sub Category
        </Button>
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={subCategories} columns={columns} searchKey="name" searchPlaceholder="Search subcategories..." />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-950 border border-white/10 text-white rounded-2xl max-w-md p-6 font-sans">
          <DialogHeader className="text-left">
            <DialogTitle className="text-white text-base font-bold font-heading">Create Sub Category</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">Add a new sub-category under a parent.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4 text-left">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-white">Name</Label>
              <Input id="name" value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="parentCategory" className="text-xs font-semibold text-white">Parent Category</Label>
              <select id="parentCategory" value={newParentCategory} onChange={(e) => setNewParentCategory(e.target.value)} className="bg-[#1A1D26] border border-white/5 text-xs text-white rounded-lg h-10 px-3 focus:outline-none">
                <option value="Audio & Acoustics">Audio & Acoustics</option>
                <option value="Smart Wearables">Smart Wearables</option>
                <option value="Tech Accessories">Tech Accessories</option>
                <option value="Premium Devices">Premium Devices</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="productCount" className="text-xs font-semibold text-white">Product Count</Label>
              <Input id="productCount" type="number" value={newProductCount} onChange={(e) => setNewProductCount(Number(e.target.value))} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
          </div>
          <DialogFooter className="flex gap-2 mt-6">
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)} className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold text-xs">Cancel</Button>
            <Button size="sm" onClick={() => { setSubCategories([...subCategories, { id: "sub-" + Date.now(), name: newName, parentCategory: newParentCategory, productCount: newProductCount }]); setDialogOpen(false); toast.success("Sub category created successfully"); }} className="rounded-full bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs cursor-pointer">Create Sub Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

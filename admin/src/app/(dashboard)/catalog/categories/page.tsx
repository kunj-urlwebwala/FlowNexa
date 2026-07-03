"use client";

import React, { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subCategories?: Record<string, unknown>[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await api.get<CategoryRecord[]>("/categories");
      setCategories(data);
    } catch (err: unknown) {
      toast.error("Failed to load categories", {
        description: err instanceof Error ? err.message : "Could not connect to database server.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) {
      toast.error("Category name is required");
      return;
    }

    try {
      const created = await api.post<CategoryRecord>("/categories", {
        name: newName,
        slug: newSlug || undefined,
        description: newDescription || undefined,
      });

      setCategories([...categories, created]);
      setDialogOpen(false);
      toast.success("Category created successfully");

      // Reset
      setNewName("");
      setNewSlug("");
      setNewDescription("");
    } catch (err: unknown) {
      toast.error("Failed to create category", {
        description: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const handleDelete = async (row: CategoryRecord) => {
    try {
      await api.delete(`/categories/${row.id}`);
      setCategories(categories.filter((c) => c.id !== row.id));
      toast.success("Category deleted", { description: `${row.name} has been removed.` });
    } catch (err: unknown) {
      toast.error("Failed to delete category", {
        description: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const columns: Column<CategoryRecord>[] = [
    {
      header: "Category Name",
      accessorKey: "name",
      cell: (row) => <span className="font-bold text-white text-xs">{row.name}</span>,
      sortable: true,
    },
    {
      header: "URL Slug",
      accessorKey: "slug",
      cell: (row) => <span className="font-mono text-[10px] text-muted-foreground">/category/{row.slug}</span>,
      sortable: true,
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (row) => <span className="text-xs text-zinc-400">{row.description || "—"}</span>,
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
            onClick={() => handleDelete(row)}
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
          <h1 className="text-2xl font-bold font-heading text-white">Product Categories</h1>
          <p className="text-xs text-muted-foreground">Manage listing folders and catalogs classification.</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer"
        >
          <Plus size={16} />
          Create Category
        </Button>
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl min-h-[200px] flex flex-col justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8">
            <Loader2 className="animate-spin text-flownexa-lime size-6" />
            <span className="text-xs text-muted-foreground">Syncing categories with server database...</span>
          </div>
        ) : (
          <DataTable data={categories} columns={columns} searchKey="name" searchPlaceholder="Search categories..." />
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-950 border border-white/10 text-white rounded-2xl max-w-md p-6 font-sans">
          <form onSubmit={handleCreateCategory}>
            <DialogHeader className="text-left">
              <DialogTitle className="text-white text-base font-bold font-heading">Create Category</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground pt-1">Add a new product category to the platform catalog.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 mt-4 text-left">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-white">Name *</Label>
                <Input id="name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Virtual Reality" className="bg-[#1A1D26] border-white/5 text-xs h-10" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="slug" className="text-xs font-semibold text-white">Slug (Optional)</Label>
                <Input id="slug" value={newSlug} onChange={(e) => setNewSlug(e.target.value)} placeholder="e.g. virtual-reality" className="bg-[#1A1D26] border-white/5 text-xs h-10" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="desc" className="text-xs font-semibold text-white">Description</Label>
                <Input id="desc" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Brief summary of category items" className="bg-[#1A1D26] border-white/5 text-xs h-10" />
              </div>
            </div>
            <DialogFooter className="flex gap-2 mt-6">
              <Button type="button" variant="outline" size="sm" onClick={() => setDialogOpen(false)} className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold text-xs h-10">Cancel</Button>
              <Button type="submit" size="sm" className="rounded-full bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs cursor-pointer h-10">Create Category</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Edit3, Plus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SEORecord {
  id: string;
  pageName: string;
  metaTitle: string;
  metaDesc: string;
  score: number;
}

export default function SEOManagementPage() {
  const [seos, setSeos] = useState<SEORecord[]>([
    { id: "seo-1", pageName: "Home Page", metaTitle: "FlowNexa — Premium E-Commerce Store", metaDesc: "Discover premium audio devices, smart wearables, and tech accessories.", score: 92 },
    { id: "seo-2", pageName: "Product Catalogue", metaTitle: "Shop Premium Acoustics & Devices | FlowNexa", metaDesc: "Browse the complete collection of headphones, earbuds, and keyboards.", score: 85 },
  ]);

  const [activeSeo, setActiveSeo] = useState<SEORecord | null>(null);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [newMetaTitle, setNewMetaTitle] = useState("");
  const [newMetaDesc, setNewMetaDesc] = useState("");

  const handleEditSeo = (seo: SEORecord) => {
    setActiveSeo(seo);
    setMetaTitle(seo.metaTitle);
    setMetaDesc(seo.metaDesc);
    setDialogOpen(true);
  };

  const handleSaveSeo = () => {
    if (!activeSeo) return;
    setSeos(
      seos.map((s) => (s.id === activeSeo.id ? { ...s, metaTitle, metaDesc, score: 98 } : s))
    );
    toast.success("SEO Metadata Updated", {
      description: `Optimized indexes for ${activeSeo.pageName}.`,
    });
    setDialogOpen(false);
  };

  const columns: Column<SEORecord>[] = [
    {
      header: "Website Page",
      accessorKey: "pageName",
      cell: (row) => <span className="font-bold text-white text-xs">{row.pageName}</span>,
      sortable: true,
    },
    {
      header: "Meta Title",
      accessorKey: "metaTitle",
      cell: (row) => <span className="text-xs text-white truncate max-w-[200px] block">{row.metaTitle}</span>,
    },
    {
      header: "Meta Description",
      accessorKey: "metaDesc",
      cell: (row) => <span className="text-xs text-muted-foreground line-clamp-1 max-w-[250px]">{row.metaDesc}</span>,
    },
    {
      header: "SEO Score",
      accessorKey: "score",
      cell: (row) => (
        <span className={`font-bold text-xs ${row.score >= 90 ? "text-emerald-400" : "text-amber-400"}`}>
          {row.score}% Optimised
        </span>
      ),
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
            onClick={() => handleEditSeo(row)}
            className="h-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] text-xs px-3.5 cursor-pointer"
          >
            <Edit3 size={12} className="mr-1.5" />
            Optimize SEO
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
        <div className="flex justify-between items-center select-none">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold font-heading text-white">SEO Indexing Management</h1>
            <p className="text-xs text-muted-foreground">Optimize meta titles, descriptions, and robots crawlers indexing settings.</p>
          </div>
          <Button
            onClick={() => setAddDialogOpen(true)}
            className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer"
          >
            <Plus size={16} />
            Add SEO Record
          </Button>
        </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={seos} columns={columns} searchKey="pageName" searchPlaceholder="Search pages..." />
      </div>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="bg-zinc-950 border border-white/10 text-white rounded-2xl max-w-md p-6 font-sans">
          <DialogHeader className="text-left">
            <DialogTitle className="text-white text-base font-bold font-heading">Add SEO Record</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">Add a new page SEO metadata entry.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4 text-left">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pageName" className="text-xs font-semibold text-white">Page Name</Label>
              <Input id="pageName" value={newPageName} onChange={(e) => setNewPageName(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="metaTitle" className="text-xs font-semibold text-white">Meta Title</Label>
              <Input id="metaTitle" value={newMetaTitle} onChange={(e) => setNewMetaTitle(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="metaDesc" className="text-xs font-semibold text-white">Meta Description</Label>
              <Textarea id="metaDesc" value={newMetaDesc} onChange={(e) => setNewMetaDesc(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-24" />
            </div>
          </div>
          <DialogFooter className="flex gap-2 mt-6">
            <Button variant="outline" size="sm" onClick={() => setAddDialogOpen(false)} className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold text-xs">Cancel</Button>
            <Button size="sm" onClick={() => { setSeos([...seos, { id: "seo-" + Date.now(), pageName: newPageName, metaTitle: newMetaTitle, metaDesc: newMetaDesc, score: 85 }]); setAddDialogOpen(false); toast.success("SEO record added successfully"); }} className="rounded-full bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs cursor-pointer">Add SEO Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {activeSeo && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-zinc-950 border border-white/10 text-white rounded-2xl max-w-md p-6 font-sans">
            <DialogHeader className="text-left">
              <DialogTitle className="text-white text-base font-bold font-heading">
                Optimize {activeSeo.pageName} SEO
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground pt-1">
                Customize titles and tags indexed by search bots like Google crawler.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 mt-4 text-left">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="metaTitle" className="text-xs font-semibold text-white">SEO Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="bg-[#1A1D26] border-white/5 text-xs h-10"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="metaDesc" className="text-xs font-semibold text-white">SEO Meta Description</Label>
                <Textarea
                  id="metaDesc"
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  className="bg-[#1A1D26] border-white/5 text-xs h-24"
                />
              </div>
            </div>

            <DialogFooter className="flex gap-2 mt-6">
              <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)} className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold text-xs">
                Discard
              </Button>
              <Button size="sm" onClick={handleSaveSeo} className="rounded-full bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs cursor-pointer">
                Confirm Metadata Updates
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

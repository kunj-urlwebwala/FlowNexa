"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Edit3, Eye, Plus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/shared/RichTextEditor";

interface PageRecord {
  id: string;
  title: string;
  slug: string;
  status: string;
  lastUpdated: string;
}

export default function WebsitePagesPage() {
  const [pages, setPages] = useState<PageRecord[]>([
    { id: "pg-1", title: "Privacy Policy", slug: "/privacy", status: "Published", lastUpdated: "June 20, 2026" },
    { id: "pg-2", title: "Return Policy", slug: "/returns-policy", status: "Published", lastUpdated: "June 18, 2026" },
    { id: "pg-3", title: "Terms & Conditions", slug: "/terms", status: "Published", lastUpdated: "June 25, 2026" },
    { id: "pg-4", title: "About Us", slug: "/about", status: "Published", lastUpdated: "June 24, 2026" },
  ]);

  const [activePage, setActivePage] = useState<PageRecord | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newStatus, setNewStatus] = useState("Published");

  const handleEditPage = (page: PageRecord) => {
    setActivePage(page);
    setEditorContent(`<h3>${page.title}</h3><p>Configure details for ${page.title} dynamic CMS page content.</p>`);
    setEditorOpen(true);
  };

  const handleSavePage = () => {
    if (!activePage) return;
    toast.success("Page Content Updated", {
      description: `Successfully published new draft for ${activePage.title}.`,
    });
    setEditorOpen(false);
  };

  const columns: Column<PageRecord>[] = [
    {
      header: "Page Title Name",
      accessorKey: "title",
      cell: (row) => <span className="font-bold text-white text-xs">{row.title}</span>,
      sortable: true,
    },
    {
      header: "Website Slug Path",
      accessorKey: "slug",
      cell: (row) => <span className="font-mono text-[10px] text-muted-foreground">{row.slug}</span>,
      sortable: true,
    },
    {
      header: "Publishing Status",
      accessorKey: "status",
      cell: (row) => (
        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {row.status}
        </span>
      ),
      sortable: true,
    },
    {
      header: "Last Sync Date",
      accessorKey: "lastUpdated",
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
            onClick={() => handleEditPage(row)}
            className="h-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] text-xs px-3.5 cursor-pointer"
          >
            <Edit3 size={12} className="mr-1.5" />
            Edit Page CMS
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
        <div className="flex justify-between items-center select-none">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold font-heading text-white">Website Dynamic Pages</h1>
            <p className="text-xs text-muted-foreground">Manage Privacy Policies, Return policies, and corporate details Pages.</p>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer"
          >
            <Plus size={16} />
            Create Page
          </Button>
        </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={pages} columns={columns} searchKey="title" searchPlaceholder="Search dynamic pages..." />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-950 border border-white/10 text-white rounded-2xl max-w-md p-6 font-sans">
          <DialogHeader className="text-left">
            <DialogTitle className="text-white text-base font-bold font-heading">Create Page</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">Add a new dynamic page to the website.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4 text-left">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title" className="text-xs font-semibold text-white">Title</Label>
              <Input id="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="slug" className="text-xs font-semibold text-white">Slug</Label>
              <Input id="slug" value={newSlug} onChange={(e) => setNewSlug(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status" className="text-xs font-semibold text-white">Status</Label>
              <select id="status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="bg-[#1A1D26] border border-white/5 text-xs text-white rounded-lg h-10 px-3 focus:outline-none">
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
          <DialogFooter className="flex gap-2 mt-6">
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)} className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold text-xs">Cancel</Button>
            <Button size="sm" onClick={() => { setPages([...pages, { id: "pg-" + Date.now(), title: newTitle, slug: newSlug, status: newStatus, lastUpdated: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) }]); setDialogOpen(false); toast.success("Page created successfully"); }} className="rounded-full bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs cursor-pointer">Create Page</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {activePage && (
        <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
          <DialogContent className="bg-zinc-950 border border-white/10 text-white rounded-2xl max-w-4xl p-6 font-sans">
            <DialogHeader className="text-left">
              <DialogTitle className="text-white text-base font-bold font-heading">
                Edit {activePage.title} CMS Content
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground pt-1">
                Customize policy contents using the WYSIWYG editor. Changes are published immediately.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-1.5 mt-4 text-left">
              <Label className="text-xs font-semibold text-white">Body Copy Editor</Label>
              <RichTextEditor content={editorContent} onChange={setEditorContent} />
            </div>

            <DialogFooter className="flex gap-2 mt-6">
              <Button variant="outline" size="sm" onClick={() => setEditorOpen(false)} className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold text-xs">
                Discard Draft
              </Button>
              <Button size="sm" onClick={handleSavePage} className="rounded-full bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs cursor-pointer">
                Save Publish Updates
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

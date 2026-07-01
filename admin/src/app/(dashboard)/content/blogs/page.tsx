"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Trash2, Edit3 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import StatusBadge from "@/components/shared/StatusBadge";

interface BlogRecord {
  id: string;
  title: string;
  category: string;
  author: string;
  status: string;
  publishDate: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogRecord[]>([
    { id: "blog-1", title: "Top 5 Acoustics Features of Sequoia Pro", category: "Acoustics & Audio", author: "Alex Mercer", status: "Active", publishDate: "June 24, 2026" },
    { id: "blog-2", title: "Virtual Reality Trends in B2B Training", category: "Smart Devices", author: "System AI Writer", status: "Draft", publishDate: "Scheduled: July 5" },
  ]);

  const columns: Column<BlogRecord>[] = [
    {
      header: "Blog Post Title",
      accessorKey: "title",
      cell: (row) => <span className="font-bold text-white text-xs leading-snug max-w-[200px] truncate block">{row.title}</span>,
      sortable: true,
    },
    {
      header: "Category",
      accessorKey: "category",
      sortable: true,
    },
    {
      header: "Author",
      accessorKey: "author",
      sortable: true,
    },
    {
      header: "Schedule Stamp",
      accessorKey: "publishDate",
      sortable: true,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
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
            onClick={() => toast.info(`Previewing blog post: ${row.title}`)}
            className="size-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] flex items-center justify-center p-0 cursor-pointer"
          >
            <Eye size={12} className="text-white" />
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => {
              setBlogs(blogs.filter((b) => b.id !== row.id));
              toast.success("Blog post deleted");
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
          <h1 className="text-2xl font-bold font-heading text-white">Blog CMS Hub</h1>
          <p className="text-xs text-muted-foreground">Author articles, modify categories, and set auto-publish schedulers.</p>
        </div>
        <Link href="/content/blogs/create">
          <Button className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer">
            <Plus size={16} />
            Write Article
          </Button>
        </Link>
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={blogs} columns={columns} searchKey="title" searchPlaceholder="Search blog posts..." />
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TestimonialRecord {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  featured: boolean;
}

export default function TestimonialsPage() {
  const [reviews, setReviews] = useState<TestimonialRecord[]>([
    { id: "REV-91", userName: "Sarah Connor", rating: 5, comment: "X-Buds Pro are incredible! Noise cancellation is crystal clear, battery life exceeds expectations.", featured: true },
    { id: "REV-90", userName: "Bruce Wayne", rating: 4, comment: "VR headset is comfortable, resolution is premium. Allocation wait times could be better.", featured: false },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newRating, setNewRating] = useState("5");
  const [newComment, setNewComment] = useState("");
  const [newFeatured, setNewFeatured] = useState(false);

  const columns: Column<TestimonialRecord>[] = [
    {
      header: "Client Name",
      accessorKey: "userName",
      cell: (row) => <span className="font-bold text-white text-xs">{row.userName}</span>,
      sortable: true,
    },
    {
      header: "Rating Stars",
      accessorKey: "rating",
      cell: (row) => (
        <div className="flex gap-0.5 text-flownexa-lime">
          {Array.from({ length: row.rating }).map((_, idx) => (
            <Star key={idx} size={11} fill="currentColor" />
          ))}
        </div>
      ),
      sortable: true,
    },
    {
      header: "Feedback Statement",
      accessorKey: "comment",
      cell: (row) => <span className="text-xs text-muted-foreground line-clamp-1">{row.comment}</span>,
    },
    {
      header: "Featured",
      accessorKey: "featured",
      cell: (row) => (
        <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded ${
          row.featured ? "bg-flownexa-lime-muted text-flownexa-lime" : "bg-white/5 text-muted-foreground"
        }`}>
          {row.featured ? "Featured" : "Standard"}
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
            onClick={() => {
              setReviews(reviews.map((r) => r.id === row.id ? { ...r, featured: !r.featured } : r));
              toast.success("Featured status toggled");
            }}
            className="h-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] text-xs px-3 cursor-pointer"
          >
            Toggle Featured
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => {
              setReviews(reviews.filter((r) => r.id !== row.id));
              toast.success("Review deleted");
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
            <h1 className="text-2xl font-bold font-heading text-white">Client Testimonials CMS</h1>
            <p className="text-xs text-muted-foreground">Monitor customer feedback reviews and select items featured on storefront homepage.</p>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer"
          >
            <Plus size={16} />
            Add Testimonial
          </Button>
        </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={reviews} columns={columns} searchKey="userName" searchPlaceholder="Search reviews..." />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-950 border border-white/10 text-white rounded-2xl max-w-md p-6 font-sans">
          <DialogHeader className="text-left">
            <DialogTitle className="text-white text-base font-bold font-heading">Add Testimonial</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">Add a new client testimonial review.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4 text-left">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="userName" className="text-xs font-semibold text-white">User Name</Label>
              <Input id="userName" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rating" className="text-xs font-semibold text-white">Rating</Label>
              <select id="rating" value={newRating} onChange={(e) => setNewRating(e.target.value)} className="bg-[#1A1D26] border border-white/5 text-xs text-white rounded-lg h-10 px-3 focus:outline-none">
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="comment" className="text-xs font-semibold text-white">Comment</Label>
              <Textarea id="comment" value={newComment} onChange={(e) => setNewComment(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-24" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" checked={newFeatured} onChange={(e) => setNewFeatured(e.target.checked)} className="accent-flownexa-lime" />
              <Label htmlFor="featured" className="text-xs font-semibold text-white">Featured</Label>
            </div>
          </div>
          <DialogFooter className="flex gap-2 mt-6">
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)} className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold text-xs">Cancel</Button>
            <Button size="sm" onClick={() => { setReviews([...reviews, { id: "rev-" + Date.now(), userName: newUserName, rating: Number(newRating), comment: newComment, featured: newFeatured }]); setDialogOpen(false); toast.success("Testimonial added successfully"); }} className="rounded-full bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs cursor-pointer">Add Testimonial</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

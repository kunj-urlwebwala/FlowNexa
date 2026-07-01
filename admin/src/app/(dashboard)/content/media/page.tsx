"use client";

import React, { useState } from "react";
import MediaUploader from "@/components/shared/MediaUploader";
import { Button } from "@/components/ui/button";
import { FileImage, Film, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: "image" | "video" | "document";
  size: string;
}

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([
    { id: "m-1", name: "headphones-featured.png", url: "/images/products/headphones.png", type: "image", size: "320 KB" },
    { id: "m-2", name: "vr-onboarding-demo.mp4", url: "/images/products/vr-headset.png", type: "video", size: "4.8 MB" },
    { id: "m-3", name: "earbuds-invoice-template.pdf", url: "#", type: "document", size: "120 KB" },
  ]);

  const handleRemove = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    toast.success("File deleted successfully");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex flex-col gap-1 select-none">
        <h1 className="text-2xl font-bold font-heading text-white">Media Assets Library</h1>
        <p className="text-xs text-muted-foreground">Upload and manage all graphics, videos, invoice PDFs, and templates.</p>
      </div>

      {/* Drag Drop Uploader Area */}
      <div className="bg-flownexa-surface border border-white/5 p-6 rounded-3xl">
        <MediaUploader maxFiles={5} />
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-2">
        {items.map((item) => (
          <div key={item.id} className="bg-flownexa-surface border border-white/5 p-3 rounded-2xl flex flex-col justify-between shadow-md relative group select-none">
            
            {/* Visual Icon / Thumbnail Preview */}
            <div className="aspect-square bg-zinc-950/40 rounded-xl border border-white/5 flex items-center justify-center p-2 mb-3 relative overflow-hidden">
              {item.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt="" className="max-h-full max-w-full object-contain" />
              ) : item.type === "video" ? (
                <Film size={24} className="text-flownexa-lime" />
              ) : (
                <FileText size={24} className="text-blue-400" />
              )}
            </div>

            <div className="text-left">
              <p className="font-bold text-[10px] text-white truncate max-w-full" title={item.name}>
                {item.name}
              </p>
              <p className="text-[9px] text-muted-foreground mt-0.5">{item.size}</p>
            </div>

            {/* Hover Actions */}
            <button
              onClick={() => handleRemove(item.id)}
              className="absolute top-2 right-2 size-6 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Delete File"
            >
              <Trash2 size={10} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

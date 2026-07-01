"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RichTextEditor from "@/components/shared/RichTextEditor";
import MediaUploader from "@/components/shared/MediaUploader";
import { toast } from "sonner";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function WriteBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Acoustics & Audio");
  const [content, setContent] = useState("");
  const [scheduler, setScheduler] = useState("");

  const handlePublish = () => {
    if (!title || !content) {
      toast.error("Validation Failed", { description: "Please enter article title and content." });
      return;
    }
    toast.success("Article Dispatched", {
      description: `Successfully published: "${title}" to category: ${category}.`,
    });
    router.push("/content/blogs");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <Link href="/content/blogs">
          <Button variant="outline" size="sm" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs gap-1.5 cursor-pointer">
            <ArrowLeft size={14} />
            Back to Articles
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold font-heading text-white">Write Blog Article</h1>
        <p className="text-xs text-muted-foreground">Draft your content, schedule publish dates, and upload header illustrations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-5 bg-flownexa-surface border border-white/5 p-6 rounded-3xl">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title" className="text-xs font-semibold text-white">Article Title*</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Acoustics Tuning on Sequoia Pro"
              className="bg-[#1A1D26] border-white/5 text-xs h-10"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-white">Article Content*</Label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>
        </div>

        {/* Configurations (1/3 width) */}
        <div className="flex flex-col gap-6">
          <div className="bg-flownexa-surface border border-white/5 p-6 rounded-3xl flex flex-col gap-4">
            <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2">Article Configs</h3>
            
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-white">Category Folder</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-[#1A1D26] border-white/5 text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1D26] border border-white/5 text-white text-xs font-sans">
                  <SelectItem value="Acoustics & Audio">Acoustics & Audio</SelectItem>
                  <SelectItem value="Smart Devices">Smart Devices</SelectItem>
                  <SelectItem value="Tech Trends">Tech Trends</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="scheduler" className="text-xs font-semibold text-white">Auto Publish Schedule</Label>
              <Input
                id="scheduler"
                type="datetime-local"
                value={scheduler}
                onChange={(e) => setScheduler(e.target.value)}
                className="bg-[#1A1D26] border-white/5 text-xs h-9"
              />
            </div>

            <Button
              onClick={handlePublish}
              className="w-full rounded-xl bg-flownexa-lime text-flownexa-black font-semibold text-xs h-10 gap-1.5 cursor-pointer mt-2"
            >
              <Send size={14} />
              Publish Article
            </Button>
          </div>

          <div className="bg-flownexa-surface border border-white/5 p-6 rounded-3xl flex flex-col gap-3">
            <Label className="text-xs font-semibold text-white">Header Banner Media</Label>
            <MediaUploader maxFiles={1} />
          </div>
        </div>
      </div>
    </div>
  );
}

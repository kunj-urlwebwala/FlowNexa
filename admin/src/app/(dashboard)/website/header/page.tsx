"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function HeaderConfigPage() {
  const [announcementText, setAnnouncementText] = useState("Get 10% off your first order with code FLOWNEXA10. Free shipping over $50!");
  const [announcementUrl, setAnnouncementUrl] = useState("/shop");

  const handleSave = () => {
    toast.success("Header config saved", {
      description: "Successfully updated navigation header announcement bar details.",
    });
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex flex-col gap-1 select-none">
        <h1 className="text-2xl font-bold font-heading text-white">Header & Announcement Setup</h1>
        <p className="text-xs text-muted-foreground">Configure storefront top announcement bars, banner tags, and menu link routes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl">
            <CardContent className="p-6 flex flex-col gap-4">
              <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2">Announcement Bar</h3>
              
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="announcementText" className="text-xs font-semibold text-white">Bar Message Text</Label>
                <Input
                  id="announcementText"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="bg-[#1A1D26] border-white/5 text-xs h-10"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="announcementUrl" className="text-xs font-semibold text-white">Bar Click Redirect URL</Label>
                <Input
                  id="announcementUrl"
                  value={announcementUrl}
                  onChange={(e) => setAnnouncementUrl(e.target.value)}
                  className="bg-[#1A1D26] border-white/5 text-xs h-10"
                />
              </div>

              <Button
                onClick={handleSave}
                className="rounded-xl bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs h-10 gap-1.5 cursor-pointer mt-2 self-start px-5"
              >
                <Save size={14} />
                Save Announcement
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

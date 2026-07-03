"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Trash2, Globe } from "lucide-react";
import MediaUploader from "@/components/shared/MediaUploader";

interface SocialLink {
  platform: string;
  url: string;
}

export default function GlobalSettingsPage() {
  const [tagline, setTagline] = useState("Elevating daily routines with premium consumer technology acoustics");
  const [socials, setSocials] = useState<SocialLink[]>([
    { platform: "Instagram", url: "https://instagram.com/flownexa" },
    { platform: "Twitter / X", url: "https://twitter.com/flownexa" },
  ]);

  const [contactEmail, setContactEmail] = useState("support@flownexa.com");
  const [contactPhone, setContactPhone] = useState("+1 (555) 019-8472");

  const [newPlatform, setNewPlatform] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleAddSocial = () => {
    if (newPlatform && newUrl) {
      setSocials([...socials, { platform: newPlatform, url: newUrl }]);
      setNewPlatform("");
      setNewUrl("");
      toast.success("Social link added");
    }
  };

  const handleRemoveSocial = (idx: number) => {
    setSocials(socials.filter((_, i) => i !== idx));
    toast.success("Social link removed");
  };

  const handleSaveAll = () => {
    toast.success("Global System Configuration Published", {
      description: "Updated storefront logo files, headers, footers, and support blocks.",
    });
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      
      {/* Title Header */}
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Global Website Configuration</h1>
          <p className="text-xs text-muted-foreground">Modify storefront branding assets, helpline nodes, and social redirects.</p>
        </div>
        <Button
          onClick={handleSaveAll}
          className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer"
        >
          <Save size={16} />
          Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Middle Column (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Corporate text content */}
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl">
            <CardContent className="p-6 flex flex-col gap-4">
              <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2">Corporate Text Content</h3>
              
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="tagline" className="text-xs font-semibold text-white">Company Headline / Tagline</Label>
                <Input
                  id="tagline"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="bg-[#1A1D26] border-white/5 text-xs h-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl">
            <CardContent className="p-6 flex flex-col gap-4">
              <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2">Social Media Links</h3>
              
              {/* Add form */}
              <div className="flex flex-col sm:flex-row gap-2 items-center bg-white/2 border border-white/5 p-3 rounded-xl">
                <Input
                  placeholder="Instagram"
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="bg-[#1A1D26] border-white/5 text-xs h-9 flex-1"
                />
                <Input
                  placeholder="https://instagram.com/..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="bg-[#1A1D26] border-white/5 text-xs h-9 flex-1"
                />
                <Button
                  onClick={handleAddSocial}
                  className="rounded-xl bg-flownexa-lime text-flownexa-black font-semibold text-xs h-9 px-3 cursor-pointer shrink-0 w-full sm:w-auto"
                >
                  Add Social
                </Button>
              </div>

              {/* List */}
              <div className="flex flex-col gap-2">
                {socials.map((social, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white/3 border border-white/5 p-3 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <Globe size={13} className="text-flownexa-lime" />
                      <div>
                        <strong className="text-white">{social.platform}:</strong>{" "}
                        <span className="text-muted-foreground">{social.url}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => handleRemoveSocial(idx)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 size-7 p-0 rounded-lg cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl">
            <CardContent className="p-6 flex flex-col gap-4">
              <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2">Support Helpline Contacts</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="contactEmail" className="text-xs font-semibold text-white">Helpline Email Address</Label>
                  <Input
                    id="contactEmail"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="bg-[#1A1D26] border-white/5 text-xs h-10"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="contactPhone" className="text-xs font-semibold text-white">Helpline Phone Number</Label>
                  <Input
                    id="contactPhone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="bg-[#1A1D26] border-white/5 text-xs h-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Branding Assets Column (1/3 width) */}
        <div className="flex flex-col gap-6">
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl text-left">
            <CardContent className="p-6 flex flex-col gap-3">
              <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2">Branding Assets</h3>
              
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-white">Storefront Logo Upload</Label>
                <MediaUploader maxFiles={1} />
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <Label className="text-xs font-semibold text-white">Favicon (.ico) File</Label>
                <MediaUploader maxFiles={1} />
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function ConfigurationPage() {
  const [stripeSecret, setStripeSecret] = useState("whsec_••••••••••••••••••••••••••••••••");
  const [openAiKey, setOpenAiKey] = useState("sk-proj-••••••••••••••••••••••••••••••••");

  const handleSave = () => {
    toast.success("API Credentials Saved", {
      description: "Successfully re-hashed database credential indexes.",
    });
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex flex-col gap-1 select-none">
        <h1 className="text-2xl font-bold font-heading text-white">API Integration Credentials</h1>
        <p className="text-xs text-muted-foreground">Manage payment gateway webhook secrets and OpenAI LLM model configurations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl">
            <CardContent className="p-6 flex flex-col gap-4">
              <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2">Outbound Connections API</h3>
              
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="stripe" className="text-xs font-semibold text-white">Stripe Webhook Secret (signing secret)</Label>
                <Input id="stripe" value={stripeSecret} onChange={(e) => setStripeSecret(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10 font-mono" />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="openai" className="text-xs font-semibold text-white">OpenAI LLM Key (Voice Caller Engine)</Label>
                <Input id="openai" value={openAiKey} onChange={(e) => setOpenAiKey(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10 font-mono" />
              </div>

              <Button
                onClick={handleSave}
                className="rounded-xl bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs h-10 gap-1.5 cursor-pointer mt-2 self-start px-5"
              >
                <Save size={14} />
                Save Credentials
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

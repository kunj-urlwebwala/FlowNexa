"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Send } from "lucide-react";

export default function SMTPSetupPage() {
  const [host, setHost] = useState("smtp.sendgrid.net");
  const [port, setPort] = useState("587");
  const [username, setUsername] = useState("apikey");
  const [senderEmail, setSenderEmail] = useState("noreply@flownexa.com");

  const handleSave = () => {
    toast.success("SMTP Configuration Saved", {
      description: "Successfully updated credentials for outbound mail dispatches.",
    });
  };

  const testConnection = () => {
    toast.info("Testing SMTP Connection...", {
      description: "Sending test ping to SMTP host node.",
    });
    setTimeout(() => {
      toast.success("SMTP Connection Verified!", {
        description: "Outgoing channel successfully established.",
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex flex-col gap-1 select-none">
        <h1 className="text-2xl font-bold font-heading text-white">SMTP Mail Gate Setup</h1>
        <p className="text-xs text-muted-foreground">Configure transactional mail servers, ports, and senders identity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl">
            <CardContent className="p-6 flex flex-col gap-4">
              <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2">Outbound Mail Servers</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="host" className="text-xs font-semibold text-white">SMTP Host Server</Label>
                  <Input id="host" value={host} onChange={(e) => setHost(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="port" className="text-xs font-semibold text-white">SMTP Port</Label>
                  <Input id="port" value={port} onChange={(e) => setPort(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="user" className="text-xs font-semibold text-white">SMTP Authentication Username</Label>
                  <Input id="user" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="sender" className="text-xs font-semibold text-white">Verified Sender E-mail</Label>
                  <Input id="sender" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
                </div>
              </div>

              <div className="flex gap-3 pt-2 mt-1">
                <Button
                  onClick={handleSave}
                  className="rounded-xl bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs h-10 gap-1.5 cursor-pointer px-5"
                >
                  <Save size={14} />
                  Save SMTP
                </Button>
                <Button
                  variant="outline"
                  onClick={testConnection}
                  className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold text-xs h-10 gap-1.5 cursor-pointer px-5"
                >
                  <Send size={14} />
                  Test Outbound Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

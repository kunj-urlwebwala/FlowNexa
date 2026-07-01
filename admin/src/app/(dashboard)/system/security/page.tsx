"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ShieldAlert } from "lucide-react";

export default function SecurityPage() {
  const [tfa, setTfa] = useState(true);
  const [sessionLimit, setSessionLimit] = useState(true);

  const handleSave = () => {
    toast.success("Security Policies Saved successfully");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex flex-col gap-1 select-none">
        <h1 className="text-2xl font-bold font-heading text-white">System Security Policies</h1>
        <p className="text-xs text-muted-foreground">Configure multi-factor authentication (2FA) and sessions termination timers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl">
            <CardContent className="p-6 flex flex-col gap-5">
              <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2">Session Control</h3>
              
              <div className="flex items-center justify-between p-3 border border-white/5 rounded-2xl bg-white/2">
                <div className="flex flex-col gap-0.5">
                  <Label className="text-xs font-semibold text-white">Require 2FA for Super Admin Login</Label>
                  <span className="text-[10px] text-muted-foreground">Forces validation OTP pin checks on login.</span>
                </div>
                <Switch checked={tfa} onCheckedChange={setTfa} className="data-[state=checked]:bg-flownexa-lime" />
              </div>

              <div className="flex items-center justify-between p-3 border border-white/5 rounded-2xl bg-white/2">
                <div className="flex flex-col gap-0.5">
                  <Label className="text-xs font-semibold text-white">Limit Active Dashboard Sessions</Label>
                  <span className="text-[10px] text-muted-foreground">Terminates older sessions on duplicate login.</span>
                </div>
                <Switch checked={sessionLimit} onCheckedChange={setSessionLimit} className="data-[state=checked]:bg-flownexa-lime" />
              </div>

              <Button
                onClick={handleSave}
                className="rounded-xl bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs h-10 gap-1.5 cursor-pointer mt-2 self-start px-5"
              >
                Save Policies
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

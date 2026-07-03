"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, ShieldCheck } from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileSettingsPage() {
  const { user } = useAdminStore();
  const [name, setName] = useState(user?.name || "Alex Mercer");
  const [email, setEmail] = useState(user?.email || "admin@flownexa.com");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSaveProfile = () => {
    toast.success("Profile Details Updated", {
      description: "Successfully updated metadata settings for your super admin account.",
    });
  };

  const handleSavePassword = () => {
    if (!currentPassword || !newPassword) {
      toast.error("Validation Failed", { description: "Please fill in password fields." });
      return;
    }
    toast.success("Credentials Modified", {
      description: "Secure system password changed successfully.",
    });
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex flex-col gap-1 select-none">
        <h1 className="text-2xl font-bold font-heading text-white">My Profile Settings</h1>
        <p className="text-xs text-muted-foreground">Manage your admin details, email notifications, and change security passwords.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Profile details */}
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl">
            <CardContent className="p-6 flex flex-col gap-4">
              <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2">Profile Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold text-white">Display Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-white">Email Address</Label>
                  <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
                </div>
              </div>

              <Button
                onClick={handleSaveProfile}
                className="rounded-xl bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs h-10 gap-1.5 cursor-pointer mt-2 self-start px-5"
              >
                <Save size={14} />
                Save Profile
              </Button>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl">
            <CardContent className="p-6 flex flex-col gap-4">
              <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2">Change Password</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="currPass" className="text-xs font-semibold text-white">Current Password</Label>
                  <Input id="currPass" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="newPass" className="text-xs font-semibold text-white">New Password</Label>
                  <Input id="newPass" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
                </div>
              </div>

              <Button
                onClick={handleSavePassword}
                className="rounded-xl bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs h-10 gap-1.5 cursor-pointer mt-2 self-start px-5"
              >
                <Save size={14} />
                Change Password
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Right Column (1/3 width) */}
        <div className="flex flex-col gap-6">
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl text-left">
            <CardContent className="p-6 flex flex-col items-center gap-4 text-center">
              <Avatar className="size-20 rounded-2xl border border-white/10 shrink-0 shadow-md">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-flownexa-lime text-flownexa-black font-extrabold text-2xl">
                  {name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <h3 className="font-heading font-bold text-sm text-white">{name}</h3>
                <span className="text-[10px] font-extrabold text-flownexa-lime bg-flownexa-lime-muted rounded-full px-2.5 py-0.5 mt-1 inline-block uppercase tracking-wider">
                  {user?.role}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 leading-relaxed w-full text-left">
                <ShieldCheck size={14} className="shrink-0" />
                <span>Account holds Super Admin permissions. Session tokens expire in 2 hours.</span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}

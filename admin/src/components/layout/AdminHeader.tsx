"use client";

import { useAdminStore } from "@/store/adminStore";
import AdminBreadcrumb from "./AdminBreadcrumb";
import { Search, Bell, LogOut, User, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const { user, logout, setSearchOpen } = useAdminStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-white/5 bg-[#0F1117]/85 backdrop-blur-md px-6 select-none">
      
      {/* Left side: Route Title & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <AdminBreadcrumb />
      </div>

      {/* Right side: Global Actions & Profile */}
      <div className="flex items-center gap-3">
        
        {/* Search Command Palette Trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="h-9 w-52 sm:w-60 rounded-xl border border-white/5 bg-[#1A1D26] hover:bg-[#242836] px-3 flex items-center justify-between text-xs text-muted-foreground transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search size={13} className="text-muted-foreground" />
            <span>Search Control Hub...</span>
          </div>
          <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded border border-white/5 font-mono">
            ⌘K
          </span>
        </button>

        {/* AI Calling Quick Status */}
        <Link href="/ai/calling">
          <Button variant="outline" size="sm" className="hidden sm:flex h-9 rounded-xl border-white/5 bg-[#1A1D26] text-xs font-semibold hover:bg-[#242836] text-flownexa-lime gap-1.5 cursor-pointer">
            <Sparkles size={12} className="animate-pulse" />
            AI Calling Online
          </Button>
        </Link>

        {/* Notifications Icon (Mock count) */}
        <button className="relative size-9 rounded-xl border border-white/5 bg-[#1A1D26] hover:bg-[#242836] flex items-center justify-center text-muted-foreground hover:text-white transition-colors cursor-pointer">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-flownexa-lime shadow-md shadow-flownexa-lime/25" />
        </button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer">
              <Avatar className="size-9 rounded-xl border border-white/10 shrink-0">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-flownexa-lime text-flownexa-black font-extrabold text-xs">
                  {user?.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#1A1D26] border border-white/5 text-white rounded-xl p-1 font-sans">
            <DropdownMenuLabel className="flex flex-col text-left px-2.5 py-2">
              <p className="font-bold text-xs text-white">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
              <p className="text-[9px] font-extrabold text-flownexa-lime bg-flownexa-lime-muted rounded px-1.5 py-0.5 mt-1.5 self-start uppercase tracking-wider">
                {user?.role}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem
              onSelect={() => router.push("/profile")}
              className="flex items-center gap-2 px-2.5 py-2 text-xs rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
            >
              <User size={13} className="text-muted-foreground" />
              <span>My Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem
              onSelect={handleLogout}
              className="flex items-center gap-2 px-2.5 py-2 text-xs rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors"
            >
              <LogOut size={13} />
              <span>Sign Out Control Hub</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}

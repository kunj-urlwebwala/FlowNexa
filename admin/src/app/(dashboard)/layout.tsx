"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/adminStore";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminHeader from "@/components/layout/AdminHeader";
import CommandPalette from "@/components/layout/CommandPalette";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAdminStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex flex-col items-center justify-center text-white gap-3 font-sans">
        <Loader2 size={36} className="text-flownexa-lime animate-spin" />
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
          Verifying Admin Credentials...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0F1117] font-sans">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky Header */}
        <AdminHeader />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin bg-[#0F1117]">
          <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
            {children}
          </div>
        </main>
      </div>

      {/* Search Command Dialog Overlay */}
      <CommandPalette />
    </div>
  );
}

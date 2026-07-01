"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, History, LogOut, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";

interface AccountLayoutProps {
  children: React.ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const { isAuthenticated, logout, user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="bg-flownexa-black text-white min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin size-6 rounded-full border-2 border-t-flownexa-lime border-white/10" />
      </div>
    );
  }

  const menuItems = [
    { label: "Account Profile", href: "/profile", icon: User },
    { label: "Order History", href: "/orders", icon: History },
  ];

  return (
    <div className="bg-flownexa-black text-white py-10 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar (Left Column - 3 Cols) */}
          <aside className="lg:col-span-3 bg-zinc-900 border border-white/5 rounded-3xl p-6 flex flex-col gap-6">
            <div className="flex items-center gap-3 pb-5 border-b border-white/5">
              <div className="size-11 rounded-full bg-flownexa-lime/10 border border-flownexa-lime/30 flex items-center justify-center text-flownexa-lime font-bold text-sm select-none">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm text-white truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                      isActive
                        ? "bg-flownexa-lime text-flownexa-black font-extrabold"
                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-white/5 pt-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground leading-snug px-2">
                <ShieldCheck size={12} className="text-flownexa-lime shrink-0" />
                <span>Authorized FlowNexa Access Profile</span>
              </div>
              <Button
                variant="ghost"
                onClick={logout}
                className="w-full gap-3 px-4 justify-start rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-400 font-semibold text-xs uppercase tracking-wider h-11"
              >
                <LogOut size={16} />
                Log Out
              </Button>
            </div>
          </aside>

          {/* Account Page Content (Right Column - 9 Cols) */}
          <main className="lg:col-span-9">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}

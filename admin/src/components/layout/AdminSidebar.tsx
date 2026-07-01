"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "@/store/adminStore";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  FolderTree,
  Warehouse,
  Wallet,
  Contact2,
  Newspaper,
  Settings2,
  Megaphone,
  Bot,
  Settings,
  Plus,
  ChevronDown,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface SidebarItem {
  label: string;
  icon: any;
  href?: string;
  subItems?: { label: string; href: string }[];
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const { sidebarExpanded, setSidebarExpanded, user, logout } = useAdminStore();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const isExpanded = sidebarExpanded;

  const menuItems: SidebarItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/" },
    { label: "Users", icon: Users, href: "/users" },
    {
      label: "Orders",
      icon: ShoppingCart,
      subItems: [
        { label: "Orders List", href: "/orders" },
        { label: "Returns", href: "/orders/returns" },
        { label: "Refunds", href: "/orders/refunds" },
        { label: "Cancel Reasons", href: "/orders/cancel-reasons" },
      ],
    },
    {
      label: "Catalog",
      icon: FolderTree,
      subItems: [
        { label: "Products", href: "/catalog/products" },
        { label: "Categories", href: "/catalog/categories" },
        { label: "Sub Categories", href: "/catalog/subcategories" },
        { label: "Brands", href: "/catalog/brands" },
      ],
    },
    {
      label: "Inventory",
      icon: Warehouse,
      subItems: [
        { label: "Inventory Dashboard", href: "/inventory" },
        { label: "Product Stocks", href: "/inventory/stocks" },
        { label: "Stock Ledger", href: "/inventory/ledger" },
        { label: "Stock Audit", href: "/inventory/audit" },
        { label: "Restock Requests", href: "/inventory/restock" },
        { label: "Damaged Stock", href: "/inventory/damaged" },
        { label: "Warehouses", href: "/warehouses" },
      ],
    },
    {
      label: "Finance",
      icon: Wallet,
      subItems: [
        { label: "Wallet Balance", href: "/finance/wallet" },
        { label: "Expenses", href: "/finance/expenses" },
        { label: "Bank Accounts", href: "/finance/bank-accounts" },
        { label: "Financial Reports", href: "/finance/reports" },
      ],
    },
    {
      label: "CRM",
      icon: Contact2,
      subItems: [
        { label: "Leads Pipeline", href: "/crm/leads" },
        { label: "Geographic Areas", href: "/crm/areas" },
        { label: "Contact Requests", href: "/crm/contact-requests" },
      ],
    },
    {
      label: "Content CMS",
      icon: Newspaper,
      subItems: [
        { label: "Blogs", href: "/content/blogs" },
        { label: "Blog Categories", href: "/content/blog-categories" },
        { label: "Testimonials", href: "/content/testimonials" },
        { label: "Media Library", href: "/content/media" },
        { label: "FAQ Setup", href: "/content/faq" },
      ],
    },
    {
      label: "Website CMS",
      icon: Settings2,
      subItems: [
        { label: "Dynamic Pages", href: "/website/pages" },
        { label: "SEO Management", href: "/website/seo" },
        { label: "Header Configuration", href: "/website/header" },
        { label: "Footer Configuration", href: "/website/footer" },
        { label: "Banner Slideshow", href: "/website/banners" },
        { label: "Global Settings", href: "/website/settings" },
      ],
    },
    {
      label: "Marketing",
      icon: Megaphone,
      subItems: [
        { label: "Coupons", href: "/marketing/coupons" },
        { label: "Email Templates", href: "/marketing/email-templates" },
        { label: "SMTP Setup", href: "/marketing/smtp" },
        { label: "Newsletter Subscribers", href: "/marketing/newsletter" },
      ],
    },
    {
      label: "AI Modules",
      icon: Bot,
      subItems: [
        { label: "AI Calling Agent", href: "/ai/calling" },
        { label: "AI Assistant", href: "/ai/assistant" },
        { label: "AI Sales Reports", href: "/ai/reports" },
      ],
    },
    {
      label: "System",
      icon: Settings,
      subItems: [
        { label: "Team Management", href: "/system/team" },
        { label: "Roles & Permissions", href: "/system/roles" },
        { label: "Activity Logs", href: "/system/activity-logs" },
        { label: "Security Policies", href: "/system/security" },
        { label: "Backups", href: "/system/backup" },
        { label: "API Configuration", href: "/system/configuration" },
      ],
    },
  ];

  const toggleSubmenu = (label: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isRouteActive = (item: SidebarItem) => {
    if (item.href === pathname) return true;
    if (item.subItems) {
      return item.subItems.some((sub) => sub.href === pathname);
    }
    return false;
  };

  return (
    <motion.aside
      className="bg-flownexa-surface border-r border-white/5 h-screen sticky top-0 flex flex-col justify-between select-none z-50 shrink-0 relative"
      animate={{ width: isExpanded ? 280 : 72 }}
      transition={{ type: "spring", stiffness: 200, damping: 28, mass: 0.8 }}
    >
      {/* Floating Border Toggle Button */}
      <button
        onClick={() => {
          setSidebarExpanded(!sidebarExpanded);
          if (sidebarExpanded) {
            setExpandedMenus({});
          }
        }}
        className="absolute -right-3 top-6 size-6 rounded-full border border-white/10 bg-zinc-900 hover:bg-flownexa-lime text-muted-foreground hover:text-flownexa-black flex items-center justify-center shadow-lg cursor-pointer z-50 transition-colors"
        title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        <ChevronRight size={12} className={cn("transition-transform duration-300", isExpanded && "rotate-180")} />
      </button>

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header Logo */}
        <div className={cn("p-4 flex items-center gap-3 border-b border-white/5", isExpanded ? "justify-start" : "justify-center")}>
          <Link href="/" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-flownexa-lime flex items-center justify-center font-heading font-black text-flownexa-black text-lg shadow-lg shadow-flownexa-lime/20 shrink-0">
              N
            </div>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-heading font-black tracking-tight text-white text-base"
              >
                FLOW<span className="text-flownexa-lime">NEXA</span> HUB
              </motion.span>
            )}
          </Link>
        </div>

        {/* Quick Launch Plus Button */}
        <div className="p-3">
          {isExpanded ? (
            <button className="w-full h-10 rounded-xl bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black flex items-center justify-center gap-2 font-semibold text-xs transition-colors shadow-lg shadow-flownexa-lime/10 cursor-pointer">
              <Plus size={16} />
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
              >Create New Scenario</motion.span>
            </button>
          ) : (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button className="w-full aspect-square rounded-xl bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black flex items-center justify-center transition-colors shadow-lg shadow-flownexa-lime/10 cursor-pointer">
                  <Plus size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-zinc-950 border border-white/10 text-white font-semibold text-xs">
                Create New Scenario
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 scrollbar-thin flex flex-col gap-1.5">
          {menuItems.map((item, index) => {
            const active = isRouteActive(item);
            const submenuExpanded = !!expandedMenus[item.label];

            if (item.subItems) {
              return (
                <div key={index} className="flex flex-col gap-0.5">
                  {isExpanded ? (
                    <div>
                      <button
                        onClick={() => toggleSubmenu(item.label)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-colors cursor-pointer",
                          active
                            ? "bg-flownexa-lime-muted text-flownexa-lime border-l-2 border-flownexa-lime"
                            : "text-muted-foreground hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <item.icon size={16} className={active ? "text-flownexa-lime" : "text-muted-foreground"} />
                          <motion.span
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.12 }}
                          >{item.label}</motion.span>
                        </div>
                        <ChevronDown size={12} className={cn("transition-transform duration-200", submenuExpanded && "rotate-180")} />
                      </button>

                      <AnimatePresence>
                        {submenuExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-col pl-9 pr-2 mt-0.5 overflow-hidden"
                          >
                            {item.subItems.map((sub, sIdx) => {
                              const subActive = pathname === sub.href;
                              return (
                                <Link
                                  key={sIdx}
                                  href={sub.href}
                                  className={cn(
                                    "py-2 font-medium text-[11px] transition-colors border-l border-white/5 pl-3",
                                    subActive ? "text-flownexa-lime border-flownexa-lime font-bold" : "text-muted-foreground hover:text-white hover:border-white/20"
                                  )}
                                >
                                  <motion.span
                                    initial={{ opacity: 0, x: -6 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -6 }}
                                    transition={{ duration: 0.1 }}
                                  >{sub.label}</motion.span>
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Tooltip key={index} delayDuration={0}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => {
                            setSidebarExpanded(true);
                            toggleSubmenu(item.label);
                          }}
                          className={cn(
                            "w-full aspect-square flex items-center justify-center rounded-xl transition-colors cursor-pointer",
                            active ? "bg-flownexa-lime-muted text-flownexa-lime" : "text-muted-foreground hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <item.icon size={18} className={active ? "text-flownexa-lime" : "text-muted-foreground"} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-zinc-950 border border-white/10 text-white font-semibold text-xs">
                        {item.label} (Click to expand sub-menu)
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              );
            }

            // Normal link
            return (
              <div key={index}>
                {isExpanded ? (
                  <Link
                    href={item.href || "/"}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium text-xs transition-colors",
                      active
                        ? "bg-flownexa-lime-muted text-flownexa-lime border-l-2 border-flownexa-lime"
                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <item.icon size={16} className={active ? "text-flownexa-lime" : "text-muted-foreground"} />
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.12 }}
                    >{item.label}</motion.span>
                  </Link>
                ) : (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href || "/"}
                        className={cn(
                          "w-full aspect-square flex items-center justify-center rounded-xl transition-colors",
                          active ? "bg-flownexa-lime-muted text-flownexa-lime" : "text-muted-foreground hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <item.icon size={18} className={active ? "text-flownexa-lime" : "text-muted-foreground"} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-zinc-950 border border-white/10 text-white font-semibold text-xs">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* User profile & exit at bottom */}
      <div className="p-3 border-t border-white/5 bg-zinc-950/20">
        {isExpanded ? (
          <div className="flex items-center justify-between gap-2.5">
            <Link href="/profile" className="flex items-center gap-2.5 group overflow-hidden">
              <Avatar className="size-8 rounded-lg shrink-0 border border-white/10">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-flownexa-lime text-flownexa-black font-extrabold text-xs">
                  {user?.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col text-left overflow-hidden"
              >
                <p className="font-bold text-xs text-white group-hover:text-flownexa-lime transition-colors truncate">
                  {user?.name}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.role}</p>
              </motion.div>
            </Link>

            <button
              onClick={logout}
              className="size-7 rounded-md hover:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-red-400 transition-colors cursor-pointer shrink-0"
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link href="/profile" className="w-full flex justify-center">
                <Avatar className="size-8 rounded-lg border border-white/10 hover:border-flownexa-lime transition-colors">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-flownexa-lime text-flownexa-black font-extrabold text-xs">
                    {user?.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-zinc-950 border border-white/10 text-white font-semibold text-xs flex flex-col gap-0.5">
              <span>{user?.name}</span>
              <span className="text-[10px] text-muted-foreground">{user?.role}</span>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </motion.aside>
  );
}

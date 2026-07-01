"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { LogIn, LogOut, User, Heart, ShoppingBag, Home, Info, HelpCircle, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MobileMenu() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { isAuthenticated, logout, user } = useAuthStore();
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop Products", href: "/products", icon: ShoppingBag },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
    { label: "About Us", href: "/about", icon: Info },
    { label: "Contact", href: "/contact", icon: PhoneCall },
    { label: "FAQ", href: "/faq", icon: HelpCircle },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] bg-flownexa-black text-white border-r border-white/10 flex flex-col p-6">
        <SheetHeader className="pb-6 border-b border-white/10">
          <SheetTitle className="text-left text-flownexa-lime font-heading font-bold text-xl">
            FlowNexa
          </SheetTitle>
        </SheetHeader>

        {/* User Info Header */}
        {isAuthenticated && user ? (
          <div className="py-6 border-b border-white/10 flex items-center gap-3">
            <div className="size-10 rounded-full bg-flownexa-lime/20 border border-flownexa-lime/50 flex items-center justify-center text-flownexa-lime font-bold text-sm">
              {user.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        ) : null}

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-1.5 py-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-flownexa-lime text-flownexa-black font-semibold"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth Section Footer */}
        <div className="pt-6 border-t border-white/10 mt-auto">
          {isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <Link href="/profile" onClick={handleLinkClick} className="w-full">
                <Button variant="outline" className="w-full gap-2 justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white border-white/10">
                  <User size={16} />
                  My Account
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={() => {
                  logout();
                  handleLinkClick();
                }}
                className="w-full gap-2 justify-center rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-400"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" onClick={handleLinkClick} className="w-full">
                <Button className="w-full gap-2 justify-center rounded-xl bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover">
                  <LogIn size={16} />
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={handleLinkClick} className="w-full">
                <Button variant="outline" className="w-full justify-center rounded-xl bg-transparent hover:bg-white/5 text-white border-white/10">
                  Create Account
                </Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

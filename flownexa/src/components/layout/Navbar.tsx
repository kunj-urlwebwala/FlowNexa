"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingCart, User, Menu, LogOut, Settings, History } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import Logo from "@/components/shared/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { toggleCart, toggleSearch, toggleMobileMenu } = useUIStore();
  const { cart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { isAuthenticated, logout, user, fetchProfile } = useAuthStore();

  const totalCartItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlistItems = wishlistItems.length;

  // Load user profile on session load
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Scroll listener for sticky styles
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Shop", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-flownexa-black/85 backdrop-blur-md py-3 shadow-lg shadow-black/10 border-b border-white/5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left Side: Mobile Menu Button & Logo */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="md:hidden size-9 rounded-full text-white hover:bg-white/10"
            aria-label="Toggle mobile menu"
          >
            <Menu size={20} />
          </Button>
          <Logo />
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors relative py-1.5 ${
                  isActive
                    ? "text-flownexa-lime font-semibold"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-flownexa-lime rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Action Icons */}
        <div className="flex items-center gap-2 md:gap-3.5">
          {/* Search Trigger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSearch}
            className="size-9 rounded-full text-white hover:bg-white/10"
            aria-label="Search products"
            title="Search (Cmd+K)"
          >
            <Search size={19} />
          </Button>

          {/* Wishlist Trigger */}
          <Link href="/wishlist">
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-full text-white hover:bg-white/10 relative"
              aria-label="View wishlist"
            >
              <Heart size={19} />
              {totalWishlistItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-flownexa-lime text-flownexa-black font-extrabold text-[10px] size-5 rounded-full flex items-center justify-center border-2 border-flownexa-black animate-scale-pop">
                  {totalWishlistItems}
                </span>
              )}
            </Button>
          </Link>

          {/* Cart Trigger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCart}
            className="size-9 rounded-full text-white hover:bg-white/10 relative"
            aria-label="View cart"
          >
            <ShoppingCart size={19} />
            {totalCartItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-flownexa-lime text-flownexa-black font-extrabold text-[10px] size-5 rounded-full flex items-center justify-center border-2 border-flownexa-black animate-scale-pop">
                {totalCartItems}
              </span>
            )}
          </Button>

          {/* Profile Dropdown or Login Button */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="size-9 rounded-full border border-flownexa-lime/30 bg-flownexa-lime/10 hover:border-flownexa-lime/60 flex items-center justify-center text-flownexa-lime font-bold text-xs select-none transition-all outline-none">
                  {user.name.split(" ").map((n) => n[0]).join("")}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2 bg-flownexa-black border border-white/10 text-white rounded-xl font-sans" align="end">
                <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                  My Profile
                </DropdownMenuLabel>
                <div className="px-3 py-2 border-b border-white/5 flex flex-col">
                  <span className="text-sm font-semibold text-white">{user.name}</span>
                  <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                </div>
                <DropdownMenuSeparator className="bg-white/5" />
                <Link href="/profile">
                  <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/5 cursor-pointer text-sm">
                    <User size={16} className="text-muted-foreground" />
                    Account Details
                  </DropdownMenuItem>
                </Link>
                <Link href="/orders">
                  <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/5 cursor-pointer text-sm">
                    <History size={16} className="text-muted-foreground" />
                    Order History
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-400 cursor-pointer text-sm"
                >
                  <LogOut size={16} />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="hidden sm:block">
              <Button className="rounded-full h-9 px-4 text-xs font-semibold bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

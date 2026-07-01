"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/store/uiStore";
import { products } from "@/data/products";
import { Product } from "@/types/product";
import { Search, Compass, AudioWaveform, Tag } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export default function SearchDialog() {
  const { isSearchOpen, setSearchOpen } = useUIStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const router = useRouter();

  // Search logic
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered.slice(0, 5));
  }, [query]);

  // Handle keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isSearchOpen, setSearchOpen]);

  const handleSelectProduct = (slug: string) => {
    setSearchOpen(false);
    setQuery("");
    router.push(`/products/${slug}`);
  };

  const handleSelectCategory = (category: string) => {
    setSearchOpen(false);
    setQuery("");
    router.push(`/products?category=${category}`);
  };

  return (
    <CommandDialog open={isSearchOpen} onOpenChange={setSearchOpen}>
      <Command className="bg-flownexa-black text-white border border-white/10 rounded-xl overflow-hidden font-sans">
        <CommandInput
          placeholder="Search products, brands or categories... (Type e.g., Audio)"
          value={query}
          onValueChange={setQuery}
          className="border-none focus:ring-0 text-white placeholder-muted-foreground py-3"
        />
        <CommandList className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin">
          <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
            No products found matching your search.
          </CommandEmpty>

          {results.length > 0 && (
            <CommandGroup heading="Products Found" className="text-muted-foreground text-xs font-semibold px-2 py-1.5">
              {results.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name}
                  onSelect={() => handleSelectProduct(product.slug)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 text-white text-sm cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="size-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-white">{product.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
                    </div>
                  </div>
                  <span className="text-flownexa-lime font-semibold text-xs">
                    ${product.price}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!query && (
            <>
              <CommandGroup heading="Popular Categories" className="text-muted-foreground text-xs font-semibold px-2 py-1.5">
                <CommandItem
                  value="audio"
                  onSelect={() => handleSelectCategory("audio")}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-white text-sm cursor-pointer transition-colors"
                >
                  <AudioWaveform size={16} className="text-flownexa-lime" />
                  <span>Audio & Acoustics</span>
                </CommandItem>
                <CommandItem
                  value="wearables"
                  onSelect={() => handleSelectCategory("wearables")}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-white text-sm cursor-pointer transition-colors"
                >
                  <Compass size={16} className="text-flownexa-lime" />
                  <span>Smart Wearables</span>
                </CommandItem>
                <CommandItem
                  value="accessories"
                  onSelect={() => handleSelectCategory("accessories")}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-white text-sm cursor-pointer transition-colors"
                >
                  <Tag size={16} className="text-flownexa-lime" />
                  <span>Tech Accessories</span>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator className="bg-white/10 my-2" />

              <CommandGroup heading="Quick Links" className="text-muted-foreground text-xs font-semibold px-2 py-1.5">
                <CommandItem
                  value="all products"
                  onSelect={() => {
                    setSearchOpen(false);
                    router.push("/products");
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-white text-sm cursor-pointer transition-colors"
                >
                  <Search size={16} className="text-muted-foreground" />
                  <span>View All Products</span>
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

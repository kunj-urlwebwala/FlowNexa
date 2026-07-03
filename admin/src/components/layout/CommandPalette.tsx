"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/adminStore";
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
import {
  Plus,
  ShoppingCart,
  Users,
  Warehouse,
  Wallet,
  Settings,
  Bot,
  Newspaper,
} from "lucide-react";

export default function CommandPalette() {
  const router = useRouter();
  const { searchOpen, setSearchOpen } = useAdminStore();

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [searchOpen, setSearchOpen]);

  const runCommand = (action: () => void) => {
    setSearchOpen(false);
    action();
  };

  return (
    <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
      <Command className="bg-[#1A1D26] text-white border border-white/5 rounded-xl overflow-hidden font-sans">
        <CommandInput
          placeholder="Type a command or search all modules... (⌘K)"
          className="border-none focus:ring-0 text-white placeholder-muted-foreground py-3 bg-[#1A1D26]"
        />
        <CommandList className="max-h-[350px] overflow-y-auto p-2 scrollbar-thin">
          <CommandEmpty className="py-6 text-center text-xs text-muted-foreground">
            No matching admin commands found.
          </CommandEmpty>

          <CommandGroup heading="Quick Actions" className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider px-2">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/catalog/products/create"))}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-white text-xs cursor-pointer transition-colors"
            >
              <Plus size={14} className="text-flownexa-lime" />
              <span>Create New Product</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/orders"))}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-white text-xs cursor-pointer transition-colors"
            >
              <ShoppingCart size={14} className="text-flownexa-lime" />
              <span>Process Pending Orders</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/content/blogs/create"))}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-white text-xs cursor-pointer transition-colors"
            >
              <Newspaper size={14} className="text-flownexa-lime" />
              <span>Write Blog Post</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator className="bg-white/5 my-2" />

          <CommandGroup heading="Modules navigation" className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider px-2">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/users"))}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-white text-xs cursor-pointer transition-colors"
            >
              <Users size={14} />
              <span>Users Manager</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/inventory"))}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-white text-xs cursor-pointer transition-colors"
            >
              <Warehouse size={14} />
              <span>Inventory & Warehouses</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/finance/wallet"))}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-white text-xs cursor-pointer transition-colors"
            >
              <Wallet size={14} />
              <span>Finance & Ledger</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/website/settings"))}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-white text-xs cursor-pointer transition-colors"
            >
              <Settings size={14} />
              <span>Global Website Configuration</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/ai/assistant"))}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-white text-xs cursor-pointer transition-colors"
            >
              <Bot size={14} className="text-flownexa-lime" />
              <span>AI Chat Assistant</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    { path: "./fonts/inter-100.ttf", weight: "100", style: "normal" },
    { path: "./fonts/inter-200.ttf", weight: "200", style: "normal" },
    { path: "./fonts/inter-300.ttf", weight: "300", style: "normal" },
    { path: "./fonts/inter-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/inter-500.ttf", weight: "500", style: "normal" },
    { path: "./fonts/inter-600.ttf", weight: "600", style: "normal" },
    { path: "./fonts/inter-700.ttf", weight: "700", style: "normal" },
    { path: "./fonts/inter-800.ttf", weight: "800", style: "normal" },
    { path: "./fonts/inter-900.ttf", weight: "900", style: "normal" },
  ],
});

const outfit = localFont({
  variable: "--font-heading",
  display: "swap",
  src: [
    { path: "./fonts/outfit-100.ttf", weight: "100", style: "normal" },
    { path: "./fonts/outfit-200.ttf", weight: "200", style: "normal" },
    { path: "./fonts/outfit-300.ttf", weight: "300", style: "normal" },
    { path: "./fonts/outfit-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/outfit-500.ttf", weight: "500", style: "normal" },
    { path: "./fonts/outfit-600.ttf", weight: "600", style: "normal" },
    { path: "./fonts/outfit-700.ttf", weight: "700", style: "normal" },
    { path: "./fonts/outfit-800.ttf", weight: "800", style: "normal" },
    { path: "./fonts/outfit-900.ttf", weight: "900", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "FlowNexa — Premium E-Commerce Platform",
  description: "Discover premium audio, wearables, and tech accessories designed to elevate your daily routine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <TooltipProvider>
          {children}
          <Toaster position="bottom-right" closeButton theme="dark" />
        </TooltipProvider>
      </body>
    </html>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight, Play, Sparkles, Twitter, Instagram, Linkedin, Github } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const popularColors = [
    { hex: "#3B82F6", label: "Royal Blue" },
    { hex: "#F97316", label: "Sunset Orange" },
    { hex: "#22C55E", label: "Neon Green" },
    { hex: "#EF4444", label: "Crimson Red" },
    { hex: "#06B6D4", label: "Cyan Blue" },
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  return (
    <section className="relative bg-flownexa-black text-white min-h-[calc(100vh-4rem)] flex items-center overflow-hidden py-12 lg:py-20 font-sans">
      {/* Background Decorative Mesh Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] size-[500px] rounded-full bg-flownexa-lime/20 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] size-[600px] rounded-full bg-blue-500/10 blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column (5 Cols) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex flex-col items-start gap-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-flownexa-lime text-xs font-semibold">
            <Sparkles size={12} fill="currentColor" />
            <span>Music Is Classic</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-[1.05] text-white">
            Sequoia <br />
            Inspiring <br />
            <span className="text-flownexa-lime">Musico.</span>
          </h1>

          <div className="flex items-center gap-4 py-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white">01</span>
            <div className="h-px w-12 bg-white/20" />
            <div className="max-w-[280px]">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Clear Sounds</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Making your dream music come true, stay with Sequoia Sounds.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Link href="/products/sequoia-inspiring-musico-pro">
              <Button className="rounded-full px-6 py-5 text-sm font-semibold bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover shadow-lg shadow-flownexa-lime/20 flex items-center gap-2 group">
                View All Products
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="rounded-full px-6 py-5 text-sm font-semibold border-white/10 bg-white/5 text-white hover:bg-white/10 flex items-center gap-2"
            >
              <span className="size-6 rounded-full bg-flownexa-lime flex items-center justify-center text-flownexa-black shrink-0">
                <Play size={10} fill="currentColor" className="ml-0.5" />
              </span>
              Play Video
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/10 w-full text-xs text-muted-foreground">
            <span>Follow us on:</span>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    <Icon size={14} />
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Center Column: Product Image (4 Cols) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-4 flex justify-center relative select-none"
        >
          {/* Circular Ambient Glow Backdrop */}
          <div className="absolute inset-0 m-auto size-[280px] sm:size-[340px] rounded-full bg-blue-500/10 border border-blue-500/20 blur-xl animate-pulse" />

          {/* Floating Product Image Container */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-10 w-[240px] sm:w-[320px] aspect-square flex items-center justify-center cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/products/headphones.png"
              alt="Sequoia Headphones"
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_25px_35px_rgba(59,130,246,0.3)] hover:scale-105 transition-transform duration-500"
            />
          </motion.div>

          {/* Decorative floating dots */}
          <div className="absolute top-10 left-10 size-2.5 rounded-full bg-white/20 animate-ping" />
          <div className="absolute bottom-20 right-10 size-1.5 rounded-full bg-flownexa-lime/40 animate-ping" />
        </motion.div>

        {/* Right Column (3 Cols) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-3 flex flex-col gap-6"
        >
          {/* Color Selection Block */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3.5">
              Popular Colors
            </h3>
            <div className="flex items-center gap-2.5">
              {popularColors.map((color) => (
                <button
                  key={color.hex}
                  className="size-6 rounded-full border border-white/20 p-0.5 hover:scale-110 hover:border-white transition-all cursor-pointer"
                  title={color.label}
                >
                  <span
                    className="size-full rounded-full block"
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Feature: Mini cards (recreating the design look) */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              New Gen Release
            </h3>

            {/* Item 1: Orizon VR */}
            <Link
              href="/products/flownexa-orizon-vr"
              className="group flex gap-3.5 items-center p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all"
            >
              <div className="size-14 rounded-lg bg-white/5 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/products/vr-headset.png"
                  alt="VR Headset"
                  className="size-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-xs text-white truncate group-hover:text-flownexa-lime transition-colors">
                  Orizon VR Headset
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Explore Virtual Space</p>
              </div>
            </Link>

            {/* Item 2: X-Buds Pro */}
            <Link
              href="/products/aural-x-buds-pro"
              className="group flex gap-3.5 items-center p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all"
            >
              <div className="size-14 rounded-lg bg-white/5 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/products/earbuds.png"
                  alt="Earbuds"
                  className="size-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-xs text-white truncate group-hover:text-flownexa-lime transition-colors">
                  Aural X-Buds Pro
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Dual-Driver Acoustics</p>
              </div>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

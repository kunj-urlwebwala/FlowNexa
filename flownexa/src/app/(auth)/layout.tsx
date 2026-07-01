"use client";

import Logo from "@/components/shared/Logo";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-flownexa-black text-white flex font-sans overflow-hidden">
      
      {/* Left Panel: Brand Promo (Hidden on mobile) (40%) */}
      <div className="hidden lg:flex lg:w-[42%] bg-flownexa-black border-r border-white/5 flex-col justify-between p-12 relative select-none">
        
        {/* Animated Background Mesh Glow */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] size-[400px] rounded-full bg-flownexa-lime/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] size-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
        </div>

        {/* Header Logo */}
        <div className="relative z-10">
          <Logo theme="dark" />
        </div>

        {/* Center Taglines & Copy (inspired by reference look) */}
        <div className="relative z-10 my-auto flex flex-col gap-6 max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-flownexa-lime text-xs font-semibold self-start"
          >
            <Sparkles size={12} fill="currentColor" />
            <span>Simplify management & shopping</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold font-heading text-white leading-tight"
          >
            Simplify shopping with our dashboard.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-muted-foreground leading-relaxed"
          >
            Discover premium audio, smart wearables, and tech accessories with our user-friendly, state-of-the-art interface.
          </motion.p>

          {/* Storyset "Bro" Style SVG Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-[340px] aspect-[4/3] relative mt-2 select-none"
          >
            <svg
              viewBox="0 0 400 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-full filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
            >
              {/* Circular spotlight backdrop */}
              <circle cx="200" cy="150" r="110" fill="#E1FF4B" fillOpacity="0.08" />
              <circle cx="200" cy="150" r="85" fill="#E1FF4B" fillOpacity="0.05" />

              {/* Grid lines (abstract graph background) */}
              <line x1="90" y1="200" x2="310" y2="200" stroke="#FFFFFF" strokeOpacity="0.1" strokeWidth="2" />
              <line x1="90" y1="160" x2="310" y2="160" stroke="#FFFFFF" strokeOpacity="0.05" strokeWidth="1.5" />
              <line x1="90" y1="120" x2="310" y2="120" stroke="#FFFFFF" strokeOpacity="0.05" strokeWidth="1.5" />
              <line x1="90" y1="80" x2="310" y2="80" stroke="#FFFFFF" strokeOpacity="0.05" strokeWidth="1.5" />

              {/* Dashboard Chart Screen */}
              <rect x="110" y="60" width="180" height="120" rx="12" fill="#1A1D26" stroke="#FFFFFF" strokeOpacity="0.15" strokeWidth="2" />
              {/* Screen Top Bar */}
              <rect x="110" y="60" width="180" height="18" rx="6" fill="#0F1117" />
              <circle cx="124" cy="69" r="3" fill="#EF4444" />
              <circle cx="134" cy="69" r="3" fill="#F59E0B" />
              <circle cx="144" cy="69" r="3" fill="#22C55E" />
              
              {/* Inside Dashboard Content - Sales Chart */}
              <path
                d="M125 150 C 145 130, 160 145, 185 115 C 205 90, 225 120, 245 95 C 260 80, 270 90, 280 80"
                stroke="#E1FF4B"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M125 150 C 145 130, 160 145, 185 115 C 205 90, 225 120, 245 95 C 260 80, 270 90, 280 80 L 280 160 L 125 160 Z"
                fill="url(#chart-grad)"
                fillOpacity="0.15"
              />

              {/* Dashboard Stand */}
              <path d="M185 180 L 175 220 L 225 220 L 215 180 Z" fill="#0F1117" stroke="#FFFFFF" strokeOpacity="0.1" />
              <rect x="160" y="220" width="80" height="6" rx="3" fill="#0F1117" />

              {/* Character 1 (Standing on Left - pointing at chart) */}
              {/* Legs */}
              <line x1="85" y1="200" x2="85" y2="245" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              <line x1="95" y1="200" x2="95" y2="245" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              {/* Shoes */}
              <rect x="79" y="243" width="12" height="6" rx="3" fill="#0F1117" />
              <rect x="89" y="243" width="12" height="6" rx="3" fill="#0F1117" />
              {/* Torso / Shirt (Lime color) */}
              <rect x="75" y="145" width="28" height="55" rx="8" fill="#E1FF4B" />
              {/* Head */}
              <circle cx="89" cy="125" r="11" fill="#F6F8F7" />
              {/* Hair */}
              <path d="M78 124 C 78 116, 85 112, 94 114 C 100 115, 100 124, 94 124 Z" fill="#0F1117" />
              {/* Left Arm (pointing to chart) */}
              <path d="M96 150 L 130 135" stroke="#F6F8F7" strokeWidth="3" strokeLinecap="round" />
              {/* Right Arm (resting) */}
              <path d="M76 150 L 66 175" stroke="#F6F8F7" strokeWidth="3" strokeLinecap="round" />

              {/* Character 2 (Sitting on Right - typing/holding laptop) */}
              {/* Stool / Seat */}
              <line x1="315" y1="210" x2="315" y2="250" stroke="#0F1117" strokeWidth="4" />
              <line x1="325" y1="210" x2="335" y2="250" stroke="#0F1117" strokeWidth="3" />
              <line x1="305" y1="210" x2="295" y2="250" stroke="#0F1117" strokeWidth="3" />
              <ellipse cx="315" cy="205" rx="20" ry="5" fill="#1A1D26" />
              {/* Torso / Shirt */}
              <rect x="300" y="150" width="26" height="50" rx="8" fill="#3B82F6" />
              {/* Head */}
              <circle cx="313" cy="130" r="11" fill="#F6F8F7" />
              {/* Hair / Glasses */}
              <path d="M302 128 C 302 120, 310 116, 320 118 C 324 119, 325 128, 319 128 Z" fill="#0F1117" />
              {/* Arms (holding laptop) */}
              <path d="M302 155 L 285 170 C 285 170, 298 175, 305 170" stroke="#F6F8F7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {/* Laptop floating */}
              <path d="M268 170 L 288 170 L 293 162 L 273 162 Z" fill="#FFFFFF" fillOpacity="0.2" stroke="#FFFFFF" strokeWidth="1.5" />
              {/* Legs (bent/sitting) */}
              <path d="M305 195 L 290 215 L 292 245" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

              {/* Floating product symbols */}
              {/* Headphones symbol */}
              <g transform="translate(145, 10) scale(0.6)" opacity="0.6" className="text-flownexa-lime">
                <rect x="15" y="15" width="20" height="20" rx="4" fill="none" stroke="#E1FF4B" strokeWidth="2"/>
                <path d="M10 25 C10 15, 40 15, 40 25" stroke="#E1FF4B" strokeWidth="2" fill="none" />
              </g>

              {/* VR Symbol */}
              <g transform="translate(225, 210) scale(0.6)" opacity="0.7">
                <rect x="10" y="10" width="30" height="15" rx="6" fill="#E1FF4B" />
                <path d="M15 17 L 35 17" stroke="#0F1117" strokeWidth="2" />
              </g>

              {/* Sparkles */}
              <path d="M330 50 L 333 55 L 338 56 L 333 57 L 330 62 L 327 57 L 322 56 L 327 55 Z" fill="#E1FF4B" />
              <path d="M60 100 L 62 103 L 65 104 L 62 105 L 60 108 L 58 105 L 55 104 L 58 103 Z" fill="#E1FF4B" opacity="0.5" />

              {/* Definitions for gradient */}
              <defs>
                <linearGradient id="chart-grad" x1="202.5" y1="80" x2="202.5" y2="160" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#E1FF4B" />
                  <stop offset="100%" stopColor="#E1FF4B" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={14} className="text-flownexa-lime" />
          <span>FlowNexa Secure Client Authentication</span>
        </div>
      </div>

      {/* Right Panel: Content Form Area (60% / 100% on mobile) */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-16 relative">
        {/* Background glow overlay for mobile */}
        <div className="lg:hidden absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[300px] rounded-full bg-flownexa-lime/25 blur-3xl" />
        </div>
        
        {/* Mobile Logo Header */}
        <div className="lg:hidden absolute top-8 left-8">
          <Logo />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[420px] relative z-10"
        >
          {children}
        </motion.div>
      </div>

    </div>
  );
}

"use client";

import { useAdminStore } from "@/store/adminStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAdminStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      router.push("/");
    } else {
      setLoading(false); // eslint-disable-line react-hooks/set-state-in-effect
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
    <div className="min-h-screen bg-[#0F1117] text-white flex font-sans overflow-hidden">
      {/* Left Panel: Graphic & Brand info (40% width, hidden on smaller screens) */}
      <div className="hidden lg:flex w-[40%] bg-zinc-950 border-r border-white/5 p-8 flex-col justify-between relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-[-10%] left-[-10%] size-[400px] rounded-full bg-flownexa-lime/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] size-[400px] rounded-full bg-blue-500/5 blur-[100px]" />
        </div>

        {/* Header Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-flownexa-lime flex items-center justify-center font-heading font-black text-flownexa-black text-lg shadow-lg shadow-flownexa-lime/20 shrink-0">
              N
            </div>
            <span className="font-heading font-black tracking-tight text-white text-base">
              FLOW<span className="text-flownexa-lime">NEXA</span> HUB
            </span>
          </div>
        </div>

        {/* Center Vector Illustration (Storyset Bro Style) */}
        <div className="relative z-10 my-auto flex flex-col gap-6 max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-flownexa-lime text-xs font-semibold self-start"
          >
            <Sparkles size={12} fill="currentColor" />
            <span>Admin Control Center v1.2</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-extrabold font-heading text-white leading-tight"
          >
            Manage your eCommerce with ease.
          </motion.h2>

          {/* Storyset "Bro" Style SVG Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-[340px] aspect-[4/3] relative mt-2 select-none"
          >
            <svg
              viewBox="0 0 400 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-full filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
            >
              <circle cx="200" cy="150" r="110" fill="#E1FF4B" fillOpacity="0.08" />
              <circle cx="200" cy="150" r="85" fill="#E1FF4B" fillOpacity="0.05" />

              <line x1="90" y1="200" x2="310" y2="200" stroke="#FFFFFF" strokeOpacity="0.1" strokeWidth="2" />
              <line x1="90" y1="160" x2="310" y2="160" stroke="#FFFFFF" strokeOpacity="0.05" strokeWidth="1.5" />
              <line x1="90" y1="120" x2="310" y2="120" stroke="#FFFFFF" strokeOpacity="0.05" strokeWidth="1.5" />

              {/* Server / System Rack */}
              <rect x="120" y="70" width="160" height="110" rx="12" fill="#1A1D26" stroke="#FFFFFF" strokeOpacity="0.15" strokeWidth="2" />
              <rect x="120" y="70" width="160" height="18" rx="6" fill="#0F1117" />
              <circle cx="134" cy="79" r="3" fill="#EF4444" />
              <circle cx="144" cy="79" r="3" fill="#F59E0B" />
              <circle cx="154" cy="79" r="3" fill="#22C55E" />
              
              {/* Server details */}
              <rect x="135" y="100" width="130" height="8" rx="4" fill="#E1FF4B" fillOpacity="0.3" />
              <rect x="135" y="115" width="90" height="8" rx="4" fill="#FFFFFF" fillOpacity="0.1" />
              <rect x="135" y="130" width="110" height="8" rx="4" fill="#FFFFFF" fillOpacity="0.1" />
              <rect x="135" y="145" width="70" height="8" rx="4" fill="#3B82F6" fillOpacity="0.3" />

              {/* Stand */}
              <path d="M185 180 L 175 220 L 225 220 L 215 180 Z" fill="#0F1117" stroke="#FFFFFF" strokeOpacity="0.1" />
              <rect x="160" y="220" width="80" height="6" rx="3" fill="#0F1117" />

              {/* Character 1 (Standing on Left - holding gears) */}
              <line x1="85" y1="200" x2="85" y2="245" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              <line x1="95" y1="200" x2="95" y2="245" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              <rect x="79" y="243" width="12" height="6" rx="3" fill="#0F1117" />
              <rect x="89" y="243" width="12" height="6" rx="3" fill="#0F1117" />
              <rect x="75" y="145" width="28" height="55" rx="8" fill="#E1FF4B" />
              <circle cx="89" cy="125" r="11" fill="#F6F8F7" />
              <path d="M78 124 C 78 116, 85 112, 94 114 C 100 115, 100 124, 94 124 Z" fill="#0F1117" />
              <path d="M96 150 L 125 138" stroke="#F6F8F7" strokeWidth="3" strokeLinecap="round" />
              <path d="M76 150 L 66 175" stroke="#F6F8F7" strokeWidth="3" strokeLinecap="round" />

              {/* Sparkles */}
              <path d="M310 50 L 313 55 L 318 56 L 313 57 L 310 62 L 307 57 L 302 56 L 307 55 Z" fill="#E1FF4B" />
            </svg>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={14} className="text-flownexa-lime" />
          <span>FlowNexa Secure Client Authentication</span>
        </div>
      </div>

      {/* Right Panel: Content Form Area (60% width / 100% on mobile) */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-16 relative">
        <div className="lg:hidden absolute top-8 left-8">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-flownexa-lime flex items-center justify-center font-heading font-black text-flownexa-black text-lg shrink-0 shadow-lg shadow-flownexa-lime/20">
              N
            </div>
            <span className="font-heading font-black tracking-tight text-white text-base">
              FLOW<span className="text-flownexa-lime">NEXA</span> HUB
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[400px] relative z-10"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

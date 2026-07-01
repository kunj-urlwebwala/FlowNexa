"use client";

import SectionHeader from "@/components/shared/SectionHeader";
import PageTransition from "@/components/shared/PageTransition";
import { Sparkles, Trophy, Earth, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const stats = [
    { label: "Founded In", value: "2024" },
    { label: "Global HQ", value: "San Francisco" },
    { label: "Active Users", value: "8 Million+" },
    { label: "Total Releases", value: "45+ Products" },
  ];

  return (
    <PageTransition>
      <div className="bg-flownexa-black text-white py-10 font-sans min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          
          <SectionHeader
            title="Our Story & Core"
            subtitle="Pioneering modern consumer audio and design aesthetics since inception."
            badge="About Us"
            align="center"
          />

          {/* Hero Section Banner */}
          <div className="relative bg-zinc-900 border border-white/5 rounded-3xl p-8 md:p-12 lg:p-16 overflow-hidden flex flex-col md:flex-row items-center gap-8 mb-16">
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="absolute top-[-50%] left-[-50%] size-[500px] rounded-full bg-flownexa-lime/20 blur-[100px]" />
            </div>
            
            <div className="flex-1 flex flex-col gap-4 relative z-10">
              <h2 className="text-2xl md:text-3xl font-extrabold font-heading text-white tracking-tight leading-tight">
                Engineering flow state through technology.
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                At FlowNexa, we believe tech should be organic, simple, and exceptionally powerful. We began in a small garage lab, analyzing the resonance curves of titanium acoustic shells. Today, we design premium wearables and audio gear that help millions of creators enter their peak flow state every day.
              </p>
            </div>

            <div className="size-48 sm:size-60 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden relative select-none">
              {/* Logo watermark */}
              <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                <path
                  d="M50 5C50 29.8528 29.8528 50 5 50C29.8528 50 50 70.1472 50 95C50 70.1472 70.1472 50 95 50C70.1472 50 50 29.8528 50 5Z"
                  fill="#0F1117"
                />
                <path d="M50 15C50 34.33 34.33 50 15 50" stroke="#E1FF4B" strokeWidth="6" strokeLinecap="round" />
                <path d="M50 85C50 65.67 65.67 50 85 50" stroke="#E1FF4B" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((st, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-zinc-900 border border-white/5 p-5 rounded-2xl text-center"
              >
                <p className="text-3xl font-extrabold text-flownexa-lime font-heading">{st.value}</p>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-2">{st.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Core Values pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Trophy,
                title: "Premium Engineering",
                desc: "Every component is meticulously handpicked and tested against strict acoustic and mechanical benchmarks.",
              },
              {
                icon: Earth,
                title: "Global Synergy",
                desc: "We supply our technology globally, backing it up with quick delivery networks and 24/7 service hubs.",
              },
              {
                icon: Award,
                title: "Awarded Design",
                desc: "Recognized internationally for our organic physical formats and intuitive tactile controls.",
              },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="bg-zinc-900 border border-white/5 p-6 rounded-2xl flex flex-col items-start gap-4">
                  <div className="size-10 rounded-xl bg-flownexa-lime-muted border border-flownexa-lime/20 flex items-center justify-center text-flownexa-lime shrink-0">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-heading font-bold text-base text-white">{p.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </PageTransition>
  );
}

"use client";

import { ShieldCheck, Zap, HeartHandshake, Compass } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { motion } from "framer-motion";

export default function BrandStory() {
  const pillars = [
    {
      icon: Zap,
      title: "Intelligent Engineering",
      description: "Devices designed with custom dynamic hardware built to last and outperform typical consumer standards.",
    },
    {
      icon: Compass,
      title: "Flow Design Philosophy",
      description: "Organic aesthetic forms with clean curves, premium matte coatings, and ergonomic physical frameworks.",
    },
    {
      icon: ShieldCheck,
      title: "Uncompromising Security",
      description: "From our secure shopping flows to your device's internal firmware protections, security is our default.",
    },
    {
      icon: HeartHandshake,
      title: "Direct Customer Synergy",
      description: "A full 2-year warranty on all products and 24/7 client care lines to ensure you remain satisfied.",
    },
  ];

  return (
    <section className="bg-flownexa-black py-16 lg:py-24 border-b border-white/5 font-sans relative z-10 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        
        <SectionHeader
          title="Designed for Flow"
          subtitle="At FlowNexa, we construct ecosystem-ready technology products that harmonize clean styling and acoustic power."
          badge="Philosophy"
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-zinc-900 border border-white/5 p-6 rounded-2xl hover:border-white/10 hover:bg-white/3 transition-all flex flex-col items-start gap-4"
              >
                <div className="size-10 rounded-xl bg-flownexa-lime-muted border border-flownexa-lime/20 flex items-center justify-center text-flownexa-lime shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

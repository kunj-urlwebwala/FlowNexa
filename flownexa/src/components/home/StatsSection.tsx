"use client";

import { motion } from "framer-motion";
import { Users, ShieldCheck, Truck, Star } from "lucide-react";

export default function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: "8M+",
      label: "Active Listeners & Creators",
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: Star,
      value: "4.8★",
      label: "Average Store Rating",
      color: "text-flownexa-lime bg-flownexa-lime-muted border-flownexa-lime/20",
    },
    {
      icon: Truck,
      value: "24h",
      label: "Express Shipping Guarantee",
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      icon: ShieldCheck,
      value: "2yr",
      label: "Full Manufacturer Warranty",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <section className="bg-flownexa-black py-10 border-y border-white/5 font-sans relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-center gap-3.5 bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 hover:border-white/20 hover:bg-white/8 transition-all"
              >
                <div className={`size-11 rounded-xl flex items-center justify-center border shrink-0 ${stat.color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-extrabold text-white leading-none">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 font-medium leading-tight">
                    {stat.label}
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

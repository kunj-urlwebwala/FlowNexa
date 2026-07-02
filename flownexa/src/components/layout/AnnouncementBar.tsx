"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-flownexa-black border-b border-flownexa-lime/10 text-white overflow-hidden text-xs py-2 px-4 flex items-center justify-between relative z-50 font-sans"
        >
          <div className="flex items-center gap-2 justify-center w-full">
            <Sparkles size={14} className="text-flownexa-lime animate-pulse" />
            <span>
              Get 10% off your first order with code <strong className="text-flownexa-lime font-bold">FLOWNEXA10</strong>. Free shipping over ₹500!
            </span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-muted-foreground hover:text-white transition-colors absolute right-4 p-1 rounded-full hover:bg-white/10"
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

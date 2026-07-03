"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export default function NewsletterCTA() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    toast.success("Subscribed successfully! Welcome to FlowNexa.");
    reset();
  };

  return (
    <section className="bg-flownexa-black py-16 lg:py-24 font-sans relative z-10 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-zinc-900 border border-white/5 rounded-3xl p-8 md:p-12 lg:p-16 overflow-hidden flex flex-col items-center text-center max-w-5xl mx-auto"
        >
          {/* Neon Mesh Gradient Background */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-[-50%] left-[-50%] size-[600px] rounded-full bg-flownexa-lime/20 blur-[120px]" />
            <div className="absolute bottom-[-50%] right-[-50%] size-[600px] rounded-full bg-blue-500/10 blur-[120px]" />
          </div>

          <div className="relative z-10 max-w-2xl flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-flownexa-lime-muted border border-flownexa-lime/20 text-flownexa-lime text-xs font-semibold mb-6">
              <Sparkles size={12} fill="currentColor" />
              <span>FlowNexa Newsletter</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight leading-tight mb-4">
              Get the latest updates in technology and acoustics.
            </h2>
            
            <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Sign up to receive early access notifications on premium product drops, private coupon codes, and deep technology logs.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-md flex flex-col gap-2"
            >
              <div className="flex items-center bg-flownexa-black border border-white/10 rounded-full p-2 focus-within:border-flownexa-lime/50 transition-colors w-full">
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Enter your email address"
                  className="border-none bg-transparent text-white placeholder-muted-foreground text-sm focus-visible:ring-0 focus-visible:ring-offset-0 h-10 flex-1 px-4"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-10 px-5 rounded-full bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover flex items-center justify-center gap-2 shrink-0 transition-all active:scale-95"
                >
                  <span>Subscribe</span>
                  <Send size={14} />
                </Button>
              </div>
              {errors.email && (
                <span className="text-xs text-red-400 mt-1">{errors.email.message}</span>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

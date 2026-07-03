"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Twitter, Instagram, Linkedin, Github, Send } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export default function Footer() {
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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    toast.success("Successfully subscribed to newsletter!");
    reset();
  };

  const footerLinks = {
    shop: [
      { label: "Audio & Acoustics", href: "/products?category=audio" },
      { label: "Smart Wearables", href: "/products?category=wearables" },
      { label: "Tech Accessories", href: "/products?category=accessories" },
      { label: "Premium Devices", href: "/products?category=electronics" },
    ],
    support: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs & Help", href: "/faq" },
      { label: "Shipping & Delivery", href: "/faq#shipping" },
      { label: "Returns & Exchanges", href: "/faq#returns" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Github, href: "https://github.com", label: "GitHub" },
  ];

  return (
    <footer className="bg-flownexa-black text-white border-t border-white/5 font-sans pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Top Section: Branding & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-12 border-b border-white/5">
          {/* Logo & Brand Message */}
          <div className="flex flex-col gap-4">
            <Logo theme="dark" />
            <p className="text-sm text-muted-foreground max-w-sm mt-2 leading-relaxed">
              Elevating daily routines with premium consumer technology. We focus on design, quality, and smooth functionality.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-flownexa-lime hover:border-flownexa-lime/50 transition-all duration-300 hover:scale-105"
                    aria-label={social.label}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Newsletter Form */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-md text-center md:text-left">
                <h3 className="font-heading font-bold text-lg text-white mb-2">
                  Stay ahead of the curve.
                </h3>
                <p className="text-xs text-muted-foreground">
                  Subscribe to our newsletter for exclusive drops, offers, and technology insights.
                </p>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="w-full md:w-auto flex flex-col gap-2 shrink-0">
                <div className="flex items-center bg-flownexa-black border border-white/10 rounded-full p-1.5 focus-within:border-flownexa-lime/50 transition-colors w-full md:w-[320px]">
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="Enter your email"
                    className="border-none bg-transparent text-white placeholder-muted-foreground text-xs focus-visible:ring-0 focus-visible:ring-offset-0 h-9 flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="size-9 rounded-full bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover flex items-center justify-center p-0"
                    aria-label="Subscribe"
                  >
                    <Send size={14} />
                  </Button>
                </div>
                {errors.email && (
                  <span className="text-[10px] text-red-400 pl-4">{errors.email.message}</span>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Middle Section: Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-flownexa-lime mb-4">
              Shop Categories
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-muted-foreground hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-flownexa-lime mb-4">
              Support
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-muted-foreground hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-flownexa-lime mb-4">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-muted-foreground hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-flownexa-lime mb-4">
              FlowNexa HQ
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              128 Innovation Way<br />
              Suite 400<br />
              San Francisco, CA 94107<br />
              <span className="text-white hover:text-flownexa-lime transition-colors block mt-3">
                hello@flownexa.com
              </span>
            </p>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} FlowNexa Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

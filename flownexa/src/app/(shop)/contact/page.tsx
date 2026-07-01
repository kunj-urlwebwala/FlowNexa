"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import PageTransition from "@/components/shared/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success("Message sent successfully!", {
      description: "We will get back to you within 24 hours.",
    });
    reset();
  };

  const contactDetails = [
    { icon: Mail, title: "Email Care Line", val: "support@flownexa.com", desc: "Expect responses in 24 hours." },
    { icon: Phone, title: "Phone Client Desk", val: "+1 (555) 019-2834", desc: "Mon-Fri 9:00 AM - 5:00 PM PST." },
    { icon: MapPin, title: "FlowNexa HQ", val: "San Francisco, CA 94107", desc: "128 Innovation Way, Suite 400." },
  ];

  return (
    <PageTransition>
      <div className="bg-flownexa-black text-white py-10 font-sans min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          
          <SectionHeader
            title="Get in Touch"
            subtitle="Have inquiries about flagship releases or shipping? Reach out to our customer care team."
            badge="Contact Us"
            align="center"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
            
            {/* Contact Details (Left Column - 4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {contactDetails.map((det, i) => {
                const Icon = det.icon;
                return (
                  <div key={i} className="bg-zinc-900 border border-white/5 p-5 rounded-2xl flex gap-4 items-center">
                    <div className="size-10 rounded-xl bg-flownexa-lime-muted border border-flownexa-lime/20 flex items-center justify-center text-flownexa-lime shrink-0">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{det.title}</p>
                      <p className="font-bold text-sm text-white mt-1">{det.val}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{det.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contact Form (Right Column - 8 Cols) */}
            <div className="lg:col-span-8 bg-zinc-900 border border-white/5 rounded-3xl p-6 sm:p-8">
              <h3 className="font-heading font-bold text-lg border-b border-white/5 pb-4 mb-6">
                Send a Message
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="cont-name" className="text-xs font-semibold">Your Name</Label>
                    <Input {...register("name")} id="cont-name" placeholder="John Doe" className="rounded-xl bg-flownexa-black border-white/10 h-11" />
                    {errors.name && <span className="text-xs text-red-400">{errors.name.message}</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="cont-email" className="text-xs font-semibold">Email Address</Label>
                    <Input {...register("email")} id="cont-email" type="email" placeholder="name@example.com" className="rounded-xl bg-flownexa-black border-white/10 h-11" />
                    {errors.email && <span className="text-xs text-red-400">{errors.email.message}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="cont-msg" className="text-xs font-semibold">Your Message</Label>
                  <Textarea {...register("message")} id="cont-msg" placeholder="Write details about your question..." rows={5} className="rounded-xl bg-flownexa-black border-white/10 p-4" />
                  {errors.message && <span className="text-xs text-red-400">{errors.message.message}</span>}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-full h-11 bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover gap-2 mt-2 w-full sm:w-[180px] shadow-lg shadow-flownexa-lime/10 ml-auto"
                >
                  {isLoading ? "Sending..." : "Send Message"}
                  <Send size={14} />
                </Button>
              </form>
            </div>

          </div>

        </div>
      </div>
    </PageTransition>
  );
}

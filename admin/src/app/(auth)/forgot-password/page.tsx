"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldAlert } from "lucide-react";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSent(true);
    toast.success("Recovery Link Dispatched", {
      description: `We've sent reset instructions to ${data.email}`,
    });
  };

  if (isSent) {
    return (
      <div className="flex flex-col gap-6 font-sans">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold font-heading text-white">
            Recovery Email Dispatched
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Please check your inbox. If the email exists in our directory, we have sent a secure authentication link to reset your password.
          </p>
        </div>

        <Link href="/login" className="w-full">
          <Button variant="outline" className="w-full rounded-full h-11 border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs flex items-center justify-center gap-1.5 cursor-pointer">
            <ArrowLeft size={14} />
            Back to Secure Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold font-heading text-white">
          Recover Control Credentials
        </h1>
        <p className="text-xs text-muted-foreground">
          Enter your registered administrator email to receive reset instructions.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        
        {/* Email Input */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-white">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@flownexa.com"
            className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-[10px] text-red-500 font-semibold">{errors.email.message}</p>
          )}
        </div>

        <div className="flex items-center gap-2 text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 leading-relaxed">
          <ShieldAlert size={14} className="shrink-0" />
          <span>Password resets require secondary SMS verification for Super Admin sessions.</span>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full h-11 bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover shadow-lg shadow-flownexa-lime/10 mt-2 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {isSubmitting ? "Dispatching Secure Link..." : "Request Reset Link"}
          {!isSubmitting && <ArrowRight size={14} />}
        </Button>

        <Link href="/login" className="text-center text-[10px] text-muted-foreground hover:text-white transition-colors underline underline-offset-4 mt-2">
          Back to Secure Sign In
        </Link>

      </form>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MailOpen } from "lucide-react";

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
    toast.success("Reset link sent!", {
      description: `We've sent a password reset link to ${data.email}`,
    });
  };

  if (isSent) {
    return (
      <div className="bg-zinc-900/60 border border-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl w-full shadow-2xl relative text-center flex flex-col items-center">
        <div className="size-14 rounded-full bg-flownexa-lime/10 border border-flownexa-lime/25 flex items-center justify-center text-flownexa-lime mb-5">
          <MailOpen size={24} />
        </div>
        
        <h1 className="text-xl font-bold tracking-tight font-heading text-white mb-2">
          Check Your Email
        </h1>
        
        <p className="text-xs text-muted-foreground leading-relaxed mb-6 max-w-sm">
          We have sent password reset instructions to your email address. Please click the link inside to set up a new password.
        </p>

        <Link href="/login" className="w-full">
          <Button className="w-full rounded-full h-11 bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold">
            Return to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/60 border border-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl w-full shadow-2xl relative">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/login" className="text-muted-foreground hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </Link>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-bold tracking-tight font-heading text-white">
          Reset Password
        </h1>
        <p className="text-xs text-muted-foreground">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-white text-xs font-semibold">
            Email Address
          </Label>
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="name@example.com"
            disabled={isSubmitting}
            className="rounded-xl bg-flownexa-black border-white/10 text-white placeholder-muted-foreground text-sm focus-visible:ring-flownexa-lime/50 h-11 px-4"
          />
          {errors.email && (
            <span className="text-xs text-red-400">{errors.email.message}</span>
          )}
        </div>

        {/* Submit button (Lime Pill shape) */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full h-11 bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold mt-2 shadow-lg shadow-flownexa-lime/10"
        >
          {isSubmitting ? "Sending Link..." : "Send Reset Link"}
        </Button>
      </form>

      <p className="text-xs text-center text-muted-foreground mt-8">
        Remembered your password?{" "}
        <Link
          href="/login"
          className="text-flownexa-lime hover:underline font-semibold hover:text-flownexa-lime-hover"
        >
          Back to Login
        </Link>
      </p>
    </div>
  );
}

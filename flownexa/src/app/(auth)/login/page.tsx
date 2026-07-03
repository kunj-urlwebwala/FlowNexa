"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chrome, Flame } from "lucide-react";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      toast.success("Successfully logged in! Welcome back to FlowNexa.");
      const searchParams = new URLSearchParams(window.location.search);
      const redirectPath = searchParams.get("redirect") || "/";
      router.push(redirectPath);
    } else {
      toast.error(result.error || "Invalid email or password. Please try again.");
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login coming soon! Please use email/password for now.`);
  };

  return (
    <div className="bg-zinc-900/60 border border-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl w-full shadow-2xl relative">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-bold tracking-tight font-heading text-white">
          Welcome Back
        </h1>
        <p className="text-xs text-muted-foreground">
          Please login to access your FlowNexa account.
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

        {/* Password Field */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-white text-xs font-semibold">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs text-flownexa-lime hover:underline hover:text-flownexa-lime-hover"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            {...register("password")}
            id="password"
            type="password"
            placeholder="••••••••"
            disabled={isSubmitting}
            className="rounded-xl bg-flownexa-black border-white/10 text-white placeholder-muted-foreground text-sm focus-visible:ring-flownexa-lime/50 h-11 px-4"
          />
          {errors.password && (
            <span className="text-xs text-red-400">{errors.password.message}</span>
          )}
        </div>

        {/* Submit button (Lime Pill shape matching reference) */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full h-11 bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold mt-2 shadow-lg shadow-flownexa-lime/10"
        >
          {isSubmitting ? "Logging In..." : "Login"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-zinc-900 px-3 text-muted-foreground">Or login with</span>
        </div>
      </div>

      {/* Social Login Buttons (Google, Apple/Facebook) */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() => handleSocialLogin("Google")}
          disabled={isSubmitting}
          className="rounded-xl border-white/10 bg-flownexa-black hover:bg-white/5 text-white gap-2 flex items-center justify-center h-10"
        >
          <Chrome size={14} className="text-muted-foreground" />
          <span className="text-xs font-semibold">Google</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSocialLogin("Apple")}
          disabled={isSubmitting}
          className="rounded-xl border-white/10 bg-flownexa-black hover:bg-white/5 text-white gap-2 flex items-center justify-center h-10"
        >
          <Flame size={14} className="text-muted-foreground" />
          <span className="text-xs font-semibold">Apple</span>
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground mt-8">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-flownexa-lime hover:underline font-semibold hover:text-flownexa-lime-hover"
        >
          Sign Up →
        </Link>
      </p>
    </div>
  );
}

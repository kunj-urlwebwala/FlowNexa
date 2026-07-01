"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useAdminStore } from "@/store/adminStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAdminStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "admin@flownexa.com",
      password: "admin123",
    },
  });

  const onSubmit = async (data: FormData) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const success = await login(data.email, data.password);
    
    if (success) {
      toast.success("Welcome back, Super Admin!", {
        description: "Successfully authenticated to Control Hub.",
      });
      router.push("/");
    } else {
      toast.error("Authentication Failed", {
        description: "Invalid email or password. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold font-heading text-white">
          Access Control Hub
        </h1>
        <p className="text-xs text-muted-foreground">
          Enter your super admin credentials to manage systems.
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
            autoComplete="email"
            placeholder="admin@flownexa.com"
            className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-[10px] text-red-500 font-semibold">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-semibold text-white">
              System Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-[10px] text-flownexa-lime hover:underline font-semibold"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={errors.password ? "border-red-500 focus-visible:ring-red-500 pr-10" : "pr-10"}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[10px] text-red-500 font-semibold">{errors.password.message}</p>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-flownexa-lime-muted border border-flownexa-lime/20 rounded-xl p-3 text-[10px] leading-relaxed text-muted-foreground">
          <span className="font-bold text-white block mb-0.5">💡 Demo Login Credentials:</span>
          Use <strong className="text-white">admin@flownexa.com</strong> and password <strong className="text-white">admin123</strong> to login as Super Admin.
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full h-11 bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover shadow-lg shadow-flownexa-lime/10 mt-2 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {isSubmitting ? "Authenticating Secure Session..." : "Secure Sign In"}
          {!isSubmitting && <ArrowRight size={14} />}
        </Button>

      </form>
    </div>
  );
}

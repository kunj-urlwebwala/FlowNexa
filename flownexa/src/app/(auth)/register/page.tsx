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
import { Checkbox } from "@/components/ui/checkbox";
import { Chrome, Flame } from "lucide-react";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    agree: z.literal(true, {
      message: "You must agree to the Terms & Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const result = await registerUser(data.email, data.password, data.name);
    if (result.success) {
      toast.success("Account created successfully!", {
        description: "Welcome to FlowNexa.",
      });
      router.push("/");
    } else {
      toast.error("Registration Failed", {
        description: result.error || "An account with this email already exists.",
      });
    }
  };

  const handleSocialSignUp = (provider: string) => {
    toast.info(`${provider} sign up coming soon! Please use email/password for now.`);
  };

  return (
    <div className="bg-zinc-900/60 border border-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl w-full shadow-2xl relative">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-bold tracking-tight font-heading text-white">
          Create Account
        </h1>
        <p className="text-xs text-muted-foreground">
          Join FlowNexa and discover premium technology releases.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Name Field */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-white text-xs font-semibold">
            Full Name
          </Label>
          <Input
            {...register("name")}
            id="name"
            placeholder="John Doe"
            disabled={isSubmitting}
            className="rounded-xl bg-flownexa-black border-white/10 text-white placeholder-muted-foreground text-sm focus-visible:ring-flownexa-lime/50 h-11 px-4"
          />
          {errors.name && (
            <span className="text-xs text-red-400">{errors.name.message}</span>
          )}
        </div>

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

        {/* Password Fields in Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-white text-xs font-semibold">
              Password
            </Label>
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
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword" className="text-white text-xs font-semibold">
              Confirm Password
            </Label>
            <Input
              {...register("confirmPassword")}
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              disabled={isSubmitting}
              className="rounded-xl bg-flownexa-black border-white/10 text-white placeholder-muted-foreground text-sm focus-visible:ring-flownexa-lime/50 h-11 px-4"
            />
            {errors.confirmPassword && (
              <span className="text-xs text-red-400">{errors.confirmPassword.message}</span>
            )}
          </div>
        </div>

        {/* Terms Agreement Checkbox */}
        <div className="flex items-start gap-2.5 mt-2">
          <Checkbox
            id="agree"
            disabled={isSubmitting}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onCheckedChange={(checked) => setValue("agree", checked === true ? true : (undefined as any))}
            className="border-white/20 data-[state=checked]:bg-flownexa-lime data-[state=checked]:text-flownexa-black"
          />
          <Label htmlFor="agree" className="text-xs text-muted-foreground leading-snug cursor-pointer select-none">
            I agree to the{" "}
            <a href="#" className="text-flownexa-lime hover:underline">
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-flownexa-lime hover:underline">
              Privacy Policy
            </a>.
          </Label>
        </div>
        {errors.agree && (
          <span className="text-xs text-red-400">{errors.agree.message}</span>
        )}

        {/* Submit button (Lime Pill shape) */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full h-11 bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold mt-2 shadow-lg shadow-flownexa-lime/10"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-zinc-900 px-3 text-muted-foreground">Or sign up with</span>
        </div>
      </div>

      {/* Social Register */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() => handleSocialSignUp("Google")}
          disabled={isSubmitting}
          className="rounded-xl border-white/10 bg-flownexa-black hover:bg-white/5 text-white gap-2 flex items-center justify-center h-10"
        >
          <Chrome size={14} className="text-muted-foreground" />
          <span className="text-xs font-semibold">Google</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSocialSignUp("Apple")}
          disabled={isSubmitting}
          className="rounded-xl border-white/10 bg-flownexa-black hover:bg-white/5 text-white gap-2 flex items-center justify-center h-10"
        >
          <Flame size={14} className="text-muted-foreground" />
          <span className="text-xs font-semibold">Apple</span>
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground mt-8">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-flownexa-lime hover:underline font-semibold hover:text-flownexa-lime-hover"
        >
          Log In →
        </Link>
      </p>
    </div>
  );
}

// src/components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { loginSchema, LoginInput } from "@/schemas/auth.schema";
import { loginUserAction } from "@/actions/auth.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginInput) => {
    setIsSubmitting(true);
    try {
      const result = await loginUserAction(values);

      if (result.success) {
        toast.success(result.message || "Logged in successfully!");
        router.push("/");
      } else {
        toast.error(result.message || "Invalid email or password");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome Back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to manage your gear rentals and listings
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              {...register("email")}
              type="email"
              placeholder="customer121@example.com"
              className="pl-10 h-10 text-sm"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Password *
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10 h-10 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 text-sm font-semibold mt-2 shadow-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Redirect Link to Register */}
      <div className="text-center text-sm text-muted-foreground pt-4 border-t">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="font-semibold text-primary hover:underline"
        >
          Register now
        </Link>
      </div>
    </div>
  );
}
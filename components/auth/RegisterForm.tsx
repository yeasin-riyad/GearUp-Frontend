// src/components/auth/RegisterForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Store,
  UserCheck,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { registerSchema, RegisterInput } from "@/schemas/auth.schema";
import { registerUserAction } from "@/actions/auth.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "CUSTOMER",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (values: RegisterInput) => {
    setIsSubmitting(true);
    try {
      const result = await registerUserAction(values);

      if (result.success) {
        toast.success(
          result.message || "Account created successfully! Redirecting...",
        );
        // Short delay for user to read toast
        setTimeout(() => {
          router.push("/auth/login");
        }, 1200);
      } else {
        toast.error(result.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="space-y-0.5 text-center">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Create an Account
        </h1>
        <p className="text-xs text-muted-foreground">
          Join GearUp to rent or share sports and outdoor gear
        </p>
      </div>

      {/* Role Selection Toggle */}
      <div className="space-y-1">
        <label className="text-[10px] font-semibold text-foreground uppercase tracking-wider block text-center">
          I want to:
        </label>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-muted rounded-lg">
          <button
            type="button"
            onClick={() =>
              setValue("role", "CUSTOMER", { shouldValidate: true })
            }
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
              selectedRole === "CUSTOMER"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserCheck className="h-3.5 w-3.5 text-primary" />
            Rent Gear (Customer)
          </button>

          <button
            type="button"
            onClick={() =>
              setValue("role", "PROVIDER", { shouldValidate: true })
            }
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
              selectedRole === "PROVIDER"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Store className="h-3.5 w-3.5 text-primary" />
            List Gear (Provider)
          </button>
        </div>
        {errors.role && (
          <p className="text-[11px] text-destructive text-center leading-tight">
            {errors.role.message}
          </p>
        )}
      </div>

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              {...register("name")}
              type="text"
              placeholder="e.g. Customer"
              className="pl-9 h-9 text-xs"
            />
          </div>
          {errors.name && (
            <p className="text-[11px] text-destructive leading-tight">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              {...register("email")}
              type="email"
              placeholder="customer121@example.com"
              className="pl-9 h-9 text-xs"
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-destructive leading-tight">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              {...register("phone")}
              type="tel"
              placeholder="01812345678"
              className="pl-9 h-9 text-xs"
            />
          </div>
          {errors.phone && (
            <p className="text-[11px] text-destructive leading-tight">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">
            Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password@123"
              className="pl-9 pr-10 h-9 text-xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-destructive leading-tight">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-9 text-xs font-semibold mt-1 shadow-xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              Registering...
            </>
          ) : (
            <>
              Register as{" "}
              {selectedRole === "PROVIDER" ? "Provider" : "Customer"}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </>
          )}
        </Button>
      </form>

      {/* Redirect Link to Login */}
      <div className="text-center text-xs text-muted-foreground pt-2 border-t">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-primary hover:underline"
        >
          Sign in here
        </Link>
      </div>
    </div>
  );
}

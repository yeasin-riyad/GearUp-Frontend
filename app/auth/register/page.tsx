// src/app/(auth)/register/page.tsx
import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register | GearUp",
  description: "Create a customer or provider account on GearUp",
};

// Server Component
export default function RegisterPage() {
  return <RegisterForm />;
}
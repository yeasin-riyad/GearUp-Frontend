"use server";

import {
  registerSchema,
  RegisterInput,
  loginSchema,
  LoginInput,
} from "@/schemas/auth.schema";
import { cookies } from "next/headers";

export type ActionResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
};

export async function registerUserAction(
  payload: RegisterInput,
): Promise<ActionResult> {
  // 1. Client input validation via Zod on the server side
  const validation = registerSchema.safeParse(payload);
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0]?.message || "Validation failed",
    };
  }

  // 2. Extra safety check: Block ADMIN registration
  if ((payload.role as string) === "ADMIN") {
    return {
      success: false,
      message: "Admin registration is forbidden.",
    };
  }

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://gearup-1-9p45.onrender.com/api";
    const response = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validation.data),
      cache: "no-store",
    });

    const resData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: resData.message || "Failed to register account",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: resData.message || "User registered successfully",
      data: resData.data,
      statusCode: resData.statusCode || 201,
    };
  } catch (error) {
    console.error("Register Action Error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection and try again.",
    };
  }
}

export async function loginUserAction(
  payload: LoginInput,
): Promise<ActionResult> {
  // 1. Zod Validation
  const validation = loginSchema.safeParse(payload);
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0]?.message || "Validation failed",
    };
  }

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://gearup-1-9p45.onrender.com/api";
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validation.data),
      cache: "no-store",
    });

    const resData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: resData.message || "Invalid credentials",
        statusCode: response.status,
      };
    }

    // Extract token if sent in payload data or headers
    const accessToken = resData.data?.accessToken;
    const refreshToken = resData.data?.refreshToken;

    if (resData.success) {
      const cookieStore = await cookies();
      cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    return {
      success: true,
      message: resData.message || "Logged in successfully",
      data: resData.data,
      statusCode: resData.statusCode || 200,
    };
  } catch (error) {
    console.error("Login Action Error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection and try again.",
    };
  }
}

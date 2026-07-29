
export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  avatar?: string;
  [key: string]: unknown;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
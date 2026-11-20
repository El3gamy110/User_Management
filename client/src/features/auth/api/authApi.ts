import ApiClient from "@/services/ApiClient";
import type { StoredAuthUser } from "@/services/tokenService";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: "Admin" | "User";
  status?: "Active" | "Inactive";
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: StoredAuthUser;
}

export function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  return ApiClient.post<AuthResponse>("/login", payload);
}

export function registerRequest(
  payload: RegisterPayload
): Promise<AuthResponse> {
  return ApiClient.post<AuthResponse>("/register", payload);
}

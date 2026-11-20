import Cookies from "js-cookie";
import { ENV } from "@/config/env";

const TOKEN_KEY = ENV.ACCESS_TOKEN_KEY || "accessToken";
const USER_KEY = ENV.USER_STORAGE_KEY || "authUser";

export interface StoredAuthUser {
  id: number;
  email: string;
  name?: string;
  role?: "Admin" | "User";
  status?: "Active" | "Inactive";
  createdAt?: string;
}

export const TokenService = {
  setToken: (token: string, expiresDays = 1) => {
    const isHttps =
      typeof window !== "undefined" && window.location.protocol === "https:";
    Cookies.set(TOKEN_KEY, token, {
      expires: expiresDays,
      secure: isHttps,
      sameSite: "lax",
    });
  },

  getToken: () => {
    return Cookies.get(TOKEN_KEY);
  },

  removeToken: () => {
    Cookies.remove(TOKEN_KEY);
  },

  hasToken: () => {
    return !!Cookies.get(TOKEN_KEY);
  },

  setUser: (user: StoredAuthUser) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // Ignore storage quota errors
    }
  },

  getUser: (): StoredAuthUser | null => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as StoredAuthUser) : null;
    } catch {
      return null;
    }
  },

  removeUser: () => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(USER_KEY);
    } catch {
      // Ignore storage errors
    }
  },

  clearAuth: () => {
    Cookies.remove(TOKEN_KEY);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(USER_KEY);
      } catch {
        // Ignore storage errors
      }
    }
  },
};

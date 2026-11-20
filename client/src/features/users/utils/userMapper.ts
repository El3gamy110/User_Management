import type { ApiUser } from "../api/usersApi";
import { AVATAR_PALETTE, type UserItem } from "./mockUsers";

export function formatDisplayDate(rawDate?: string): string {
  if (!rawDate) return "—";
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) {
    return rawDate;
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

export function normalizeApiUser(apiUser: ApiUser): UserItem {
  const fallbackName = apiUser.email ? apiUser.email.split("@")[0] : "User";
  const resolvedName = apiUser.name?.trim() || fallbackName;
  const numericId = Number(apiUser.id) || 0;

  return {
    id: apiUser.id,
    name: resolvedName,
    email: apiUser.email,
    role: apiUser.role === "Admin" ? "Admin" : "User",
    status: apiUser.status === "Inactive" ? "Inactive" : "Active",
    createdAt: formatDisplayDate(apiUser.createdAt),
    avatarColor: AVATAR_PALETTE[Math.abs(numericId) % AVATAR_PALETTE.length],
  };
}

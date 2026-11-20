import axios from "axios";
import { ENV } from "@/config/env";

export function extractApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === "string" && data.trim().length > 0) {
      return data;
    }

    if (data && typeof data === "object") {
      const record = data as Record<string, unknown>;
      if (typeof record.message === "string" && record.message.trim()) {
        return record.message;
      }
      if (typeof record.error === "string" && record.error.trim()) {
        return record.error;
      }
    }

    if (error.code === "ERR_NETWORK" || !error.response) {
      return `Unable to reach the server at ${ENV.API_URL}. Make sure json-server-auth is running.`;
    }

    if (error.response.status === 401) {
      return "Your session has expired or you are not authorized. Please log in again.";
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

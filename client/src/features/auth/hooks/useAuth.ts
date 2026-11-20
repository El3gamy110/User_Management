"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { TokenService } from "@/services/tokenService";
import {
  loginRequest,
  registerRequest,
  type AuthResponse,
  type LoginPayload,
  type RegisterPayload,
} from "../api/authApi";

export function useLoginMutation(rememberMe = false) {
  return useApiMutation<LoginPayload, AuthResponse>({
    mutationFn: loginRequest,
    options: {
      onSuccess: (data) => {
        TokenService.setToken(data.accessToken, rememberMe ? 7 : 1);
        TokenService.setUser(data.user);
      },
    },
  });
}

export function useRegisterMutation() {
  return useApiMutation<RegisterPayload, AuthResponse>({
    mutationFn: registerRequest,
    options: {
      onSuccess: (data) => {
        TokenService.setToken(data.accessToken, 1);
        TokenService.setUser(data.user);
      },
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    TokenService.clearAuth();
    queryClient.clear();
    router.push("/login");
  };
}

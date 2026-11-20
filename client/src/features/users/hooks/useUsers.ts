"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { useApiMutation } from "@/shared/hooks/useApiMutation";
import {
  createUserRequest,
  deleteUserRequest,
  getUserByIdRequest,
  getUsersRequest,
  updateUserRequest,
  type ApiUser,
  type CreateUserPayload,
  type CreateUserResponse,
  type UpdateUserPayload,
} from "../api/usersApi";

export const USERS_QUERY_KEY = ["users"] as const;

export function useUsersQuery(enabled = true) {
  return useApiQuery<ApiUser[]>({
    queryKey: USERS_QUERY_KEY,
    queryFn: getUsersRequest,
    options: {
      enabled,
      retry: 1,
    },
  });
}

export function useUserQuery(id: number | null) {
  return useApiQuery<ApiUser>({
    queryKey: [...USERS_QUERY_KEY, id],
    queryFn: () => getUserByIdRequest(id as number),
    options: {
      enabled: id !== null,
      retry: 1,
    },
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useApiMutation<CreateUserPayload, CreateUserResponse>({
    mutationFn: createUserRequest,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      },
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useApiMutation<UpdateUserPayload, ApiUser>({
    mutationFn: updateUserRequest,
    options: {
      onSuccess: (updatedUser) => {
        queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
        if (updatedUser?.id !== undefined) {
          queryClient.invalidateQueries({
            queryKey: [...USERS_QUERY_KEY, updatedUser.id],
          });
        }
      },
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useApiMutation<number, Record<string, never>>({
    mutationFn: deleteUserRequest,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      },
    },
  });
}

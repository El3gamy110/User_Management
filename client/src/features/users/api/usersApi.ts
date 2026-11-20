import ApiClient from "@/services/ApiClient";

export interface ApiUser {
  id: number;
  email: string;
  name?: string;
  password?: string;
  role?: "Admin" | "User";
  status?: "Active" | "Inactive";
  createdAt?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role?: "Admin" | "User";
  status?: "Active" | "Inactive";
  createdAt?: string;
}

export interface CreateUserResponse {
  accessToken: string;
  user: ApiUser;
}

export interface UpdateUserPayload {
  id: number;
  data: {
    name?: string;
    email?: string;
    password?: string;
    role?: "Admin" | "User";
    status?: "Active" | "Inactive";
  };
}

export function getUsersRequest(): Promise<ApiUser[]> {
  return ApiClient.get<ApiUser[]>("/users");
}

export async function getUserByIdRequest(id: number): Promise<ApiUser> {
  const res = await ApiClient.get<ApiUser | ApiUser[]>(`/users/${id}`);
  return Array.isArray(res) ? res[0] : res;
}

export function createUserRequest(
  payload: CreateUserPayload
): Promise<CreateUserResponse> {
  return ApiClient.post<CreateUserResponse>("/users", payload);
}

export function updateUserRequest({
  id,
  data,
}: UpdateUserPayload): Promise<ApiUser> {
  return ApiClient.patch<ApiUser>(`/users/${id}`, data);
}

export function deleteUserRequest(id: number): Promise<Record<string, never>> {
  return ApiClient.delete<Record<string, never>>(`/users/${id}`);
}

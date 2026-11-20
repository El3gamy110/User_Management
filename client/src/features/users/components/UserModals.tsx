"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle, Crown, Loader2, Lock, Mail, Trash2, User, X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { UserItem, UserRole, UserStatus } from "../utils/mockUsers";
import { useUserQuery } from "../hooks/useUsers";
import { normalizeApiUser } from "../utils/userMapper";
import { extractApiErrorMessage } from "@/services/apiError";

export interface UserFormPayload {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
}

interface UserFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  initialUser: UserItem | null;
  isSubmitting?: boolean;
  apiError?: string | null;
  onClose: () => void;
  onSubmit: (payload: UserFormPayload) => void;
}

export function UserFormModal({
  open,
  mode,
  initialUser,
  isSubmitting = false,
  apiError = null,
  onClose,
  onSubmit,
}: UserFormModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("User");
  const [status, setStatus] = useState<UserStatus>("Active");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(initialUser?.name ?? "");
      setEmail(initialUser?.email ?? "");
      setPassword("");
      setRole(initialUser?.role ?? "User");
      setStatus(initialUser?.status ?? "Active");
      setError(null);
    }
  }, [open, initialUser]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (mode === "create" && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    onSubmit({
      name: name.trim(),
      email: email.trim(),
      password: password || undefined,
      role,
      status,
    });
  };

  const displayedError = error || apiError;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111318]/45 px-4 backdrop-blur-[2px]"
      onClick={() => !isSubmitting && onClose()}
    >
      <div
        className="w-full max-w-[460px] rounded-[18px] border border-[#e6e9f4] bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="text-start">
            <h3 className="text-[19px] font-bold text-[#111318]">
              {mode === "create" ? "Create User" : "Edit User"}
            </h3>
            <p className="text-[13px] text-[#64697a] mt-0.5">
              {mode === "create"
                ? "Add a new user via POST /users."
                : "Update user details via PATCH /users/:id."}
            </p>
          </div>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-[#64697a] hover:bg-[#f2f3f8] disabled:opacity-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-start">
          <div>
            <label
              htmlFor="modal-user-name"
              className="block text-[13.5px] font-semibold text-[#181b25] mb-1.5"
            >
              Full Name
            </label>
            <div className="flex items-center h-11 rounded-[10px] border border-[#d8dde8] bg-white px-3 focus-within:border-[#5b34de] focus-within:ring-3 focus-within:ring-[#5b34de]/15">
              <User className="w-4 h-4 text-[#7a8194] me-2.5 shrink-0" />
              <input
                id="modal-user-name"
                type="text"
                disabled={isSubmitting}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full bg-transparent text-[14px] text-[#181b25] placeholder:text-[#969db0] outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="modal-user-email"
              className="block text-[13.5px] font-semibold text-[#181b25] mb-1.5"
            >
              Email
            </label>
            <div className="flex items-center h-11 rounded-[10px] border border-[#d8dde8] bg-white px-3 focus-within:border-[#5b34de] focus-within:ring-3 focus-within:ring-[#5b34de]/15">
              <Mail className="w-4 h-4 text-[#7a8194] me-2.5 shrink-0" />
              <input
                id="modal-user-email"
                type="email"
                disabled={isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full bg-transparent text-[14px] text-[#181b25] placeholder:text-[#969db0] outline-none"
              />
            </div>
          </div>

          {mode === "create" && (
            <div>
              <label
                htmlFor="modal-user-password"
                className="block text-[13.5px] font-semibold text-[#181b25] mb-1.5"
              >
                Password
              </label>
              <div className="flex items-center h-11 rounded-[10px] border border-[#d8dde8] bg-white px-3 focus-within:border-[#5b34de] focus-within:ring-3 focus-within:ring-[#5b34de]/15">
                <Lock className="w-4 h-4 text-[#7a8194] me-2.5 shrink-0" />
                <input
                  id="modal-user-password"
                  type="password"
                  disabled={isSubmitting}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password (min 6 chars)"
                  className="w-full bg-transparent text-[14px] text-[#181b25] placeholder:text-[#969db0] outline-none"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="modal-user-role"
                className="block text-[13.5px] font-semibold text-[#181b25] mb-1.5"
              >
                Role
              </label>
              <select
                id="modal-user-role"
                disabled={isSubmitting}
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="h-11 w-full rounded-[10px] border border-[#d8dde8] bg-white px-3 text-[14px] text-[#181b25] outline-none focus:border-[#5b34de]"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="modal-user-status"
                className="block text-[13.5px] font-semibold text-[#181b25] mb-1.5"
              >
                Status
              </label>
              <select
                id="modal-user-status"
                disabled={isSubmitting}
                value={status}
                onChange={(e) => setStatus(e.target.value as UserStatus)}
                className="h-11 w-full rounded-[10px] border border-[#d8dde8] bg-white px-3 text-[14px] text-[#181b25] outline-none focus:border-[#5b34de]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {displayedError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-[9px] border border-red-200 bg-[#fef2f2] px-3 py-2 text-[13px] font-medium text-[#dc2626]"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{displayedError}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="h-10 rounded-[10px] border border-[#dfe3ee] bg-white px-4 text-[14px] font-semibold text-[#4b5163] hover:bg-[#f6f7fb] disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-[#673de6] to-[#5329d1] px-5 text-[14px] font-semibold text-white shadow-[0_6px_16px_-4px_rgba(91,52,222,0.5)] hover:from-[#5c32db] hover:to-[#4720c2] disabled:opacity-65 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{mode === "create" ? "Create User" : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ViewUserModalProps {
  user: UserItem | null;
  onClose: () => void;
}

export function ViewUserModal({ user, onClose }: ViewUserModalProps) {
  const userQuery = useUserQuery(user?.id ?? null);

  if (!user) return null;

  const resolvedUser = userQuery.data ? normalizeApiUser(userQuery.data) : user;
  const initial = resolvedUser.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111318]/45 px-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] rounded-[18px] border border-[#e6e9f4] bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h3 className="text-[18px] font-bold text-[#111318]">
              User Details
            </h3>
            {userQuery.isFetching && (
              <Loader2 className="w-4 h-4 animate-spin text-[#5b34de]" />
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="rounded-lg p-1.5 text-[#64697a] hover:bg-[#f2f3f8] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {userQuery.isError && (
          <div className="mb-4 flex items-start gap-2 rounded-[9px] border border-amber-200 bg-amber-50 px-3 py-2 text-start text-[12.5px] text-amber-800">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Could not refresh from GET /users/{user.id}:{" "}
              {extractApiErrorMessage(userQuery.error)}
            </span>
          </div>
        )}

        <div className="flex items-center gap-4 pb-5 border-b border-[#f0f1f7]">
          <span
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[20px] font-bold",
              resolvedUser.avatarColor
            )}
          >
            {initial}
          </span>
          <div className="min-w-0 text-start">
            <p className="text-[17px] font-bold text-[#111318] truncate">
              {resolvedUser.name}
            </p>
            <p className="text-[13.5px] text-[#64697a] truncate">
              {resolvedUser.email}
            </p>
          </div>
        </div>

        <dl className="mt-5 space-y-3 text-[14px]">
          <div className="flex items-center justify-between">
            <dt className="text-[#64697a]">User ID</dt>
            <dd className="font-semibold text-[#181b25]">#{resolvedUser.id}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-[#64697a]">Role</dt>
            <dd>
              {resolvedUser.role === "Admin" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#efeaff] px-2.5 py-0.5 text-[12.5px] font-semibold text-[#5b34de]">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-[#e8f2ff] px-2.5 py-0.5 text-[12.5px] font-semibold text-[#2563eb]">
                  User
                </span>
              )}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-[#64697a]">Status</dt>
            <dd>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12.5px] font-semibold",
                  resolvedUser.status === "Active"
                    ? "bg-[#e8f9ef] text-[#15803d]"
                    : "bg-[#feecec] text-[#dc2626]"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    resolvedUser.status === "Active"
                      ? "bg-[#16a34a]"
                      : "bg-[#dc2626]"
                  )}
                />
                <span>{resolvedUser.status}</span>
              </span>
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-[#64697a]">Created At</dt>
            <dd className="font-medium text-[#181b25]">
              {resolvedUser.createdAt}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-[10px] bg-[#5b34de] px-5 text-[14px] font-semibold text-white hover:bg-[#4b27c7] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface DeleteUserModalProps {
  user: UserItem | null;
  isDeleting?: boolean;
  apiError?: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteUserModal({
  user,
  isDeleting = false,
  apiError = null,
  onClose,
  onConfirm,
}: DeleteUserModalProps) {
  if (!user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111318]/45 px-4 backdrop-blur-[2px]"
      onClick={() => !isDeleting && onClose()}
    >
      <div
        className="w-full max-w-[400px] rounded-[18px] border border-[#e6e9f4] bg-white p-6 shadow-2xl text-start"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#feecec] text-[#dc2626] mb-4">
          <Trash2 className="w-5 h-5" />
        </div>
        <h3 className="text-[18px] font-bold text-[#111318]">Delete User?</h3>
        <p className="mt-1.5 text-[14px] text-[#64697a] leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[#181b25]">{user.name}</span>?
          This will permanently remove them via{" "}
          <code className="text-[12.5px] font-semibold text-[#4b5163]">
            DELETE /users/{user.id}
          </code>
          .
        </p>

        {apiError && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-[9px] border border-red-200 bg-[#fef2f2] px-3 py-2 text-[13px] font-medium text-[#dc2626]"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="h-10 rounded-[10px] border border-[#dfe3ee] bg-white px-4 text-[14px] font-semibold text-[#4b5163] hover:bg-[#f6f7fb] disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-[#dc2626] px-5 text-[14px] font-semibold text-white hover:bg-[#b91c1c] disabled:opacity-65 cursor-pointer"
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

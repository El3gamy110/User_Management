"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Menu,
  Plus,
  RefreshCw,
  Search,
  User as UserIcon,
  X,
} from "lucide-react";
import { ENV } from "@/config/env";
import { TokenService, type StoredAuthUser } from "@/services/tokenService";
import { extractApiErrorMessage } from "@/services/apiError";
import { useLogout } from "@/features/auth/hooks/useAuth";
import DashboardSidebar, { type SidebarTab } from "./DashboardSidebar";
import DashboardOverview from "./DashboardOverview";
import UsersStatsGrid from "./UsersStatsGrid";
import UsersTable from "./UsersTable";
import {
  DeleteUserModal,
  UserFormModal,
  ViewUserModal,
  type UserFormPayload,
} from "./UserModals";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useUserQuery,
  useUsersQuery,
} from "../hooks/useUsers";
import { normalizeApiUser } from "../utils/userMapper";
import type { UserItem } from "../utils/mockUsers";

const PAGE_SIZE = 5;

export default function UsersDashboard() {
  const router = useRouter();
  const logout = useLogout();

  const [authChecked, setAuthChecked] = useState(false);
  const [storedUser, setStoredUser] = useState<StoredAuthUser | null>(null);

  const [activeTab, setActiveTab] = useState<SidebarTab>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [viewingUser, setViewingUser] = useState<UserItem | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);

  // Feedback states
  const [modalApiError, setModalApiError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile form state
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileFeedback, setProfileFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Auth guard on client mount
  useEffect(() => {
    const hasToken = TokenService.hasToken();
    if (!ENV.DISABLE_DASHBOARD_PROTECTION && !hasToken) {
      router.replace("/login");
      return;
    }
    setStoredUser(TokenService.getUser());
    setAuthChecked(true);
  }, [router]);

  // Auto-dismiss success toast
  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  // API Queries & Mutations
  const usersQuery = useUsersQuery(authChecked);
  const currentUserQuery = useUserQuery(authChecked ? storedUser?.id ?? null : null);

  const createUserMutation = useCreateUserMutation();
  const updateUserMutation = useUpdateUserMutation();
  const deleteUserMutation = useDeleteUserMutation();

  const resolvedCurrentUser = useMemo(() => {
    const source = currentUserQuery.data ?? storedUser;
    if (!source) return null;
    const normalized = normalizeApiUser(source);
    return {
      id: normalized.id,
      name: normalized.name,
      email: normalized.email,
      role: normalized.role,
      status: normalized.status,
      createdAt: normalized.createdAt,
    };
  }, [currentUserQuery.data, storedUser]);

  useEffect(() => {
    if (resolvedCurrentUser) {
      setProfileName(resolvedCurrentUser.name);
      setProfileEmail(resolvedCurrentUser.email);
    }
  }, [resolvedCurrentUser]);

  const users = useMemo<UserItem[]>(() => {
    if (!usersQuery.data) return [];
    return usersQuery.data.map(normalizeApiUser);
  }, [usersQuery.data]);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const adminsCount = users.filter((u) => u.role === "Admin").length;
    const activeCount = users.filter((u) => u.status === "Active").length;
    const inactiveCount = totalUsers - activeCount;
    return { totalUsers, adminsCount, activeCount, inactiveCount };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, safePage]);

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    const visibleIds = paginatedUsers.map((u) => u.id);
    const allSelected =
      visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleOpenCreate = () => {
    setFormMode("create");
    setEditingUser(null);
    setModalApiError(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (user: UserItem) => {
    setFormMode("edit");
    setEditingUser(user);
    setModalApiError(null);
    setFormModalOpen(true);
  };

  const handleSaveUser = (payload: UserFormPayload) => {
    setModalApiError(null);

    if (formMode === "create") {
      createUserMutation.mutate(
        {
          name: payload.name,
          email: payload.email,
          password: payload.password || "",
          role: payload.role,
          status: payload.status,
          createdAt: new Date().toISOString(),
        },
        {
          onSuccess: (res) => {
            setFormModalOpen(false);
            setCurrentPage(1);
            setToastMessage(
              `User "${res.user?.name || payload.name}" created successfully.`
            );
          },
          onError: (err) => {
            setModalApiError(
              extractApiErrorMessage(err, "Failed to create user.")
            );
          },
        }
      );
      return;
    }

    if (editingUser) {
      updateUserMutation.mutate(
        {
          id: editingUser.id,
          data: {
            name: payload.name,
            email: payload.email,
            role: payload.role,
            status: payload.status,
          },
        },
        {
          onSuccess: (updated) => {
            if (storedUser && updated.id === storedUser.id) {
              const merged = {
                ...storedUser,
                name: updated.name ?? payload.name,
                email: updated.email ?? payload.email,
              };
              TokenService.setUser(merged);
              setStoredUser(merged);
            }
            setFormModalOpen(false);
            setEditingUser(null);
            setToastMessage(`User "${payload.name}" updated successfully.`);
          },
          onError: (err) => {
            setModalApiError(
              extractApiErrorMessage(err, "Failed to update user.")
            );
          },
        }
      );
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingUser) return;
    setModalApiError(null);

    const target = deletingUser;
    deleteUserMutation.mutate(target.id, {
      onSuccess: () => {
        setSelectedIds((prev) => prev.filter((id) => id !== target.id));
        setDeletingUser(null);
        setToastMessage(`User "${target.name}" deleted successfully.`);
      },
      onError: (err) => {
        setModalApiError(extractApiErrorMessage(err, "Failed to delete user."));
      },
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileFeedback(null);

    if (!resolvedCurrentUser) return;
    if (!profileName.trim()) {
      setProfileFeedback({ type: "error", text: "Name cannot be empty." });
      return;
    }

    updateUserMutation.mutate(
      {
        id: resolvedCurrentUser.id,
        data: {
          name: profileName.trim(),
          email: profileEmail.trim(),
        },
      },
      {
        onSuccess: (updated) => {
          const nextStored: StoredAuthUser = {
            id: updated.id,
            name: updated.name ?? profileName.trim(),
            email: updated.email ?? profileEmail.trim(),
            role: updated.role,
            status: updated.status,
            createdAt: updated.createdAt,
          };
          TokenService.setUser(nextStored);
          setStoredUser(nextStored);
          setProfileFeedback({
            type: "success",
            text: "Profile updated successfully via PATCH /users/" + updated.id,
          });
        },
        onError: (err) => {
          setProfileFeedback({
            type: "error",
            text: extractApiErrorMessage(err, "Failed to update profile."),
          });
        },
      }
    );
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-3 bg-[#f6f7fb] text-[#5e6373]">
        <Loader2 className="w-7 h-7 animate-spin text-[#5b34de]" />
        <p className="text-[14px] font-medium">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-[#f6f7fb] text-[#111318]">
      <DashboardSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        currentUser={
          resolvedCurrentUser
            ? {
                name: resolvedCurrentUser.name,
                email: resolvedCurrentUser.email,
              }
            : null
        }
        onLogout={logout}
      />

      <main className="flex-1 min-w-0 px-4 py-6 sm:px-7 lg:px-9 lg:py-8">
        <div className="mx-auto w-full max-w-[1280px] space-y-6">
          {/* Success Toast */}
          {toastMessage && (
            <div className="flex items-center justify-between gap-3 rounded-[12px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13.5px] font-medium text-emerald-800 shadow-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{toastMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                aria-label="Dismiss notification"
                className="rounded-md p-1 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {activeTab === "dashboard" ? (
            <DashboardOverview
              currentUserName={resolvedCurrentUser?.name || "Admin"}
              users={users}
              isLoading={usersQuery.isLoading}
              isFetching={usersQuery.isFetching}
              isError={usersQuery.isError}
              onRefresh={() => usersQuery.refetch()}
              onOpenMobileMenu={() => setMobileSidebarOpen(true)}
              onOpenCreateUser={handleOpenCreate}
              onNavigateToUsers={() => setActiveTab("users")}
              onNavigateToProfile={() => setActiveTab("profile")}
              onViewUser={setViewingUser}
              onEditUser={handleOpenEdit}
            />
          ) : activeTab === "profile" ? (
            <>
              <header className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(true)}
                  aria-label="Open menu"
                  className="lg:hidden mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#dfe3ee] bg-white text-[#374151] hover:bg-[#f4f5fa] cursor-pointer"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="text-start">
                  <h1 className="text-[25px] sm:text-[28px] font-bold tracking-tight text-[#111318]">
                    My Profile
                  </h1>
                  <p className="mt-1 text-[14px] text-[#5e6373]">
                    View and update your account details synced with{" "}
                    <code className="text-[13px] font-semibold">
                      GET / PATCH /users/{resolvedCurrentUser?.id ?? ":id"}
                    </code>
                    .
                  </p>
                </div>
              </header>

              <section className="max-w-[560px] rounded-[16px] border border-[#eaecf4] bg-white p-6 shadow-[0_2px_12px_rgba(16,24,40,0.03)]">
                <div className="flex items-center gap-4 pb-5 border-b border-[#f0f1f7]">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#673de6] to-[#4e26c7] text-[20px] font-bold text-white">
                    {resolvedCurrentUser?.name?.charAt(0).toUpperCase() || (
                      <UserIcon className="w-6 h-6" />
                    )}
                  </span>
                  <div className="text-start">
                    <h2 className="text-[18px] font-bold text-[#111318]">
                      {resolvedCurrentUser?.name || "Authenticated User"}
                    </h2>
                    <p className="text-[13.5px] text-[#64697a]">
                      {resolvedCurrentUser?.email || "—"}
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleSaveProfile}
                  className="mt-5 space-y-4 text-start"
                >
                  <div>
                    <label
                      htmlFor="profile-name"
                      className="block text-[13.5px] font-semibold text-[#181b25] mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      id="profile-name"
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="h-11 w-full rounded-[10px] border border-[#d8dde8] bg-white px-3.5 text-[14px] text-[#181b25] outline-none focus:border-[#5b34de] focus:ring-3 focus:ring-[#5b34de]/15"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-email"
                      className="block text-[13.5px] font-semibold text-[#181b25] mb-1.5"
                    >
                      Email
                    </label>
                    <input
                      id="profile-email"
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="h-11 w-full rounded-[10px] border border-[#d8dde8] bg-white px-3.5 text-[14px] text-[#181b25] outline-none focus:border-[#5b34de] focus:ring-3 focus:ring-[#5b34de]/15"
                    />
                  </div>

                  {profileFeedback && (
                    <div
                      className={
                        profileFeedback.type === "success"
                          ? "rounded-[10px] border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[13px] font-medium text-emerald-800"
                          : "rounded-[10px] border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700"
                      }
                    >
                      {profileFeedback.text}
                    </div>
                  )}

                  <div className="pt-1 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={
                        updateUserMutation.isPending || !resolvedCurrentUser
                      }
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-[#673de6] to-[#5329d1] px-5 text-[14px] font-semibold text-white shadow-[0_6px_16px_-5px_rgba(91,52,222,0.55)] hover:from-[#5c32db] hover:to-[#4720c2] disabled:opacity-60 cursor-pointer"
                    >
                      {updateUserMutation.isPending && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      <span>Save Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("users")}
                      className="h-10 rounded-[10px] border border-[#dfe3ee] bg-white px-4 text-[14px] font-semibold text-[#4b5163] hover:bg-[#f6f7fb] cursor-pointer"
                    >
                      Back to Users
                    </button>
                  </div>
                </form>
              </section>
            </>
          ) : (
            <>
              {/* Header Row */}
              <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileSidebarOpen(true)}
                    aria-label="Open menu"
                    className="lg:hidden mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#dfe3ee] bg-white text-[#374151] hover:bg-[#f4f5fa] cursor-pointer"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <div className="text-start">
                    <h1 className="text-[25px] sm:text-[28px] font-bold tracking-tight text-[#111318] leading-tight">
                      Users Management
                    </h1>
                    <p className="mt-1 text-[14px] text-[#5e6373]">
                      Manage all users in the system. You can create, view,
                      update, and delete users.
                    </p>
                  </div>
                </div>

                {/* Search & Create Action */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex items-center h-[42px] w-full sm:w-[275px] rounded-[10px] border border-[#dfe3ee] bg-white px-3.5 transition-all focus-within:border-[#5b34de] focus-within:ring-3 focus-within:ring-[#5b34de]/15">
                    <Search
                      className="w-4 h-4 shrink-0 text-[#7a8194] me-2.5"
                      strokeWidth={2}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search users by name or email..."
                      aria-label="Search users by name or email"
                      className="h-full w-full bg-transparent text-start text-[13.5px] text-[#181b25] placeholder:text-[#969db0] outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => usersQuery.refetch()}
                    disabled={usersQuery.isFetching}
                    title="Refresh users list"
                    aria-label="Refresh users list"
                    className="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] border border-[#dfe3ee] bg-white text-[#4b5163] hover:bg-[#f4f5fa] disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${usersQuery.isFetching ? "animate-spin" : ""}`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenCreate}
                    className="inline-flex h-[42px] shrink-0 items-center justify-center gap-1.5 rounded-[10px] bg-gradient-to-r from-[#673de6] to-[#5329d1] px-4.5 text-[14px] font-semibold text-white shadow-[0_6px_16px_-5px_rgba(91,52,222,0.55)] transition-all hover:from-[#5c32db] hover:to-[#4720c2] active:scale-[0.99] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2.4} />
                    <span>Create User</span>
                  </button>
                </div>
              </header>

              {/* 4 Stat Cards */}
              <UsersStatsGrid
                totalUsers={stats.totalUsers}
                adminsCount={stats.adminsCount}
                activeCount={stats.activeCount}
                inactiveCount={stats.inactiveCount}
              />

              {/* API Error Banner */}
              {usersQuery.isError && (
                <div
                  role="alert"
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[14px] border border-red-200 bg-red-50 px-5 py-4 text-start text-[14px] text-red-700"
                >
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">
                        Failed to load users from {ENV.API_URL}/users
                      </p>
                      <p className="text-[13px] text-red-600 mt-0.5">
                        {extractApiErrorMessage(usersQuery.error)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => usersQuery.refetch()}
                    className="self-start sm:self-center shrink-0 rounded-[9px] bg-red-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-red-700 cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Loading State vs Users Table */}
              {usersQuery.isLoading ? (
                <section className="rounded-[16px] border border-[#eaecf4] bg-white p-12 flex flex-col items-center justify-center gap-3 text-[#64697a] shadow-[0_2px_12px_rgba(16,24,40,0.03)]">
                  <Loader2 className="w-7 h-7 animate-spin text-[#5b34de]" />
                  <p className="text-[14px] font-medium">
                    Loading users from {ENV.API_URL}/users...
                  </p>
                </section>
              ) : (
                <UsersTable
                  users={paginatedUsers}
                  totalFilteredCount={filteredUsers.length}
                  currentPage={safePage}
                  totalPages={totalPages}
                  pageSize={PAGE_SIZE}
                  selectedIds={selectedIds}
                  onToggleSelect={handleToggleSelect}
                  onToggleSelectAll={handleToggleSelectAll}
                  onPageChange={setCurrentPage}
                  onViewUser={setViewingUser}
                  onEditUser={handleOpenEdit}
                  onDeleteUser={(user) => {
                    setModalApiError(null);
                    setDeletingUser(user);
                  }}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Live API Modals */}
      <UserFormModal
        open={formModalOpen}
        mode={formMode}
        initialUser={editingUser}
        isSubmitting={
          createUserMutation.isPending || updateUserMutation.isPending
        }
        apiError={modalApiError}
        onClose={() => {
          setFormModalOpen(false);
          setEditingUser(null);
          setModalApiError(null);
        }}
        onSubmit={handleSaveUser}
      />

      <ViewUserModal user={viewingUser} onClose={() => setViewingUser(null)} />

      <DeleteUserModal
        user={deletingUser}
        isDeleting={deleteUserMutation.isPending}
        apiError={modalApiError}
        onClose={() => {
          setDeletingUser(null);
          setModalApiError(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

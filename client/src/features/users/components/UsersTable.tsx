"use client";

import React from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Crown,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { UserItem } from "../utils/mockUsers";

interface UsersTableProps {
  users: UserItem[];
  totalFilteredCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onPageChange: (page: number) => void;
  onViewUser: (user: UserItem) => void;
  onEditUser: (user: UserItem) => void;
  onDeleteUser: (user: UserItem) => void;
}

export default function UsersTable({
  users,
  totalFilteredCount,
  currentPage,
  totalPages,
  pageSize,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onPageChange,
  onViewUser,
  onEditUser,
  onDeleteUser,
}: UsersTableProps) {
  const allVisibleSelected =
    users.length > 0 && users.every((u) => selectedIds.includes(u.id));

  const startItem =
    totalFilteredCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalFilteredCount);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <section className="rounded-[16px] border border-[#eaecf4] bg-white shadow-[0_2px_12px_rgba(16,24,40,0.03)] overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f1f7]">
        <h2 className="text-[17px] font-bold text-[#111318]">Users List</h2>
        {selectedIds.length > 0 && (
          <span className="rounded-full bg-[#efeaff] px-3 py-1 text-[12px] font-semibold text-[#5b34de]">
            {selectedIds.length} selected
          </span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] border-collapse text-start">
          <thead>
            <tr className="border-b border-[#f0f1f7] bg-[#fbfbfe] text-[13px] font-semibold text-[#525768]">
              <th className="w-12 py-3.5 ps-6 pe-2">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={onToggleSelectAll}
                    aria-label="Select all visible users"
                    className="peer sr-only"
                  />
                  <span className="flex h-[17px] w-[17px] items-center justify-center rounded-[4px] border border-[#cbd2e1] bg-white transition-colors peer-checked:border-[#5b34de] peer-checked:bg-[#5b34de]">
                    {allVisibleSelected && (
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    )}
                  </span>
                </label>
              </th>
              <th className="w-14 py-3.5 px-3 text-start">#</th>
              <th className="py-3.5 px-3 text-start">Name</th>
              <th className="py-3.5 px-3 text-start">Email</th>
              <th className="py-3.5 px-3 text-start">Role</th>
              <th className="py-3.5 px-3 text-start">Status</th>
              <th className="py-3.5 px-3 text-start">Created At</th>
              <th className="py-3.5 ps-3 pe-6 text-start">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#f1f2f8] text-[14px]">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-14 px-6 text-center text-[14.5px] text-[#64697a]"
                >
                  No users matched your search. Try a different name or email.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isSelected = selectedIds.includes(user.id);
                const initial = user.name.trim().charAt(0).toUpperCase() || "?";

                return (
                  <tr
                    key={user.id}
                    className={cn(
                      "transition-colors hover:bg-[#fafaff]",
                      isSelected && "bg-[#f6f3ff]/60"
                    )}
                  >
                    <td className="py-3.5 ps-6 pe-2">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelect(user.id)}
                          aria-label={`Select ${user.name}`}
                          className="peer sr-only"
                        />
                        <span className="flex h-[17px] w-[17px] items-center justify-center rounded-[4px] border border-[#cbd2e1] bg-white transition-colors peer-checked:border-[#5b34de] peer-checked:bg-[#5b34de]">
                          {isSelected && (
                            <Check
                              className="w-3 h-3 text-white"
                              strokeWidth={3}
                            />
                          )}
                        </span>
                      </label>
                    </td>

                    <td className="py-3.5 px-3 font-medium text-[#4b5163]">
                      {user.id}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold",
                            user.avatarColor
                          )}
                        >
                          {initial}
                        </span>
                        <span className="font-semibold text-[#181b25]">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-[#4b5163]">{user.email}</td>

                    <td className="py-3.5 px-3">
                      {user.role === "Admin" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#efeaff] px-3 py-1 text-[12.5px] font-semibold text-[#5b34de]">
                          <Crown className="w-3.5 h-3.5" strokeWidth={2.1} />
                          <span>Admin</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-[#e8f2ff] px-3 py-1 text-[12.5px] font-semibold text-[#2563eb]">
                          User
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      {user.status === "Active" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f9ef] px-3 py-1 text-[12.5px] font-semibold text-[#15803d]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#feecec] px-3 py-1 text-[12.5px] font-semibold text-[#dc2626]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#dc2626]" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-[#4b5163] whitespace-nowrap">
                      {user.createdAt}
                    </td>

                    <td className="py-3.5 ps-3 pe-6">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onViewUser(user)}
                          title="View user"
                          aria-label={`View ${user.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#f4f5fa] text-[#374151] hover:bg-[#e8ebf5] hover:text-[#111318] transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" strokeWidth={1.85} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onEditUser(user)}
                          title="Edit user"
                          aria-label={`Edit ${user.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#f4f5fa] text-[#374151] hover:bg-[#efeaff] hover:text-[#5b34de] transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" strokeWidth={1.85} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteUser(user)}
                          title="Delete user"
                          aria-label={`Delete ${user.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#fef0f0] text-[#dc2626] hover:bg-[#fde0e0] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.85} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#f0f1f7] px-6 py-4">
        <p className="text-[13.5px] text-[#5e6373]">
          {totalFilteredCount === 0
            ? "Showing 0 users"
            : `Showing ${startItem}–${endItem} of ${totalFilteredCount} users`}
        </p>

        {totalPages > 0 && (
          <nav
            aria-label="Users pagination"
            className="flex items-center gap-1.5"
          >
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              aria-label="Previous page"
              className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-[#e3e6f2] bg-white text-[#4b5163] hover:bg-[#f5f6fb] disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" strokeWidth={2} />
            </button>

            {pageNumbers.map((page) => {
              const isCurrent = page === currentPage;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange(page)}
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(
                    "flex h-9 min-w-9 items-center justify-center rounded-[9px] px-2.5 text-[13.5px] font-semibold transition-all cursor-pointer",
                    isCurrent
                      ? "bg-[#5b34de] text-white shadow-[0_4px_12px_-3px_rgba(91,52,222,0.55)]"
                      : "border border-[#e3e6f2] bg-white text-[#374151] hover:bg-[#f5f6fb]"
                  )}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              aria-label="Next page"
              className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-[#e3e6f2] bg-white text-[#4b5163] hover:bg-[#f5f6fb] disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight
                className="w-4 h-4 rtl:rotate-180"
                strokeWidth={2}
              />
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}

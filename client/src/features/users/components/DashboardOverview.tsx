"use client";

import React, { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Crown,
  Eye,
  KeyRound,
  Loader2,
  Menu,
  Pencil,
  Plus,
  RefreshCw,
  Server,
  ShieldCheck,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";
import { ENV } from "@/config/env";
import { cn } from "@/lib/cn";
import type { UserItem } from "../utils/mockUsers";

interface DashboardOverviewProps {
  currentUserName: string;
  users: UserItem[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRefresh: () => void;
  onOpenMobileMenu: () => void;
  onOpenCreateUser: () => void;
  onNavigateToUsers: () => void;
  onNavigateToProfile: () => void;
  onViewUser: (user: UserItem) => void;
  onEditUser: (user: UserItem) => void;
}

const API_ENDPOINTS = [
  { method: "POST", path: "/login", badge: "bg-[#efeaff] text-[#5b34de]" },
  { method: "POST", path: "/register", badge: "bg-[#efeaff] text-[#5b34de]" },
  { method: "GET", path: "/users", badge: "bg-[#e8f9ef] text-[#15803d]" },
  { method: "PATCH", path: "/users/:id", badge: "bg-[#e8f2ff] text-[#2563eb]" },
  { method: "DELETE", path: "/users/:id", badge: "bg-[#feecec] text-[#dc2626]" },
] as const;

export default function DashboardOverview({
  currentUserName,
  users,
  isLoading,
  isFetching,
  isError,
  onRefresh,
  onOpenMobileMenu,
  onOpenCreateUser,
  onNavigateToUsers,
  onNavigateToProfile,
  onViewUser,
  onEditUser,
}: DashboardOverviewProps) {
  const [donutMode, setDonutMode] = useState<"status" | "role">("status");

  const metrics = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === "Admin").length;
    const regularUsers = total - admins;
    const active = users.filter((u) => u.status === "Active").length;
    const inactive = total - active;

    const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;
    const adminPercent = total > 0 ? Math.round((admins / total) * 100) : 0;
    const inactivePercent = total > 0 ? Math.round((inactive / total) * 100) : 0;

    return {
      total,
      admins,
      regularUsers,
      active,
      inactive,
      activePercent,
      adminPercent,
      inactivePercent,
    };
  }, [users]);

  const recentUsers = useMemo(() => {
    return [...users].sort((a, b) => Number(b.id) - Number(a.id)).slice(0, 5);
  }, [users]);

  const formattedToday = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date());
  }, []);

  // SVG Donut math
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const primarySegmentCount =
    donutMode === "status" ? metrics.active : metrics.admins;
  const secondarySegmentCount =
    donutMode === "status" ? metrics.inactive : metrics.regularUsers;
  const primaryRatio =
    metrics.total > 0 ? primarySegmentCount / metrics.total : 0;
  const primaryStrokeLength = primaryRatio * circumference;
  const secondaryStrokeLength = circumference - primaryStrokeLength;

  const primaryColor = donutMode === "status" ? "#16a34a" : "#5b34de";
  const secondaryColor = donutMode === "status" ? "#f87171" : "#60a5fa";

  const breakdownBars = [
    {
      label: "Active Users",
      count: metrics.active,
      percent: metrics.activePercent,
      barClass: "bg-gradient-to-r from-[#22c55e] to-[#16a34a]",
      dotClass: "bg-[#16a34a]",
      pillClass: "bg-[#e8f9ef] text-[#15803d]",
    },
    {
      label: "Standard Users",
      count: metrics.regularUsers,
      percent:
        metrics.total > 0
          ? Math.round((metrics.regularUsers / metrics.total) * 100)
          : 0,
      barClass: "bg-gradient-to-r from-[#60a5fa] to-[#2563eb]",
      dotClass: "bg-[#2563eb]",
      pillClass: "bg-[#e8f2ff] text-[#2563eb]",
    },
    {
      label: "Administrators",
      count: metrics.admins,
      percent: metrics.adminPercent,
      barClass: "bg-gradient-to-r from-[#7c53f5] to-[#5b34de]",
      dotClass: "bg-[#5b34de]",
      pillClass: "bg-[#efeaff] text-[#5b34de]",
    },
    {
      label: "Inactive Users",
      count: metrics.inactive,
      percent: metrics.inactivePercent,
      barClass: "bg-gradient-to-r from-[#f87171] to-[#dc2626]",
      dotClass: "bg-[#dc2626]",
      pillClass: "bg-[#feecec] text-[#dc2626]",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Hero Card */}
      <header className="relative overflow-hidden rounded-[20px] border border-[#e5e8f4] bg-white px-6 py-6 sm:px-7 shadow-[0_4px_20px_-6px_rgba(24,16,66,0.06)]">
        {/* Subtle decorative soft purple glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -end-16 h-56 w-56 rounded-full bg-[#673de6]/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 end-1/4 h-44 w-44 rounded-full bg-[#8b6bff]/10 blur-3xl"
        />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={onOpenMobileMenu}
              aria-label="Open menu"
              className="lg:hidden mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#dfe3ee] bg-white text-[#374151] hover:bg-[#f4f5fa] cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="text-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e7e1ff] bg-[#f6f3ff] px-3 py-1 text-[12px] font-semibold text-[#5b34de] mb-2.5">
                <Activity className="w-3.5 h-3.5" />
                <span>Overview</span>
                <span className="text-[#c5b8f8]">•</span>
                <span className="text-[#64697a] font-medium">
                  {formattedToday}
                </span>
              </div>

              <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-[#111318] leading-tight">
                Welcome back, {currentUserName} 👋
              </h1>
              <p className="mt-1.5 text-[14px] text-[#5e6373] max-w-[560px]">
                Monitor workspace users, account health, and authentication
                endpoints in real time.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-[10px] border px-3 py-2 text-[12.5px] font-semibold",
                isError
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              )}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  isError ? "bg-red-500" : "bg-emerald-500 animate-pulse"
                )}
              />
              <span>{isError ? "API Offline" : "API Connected"}</span>
            </span>

            <button
              type="button"
              onClick={onRefresh}
              disabled={isFetching}
              title="Refresh dashboard data"
              aria-label="Refresh dashboard data"
              className="inline-flex h-[40px] w-[40px] items-center justify-center rounded-[10px] border border-[#dfe3ee] bg-white text-[#4b5163] hover:bg-[#f4f5fa] disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw
                className={cn("w-4 h-4", isFetching && "animate-spin")}
              />
            </button>

            <button
              type="button"
              onClick={onOpenCreateUser}
              className="inline-flex h-[40px] items-center justify-center gap-1.5 rounded-[10px] bg-gradient-to-r from-[#673de6] to-[#5329d1] px-4 text-[13.5px] font-semibold text-white shadow-[0_6px_16px_-5px_rgba(91,52,222,0.55)] transition-all hover:from-[#5c32db] hover:to-[#4720c2] active:scale-[0.99] cursor-pointer"
            >
              <Plus className="w-4 h-4" strokeWidth={2.4} />
              <span>Create User</span>
            </button>
          </div>
        </div>
      </header>

      {/* 4 Upgraded KPI Cards */}
      <section
        aria-label="Key metrics"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {/* Total Users */}
        <div className="group rounded-[16px] border border-[#eaecf4] bg-white p-5 shadow-[0_2px_12px_rgba(16,24,40,0.025)] transition-all hover:border-[#d5ccff] hover:shadow-[0_8px_24px_-12px_rgba(91,52,222,0.22)]">
          <div className="flex items-center justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#efeaff] text-[#5b34de]">
              <Users className="w-5 h-5" strokeWidth={1.9} />
            </span>
            <span className="rounded-full bg-[#f4f1ff] px-2.5 py-1 text-[11.5px] font-semibold text-[#5b34de]">
              Directory
            </span>
          </div>
          <div className="mt-4 text-start">
            <p className="text-[13px] font-medium text-[#5e6373]">Total Users</p>
            <div className="mt-1 flex items-baseline justify-between">
              <p className="text-[28px] font-bold tracking-tight text-[#111318]">
                {isLoading ? "—" : metrics.total}
              </p>
              <button
                type="button"
                onClick={onNavigateToUsers}
                className="text-[12.5px] font-semibold text-[#5b34de] hover:underline cursor-pointer"
              >
                Manage →
              </button>
            </div>
          </div>
        </div>

        {/* Active Rate */}
        <div className="group rounded-[16px] border border-[#eaecf4] bg-white p-5 shadow-[0_2px_12px_rgba(16,24,40,0.025)] transition-all hover:border-emerald-200 hover:shadow-[0_8px_24px_-12px_rgba(22,163,74,0.18)]">
          <div className="flex items-center justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#e8f9ef] text-[#16a34a]">
              <UserCheck className="w-5 h-5" strokeWidth={1.9} />
            </span>
            <span className="rounded-full bg-[#e8f9ef] px-2.5 py-1 text-[11.5px] font-semibold text-[#15803d]">
              {isLoading ? "—" : `${metrics.activePercent}%`}
            </span>
          </div>
          <div className="mt-4 text-start">
            <p className="text-[13px] font-medium text-[#5e6373]">
              Active Accounts
            </p>
            <p className="mt-1 text-[28px] font-bold tracking-tight text-[#111318]">
              {isLoading ? "—" : metrics.active}
            </p>
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[#eef0f6]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] transition-all duration-500"
                style={{ width: `${metrics.activePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Admins */}
        <div className="group rounded-[16px] border border-[#eaecf4] bg-white p-5 shadow-[0_2px_12px_rgba(16,24,40,0.025)] transition-all hover:border-[#d5ccff] hover:shadow-[0_8px_24px_-12px_rgba(91,52,222,0.22)]">
          <div className="flex items-center justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#f3eeff] text-[#6d3ae8]">
              <Crown className="w-5 h-5" strokeWidth={1.9} />
            </span>
            <span className="rounded-full bg-[#f3eeff] px-2.5 py-1 text-[11.5px] font-semibold text-[#6d3ae8]">
              {isLoading ? "—" : `${metrics.adminPercent}% share`}
            </span>
          </div>
          <div className="mt-4 text-start">
            <p className="text-[13px] font-medium text-[#5e6373]">
              Administrators
            </p>
            <p className="mt-1 text-[28px] font-bold tracking-tight text-[#111318]">
              {isLoading ? "—" : metrics.admins}
            </p>
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[#eef0f6]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7c53f5] to-[#5b34de] transition-all duration-500"
                style={{ width: `${metrics.adminPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Inactive Users */}
        <div className="group rounded-[16px] border border-[#eaecf4] bg-white p-5 shadow-[0_2px_12px_rgba(16,24,40,0.025)] transition-all hover:border-rose-200 hover:shadow-[0_8px_24px_-12px_rgba(220,38,38,0.16)]">
          <div className="flex items-center justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#feecec] text-[#dc2626]">
              <UserX className="w-5 h-5" strokeWidth={1.9} />
            </span>
            <span className="rounded-full bg-[#feecec] px-2.5 py-1 text-[11.5px] font-semibold text-[#dc2626]">
              {isLoading ? "—" : `${metrics.inactivePercent}%`}
            </span>
          </div>
          <div className="mt-4 text-start">
            <p className="text-[13px] font-medium text-[#5e6373]">
              Inactive Accounts
            </p>
            <p className="mt-1 text-[28px] font-bold tracking-tight text-[#111318]">
              {isLoading ? "—" : metrics.inactive}
            </p>
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[#eef0f6]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#f87171] to-[#dc2626] transition-all duration-500"
                style={{ width: `${metrics.inactivePercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Row: Breakdown Bars + Donut Ring */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left: User Composition Bars */}
        <div className="xl:col-span-7 rounded-[18px] border border-[#eaecf4] bg-white p-6 shadow-[0_2px_12px_rgba(16,24,40,0.03)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="text-start">
              <h2 className="text-[17px] font-bold text-[#111318]">
                User Composition
              </h2>
              <p className="text-[13px] text-[#64697a] mt-0.5">
                Live distribution across roles and account status
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f5fa] px-3 py-1 text-[12px] font-semibold text-[#4b5163]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5b34de]" />
              <span>Synced with db.json</span>
            </span>
          </div>

          {isLoading ? (
            <div className="py-12 flex items-center justify-center gap-2.5 text-[#64697a]">
              <Loader2 className="w-5 h-5 animate-spin text-[#5b34de]" />
              <span className="text-[14px]">Loading analytics...</span>
            </div>
          ) : (
            <div className="space-y-5">
              {breakdownBars.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-[13.5px]">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn("h-2.5 w-2.5 rounded-full", item.dotClass)}
                      />
                      <span className="font-semibold text-[#181b25]">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#111318]">
                        {item.count}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[11.5px] font-semibold",
                          item.pillClass
                        )}
                      >
                        {item.percent}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#f1f2f8]">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        item.barClass
                      )}
                      style={{
                        width:
                          item.count > 0 ? `${Math.max(item.percent, 4)}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Interactive Donut Chart */}
        <div className="xl:col-span-5 rounded-[18px] border border-[#eaecf4] bg-white p-6 shadow-[0_2px_12px_rgba(16,24,40,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-5">
            <div className="text-start">
              <h2 className="text-[17px] font-bold text-[#111318]">
                Account Ratio
              </h2>
              <p className="text-[13px] text-[#64697a] mt-0.5">
                {donutMode === "status"
                  ? "Active vs Inactive users"
                  : "Admins vs Standard users"}
              </p>
            </div>

            <div className="inline-flex rounded-[10px] border border-[#e6e9f4] bg-[#f7f8fc] p-1">
              <button
                type="button"
                onClick={() => setDonutMode("status")}
                className={cn(
                  "rounded-[7px] px-2.5 py-1 text-[12px] font-semibold transition-all cursor-pointer",
                  donutMode === "status"
                    ? "bg-white text-[#5b34de] shadow-xs"
                    : "text-[#64697a] hover:text-[#181b25]"
                )}
              >
                Status
              </button>
              <button
                type="button"
                onClick={() => setDonutMode("role")}
                className={cn(
                  "rounded-[7px] px-2.5 py-1 text-[12px] font-semibold transition-all cursor-pointer",
                  donutMode === "role"
                    ? "bg-white text-[#5b34de] shadow-xs"
                    : "text-[#64697a] hover:text-[#181b25]"
                )}
              >
                Role
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row xl:flex-col 2xl:flex-row items-center justify-center gap-6 my-auto">
            {/* SVG Donut */}
            <div className="relative flex h-[156px] w-[156px] shrink-0 items-center justify-center">
              <svg
                viewBox="0 0 148 148"
                className="h-full w-full -rotate-90"
                aria-hidden="true"
              >
                <circle
                  cx="74"
                  cy="74"
                  r={radius}
                  fill="none"
                  stroke="#f0f1f8"
                  strokeWidth="16"
                />
                {metrics.total > 0 && (
                  <>
                    <circle
                      cx="74"
                      cy="74"
                      r={radius}
                      fill="none"
                      stroke={secondaryColor}
                      strokeWidth="16"
                      strokeDasharray={`${secondaryStrokeLength} ${circumference}`}
                      strokeDashoffset={-primaryStrokeLength}
                      strokeLinecap="butt"
                      className="transition-all duration-500"
                    />
                    <circle
                      cx="74"
                      cy="74"
                      r={radius}
                      fill="none"
                      stroke={primaryColor}
                      strokeWidth="16"
                      strokeDasharray={`${primaryStrokeLength} ${circumference}`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </>
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[26px] font-bold text-[#111318] leading-none">
                  {isLoading ? "—" : metrics.total}
                </span>
                <span className="mt-1 text-[12px] font-medium text-[#64697a]">
                  Total Users
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between rounded-[12px] border border-[#f0f1f7] bg-[#fbfbfe] px-3.5 py-2.5">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <span className="text-[13.5px] font-semibold text-[#181b25]">
                    {donutMode === "status" ? "Active" : "Admins"}
                  </span>
                </div>
                <span className="text-[14px] font-bold text-[#111318]">
                  {primarySegmentCount}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-[12px] border border-[#f0f1f7] bg-[#fbfbfe] px-3.5 py-2.5">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: secondaryColor }}
                  />
                  <span className="text-[13.5px] font-semibold text-[#181b25]">
                    {donutMode === "status" ? "Inactive" : "Standard Users"}
                  </span>
                </div>
                <span className="text-[14px] font-bold text-[#111318]">
                  {secondarySegmentCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Row: Recent Users + Quick Actions & API Status */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Recent Users Card */}
        <div className="xl:col-span-7 rounded-[18px] border border-[#eaecf4] bg-white shadow-[0_2px_12px_rgba(16,24,40,0.03)] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#f0f1f7]">
            <div className="text-start">
              <h2 className="text-[17px] font-bold text-[#111318]">
                Recent Users
              </h2>
              <p className="text-[12.5px] text-[#64697a] mt-0.5">
                Latest accounts in your workspace
              </p>
            </div>
            <button
              type="button"
              onClick={onNavigateToUsers}
              className="inline-flex items-center gap-1.5 rounded-[9px] bg-[#f4f1ff] px-3 py-1.5 text-[13px] font-semibold text-[#5b34de] hover:bg-[#ebe5ff] transition-colors cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          {isLoading ? (
            <div className="p-10 flex items-center justify-center gap-2.5 text-[#64697a]">
              <Loader2 className="w-5 h-5 animate-spin text-[#5b34de]" />
              <span className="text-[14px]">Loading recent users...</span>
            </div>
          ) : recentUsers.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-[14px] text-[#64697a]">
                No users found in the database yet.
              </p>
              <button
                type="button"
                onClick={onOpenCreateUser}
                className="mt-3 inline-flex items-center gap-1.5 rounded-[10px] bg-[#5b34de] px-4 py-2 text-[13.5px] font-semibold text-white hover:bg-[#4b27c7] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create First User</span>
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-[#f2f3f8]">
              {recentUsers.map((user) => {
                const initial = user.name.trim().charAt(0).toUpperCase() || "?";
                return (
                  <li
                    key={user.id}
                    className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 px-6 py-3.5 hover:bg-[#fafaff] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13.5px] font-semibold",
                          user.avatarColor
                        )}
                      >
                        {initial}
                      </span>
                      <div className="min-w-0 text-start">
                        <p className="truncate text-[14px] font-semibold text-[#181b25]">
                          {user.name}
                        </p>
                        <p className="truncate text-[12.5px] text-[#64697a]">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ms-auto">
                      {user.role === "Admin" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#efeaff] px-2.5 py-0.5 text-[11.5px] font-semibold text-[#5b34de]">
                          <Crown className="w-3 h-3" />
                          <span>Admin</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-[#e8f2ff] px-2.5 py-0.5 text-[11.5px] font-semibold text-[#2563eb]">
                          User
                        </span>
                      )}

                      <span
                        className={cn(
                          "hidden sm:inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold",
                          user.status === "Active"
                            ? "bg-[#e8f9ef] text-[#15803d]"
                            : "bg-[#feecec] text-[#dc2626]"
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            user.status === "Active"
                              ? "bg-[#16a34a]"
                              : "bg-[#dc2626]"
                          )}
                        />
                        <span>{user.status}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => onViewUser(user)}
                        title="View user"
                        aria-label={`View ${user.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#f4f5fa] text-[#4b5163] hover:bg-[#e8ebf5] cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditUser(user)}
                        title="Edit user"
                        aria-label={`Edit ${user.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#f4f5fa] text-[#4b5163] hover:bg-[#efeaff] hover:text-[#5b34de] cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Right Column: Quick Actions + API Status */}
        <div className="xl:col-span-5 space-y-5">
          {/* Quick Actions Card */}
          <div className="rounded-[18px] border border-[#eaecf4] bg-white p-5 shadow-[0_2px_12px_rgba(16,24,40,0.03)]">
            <h2 className="text-[16px] font-bold text-[#111318] text-start mb-3.5">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={onOpenCreateUser}
                className="flex items-center justify-between rounded-[12px] border border-[#eceef6] bg-[#fbfbfe] px-4 py-3 text-start transition-all hover:border-[#cfc4ff] hover:bg-[#f6f3ff] cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#efeaff] text-[#5b34de]">
                    <UserPlus className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="text-[13.5px] font-semibold text-[#181b25]">
                      Add New User
                    </p>
                    <p className="text-[12px] text-[#64697a]">
                      Create an account via POST /users
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8c92a4] group-hover:text-[#5b34de] transition-colors rtl:rotate-180" />
              </button>

              <button
                type="button"
                onClick={onNavigateToUsers}
                className="flex items-center justify-between rounded-[12px] border border-[#eceef6] bg-[#fbfbfe] px-4 py-3 text-start transition-all hover:border-[#cfc4ff] hover:bg-[#f6f3ff] cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#e8f2ff] text-[#2563eb]">
                    <Users className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="text-[13.5px] font-semibold text-[#181b25]">
                      Open Users Directory
                    </p>
                    <p className="text-[12px] text-[#64697a]">
                      Search, paginate, edit & delete users
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8c92a4] group-hover:text-[#5b34de] transition-colors rtl:rotate-180" />
              </button>

              <button
                type="button"
                onClick={onNavigateToProfile}
                className="flex items-center justify-between rounded-[12px] border border-[#eceef6] bg-[#fbfbfe] px-4 py-3 text-start transition-all hover:border-[#cfc4ff] hover:bg-[#f6f3ff] cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#e8f9ef] text-[#15803d]">
                    <UserCog className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="text-[13.5px] font-semibold text-[#181b25]">
                      Account Settings
                    </p>
                    <p className="text-[12px] text-[#64697a]">
                      Update your profile name & email
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8c92a4] group-hover:text-[#5b34de] transition-colors rtl:rotate-180" />
              </button>
            </div>
          </div>

          {/* Auth Server Status Card */}
          <div className="rounded-[18px] border border-[#eaecf4] bg-white p-5 shadow-[0_2px_12px_rgba(16,24,40,0.03)]">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[#5b34de]" />
                <h2 className="text-[15px] font-bold text-[#111318]">
                  Auth API Server
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f9ef] px-2.5 py-0.5 text-[11.5px] font-semibold text-[#15803d]">
                <KeyRound className="w-3 h-3" />
                <span>JWT Active</span>
              </span>
            </div>

            <div className="rounded-[10px] bg-[#f7f8fc] border border-[#eaecf4] px-3.5 py-2.5 flex items-center justify-between text-[12.5px] mb-3.5">
              <span className="text-[#64697a]">Base URL</span>
              <code className="font-semibold text-[#181b25]">{ENV.API_URL}</code>
            </div>

            <div className="flex flex-wrap gap-2">
              {API_ENDPOINTS.map((ep) => (
                <span
                  key={`${ep.method}-${ep.path}`}
                  className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#eceef6] bg-[#fbfbfe] px-2.5 py-1 text-[11.5px] font-medium text-[#374151]"
                >
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-bold",
                      ep.badge
                    )}
                  >
                    {ep.method}
                  </span>
                  <code>{ep.path}</code>
                </span>
              ))}
            </div>

            {!isError && (
              <p className="mt-3.5 flex items-center gap-1.5 text-[12px] text-[#5e6373]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />
                <span>Bearer token automatically attached to all requests.</span>
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

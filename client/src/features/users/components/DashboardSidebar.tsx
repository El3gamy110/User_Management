"use client";

import React from "react";
import {
  ChevronDown,
  Home,
  LogOut,
  User,
  Users,
  X,
} from "lucide-react";
import AuthBrand from "@/features/auth/components/AuthBrand";
import { cn } from "@/lib/cn";

export type SidebarTab = "dashboard" | "users" | "profile";

interface CurrentUserSummary {
  name: string;
  email: string;
}

interface DashboardSidebarProps {
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  currentUser: CurrentUserSummary | null;
  onLogout: () => void;
}

const NAV_ITEMS: {
  id: SidebarTab;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "users", label: "Users", icon: Users },
  { id: "profile", label: "Profile", icon: User },
];

export default function DashboardSidebar({
  activeTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  currentUser,
  onLogout,
}: DashboardSidebarProps) {
  const displayName = currentUser?.name || "Admin User";
  const displayEmail = currentUser?.email || "admin@example.com";
  const initial = displayName.trim().charAt(0).toUpperCase() || "A";

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-[#fbfbfe] px-4 py-6">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 mb-8">
          <AuthBrand orientation="horizontal" />
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
            className="lg:hidden rounded-lg p-1.5 text-[#64697a] hover:bg-[#eef0f7] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Main navigation" className="space-y-1.5">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onSelectTab(id);
                  onCloseMobile();
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[14.5px] transition-colors cursor-pointer",
                  isActive
                    ? "bg-[#e7e1ff] text-[#552ed8] font-semibold"
                    : "text-[#2c3140] font-medium hover:bg-[#f0f1f8]"
                )}
              >
                <Icon
                  className={cn(
                    "w-[18px] h-[18px]",
                    isActive ? "text-[#552ed8]" : "text-[#4b5163]"
                  )}
                  strokeWidth={1.9}
                />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="my-5 border-t border-[#eaecf4]" />

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[14.5px] font-medium text-[#dc2626] hover:bg-[#fef2f2] transition-colors cursor-pointer"
        >
          <LogOut
            className="w-[18px] h-[18px] rtl:rotate-180"
            strokeWidth={1.9}
          />
          <span>Logout</span>
        </button>
      </div>

      {/* Bottom User Card */}
      <button
        type="button"
        onClick={() => {
          onSelectTab("profile");
          onCloseMobile();
        }}
        className="mt-6 flex w-full items-center gap-3 rounded-[14px] border border-[#e6e9f4] bg-white p-3 text-start shadow-[0_2px_8px_rgba(16,24,40,0.03)] hover:border-[#d5dbf0] transition-colors cursor-pointer"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#673de6] to-[#4e26c7] text-[15px] font-semibold text-white">
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold text-[#111318]">
            {displayName}
          </p>
          <p className="truncate text-[12px] text-[#64697a]">{displayEmail}</p>
        </div>
        <ChevronDown
          className="w-4 h-4 shrink-0 text-[#64697a]"
          strokeWidth={2}
        />
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[252px] shrink-0 border-e border-[#e8ebf4] bg-[#fbfbfe]">
        <div className="sticky top-0 h-screen">{sidebarContent}</div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-[#111318]/40 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 start-0 z-50 w-[264px] border-e border-[#e8ebf4] bg-[#fbfbfe] shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

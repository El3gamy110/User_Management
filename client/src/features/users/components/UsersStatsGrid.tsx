import React from "react";
import { ArrowUp, Check, Crown, Users, X } from "lucide-react";

interface UsersStatsGridProps {
  totalUsers: number;
  adminsCount: number;
  activeCount: number;
  inactiveCount: number;
}

export default function UsersStatsGrid({
  totalUsers,
  adminsCount,
  activeCount,
  inactiveCount,
}: UsersStatsGridProps) {
  return (
    <section
      aria-label="User statistics"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
    >
      {/* Total Users */}
      <div className="flex items-center justify-between rounded-[14px] border border-[#eaecf4] bg-white px-5 py-4.5 shadow-[0_2px_10px_rgba(16,24,40,0.025)]">
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef0ff] text-[#5b34de]">
            <Users className="w-5 h-5" strokeWidth={1.9} />
          </span>
          <div>
            <p className="text-[13px] font-medium text-[#5e6373]">
              Total Users
            </p>
            <p className="mt-0.5 text-[26px] font-bold leading-tight text-[#111318]">
              {totalUsers}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-0.5 self-end rounded-full bg-[#e8f9ef] px-2.5 py-1 text-[12px] font-semibold text-[#15803d]">
          <ArrowUp className="w-3 h-3" strokeWidth={2.5} />
          <span>+12%</span>
        </span>
      </div>

      {/* Admins */}
      <div className="flex items-center gap-4 rounded-[14px] border border-[#eaecf4] bg-white px-5 py-4.5 shadow-[0_2px_10px_rgba(16,24,40,0.025)]">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#efeaff] text-[#6636e6]">
          <Crown className="w-5 h-5" strokeWidth={1.9} />
        </span>
        <div>
          <p className="text-[13px] font-medium text-[#5e6373]">Admins</p>
          <p className="mt-0.5 text-[26px] font-bold leading-tight text-[#111318]">
            {adminsCount}
          </p>
        </div>
      </div>

      {/* Active Users */}
      <div className="flex items-center gap-4 rounded-[14px] border border-[#eaecf4] bg-white px-5 py-4.5 shadow-[0_2px_10px_rgba(16,24,40,0.025)]">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e8f9ef] text-[#16a34a]">
          <Check className="w-5 h-5" strokeWidth={2.3} />
        </span>
        <div>
          <p className="text-[13px] font-medium text-[#5e6373]">Active Users</p>
          <p className="mt-0.5 text-[26px] font-bold leading-tight text-[#111318]">
            {activeCount}
          </p>
        </div>
      </div>

      {/* Inactive Users */}
      <div className="flex items-center gap-4 rounded-[14px] border border-[#eaecf4] bg-white px-5 py-4.5 shadow-[0_2px_10px_rgba(16,24,40,0.025)]">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#feecec] text-[#dc2626]">
          <X className="w-5 h-5" strokeWidth={2.3} />
        </span>
        <div>
          <p className="text-[13px] font-medium text-[#5e6373]">
            Inactive Users
          </p>
          <p className="mt-0.5 text-[26px] font-bold leading-tight text-[#111318]">
            {inactiveCount}
          </p>
        </div>
      </div>
    </section>
  );
}

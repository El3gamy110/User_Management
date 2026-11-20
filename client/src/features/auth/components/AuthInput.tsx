"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/cn";

export interface AuthInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  id: string;
  icon: React.ReactNode;
  error?: string;
}

export default function AuthInput({
  label,
  id,
  type = "text",
  icon,
  error,
  className,
  ...props
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-start text-[14px] font-semibold text-[#181b25] mb-2"
      >
        {label}
      </label>

      <div
        className={cn(
          "relative flex items-center h-[48px] w-full rounded-[10px] border bg-white transition-all duration-150",
          error
            ? "border-red-400 focus-within:border-red-500 focus-within:ring-3 focus-within:ring-red-500/15"
            : "border-[#d8dde8] hover:border-[#bfc7d9] focus-within:border-[#6037e6] focus-within:ring-3 focus-within:ring-[#6037e6]/15"
        )}
      >
        <span className="pointer-events-none flex items-center justify-center ps-3.5 pe-2.5 text-[#7a8194]">
          {icon}
        </span>

        <input
          id={id}
          type={resolvedType}
          className={cn(
            "h-full w-full bg-transparent text-start text-[14.5px] text-[#181b25] placeholder:text-[#969db0] outline-none",
            isPassword ? "pe-11" : "pe-3.5",
            className
          )}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute end-3 flex items-center justify-center p-1 text-[#6b7285] hover:text-[#2a2f3d] transition-colors cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="w-[18px] h-[18px]" strokeWidth={1.8} />
            ) : (
              <Eye className="w-[18px] h-[18px]" strokeWidth={1.8} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-start text-[12.5px] font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

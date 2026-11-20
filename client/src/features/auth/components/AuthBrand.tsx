import React from "react";
import { cn } from "@/lib/cn";

interface AuthBrandProps {
  orientation?: "vertical" | "horizontal";
  className?: string;
}

export function BrandLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-9 h-9", className)}
      aria-hidden="true"
    >
      <path
        d="M18 4.5L5.5 11.25L18 18L30.5 11.25L18 4.5Z"
        fill="#5D34DF"
        stroke="#5D34DF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 17.75L18 24.5L30.5 17.75"
        stroke="#5D34DF"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 24.25L18 31L30.5 24.25"
        stroke="#5D34DF"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AuthBrand({
  orientation = "vertical",
  className,
}: AuthBrandProps) {
  return (
    <div
      className={cn(
        "flex items-center",
        orientation === "vertical"
          ? "flex-col justify-center gap-2.5"
          : "flex-row gap-2.5",
        className
      )}
    >
      <BrandLogoIcon
        className={orientation === "vertical" ? "w-10 h-10" : "w-8 h-8"}
      />
      <span
        className={cn(
          "font-bold tracking-tight text-[#111318]",
          orientation === "vertical" ? "text-[18px]" : "text-[17px]"
        )}
      >
        Json Server Auth
      </span>
    </div>
  );
}

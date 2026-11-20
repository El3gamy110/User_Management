import React from "react";
import { cn } from "@/lib/cn";

interface AuthSplitLayoutProps {
  formPanel: React.ReactNode;
  heroPanel: React.ReactNode;
  heroPosition?: "left" | "right";
  className?: string;
}

export default function AuthSplitLayout({
  formPanel,
  heroPanel,
  heroPosition = "left",
  className,
}: AuthSplitLayoutProps) {
  const heroSection = (
    <section className="relative hidden lg:flex w-full h-full flex-col items-center justify-center overflow-hidden px-10 py-11 text-white bg-gradient-to-br from-[#130b38] via-[#271569] to-[#1e1053]">
      {/* Ambient radial glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[#5b35e5]/35 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-[#6d45f3]/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#2e1678]/40 blur-3xl"
      />

      <div className="relative z-10 w-full max-w-[340px] flex flex-col items-center">
        {heroPanel}
      </div>
    </section>
  );

  const formSection = (
    <section className="flex w-full h-full flex-col items-center justify-center px-6 sm:px-10 py-10 lg:py-11 bg-gradient-to-b from-[#ffffff] via-[#fbfbfe] to-[#f6f6fc]">
      <div className="w-full max-w-[390px]">{formPanel}</div>
    </section>
  );

  return (
    <main
      className={cn(
        "min-h-screen w-full flex items-center justify-center px-4 py-8 sm:px-6 lg:px-10 bg-gradient-to-br from-[#eceef7] via-[#f4f5fb] to-[#e7eaf6]",
        className
      )}
    >
      <div className="w-full max-w-[1000px] lg:min-h-[700px] grid grid-cols-1 lg:grid-cols-2 rounded-[24px] overflow-hidden border border-[#e2e6f3] bg-white shadow-[0_24px_64px_-16px_rgba(24,16,66,0.18)]">
        {heroPosition === "left" ? (
          <>
            {heroSection}
            {formSection}
          </>
        ) : (
          <>
            {formSection}
            {heroSection}
          </>
        )}
      </div>
    </main>
  );
}

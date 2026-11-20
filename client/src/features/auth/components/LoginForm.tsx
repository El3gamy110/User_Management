"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Bot,
  Check,
  Loader2,
  Lock,
  Mail,
  User,
  Users,
} from "lucide-react";
import AuthSplitLayout from "./AuthSplitLayout";
import AuthBrand from "./AuthBrand";
import AuthInput from "./AuthInput";
import LoginIllustration from "./LoginIllustration";
import { useLoginMutation } from "../hooks/useAuth";
import { extractApiErrorMessage } from "@/services/apiError";

const LOGIN_FEATURES = [
  {
    icon: User,
    title: "Authentication",
    description: "Register & Login",
  },
  {
    icon: Users,
    title: "User Management",
    description: "CRUD Operations",
  },
  {
    icon: Bot,
    title: "REST API Ready",
    description: "For Front-End Integration",
  },
] as const;

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [apiError, setApiError] = useState<string | null>(null);

  const loginMutation = useLoginMutation(rememberMe);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);

    const nextErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    loginMutation.mutate(
      {
        email: email.trim(),
        password,
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (err) => {
          setApiError(
            extractApiErrorMessage(
              err,
              "Invalid email or password. Please try again."
            )
          );
        },
      }
    );
  };

  const leftPanel = (
    <div className="w-full flex flex-col items-center text-center">
      <LoginIllustration />

      <h2 className="mt-5 text-[28px] xl:text-[30px] font-bold tracking-tight text-white">
        Json Server Auth
      </h2>
      <p className="mt-2.5 max-w-[290px] text-[14.5px] leading-relaxed text-[#d7d2f5]/85">
        Simple authentication and user management using JSON Server.
      </p>

      <ul className="mt-8 w-full max-w-[275px] space-y-4 text-start">
        {LOGIN_FEATURES.map(({ icon: Icon, title, description }) => (
          <li key={title} className="flex items-center gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 border border-white/10 text-[#e4e0ff] backdrop-blur-sm">
              <Icon className="w-[18px] h-[18px]" strokeWidth={1.85} />
            </span>
            <div className="min-w-0">
              <p className="text-[14.5px] font-semibold text-white leading-snug">
                {title}
              </p>
              <p className="text-[13px] text-[#ccc5f2]/80 leading-snug">
                {description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  const rightPanel = (
    <div className="w-full">
      <AuthBrand orientation="vertical" className="mb-6" />

      <div className="mb-6 text-start">
        <h1 className="text-[28px] sm:text-[30px] font-bold tracking-tight text-[#111318] flex items-center gap-2">
          <span>Welcome Back</span>
          <span aria-hidden="true" className="text-[24px] sm:text-[26px]">
            👋
          </span>
        </h1>
        <p className="mt-1.5 text-[14.5px] text-[#5e6373]">
          Login to your account to access the dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <AuthInput
          id="login-email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          disabled={loginMutation.isPending}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            if (apiError) setApiError(null);
          }}
          error={errors.email}
          icon={<Mail className="w-[18px] h-[18px]" strokeWidth={1.8} />}
        />

        <AuthInput
          id="login-password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={loginMutation.isPending}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password)
              setErrors((prev) => ({ ...prev, password: undefined }));
            if (apiError) setApiError(null);
          }}
          error={errors.password}
          icon={<Lock className="w-[18px] h-[18px]" strokeWidth={1.8} />}
        />

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between pt-0.5">
          <label
            htmlFor="remember-me"
            className="inline-flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <span className="relative flex items-center justify-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                disabled={loginMutation.isPending}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="peer sr-only"
              />
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border border-[#c7cede] bg-white transition-all peer-checked:border-[#5d34df] peer-checked:bg-[#5d34df] peer-focus-visible:ring-3 peer-focus-visible:ring-[#5d34df]/25 group-hover:border-[#9da7be]">
                {rememberMe && (
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                )}
              </span>
            </span>
            <span className="text-[14px] text-[#3f4454]">Remember me</span>
          </label>

          <Link
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-[14px] font-semibold text-[#5b34de] hover:text-[#4824be] transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {apiError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-[10px] border border-red-200 bg-red-50 px-3.5 py-2.5 text-start text-[13px] font-medium text-red-700"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="mt-2 flex h-[48px] w-full items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-[#6940e8] to-[#5329d1] px-5 text-[15px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(91,52,222,0.55)] transition-all duration-150 hover:from-[#5e34e0] hover:to-[#4720c2] hover:shadow-[0_10px_24px_-6px_rgba(91,52,222,0.65)] active:scale-[0.99] disabled:opacity-65 disabled:cursor-not-allowed cursor-pointer"
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="w-[18px] h-[18px] animate-spin" />
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <span>Log In</span>
              <ArrowRight
                className="w-[17px] h-[17px] rtl:rotate-180"
                strokeWidth={2.2}
              />
            </>
          )}
        </button>
      </form>

      <p className="mt-7 text-center text-[14px] text-[#5e6373]">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-[#5b34de] underline underline-offset-4 hover:text-[#4824be] transition-colors"
        >
          Create an account
        </Link>
      </p>
    </div>
  );

  return (
    <AuthSplitLayout
      formPanel={rightPanel}
      heroPanel={leftPanel}
      heroPosition="left"
    />
  );
}

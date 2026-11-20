"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Check,
  Loader2,
  Lock,
  Mail,
  User,
  UserPlus,
} from "lucide-react";
import AuthSplitLayout from "./AuthSplitLayout";
import AuthBrand from "./AuthBrand";
import AuthInput from "./AuthInput";
import RegisterIllustration from "./RegisterIllustration";
import { useRegisterMutation } from "../hooks/useAuth";
import { extractApiErrorMessage } from "@/services/apiError";

const REGISTER_STEPS = [
  "Create your account",
  "Secure authentication",
  "Manage users & data",
] as const;

interface RegisterErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const registerMutation = useRegisterMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);

    const nextErrors: RegisterErrors = {};

    if (!fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    } else if (fullName.trim().length < 2) {
      nextErrors.fullName = "Full name must be at least 2 characters.";
    }

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    registerMutation.mutate(
      {
        name: fullName.trim(),
        email: email.trim(),
        password,
        role: "User",
        status: "Active",
        createdAt: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (err) => {
          setApiError(
            extractApiErrorMessage(
              err,
              "Unable to create account. Please try again."
            )
          );
        },
      }
    );
  };

  const heroPanel = (
    <div className="w-full flex flex-col items-center text-center">
      <RegisterIllustration />

      <h2 className="mt-5 text-[28px] xl:text-[30px] font-bold tracking-tight text-white">
        Json Server Auth
      </h2>
      <p className="mt-2.5 max-w-[260px] text-[14.5px] leading-relaxed text-[#d7d2f5]/85">
        Create your account and get started in seconds.
      </p>

      <ul className="mt-8 w-full max-w-[275px] space-y-4 text-start">
        {REGISTER_STEPS.map((step) => (
          <li key={step} className="flex items-center gap-3.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 border border-white/10 text-white backdrop-blur-sm">
              <Check className="w-4 h-4" strokeWidth={2.5} />
            </span>
            <span className="text-[14.5px] font-medium text-[#efecff]">
              {step}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  const formPanel = (
    <div className="w-full">
      <AuthBrand orientation="vertical" className="mb-6" />

      <div className="mb-6 text-start">
        <h1 className="text-[28px] sm:text-[30px] font-bold tracking-tight text-[#111318] flex items-center gap-2">
          <span>Create Account</span>
          <span aria-hidden="true" className="text-[24px] sm:text-[26px]">
            ✨
          </span>
        </h1>
        <p className="mt-1.5 text-[14.5px] text-[#5e6373]">
          Join now and start managing users.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthInput
          id="register-full-name"
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          autoComplete="name"
          disabled={registerMutation.isPending}
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (errors.fullName)
              setErrors((prev) => ({ ...prev, fullName: undefined }));
            if (apiError) setApiError(null);
          }}
          error={errors.fullName}
          icon={<User className="w-[18px] h-[18px]" strokeWidth={1.8} />}
        />

        <AuthInput
          id="register-email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          disabled={registerMutation.isPending}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email)
              setErrors((prev) => ({ ...prev, email: undefined }));
            if (apiError) setApiError(null);
          }}
          error={errors.email}
          icon={<Mail className="w-[18px] h-[18px]" strokeWidth={1.8} />}
        />

        <AuthInput
          id="register-password"
          label="Password"
          type="password"
          placeholder="Create a password"
          autoComplete="new-password"
          disabled={registerMutation.isPending}
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

        <AuthInput
          id="register-confirm-password"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          autoComplete="new-password"
          disabled={registerMutation.isPending}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword)
              setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            if (apiError) setApiError(null);
          }}
          error={errors.confirmPassword}
          icon={<Lock className="w-[18px] h-[18px]" strokeWidth={1.8} />}
        />

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
          disabled={registerMutation.isPending}
          className="mt-2 flex h-[48px] w-full items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-[#6940e8] to-[#5329d1] px-5 text-[15px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(91,52,222,0.55)] transition-all duration-150 hover:from-[#5e34e0] hover:to-[#4720c2] hover:shadow-[0_10px_24px_-6px_rgba(91,52,222,0.65)] active:scale-[0.99] disabled:opacity-65 disabled:cursor-not-allowed cursor-pointer"
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="w-[18px] h-[18px] animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-[18px] h-[18px]" strokeWidth={2.1} />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-[14px] text-[#5e6373]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#5b34de] underline underline-offset-4 hover:text-[#4824be] transition-colors"
        >
          Login
        </Link>
      </p>
    </div>
  );

  return (
    <AuthSplitLayout
      formPanel={formPanel}
      heroPanel={heroPanel}
      heroPosition="left"
    />
  );
}

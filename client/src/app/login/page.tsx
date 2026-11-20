import React from "react";
import LoginForm from "@/features/auth/components/LoginForm";

export const metadata = {
  title: "Login | Json Server Auth",
  description: "Login to your account to access the users management dashboard.",
};

export default function LoginPage() {
  return <LoginForm />;
}

import React from "react";
import RegisterForm from "@/features/auth/components/RegisterForm";

export const metadata = {
  title: "Create Account | Json Server Auth",
  description: "Create your account and start managing users.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}

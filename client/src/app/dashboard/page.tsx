import React from "react";
import UsersDashboard from "@/features/users/components/UsersDashboard";

export const metadata = {
  title: "Users Management | Json Server Auth",
  description: "Manage all users in the system — create, view, update, and delete users.",
};

export default function DashboardPage() {
  return <UsersDashboard />;
}

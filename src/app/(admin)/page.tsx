"use client";
import React from "react";
import { useAppSelector} from "@/lib/redux/hooks";
import { UserRole } from "@/constant/userRoles";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import ATeamDashboard from "@/components/dashboard/ATeamDashboard";
import BTeamDashboard from "@/components/dashboard/BTeamDashboard";

export default function Dashboard() {
  const { user: loggedInUser } = useAppSelector((state) => state.user);

  return (
    <div className="w-full">
      {loggedInUser?.role === UserRole.ADMIN ? (
        <AdminDashboard />
      ) : loggedInUser?.role === UserRole.A_TEAM ? (
        <ATeamDashboard />
      ) : (
        <BTeamDashboard />
      )}
    </div>
  );
}

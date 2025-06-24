"use client";
import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { fetchStatisticsNumbers } from "@/lib/redux/slices/statisticsSlice";
import { UserRole } from "@/constant/userRoles";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import ATeamDashboard from "@/components/dashboard/ATeamDashboard";
import BTeamDashboard from "@/components/dashboard/BTeamDashboard";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { user: loggedInUser } = useAppSelector((state) => state.user);

  useEffect(() => {
    getStatNumbers();
  }, []);

  const getStatNumbers = async () => {
    try {
      const payload = {};
      await dispatch(fetchStatisticsNumbers(payload)).unwrap();
    } catch (error: any) {
      console.log("error while getting statistics number", error);
    }
  };

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

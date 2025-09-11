"use client";
import React,{useEffect} from "react";
import { useAppDispatch,useAppSelector} from "@/lib/redux/hooks";
import { setPageTitle } from "@/lib/redux/slices/appSlice";
import { UserRole } from "@/constant/userRoles";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import ATeamDashboard from "@/components/dashboard/ATeamDashboard";
import BTeamDashboard from "@/components/dashboard/BTeamDashboard";
import ReferralTable from "@/components/referral/ReferralTable";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { user: loggedInUser } = useAppSelector((state) => state.user);

  useEffect(()=>{
     dispatch(setPageTitle("Dashboard"));
  },[])

  return (
    <div className="w-full">
      {loggedInUser?.role === UserRole.ADMIN ? (
        <AdminDashboard />
      ) : loggedInUser?.role === UserRole.A_TEAM ? (
        <ATeamDashboard />
      ) : (
        <BTeamDashboard />
      )}

      <div className="py-6">
        <ReferralTable searchText="" status=""/>
      </div>
    </div>
  );
}

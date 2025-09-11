"use client";
import React from "react";
import UserPersonalInfoCard from "@/components/user-profile/UserPersonalInfoCard";
import UserMetaInfoCard from "@/components/user-profile/UserMetaInfoCard";
import UserAccountInfoCard from "@/components/user-profile/UserAccountInfoCard";
import { useAppSelector } from "@/lib/redux/hooks";
import { UserRole } from "@/constant/userRoles";
// import { Metadata } from "next";


// export const metadata: Metadata = {
//   title: "Profile | Honeybee Harry's",
//   description:
//     "",
// };

export default function Profile() {
  const { user: loggedInUser } = useAppSelector((state) => state.user);
  const shouldShowAccountInfoCard = loggedInUser?.role === UserRole.A_TEAM ||loggedInUser?.role === UserRole.B_TEAM

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5  lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800  lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaInfoCard />
          <UserPersonalInfoCard />
          {
            shouldShowAccountInfoCard && (<UserAccountInfoCard/>)
          }
        </div>
      </div>
    </div>
  );
}

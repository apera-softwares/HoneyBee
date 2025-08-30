"use client";
import React from "react";
// import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
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
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          {
            shouldShowAccountInfoCard && (<UserAccountInfoCard/>)
          }
          
          {/* <UserAddressCard /> */}
        </div>
      </div>
    </div>
  );
}

"use client";
import React from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { formatRoleName, capitalizeWord } from "@/utils/stringUtils";
// import { FiEdit } from "react-icons/fi";

export default function UserInfoCard() {
  const { userProfile } = useAppSelector((state) => state.userProfile);

  return (
    <div className="w-full  p-5 lg:p-6 border border-gray-200 rounded-2xl">
      <div className="w-full flex items-start lg:items-center justify-between gap-4 mb-6">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
          Personal Information
        </h4>
        {/* <button
          onClick={openModal}
          className="flex  items-center justify-center gap-1 rounded-lg border border-gray-300 bg-white px-2 lg:px-4  py-1.5 lg:py-2 text-sm font-medium text-gray-700  hover:bg-gray-50 hover:text-gray-800  lg:inline-flex "
        >
         <FiEdit className="text-base lg:text-lg mb-0.5"/> <span className="hidden lg:inline-block" >Edit</span>
        </button> */}
      </div>
     <div className="w-full space-y-4 lg:space-y-6">
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4  lg:gap-6">
        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            First Name
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {capitalizeWord(userProfile?.firstName)}
          </p>
        </div>
        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Last Name
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {capitalizeWord(userProfile?.lastName)}
          </p>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4  lg:gap-6">
        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Email address
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {userProfile?.email}
          </p>
        </div>
        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Phone
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            +09 363 398 46
          </p>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4  lg:gap-6">
        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Role
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {formatRoleName(userProfile?.role)}
          </p>
        </div>
      </div>
     </div>
    </div>
  );
}

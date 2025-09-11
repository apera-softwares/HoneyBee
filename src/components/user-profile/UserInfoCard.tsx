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
        <h4 className="text-lg font-semibold text-gray-800 ">
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
          <InfoRow
            label="First Name"
            value={capitalizeWord(userProfile?.firstName)||"NA"}
          />
          <InfoRow
            label="Last Name"
            value={capitalizeWord(userProfile?.lastName)||"NA"}
          />
        </div>
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4  lg:gap-6">
          <InfoRow label="Email Address" value={userProfile?.email||"NA"} />
          <InfoRow label="Role" value={formatRoleName(userProfile?.role)||"NA"} />
        </div>
      </div>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: React.ReactNode | string;
}
const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
  return (
    <div className="w-full">
      <p className="mb-2 text-xs leading-normal text-gray-500">{label}</p>
      <div className="text-sm font-medium text-gray-800">{value}</div>
    </div>
  );
};

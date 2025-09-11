"use client";
import React, { useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { FiEdit } from "react-icons/fi";
import UserAccountInfoEditModal from "./UserAccountInfoEditModal";

export default function UserAccountInfoCard() {
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const { userProfile } = useAppSelector((state) => state.userProfile);

  const handleOpenEditModal = () => {
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  return (
    <div className="w-full  p-5 lg:p-6 border border-gray-200 rounded-2xl">
      <div className="w-full flex items-start lg:items-center justify-between gap-4 mb-6">
        <h4 className="text-lg font-semibold text-gray-800">
          Account Information
        </h4>
        <button
          onClick={handleOpenEditModal}
          className="flex  items-center justify-center gap-1 rounded-lg border border-gray-300 bg-white px-2  lg:px-4 py-1.5 lg:py-2 text-sm font-medium text-gray-700  hover:bg-gray-50 hover:text-gray-800  lg:inline-flex "
        >
          <FiEdit className="text-base lg:text-lg mb-0.5" />
          <span className=" hidden lg:inline-block">Edit</span>
        </button>
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4  lg:gap-6">
        <InfoRow
          label="Account Number"
          value={userProfile?.accountNumber || "NA"}
        />
        <InfoRow
          label="Routing Number"
          value={userProfile?.routingNumber || "NA"}
        />
      </div>
      <UserAccountInfoEditModal
        isOpen={showEditModal}
        closeModal={handleCloseEditModal}
      />
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
      <p className="mb-2 text-xs leading-normal text-gray-500">{label || ""}</p>
      <div className="text-sm font-medium text-gray-800">{value || "NA"}</div>
    </div>
  );
};

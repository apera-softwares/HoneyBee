"use client";
import React,{useState} from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { FiEdit } from "react-icons/fi";
import UserAccountInfoEditModal from "./UserAccountInfoEditModal";

export default function UserAccountInfoCard() {
  const [showEditModal,setShowEditModal] = useState<boolean>(false);
  const { userProfile } = useAppSelector((state) => state.userProfile);

  const handleOpenEditModal = ()=>{
    setShowEditModal(true);
  }
  const handleCloseEditModal = ()=>{
    setShowEditModal(false);
  }

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
         <FiEdit className="text-base lg:text-lg mb-0.5"/><span className=" hidden lg:inline-block" >Edit</span>
        </button>
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4  lg:gap-6">
        <div className="w-full">
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Account Number
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {userProfile?.accountNumber || "NA"}
          </p>
        </div>
        <div className="w-full">
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Routing Number
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {userProfile?.routingNumber || "NA"}
          </p>
        </div>
      </div>
      <UserAccountInfoEditModal isOpen={showEditModal} closeModal={handleCloseEditModal} />
    </div>
  );
}

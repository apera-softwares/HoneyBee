"use client";
import React, { useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { BiSolidEditAlt } from "react-icons/bi";
import toast from "react-hot-toast";
import { capitalizeWord,capitalizeWords } from "@/utils/stringUtils";

type Role = "A_TEAM" | "B_TEAM" | "ADMIN";

interface StatusOption {
  label: string;
  value: string;
}

const statusOptions: Record<Role, StatusOption[]> = {
  A_TEAM: [
    { label: "Pending", value: "Pending" },
    { label: "Contacted", value: "Contacted" },
    { label: "Appointment Completed", value: "Appointment_Completed" },
    { label: "Sold", value: "Sold" },
  ],
  B_TEAM:  [
    { label: "Pending", value: "Pending" },
    { label: "Contacted", value: "Contacted" },
    { label: "Appointment Completed", value: "Appointment_Completed" },
    { label: "Sold", value: "Sold" },
  ],
  ADMIN: [
    { label: "Pitched", value: "Pitched" },
    { label: "Pending", value: "Pending" },
    { label: "Sold", value: "Sold" },
    { label: "Payout", value: "Payout" },
  ],
};

interface ReferralStatusModalProps {
  isOpen: boolean;
  closeModal: () => void;
  role:Role;
  referral: any; // Pass the full referral object
  onUpdateStatus: (id: string, status: string) => void;
}

const ReferralStatusModal: React.FC<ReferralStatusModalProps> = ({
  isOpen,
  closeModal,
  role,
  referral,
  onUpdateStatus,
}) => {
  const [newStatus, setNewStatus] = useState(referral?.status || "");
  const options = statusOptions[role] || [];

  const handleSubmit = () => {
    if (!newStatus) {
      toast.error("Please select a valid status.");
      return;
    }
    onUpdateStatus(referral.id, newStatus);
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-md p-6 lg:p-8 pt-10"
    >
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center mb-4">
          <span className="bg-primary p-2 flex justify-center items-center rounded-full">
            <BiSolidEditAlt className="text-white" size={20} />
          </span>
          <div className="ml-4">
            <h5 className="font-semibold text-gray-800 text-xl sm:text-2xl dark:text-white/90">
              Update Referral Status
            </h5>
          </div>
        </div>

        {/* Status Dropdown */}

           <div className="p-4 border rounded-md bg-gray-50 flex justify-between items-center mb-4">
          <div>
            <p className="font-semibold">
              {
                ` Name: ${capitalizeWord(referral?.firstName)} ${capitalizeWord(referral?.lastName)}`
              }
            </p>
            <p className="text-sm text-gray-500">
              {
                `Product: ${capitalizeWords(referral?.product?.name)}`
              }
              </p>
          </div>
        
        </div>
        <div className="my-6">
          <label className="block text-gray-700 font-medium mb-2">
            Select Status
          </label>
          <select
            className="w-full border px-3 py-2 rounded-md text-sm focus:outline-none cursor-pointer"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option value="">-- Select Status --</option>
            {/* <option value="Pitched">Pitched</option>
            <option value="Pending">Pending</option>
            <option value="Sold">Sold</option>
            <option value="Payout">Payout</option> */}
             {options.map((status) => (
                <option key={status.value} value={status.value}>
                   {status.label}
                </option>
              ))}
          </select>
        </div>

        {/* Referral Details */}
     

        {/* Buttons */}
        <div className="flex items-center justify-end w-full gap-3 mt-4">
          <Button size="sm" onClick={handleSubmit}>
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={closeModal}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReferralStatusModal;

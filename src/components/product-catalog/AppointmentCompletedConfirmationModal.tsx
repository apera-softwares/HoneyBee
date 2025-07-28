"use client";
import React, { useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { BiSolidEditAlt } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateProductCatalog } from "@/lib/redux/slices/productCatalogSlice";

interface AppointmentCompletedConfirmationModalProps {
  isOpen: boolean;
  closeModal: () => void;
  product: any;
  onAppointmentCompleted: () => void;
}

const AppointmentCompletedConfirmationModal: React.FC<
  AppointmentCompletedConfirmationModalProps
> = ({ isOpen, closeModal, product, onAppointmentCompleted }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      AppointmentCompleted: true,
    };
    try {
      await dispatch(
        updateProductCatalog({ id: product?.id, data: payload })
      ).unwrap();
      toast.success("Appointment Completed Successfully");
      closeModal();
      onAppointmentCompleted();
    } catch (error: any) {
      console.error("Error while appointment completed:", error);
      const message = "Failed to mark as Appointment Completed";
      const errorMessage =
        typeof error === "string" ? error : error?.message || message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    if (!loading) {
      closeModal();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      className="max-w-lg p-6 lg:p-8 pt-10"
    >
      <Toaster />
      <div className="w-full">
        {/* Header */}
        <div className="w-full flex items-center mb-5">
          <span className="bg-primary p-2 flex justify-center items-center rounded-full">
            <BiSolidEditAlt className="text-white" size={20} />
          </span>
          <div className="ml-4">
            <h5 className="font-semibold text-gray-800 text-2xl  dark:text-white/90">
              Appointment Completed Confirmation
            </h5>
          </div>
        </div>

        {/* Status Dropdown */}

        <div className="px-2 rounded-md bg-gray-50 flex justify-between items-center mb-5">
          <div>
            <p className="font-semibold text-center">
              Are you sure you want to mark as appointment completed ?
            </p>
            <p className="text-sm text-gray-500"></p>
          </div>
        </div>
        <div className="my-6"></div>

        {/* Buttons */}
        <div className="flex items-center justify-end w-full gap-3 mt-4 ">
          <Button size="sm" disabled={loading} onClick={handleSubmit}>
            Yes,Sure
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={loading}
            onClick={closeModal}
          >
            No,Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AppointmentCompletedConfirmationModal;

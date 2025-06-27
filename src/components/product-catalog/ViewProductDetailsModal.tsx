"use client";
import React from "react";
import { Modal } from "../ui/modal";
import { GridIcon } from "../../icons/index";

interface ViewProductDetailsModalProps {
  isOpen: boolean;
  closeModal: () => void;
  selectedProduct: any;
}

const ViewProductDetailsModal: React.FC<ViewProductDetailsModalProps> = ({
  isOpen,
  closeModal,
  selectedProduct,
}) => {

  const handleCloseModal = () => {
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      className="max-w-[600px] p-6 lg:p-10 pt-10 "
    >
      <div className="w-full  ">
        <div className="w-full flex items-center gap-4  mb-6 ">
          <span className="bg-primary text-white p-1.5  flex justify-center items-center rounded-full">
            <GridIcon />
          </span>
          <div className="">
            <h5 className="font-semibold text-gray-800 text-xl sm:text-2xl  dark:text-white/90">
              Product Details
            </h5>
          </div>
        </div>

        <div className="w-full max-h-[340px] overflow-y-auto  space-y-4">
          <div className="w-full border-b pb-1">
            <p className=" font-medium text-sm text-gray-600 mb-1">Name</p>
            <h2 className=" font-medium ">{selectedProduct?.name || ""}</h2>
          </div>

          <div className="w-full border-b pb-1 ">
            <p className="font-medium text-sm text-gray-600 mb-1">Price</p>
            <h2 className="  font-medium">
              {selectedProduct?.price ? `$${selectedProduct?.price}` : "NA"}
            </h2>
          </div>
          <div className="w-full border-b pb-1 ">
            <p className="font-medium text-sm text-gray-600 mb-1">Status</p>
            <h2 className="  font-medium">
              {selectedProduct?.status ? "Active" : "Inactive"}
            </h2>
          </div>

          <div className="w-full border-b pb-1">
            <p className="font-medium text-sm text-gray-600 mb-1">
              Bullet Points
            </p>
            {selectedProduct &&
              selectedProduct?.bulletPoints &&
              selectedProduct?.bulletPoints
                ?.split(",")
                ?.map((point: string,index:number) => (
                  <h2 key={index} className=" font-medium"> • {point || ""}</h2>
                ))}
          </div>
          <div className="w-full border-b pb-1">
            <p className="font-medium text-sm text-gray-600 mb-1">
              Elevator Pitch
            </p>
            <h2 className=" font-medium">
              {selectedProduct?.elevatorPitch || ""}
            </h2>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewProductDetailsModal;

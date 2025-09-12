"use client";
import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { GridIcon } from "../../icons/index";
import { TbArrowNarrowLeft, TbArrowNarrowRight } from "react-icons/tb";
import { capitalizeWords } from "@/utils/stringUtils";

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
  const bulletPoints = selectedProduct?.bulletPoints?.split(",") || [];
  const [current, setCurrent] = useState(0);
  const isFirst = current === 0;
  const isLast = current === selectedProduct?.images?.length - 1;

  const nextSlide = () => !isLast && setCurrent((prev) => prev + 1);
  const prevSlide = () => !isFirst && setCurrent((prev) => prev - 1);

  const clear = () => {
    setCurrent(0);
  };
  const handleCloseModal = () => {
    clear();
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      className="max-w-3xl px-6 lg:px-8 py-8 "
    >
      <div className="w-full  ">
        <div className="w-full flex items-center gap-4 mb-6 sm:mb-8 ">
          <span className="bg-primary text-white p-2  flex justify-center items-center rounded-full">
            <GridIcon />
          </span>
          <div className="">
            <h5 className="font-semibold text-gray-800 text-xl sm:text-2xl  dark:text-white/90">
              Product Details
            </h5>
          </div>
        </div>

        <div className="w-full max-h-[400px] overflow-y-auto">
          <div className="w-full flex flex-col sm:flex-row  items-start sm:items-center gap-6 lg:gap-8 mb-6 border p-4  rounded-2xl ">
            <div className="w-full sm:w-1/2 relative rounded-2xl overflow-hidden aspect-square">
              {selectedProduct?.images?.length > 0 ? (
                <>
                  <img
                    src={selectedProduct?.images[current]}
                    alt={"Product Image"}
                    className=" object-fill w-full h-full rounded-2xl"
                  />
                  
                  {/* nav button */}
                  <button
                    onClick={prevSlide}
                    disabled={isFirst}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow ${
                      isFirst ? "opacity-50 cursor-not-allowed" : "opacity-100"
                    }`}
                  >
                    <TbArrowNarrowLeft className="text-gray-700" />
                  </button>

                  <button
                    onClick={nextSlide}
                    disabled={isLast}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow ${
                      isLast ? "opacity-50 cursor-not-allowed" : "opacity-100"
                    }`}
                  >
                    <TbArrowNarrowRight className="text-gray-700" />
                  </button>

                  {/* dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {selectedProduct?.images?.map((_: any, i: any) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i === current
                            ? "bg-orange-500"
                            : "bg-white border border-orange-500"
                        }`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 rounded-xl text-sm font-semibold ">
                  No Image Available
                </div>
              )}
            </div>
            <div className="w-full sm:w-1/2  space-y-4">
              <div className="w-full border-b pb-1">
                <p className=" font-semibold text-sm text-gray-800 mb-1">
                  Name
                </p>
                <h2 className="">
                  {
                    capitalizeWords(selectedProduct?.name)
                  }
                  </h2>
              </div>

              <div className="w-full border-b pb-1 ">
                <p className="font-semibold text-sm text-gray-800 mb-1">
                  {/* Estimated Price */}
                  Referral Commission
                </p>
                <h2 className="">
                  {selectedProduct?.estimatedPrice ? `${selectedProduct?.estimatedPrice} %` : "NA"}
                </h2>
              </div>
              <div className="w-full border-b pb-1 ">
                <p className="font-semibold text-sm text-gray-800 mb-1">
                  {/* Sold Price */}
                  Price Range
                </p>
                <h2 className="">
                  {selectedProduct?.price ? `$${selectedProduct?.price}` : "NA"}
                </h2>
              </div>
              <div className="w-full  ">
                <p className="font-semibold text-sm text-gray-800 mb-1">
                  Status
                </p>
                <h2 className="">
                  {selectedProduct?.status ? "Active" : "Inactive"}
                </h2>
              </div>
            </div>
          </div>
          <div className="w-full p-4 border rounded-2xl space-y-4">
            <div className="w-full border-b pb-1">
              <p className="font-semibold text-sm text-gray-800 mb-1">
                Bullet Points
              </p>
              {bulletPoints && bulletPoints?.length > 0 ? (
                bulletPoints.map((point: string, index: number) => (
                  <h2 key={index} className="">
                    • {point || ""}
                  </h2>
                ))
              ) : (
                <h2 className="">No bullet points found</h2>
              )}
            </div>
            <div className="w-full">
              <p className="font-semibold text-sm text-gray-800 mb-1">
                Elevator Pitch
              </p>
              <h2 className=" ">{selectedProduct?.elevatorPitch || ""}</h2>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewProductDetailsModal;

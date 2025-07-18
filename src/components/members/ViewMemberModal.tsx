"use client";
import React, { useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { BiSolidEditAlt } from "react-icons/bi";
//import Image from "next/image";
import { TbArrowNarrowLeft, TbArrowNarrowRight } from "react-icons/tb";
import { BACKEND_API } from "@/api";
import { capitalizeWord } from "@/utils/stringUtils";

interface ViewMemberModalProps {
  isOpen: boolean;
  closeModal: () => void;
  user: any; // Pass full referral object
}

const ViewMemberModal: React.FC<ViewMemberModalProps> = ({
  isOpen,
  closeModal,
  user,
}) => {
  const images =
    user?.product?.media?.length > 0
      ? user?.product?.media?.map(
          (mediaItem: any) =>
            `${BACKEND_API}${mediaItem?.imageName?.slice(
              2,
              mediaItem?.imageName?.length
            )}`
        )
      : ["/assets/images/image-not-available.png"];
  const bulletPoints = user?.product?.bulletPoints?.split(",") || [];
  const [current, setCurrent] = useState(0);
  const isFirst = current === 0;
  const isLast = current === images.length - 1;

  const nextSlide = () => !isLast && setCurrent((prev) => prev + 1);
  const prevSlide = () => !isFirst && setCurrent((prev) => prev - 1);

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-3xl p-6 lg:p-8 pt-10"
    >
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-primary p-2 flex justify-center items-center rounded-full">
            <BiSolidEditAlt className="text-white" size={20} />
          </span>
          <div className="">
            <h5 className="font-semibold text-gray-800 text-xl sm:text-2xl dark:text-white/90">
              Assigned Member Details
            </h5>
          </div>
        </div>

        <div className="w-full max-h-80 overflow-y-auto">
          {/* Team Member Info */}
          <div className="px-4 py-3 border rounded-md bg-gray-50 mb-6">
            <p className="font-semibold text-gray-800">
              {` Name: ${capitalizeWord(user?.teamMember?.user?.firstName)} 
              ${capitalizeWord(user?.teamMember?.user?.lastName)}`}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Email: {user?.teamMember?.user?.email || "N/A"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Team: {user?.teamMember?.team?.name}
            </p>
          </div>
          {user?.product && (
            <p className="font-semibold text-gray-800 mb-1">Assigned Poduct</p>
          )}
          {/* Product Details Section */}
          {user?.product && (
            <div className="w-full bg-white border rounded-xl shadow-sm p-4 lg:p-6 flex flex-col sm:flex-row gap-4">
              {/* Image Carousel */}
              <div className="w-full sm:w-1/2 relative rounded-xl overflow-hidden aspect-square">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[current]}
                      alt={"Product Image"}
                      className=" object-fill w-full h-full rounded-2xl"
                    />

                    {/* Arrows */}
                    <button
                      onClick={prevSlide}
                      disabled={isFirst}
                      className={`absolute left-3 top-1/2 -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow ${
                        isFirst
                          ? "opacity-50 cursor-not-allowed"
                          : "opacity-100"
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

                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_: any, i: any) => (
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
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 rounded-xl text-sm">
                    No Image Available
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="w-full sm:w-1/2 flex flex-col justify-center">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                  {user.product.name}
                </h2>
                <ul className="space-y-1 max-h-32 overflow-y-auto pr-1 text-sm text-gray-600">
                  {bulletPoints.map((point: string, idx: number) => (
                    <li key={idx}>• {point.trim()}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        {/* Action Buttons */}
        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={closeModal}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewMemberModal;

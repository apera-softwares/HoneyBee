"use client";
import React from "react";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { FiTrash } from "react-icons/fi";

interface Product {
  id: string;
  product: {
    id: string;
    name: string;
    elevatorPitch: string;
    bulletPoints: string;
  };
}

interface ProductListModalProps {
  isOpen: boolean;
  closeModal: () => void;
  products: Product[];
  title?: string;
  onRemove?: (productId: string) => void;
}

const ProductListModal: React.FC<ProductListModalProps> = ({
  isOpen,
  closeModal,
  products,
  title = "Product List",
  onRemove,
}) => {

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[700px] p-6 lg:p-10 pt-10 "
    >
     <div className="w-full">
         <div className="mb-4">
        <h5 className="font-semibold text-gray-800 text-xl sm:text-2xl dark:text-white/90">
          {title}
        </h5>
        <p className="text-sm text-gray-600 mt-1 dark:text-gray-300">
          Below is the list of products with details:
        </p>
      </div>

      <div className="max-h-[400px] overflow-y-auto space-y-6 pr-2">
        {products.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No products found.
          </p>
        ) : (
          products.map((product: any, index) => (
            <div
              key={product?.id}
              className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 shadow-sm relative"
            >
              <div className="flex items-start gap-2">
                <span className="font-bold text-gray-700 dark:text-gray-200">
                  {index + 1}.
                </span>
                <div className="flex-1">
                  <h6 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {product?.product?.name}
                  </h6>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-wrap">
                    {product?.product?.elevatorPitch}
                  </p>

                  {product?.product?.bulletPoints && (
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-3 space-y-1">
                      {product?.product?.bulletPoints.split(",").map((point: any, idx: any) => (
                        <li key={idx}>{point.trim()}</li>
                      ))}
                    </ul>
                  )}

                  {/* Remove Button */}
                  <div className="mt-4">
                    <button
                      className="inline-flex items-center border rounded-xl bg-white shadow-md p-2 gap-1 text-red-600 hover:text-red-700 text-sm font-medium transition hover:shadow-xl"
                      onClick={() => onRemove?.(product?.id)}
                    >
                      <FiTrash className="w-4 h-4" />
                      Remove Assigned Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-end mt-6">
        <Button size="sm" variant="outline" onClick={closeModal}>
          Close
        </Button>
      </div>

     </div>
    </Modal>
  );
};

export default ProductListModal;

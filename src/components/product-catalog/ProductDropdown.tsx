import { BACKEND_API } from "@/api";
import React, { useState, useRef, useEffect } from "react";
import { DEFAULT_PRODUCT_IMAGE } from "@/constant/defaultImages";
import { capitalizeWords } from "@/utils/stringUtils";


type Props = {
  products: any[];
  selectedProductId: string;
  onChange: (productId: string) => void;
};

const ProductDropdown: React.FC<Props> = ({
  products,
  selectedProductId,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative " ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 text-base md:text-lg text-[#717171]  h-10  pb-2 placeholder:pb-4 border-b border-[#E0E0E0]  outline-none transition-all duration-500 "
      >
        <span className="flex items-center gap-2 min-w-0 ">
          {selectedProduct?.media?.[0]?.imageName && (
            <img
              src={`${BACKEND_API}${selectedProduct.media[0].imageName.slice(
                2
              )}`}
              alt={selectedProduct?.name || "Product"}
              className="w-8 h-8 object-cover rounded border border-[#E0E0E0] shrink-0"
            />
          )}

          <span className="truncate max-w-60">
            {selectedProduct?.name || "Select a product"}
          </span>
        </span>
        <svg
          className={`ml-auto h-4 w-4 shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto border rounded-md shadow bg-white">
          {products.length > 0 ? (
            <>
              <div
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-500"
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
              >
                <span>Select a product</span>
              </div>

              {products.map((product: any) => {
                const imgSrc =
                  product?.media?.length > 0 && product.media[0]?.imageName
                    ? `${BACKEND_API}${product.media[0].imageName.slice(2)}`
                    : DEFAULT_PRODUCT_IMAGE;

                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      onChange(product.id);
                      setIsOpen(false);
                    }}
                  >
                    <img
                      src={imgSrc}
                      alt={product.name}
                      className="w-8 h-8 object-cover object-center rounded border border-[#E0E0E0] "
                    />
                    <span className="truncate">{capitalizeWords(product.name)}</span>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="px-3 py-2 text-gray-500 ">No product available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDropdown;

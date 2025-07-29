"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { FiEdit } from "react-icons/fi";
import { FaRegEye } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchProductCatalogs } from "@/lib/redux/slices/productCatalogSlice";
import Spinner from "../common/Spinner";
import Pagination from "../tables/Pagination";
import { Toaster } from "react-hot-toast";
import { capitalizeWords } from "@/utils/stringUtils";
import AppointmentCompletedConfirmationModal from "./AppointmentCompletedConfirmationModal";

interface FiltersState {
  searchQuery: string;
  status: string;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
}

interface ProductCatalogTableProps {
  filters: FiltersState;
  paginationData: PaginationState;
  setPaginationData: React.Dispatch<React.SetStateAction<PaginationState>>;
  onEdit: (data: any) => void;
  onView: (data: any) => void;
}

const LIMIT = 5;
const ProductCatalogTable: React.FC<ProductCatalogTableProps> = ({
  filters,
  paginationData,
  setPaginationData,
  onEdit,
  onView,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { productCatalogs, loading } = useSelector(
    (state: RootState) => state.productCatalog
  );
  const [
    showAppointmentCompletedConfirmationModal,
    setShowAppointmentCompletedConfirmationModal,
  ] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    getProductCatalogs();
  }, [filters, paginationData.currentPage]);

  const getProductCatalogs = async () => {
    try {
      const payload = {
        searchQuery: filters.searchQuery,
        status:
          filters.status === ""
            ? ""
            : filters.status === "true"
            ? "true"
            : "false",
        page: paginationData.currentPage || 1,
        limit: LIMIT,
      };
      const res = await dispatch(fetchProductCatalogs(payload)).unwrap();
      setPaginationData((prev: PaginationState) => ({
        ...prev,
        totalPages: res?.lastPage || 0,
      }));
    } catch (error: any) {
      console.log(error?.message || "Failed to fetch products");
    }
  };

  const handlePageChange = (page: any) => {
    setPaginationData((prev: PaginationState) => ({
      ...prev,
      currentPage: page,
    }));
  };

  const handleAppointmentCompletedClick = (product: any) => {
    if (product) {
      setSelectedProduct(product);
      setShowAppointmentCompletedConfirmationModal(true);
      return;
    }
    setSelectedProduct(null);
    setShowAppointmentCompletedConfirmationModal(false);
  };

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white dark:bg-white/[0.03] shadow-md">
      <div className="w-full overflow-x-auto">
        <Toaster />

        <div className="w-full">
          {loading ? (
            <Spinner />
          ) : (
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Estimated Price
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Sold Price
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Appointment Completed
                  </TableCell>
                  {/* <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Elevator Pitch</TableCell> */}
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productCatalogs && productCatalogs.length > 0 ? (
                  productCatalogs.map((product: any) => (
                    <TableRow key={product?.id}>
                      <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {capitalizeWords(product?.name)}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {product?.estimatedPrice
                          ? `$${product?.estimatedPrice}`
                          : `NA`}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {product?.price ? `$${product?.price}` : `NA`}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Badge
                          size="md"
                          color={product?.status ? "success" : "warning"}
                        >
                          {product?.status ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>

                      {/* <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                          {product?.elevatorPitch && (
                                            product.elevatorPitch?.length > 40
                                            ? `${product.elevatorPitch.slice(0, 40)}...`
                                            : product.elevatorPitch
                                            )}

                                            </TableCell> */}
                      <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {product?.AppointmentCompleted ? (
                          <Badge size="md" color={"success"}>
                            Completed
                          </Badge>
                        ) : (
                          <button
                            className="w-28 flex justify-center items-center font-medium text-primary bg-primary/10 px-4 py-1 rounded-full gap-2 disabled:cursor-not-allowed cursor-pointer"
                            onClick={() => {
                              handleAppointmentCompletedClick(product);
                            }}
                          >
                            <FaRegEye className="h-5 w-5 text-primary cursor-pointer " />
                            Mark As Completed
                          </button>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        <div className="flex flex-col items-start gap-1">
                          <button
                            className="w-24 flex justify-center items-center font-medium text-primary bg-primary/10 px-4 py-1 rounded-full gap-2 disabled:cursor-not-allowed cursor-pointer"
                            onClick={() => onEdit(product)}
                          >
                            <FiEdit className="h-5 w-5 text-primary cursor-pointer " />
                            Edit
                          </button>
                          <button
                            className="w-24 flex justify-center items-center font-medium text-primary bg-primary/10 px-4 py-1 rounded-full gap-2 disabled:cursor-not-allowed cursor-pointer"
                            onClick={() => onView(product)}
                          >
                            <FaRegEye className="h-5 w-5 text-primary cursor-pointer " />
                            View
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="text-center py-6 text-gray-500">
                      No product catalog found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {paginationData.totalPages > 0 && (
        <div className=" w-full flex justify-end px-4 py-6 ">
          <Pagination
            currentPage={paginationData.currentPage}
            totalPages={paginationData.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <AppointmentCompletedConfirmationModal
        isOpen={showAppointmentCompletedConfirmationModal}
        closeModal={() => handleAppointmentCompletedClick(null)}
        product={selectedProduct}
        onAppointmentCompleted={getProductCatalogs}
      />
    </div>
  );
};

export default ProductCatalogTable;

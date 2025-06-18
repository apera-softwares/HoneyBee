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
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchProductCatalogs } from "@/lib/redux/slices/productCatalogSlice";
import Spinner from "../common/Spinner";
import Pagination from "../tables/Pagination";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BACKEND_API } from "@/api";

interface FiltersState {
  searchQuery: string;
  status: string;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
}

interface ProductSelectTableProps {
  filters: FiltersState;
  paginationData: PaginationState;
  setPaginationData: React.Dispatch<React.SetStateAction<PaginationState>>;
  onEdit: (data: any) => void;
}

const ProductSelectTable: React.FC<ProductSelectTableProps> = ({
  filters,
  paginationData,
  setPaginationData,
  onEdit,
}) => {
  const dispatch = useAppDispatch();
  const LIMIT = 5;
  const [selectedProductId, setSelectedProductId] = useState<any>(null);
  const [assignedProducts, setAssignProduct] = useState<any[]>([]);
  const { productCatalogs, loading } = useAppSelector(
    (state) => state.productCatalog
  );
  const { userProfile } = useAppSelector((state) => state.userProfile);
  const { user: loggedInUser } = useAppSelector((state) => state.user);
  const teamId = userProfile?.teamMember?.[0]?.teamId||null;

  useEffect(() => {
    if(teamId)
    getAssignedProducts("");
  }, []);

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

  const getAssignedProducts = async (memberId: string) => {
    if (!memberId) return;

    try {
      const token = loggedInUser?.token;
      const response = await axios.get(`${BACKEND_API}product/${memberId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      const products = response.data?.data || [];
      setAssignProduct(products);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error getting team members:",
          error.response?.data || error.message
        );
      } else {
        console.error("Unexpected error getting team members:", error);
      }
    }
  };

  const handlePageChange = (page: any) => {
    setPaginationData((prev: PaginationState) => ({
      ...prev,
      currentPage: page,
    }));
  };

  const handleAssignProductToSelf = async (productId: string) => {
    try {
      setSelectedProductId(productId);
      const payload = {
        teamMemberId: "",
        productId: productId,
      };

      const token = loggedInUser?.token;
      const response = await axios.post(
        `${BACKEND_API}product/assignMemb`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      //refetching newly assigned products
      getAssignedProducts("");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error getting team members:",
          error.response?.data || error.message
        );
      } else {
        console.error("Unexpected error getting team members:", error);
      }
    } finally {
      setSelectedProductId(null);
    }
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
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Elevator Pitch
                  </TableCell>
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
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {product?.name || ""}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Badge
                          size="md"
                          color={product?.status ? "success" : "warning"}
                        >
                          {product?.status ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {product?.elevatorPitch &&
                          (product.elevatorPitch?.length > 40
                            ? `${product.elevatorPitch.slice(0, 40)}...`
                            : product.elevatorPitch)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {selectedProductId === product?.id ? (
                          "loading.."
                        ) : (
                          <button
                            className="flex items-center text-primary gap-2 cursor-pointer "
                            onClick={() =>
                              handleAssignProductToSelf(product?.id)
                            }
                          >
                            Select
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="text-center py-6 text-gray-500">
                      No product found.
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
    </div>
  );
};

export default ProductSelectTable;

"use client";
import React, {  useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchProductCatalogs } from "@/lib/redux/slices/productCatalogSlice";
import Spinner from "../common/Spinner";
import Pagination from "../tables/Pagination";
import { TbLoader2 } from "react-icons/tb";
import { FaRegEye } from "react-icons/fa";

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
  selectedProductId: string | null;
  selectedProducts: any[];
  onProductSelect: (productId: string) => void;
  onProductUnselect:(productId:string)=>void;
  onView:(product:any)=>void;
}

const ProductSelectTable: React.FC<ProductSelectTableProps> = ({
  filters,
  paginationData,
  setPaginationData,
  selectedProductId,
  selectedProducts,
  onProductSelect,
  onProductUnselect,
  onView
}) => {
  const dispatch = useAppDispatch();
  const LIMIT = 5;
  const { productCatalogs, loading } = useAppSelector((state) => state.productCatalog);
  
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

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white dark:bg-white/[0.03] shadow-md">
      <div className="w-full overflow-x-auto">
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
                    Price
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  {/* <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Elevator Pitch
                  </TableCell> */}
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
                  productCatalogs.map((product: any) => {
                    const isSelected = selectedProducts.some(
                      (selectedProd: any) => selectedProd?.id === product.id
                    );
                    return (
                      <TableRow key={product?.id}>
                        <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {product?.name || ""}
                        </TableCell>
                        <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                         {
                          product?.estimatedPrice ? `$${product?.estimatedPrice}`:`NA`
                         }
                        </TableCell>
                        <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                         {
                          product?.price ? `$${product?.price}`:`NA`
                         }
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
                          {product?.elevatorPitch &&
                            (product.elevatorPitch?.length > 40
                              ? `${product.elevatorPitch.slice(0, 40)}...`
                              : product.elevatorPitch)}
                        </TableCell> */}
                        <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        <div className="flex flex-col items-start gap-1">
                                                    {isSelected ? (
                            <button
                              className="w-24 flex justify-center items-center font-medium text-red-500 bg-red-500/10 px-4 py-1 rounded-full gap-2 disabled:cursor-not-allowed cursor-pointer"
                              disabled={Boolean(selectedProductId)}
                              onClick={() => onProductUnselect(product.id)}
                            >
                               Unselect
                            </button>
                          ) : selectedProductId === product.id ? (
                            <span className="flex items-center  text-primary">
                              <TbLoader2 className="text-xl animate-spin ml-5" />
                            </span>
                          ) : (
                            <button
                              className="w-24 flex justify-center items-center font-medium text-primary bg-primary/10 px-4 py-1 rounded-full gap-2 disabled:cursor-not-allowed cursor-pointer"
                              disabled={Boolean(selectedProductId)}
                              onClick={() => onProductSelect(product.id)}
                            >
                              Select
                            </button>
                          )}

                            <button
                              className="w-24 flex justify-center items-center font-medium text-primary bg-primary/10 px-4 py-1 rounded-full gap-2 disabled:cursor-not-allowed cursor-pointer"
                              onClick={() => onView(product)}
                            >
                             <FaRegEye className="w-5 h-5"/> View
                            </button>
                        </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
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

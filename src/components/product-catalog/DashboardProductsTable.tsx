"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchProductCatalogs } from "@/lib/redux/slices/productCatalogSlice";
import Spinner from "../common/Spinner";
import Pagination from "../tables/Pagination";
import { Toaster } from "react-hot-toast";
import ViewProductDetailsModal from "./ViewProductDetailsModal";
import { BACKEND_API } from "@/api";
import { FaRegEye } from "react-icons/fa";

const DashboardProductsTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const ITEM_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [ selectedProduct,setSelectedProduct ] = useState<any>(null);
  const[showViewProductDetailsModal,setShowViewProductViewDetailsModal]=useState<boolean>(false);
  const { productCatalogs, loading } = useSelector(
    (state: RootState) => state.productCatalog
  );

  useEffect(() => {
    getProductCatalogs();
  }, [currentPage]);

  const getProductCatalogs = async () => {
    try {
      const payload = {
        searchQuery: "",
        page: currentPage,
        limit: ITEM_PER_PAGE,
      };
      const res = await dispatch(fetchProductCatalogs(payload)).unwrap();
      setTotalPages(res?.lastPage || 0);
    } catch (error: any) {
      console.log(error?.message || "Failed to fetch products");
    }
  };

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  const handleViewProductDetails = (data:any)=>{
    if(data){

    const images = data?.media?.length > 0 ? data?.media?.map((mediaItem: any) => `${BACKEND_API}${mediaItem?.imageName?.slice(2, mediaItem?.imageName?.length)}`) : ["/assets/images/image-not-available.png"];
    setSelectedProduct({...data,images});
    setShowViewProductViewDetailsModal(true);
    return ;
    }

    setShowViewProductViewDetailsModal(false);
    setSelectedProduct(null);

  }
  
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
                    className="px-6 py-4 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    S.No
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-4 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-4 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Estimated Price
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-4 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Sold Price
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-4 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-4 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productCatalogs && productCatalogs.length > 0 ? (
                  productCatalogs.map((product: any,index:number) => (
                    <TableRow key={product?.id}>
                      <TableCell className="px-6 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                         {(currentPage - 1) * ITEM_PER_PAGE + index + 1}
                      </TableCell>
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
                      <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <div className="flex flex-col items-start gap-1">
                              <button className="flex justify-center items-center font-medium text-primary bg-primary/10 px-3 py-1 rounded-full gap-2 disabled:cursor-not-allowed cursor-pointer" onClick={() =>handleViewProductDetails(product)}>
                                  <FaRegEye className="h-5 w-5  cursor-pointer"  />
                                                    View
                              </button>
                          </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="text-center py-6 text-gray-500">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {totalPages > 0 && (
        <div className=" w-full flex justify-end px-4 py-6 ">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <ViewProductDetailsModal isOpen={showViewProductDetailsModal} closeModal={()=>handleViewProductDetails(null)} selectedProduct={selectedProduct}/>
    </div>
  );
};

export default DashboardProductsTable;

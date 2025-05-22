"use client";
import React, { useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchProductCatalogs } from "@/lib/redux/slices/productCatalogSlice";
import Spinner from "../common/Spinner";
import Pagination from "../tables/Pagination";
import { Toaster } from "react-hot-toast";

interface FiltersState {
    searchQuery:string,
    status:string,
}

interface PaginationState {
    currentPage:number,
    totalPages:number,
}

interface ProductCatalogTableProps {
    filters:FiltersState,
    paginationData:PaginationState,
    setPaginationData:React.Dispatch<React.SetStateAction<PaginationState>>,
    onEdit:(data:any)=>void;
}


const ProductCatalogTable: React.FC<ProductCatalogTableProps> = ({ filters,paginationData,setPaginationData,onEdit, }) => {
    

 

    const dispatch = useDispatch<AppDispatch>();
    const {productCatalogs, loading } = useSelector((state: RootState) => state.productCatalog);

    const payload = {
           
            searchQuery:filters.searchQuery,
            status:filters.status === "" ? "" : filters.status==="true" ? "true" : "false",
            page:paginationData.currentPage||1,
            limit:5,
        }

    useEffect(() => {

        getProductCatalogs();
       

    }, [filters,paginationData.currentPage]);


    const getProductCatalogs = async () => {
        try {
            const res = await dispatch(fetchProductCatalogs(payload)).unwrap();
            setPaginationData((prev:PaginationState)=>({...prev,totalPages:res?.lastPage||0}))
            

        } catch (error: any) {
            console.log(error?.message || "Failed to fetch products");
        }
    };

    const handlePageChange = (page: any) => {
        setPaginationData((prev:PaginationState)=>({...prev,currentPage:page}));
    };



    return (
        <div className="overflow-hidden rounded-xl bg-white dark:bg-white/[0.03] shadow-md">
            <div className="max-w-full overflow-x-auto">
            <Toaster />

                <div className="min-w-[1102px]">
                    {loading ? (
                        <Spinner />
                    ) : (
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                  
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Name</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Status</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Elevator Pitch</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Actions</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {productCatalogs && productCatalogs.length > 0 ? (
                                    productCatalogs.map((product:any)=>(      <TableRow key={product?.id} >
                                          
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                           {product?.name||""}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            
                                                <Badge
                                                    size="md"
                                                    color={ product?.status ? "success":"warning" }
                                                >
                                                    {product?.status? "Active" : "Inactive" }
                                                </Badge>
                                            </TableCell>
                                         
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                          {product?.elevatorPitch && (
                                            product.elevatorPitch?.length > 40
                                            ? `${product.elevatorPitch.slice(0, 40)}...`
                                            : product.elevatorPitch
                                            )}

                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                <FiEdit className="h-5 w-5 text-orange-300 cursor-pointer" onClick={() =>onEdit(product)} />
                                            </TableCell>
                                        </TableRow>))
                                    
                                  
                                  
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

        
               {paginationData.totalPages > 0 && (    <div className=" w-full flex justify-end p-4">
                <Pagination currentPage={paginationData.currentPage} totalPages={paginationData.totalPages } onPageChange={handlePageChange} />

            </div>)}
            
        
          

        </div>
    );
};


export default ProductCatalogTable
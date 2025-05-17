import React, { useEffect, useState } from "react";
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
import { fetchUsers } from "@/lib/redux/slices/userManagementSlice";
import Spinner from "../common/Spinner";
import Pagination from "../tables/Pagination";
import { Toaster } from "react-hot-toast";


interface ProductCatalogTableProps {
    searchText: string;
    role: string;
    order: string;
}

const ProductCatalogTable: React.FC<ProductCatalogTableProps> = ({ searchText, role, order }) => {

    const dispatch = useDispatch<AppDispatch>();
    const [usersData, setUsersData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { loading, error } = useSelector((state: RootState) => state.UserManagement);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editUserData, setEditUserData] = useState<any>({});

    console.log(totalPages,"total pages")

    useEffect(() => {
        // dispatch(fetchUsers({ page: currentPage, limit: 5, name: searchText, role: role, order})).then((res: any) => {
        //     if (res.meta.requestStatus === "fulfilled") {
        //         if (res.payload) {
        //             setUsersData(res.payload.data || []);
        //             console.log(res.payload)
        //             const lastPage = res.payload.lastPage;
        //             setTotalPages(lastPage);
        //         } else {
        //             setUsersData([]);
        //             setTotalPages(1);
        //         }
        //     } else {
        //         console.log("Failed to fetch users:", res.payload || "Unknown error");
        //     }
        // });
    }, [dispatch, currentPage, searchText, role, isModalOpen, order]);

    const handlePageChange = (page: any) => {
        setCurrentPage(page);
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
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Product</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Name</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Status</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Assigned Teams</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Assigend Members</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Elevator Pitch</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Actions</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {true ? (
                                    
                                        <TableRow >
                                            <TableCell className="px-5 py-4 text-start">
                                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                   1
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                Solar Pro Pack
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            
                                                <Badge
                                                    size="sm"
                                                    color={"success"
                                                    }
                                                >
                                                    Active
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                               A-Team Aplpha , Bravo
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                             Sarah , tom r 
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                           Affordable solar bundles for all home sizes.
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                <FiEdit className="h-5 w-5 text-orange-300 cursor-pointer" onClick={() => {
                                                  
                                                }} />
                                            </TableCell>
                                        </TableRow>
                                  
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
            <div className=" w-full flex lg:justify-end p-4">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

            </div>
          

        </div>
    );
};


export default ProductCatalogTable
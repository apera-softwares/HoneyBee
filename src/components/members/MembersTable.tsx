import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import Spinner from "../common/Spinner";
import Pagination from "../tables/Pagination";
import toast, { Toaster } from "react-hot-toast";
//import { MdRemoveRedEye } from "react-icons/md";
import { deleteAssignedMemberProduct, fetchAssignedMembers } from "@/lib/redux/slices/membersSlice";
import { EyeIcon } from "@/icons";
import ViewMemeberModal from "./ViewMemberModal";
import { FiEdit } from "react-icons/fi";

interface TeamTableProps {
    searchText: string;
    role: string;
    order: string;
}

const AssignedMembersTable: React.FC<TeamTableProps> = ({ searchText, role, order }) => {
    const ITEM_PER_PAGE = 5;
    const dispatch = useDispatch<AppDispatch>();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const { loading, members } = useSelector((state: RootState) => state.memberManagement);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [userData, setuserData] = useState("");

    useEffect(() => {
        setCurrentPage(1);
        dispatch(fetchAssignedMembers({ page: 1, limit: ITEM_PER_PAGE, name: searchText, order: order })).then((res: any) => {
            if (res.meta.requestStatus === "fulfilled") {
                if (res.payload) {
                    const lastPage = res.payload.lastPage;
                    setTotalPages(lastPage);
                } else {
                    setTotalPages(0);
                }
            } else {
                console.log("Failed to fetch Assigend Members:", res.payload || "Unknown error");
            }
        });
    }, [dispatch, searchText, role, order, isModalOpen]);

    useEffect(() => {
        dispatch(fetchAssignedMembers({ page: currentPage, limit: ITEM_PER_PAGE, name: searchText, order: order })).then((res: any) => {
            if (res.meta.requestStatus === "fulfilled") {
                if (res.payload) {
                    console.log(res.payload, "Assigend members")
                    const lastPage = res.payload.lastPage;
                    setTotalPages(lastPage);
                } else {
                    setTotalPages(0);
                }
            } else {
                console.log("Failed to fetch Assigend Members:", res.payload || "Unknown error");
            }
        });
    }, [dispatch, currentPage]);

    const handlePageChange = (page: any) => {
        setCurrentPage(page);
    };

    const handleRemoveMemberProduct = (id: any) => {
        dispatch(deleteAssignedMemberProduct(id)).then((res: any) => {
            if (res.meta.requestStatus === "fulfilled") {
                if (res.payload) {
                    // setTeamDataMembers(res.payload.data || []);
                    fetchAssignedMembers({ page: currentPage, limit: ITEM_PER_PAGE, name: searchText })
                    setIsModalOpen(false)
                    toast.success("Product Removed successful!");
                    console.log(res.payload, "Member Deleted")
                }
            } else {
                console.log("Failed to Removed Product:", res.payload || "Unknown error");
                toast.error("Error in Removed Product!");
            }
        });
    }

    return (
        <div className="overflow-hidden rounded-xl bg-white dark:bg-white/[0.03] shadow-md">
            <div className="w-full overflow-x-auto ">
                <Toaster />
                <div className="w-full">
                    {loading ? (
                        <Spinner />
                    ) : (
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">S.No</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Name</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Email</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Team</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Product Name</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Action</TableCell>
                                    {/* <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Actions</TableCell> */}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members.length > 0 ? (
                                    members.map((user: any, index) => {
                                        console.log(user, "user")
                                        return (
                                            <TableRow key={user?.id}>
                                                <TableCell className="px-5 py-4 text-start">
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {(currentPage - 1) * ITEM_PER_PAGE + index + 1}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {user?.teamMember?.user?.firstName} {user?.user?.lastName}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {user?.teamMember?.user?.email}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {user?.teamMember?.team?.name}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {user?.product?.name}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    <button
                                                        className="flex items-center text-primary gap-2 cursor-pointer"
                                                        onClick={() => {
                                                            setIsModalOpen(true)
                                                            setuserData(user)
                                                        }}
                                                    >
                                                        View <FiEdit className="mr-1.5" />
                                                    </button>


                                                </TableCell>
                                                {/*                                          
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <Badge
                                                    size="sm"
                                                    color={
                                                        user?.verified
                                                            ? "success"
                                                            : !user?.verified
                                                                ? "warning"
                                                                : "error"
                                                    }
                                                >
                                                    {user?.verified ? "Verified" : "Not verified"}
                                                </Badge>
                                            </TableCell> */}
                                                {/* <TableCell className="px-4 py-3 flex text-orange-400 text-theme-sm dark:text-gray-400">
                                                <div className="flex items-center gap-1 bg-[#F8E4C8] p-2 px-4 rounded-full cursor-pointer" onClick={() => {
                                                    setIsModalOpen(true)
                                                    setProducts(user.memberProduct)
                                                }}>
                                                    <MdRemoveRedEye className="h-5 w-5 text-orange-400 cursor-pointer" /> View Products
                                                </div>
                                            </TableCell> */}
                                                {/* <TableCell className="px-4 py-3 text-red-500 text-theme-sm dark:text-gray-400">
                                                <div className="flex items-center gap-1 cursor-pointer" onClick={() => {
                                                    setMembeId(user?.id)
                                                    setIsModalRemoveOpen(true)
                                                }}>
                                                    <MdDeleteOutline className="h-5 w-5 text-red-500 cursor-pointer" /> Remove
                                                </div>
                                            </TableCell> */}

                                            </TableRow>
                                        )
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell className="text-center py-6 text-gray-500">
                                            No members found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>

            {
                totalPages > 0 && (<div className=" w-full flex justify-end px-4 py-6">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>)
            }

            <ViewMemeberModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} user={userData}
            />


        </div>
    );
};


export default AssignedMembersTable
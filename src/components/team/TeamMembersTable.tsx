import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useAppDispatch,useAppSelector } from "@/lib/redux/hooks";
import Spinner from "../common/Spinner";
import Pagination from "../tables/Pagination";
import toast, { Toaster } from "react-hot-toast";
import { deleteTeamMember, fetchTeamMembers } from "@/lib/redux/slices/teamManagementSlice";
import Badge from "../ui/badge/Badge";
import TeamDeleteConfirm from "../common/DeleteConfirmationModal";
import MemberAddModal from "./MemberAddModal";
interface TeamMembersTableProps {
    id?: string;
    searchText?: string;
    role?: string;
    order?: string;
}

const TeamMembersTable: React.FC<TeamMembersTableProps> = ({ searchText, role, order, id }) => {

    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.teamManagement);
    const [teamDataMembers, setTeamDataMembers] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [memberId, setMembeId] = useState<any>({});
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    useEffect(() => {
        fetcTeamMembers()
    }, [dispatch, currentPage, searchText, role, isModalOpen, isAddModalOpen, order]);

    const fetcTeamMembers = () => {
        dispatch(fetchTeamMembers({ id: id, page: currentPage, limit: 5 })).then((res: any) => {
            if (res.meta.requestStatus === "fulfilled") {
                if (res.payload) {
                    setTeamDataMembers(res.payload.data || []);
                    console.log(res.payload, "team memebers data")
                    const lastPage = res.payload.lastPage;
                    setTotalPages(lastPage);
                } else {
                    setTeamDataMembers([]);
                    setTotalPages(1);
                }
            } else {
                console.log("Failed to fetch Team Members:", res.payload || "Unknown error");
            }
        });
    }

    const handlePageChange = (page: any) => {
        setCurrentPage(page);
    };

    const handleDeleteMember = () => {
        dispatch(deleteTeamMember(memberId)).then((res: any) => {
            if (res.meta.requestStatus === "fulfilled") {
                if (res.payload) {
                    setTeamDataMembers(res.payload.data || []);
                    fetcTeamMembers()
                    toast.success("Team Member Deleted successful!");

                    console.log(res.payload, "Member Deleted")
                }
            } else {
                console.log("Failed to Delete Team Member:", res.payload || "Unknown error");
                toast.error("Error in delete Team Member!");

            }
        });
    }

    return (
        <div className="overflow-hidden rounded-xl bg-white dark:bg-white/[0.03] shadow-md">
            <div className="max-w-full overflow-x-auto">
                <Toaster />

                <div className="min-w-[1102px]">
                    {loading.read ? (
                        <Spinner />
                    ) : (
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">No.</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Name</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Email</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Role</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Verified</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Actions</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teamDataMembers.length > 0 ? (
                                    teamDataMembers.map((member: any, index) => (
                                        <TableRow key={member?.id}>
                                            <TableCell className="px-5 py-4 text-start">
                                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                    {index + 1}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {member?.user?.firstName}  {member?.user?.lastName}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {member?.user?.email}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {member?.user?.role}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <Badge
                                                    size="sm"
                                                    color={
                                                        member?.user?.verified
                                                            ? "success"
                                                            : !member?.user?.verified
                                                                ? "warning"
                                                                : "error"
                                                    }>
                                                    {member?.user?.verified ? "Verified" : "Not verified"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-red-500 text-theme-sm dark:text-gray-400">
                                                <div className="flex items-center gap-1 cursor-pointer" onClick={() => {
                                                    setMembeId(member?.id)
                                                    setIsModalOpen(true)
                                                }}>
                                                    <RiDeleteBin6Line className="h-5 w-5 text-red-500 cursor-pointer" />Remove
                                                </div>
                                            </TableCell>

                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell className="text-center py-6 text-gray-500">
                                            No users found.
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
            <TeamDeleteConfirm isOpen={isModalOpen} closeModal={() => {
                setIsModalOpen(false)
                setMembeId("")
            }} onDeleteConfirm={handleDeleteMember} type="Remove" name="Member" />
            <MemberAddModal isOpen={isAddModalOpen} closeModal={() => {
                setIsAddModalOpen(false)
                fetcTeamMembers()
            }} id={id?.toString()} />

        </div>
    );
};


export default TeamMembersTable
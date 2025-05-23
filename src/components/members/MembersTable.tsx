import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import Spinner from "../common/Spinner";
import Pagination from "../tables/Pagination";
import { Toaster } from "react-hot-toast";
// import TeamAddEdit from "./TeamAddEdit";
import { fetchTeams } from "@/lib/redux/slices/teamManagementSlice";
import { MdRemoveRedEye } from "react-icons/md";
import { useRouter } from "next/navigation";
import { fetchMembers } from "@/lib/redux/slices/membersSlice";


interface TeamTableProps {
    searchText: string;
    role: string;
    order: string;
}

const TeamTable: React.FC<TeamTableProps> = ({ searchText, role, order }) => {

    const dispatch = useDispatch<AppDispatch>();
    const [teamData, setTeamData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { loading } = useSelector((state: RootState) => state.TeamManagement);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editTeamData, setEditTeamData] = useState<any>({});

    const router = useRouter()


    useEffect(() => {
        dispatch(fetchMembers({ page: currentPage, limit: 5 })).then((res: any) => {
            if (res.meta.requestStatus === "fulfilled") {
                if (res.payload) {
                    setTeamData(res.payload.data || []);
                    console.log(res.payload,"team members")
                    const lastPage = res.payload.lastPage;
                    setTotalPages(lastPage);
                } else {
                    setTeamData([]);
                    setTotalPages(1);
                }
            } else {
                console.log("Failed to fetch Teams:", res.payload || "Unknown error");
            }
        });
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
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">S.No</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Name</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Members</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Actions</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teamData.length > 0 ? (
                                    teamData.map((user: any, index) => (
                                        <TableRow key={user?.id}>
                                            <TableCell className="px-5 py-4 text-start">
                                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                    {index + 1}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {user?.name}
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
                                            <TableCell className="px-4 py-3 flex text-orange-400 text-theme-sm dark:text-gray-400">
                                                <div className="flex items-center gap-1 bg-[#F8E4C8] p-2 px-4 rounded-full cursor-pointer" onClick={() => {
                                                    router.push(`/team/${user.id}/members`)
                                                }}>
                                                    <MdRemoveRedEye className="h-5 w-5 text-orange-400 cursor-pointer" />Members
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-orange-400 text-theme-sm dark:text-gray-400">
                                                <div className="flex items-center gap-1" onClick={() => {
                                                    setEditTeamData(user)
                                                    setIsModalOpen(true)
                                                }}>
                                                    <FiEdit className="h-5 w-5 text-orange-400 cursor-pointer" />Edit
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
            {/* <TeamAddEdit isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} teamData={editTeamData} type="update" /> */}

        </div>
    );
};


export default TeamTable
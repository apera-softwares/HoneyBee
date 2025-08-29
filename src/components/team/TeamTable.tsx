import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { FiEdit } from "react-icons/fi";
import Spinner from "../common/Spinner";
import Pagination from "../tables/Pagination";
import { Toaster } from "react-hot-toast";
import TeamAddEdit from "./TeamAddEdit";
import { fetchTeams, fetchTeamsByUserId } from "@/lib/redux/slices/teamManagementSlice";
import { MdRemoveRedEye } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useAppSelector,useAppDispatch } from "@/lib/redux/hooks";
import { UserRole } from "@/constant/userRoles";
import { capitalizeWords } from "@/utils/stringUtils";


interface TeamTableProps {
    searchText: string;
    role: string;
    order: string;
    isCreateTeamModalOpen?:boolean,
}

const TeamTable: React.FC<TeamTableProps> = ({ searchText, role, order,isCreateTeamModalOpen }) => {
    const ITEM_PER_PAGE = 5;
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {user:loggedInUser} = useAppSelector((state)=>state.user);
    const { loading, teams } = useAppSelector((state) => state.teamManagement);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editTeamData, setEditTeamData] = useState<any>({});
   
    //check wheather to show or not actions column for diffrent role
   const shouldShowActionsColumn = loggedInUser?.role === UserRole.ADMIN;
    

    useEffect(() => {
        if (loggedInUser?.role === UserRole.ADMIN) {
            if(currentPage === 1)
            {
                getTeams(1);
            }else{
                setCurrentPage(1);
            }

        } else {
            getTeamsByUserId(1);
        }

    }, [searchText, role,order]);

    useEffect(() => {
        if (loggedInUser?.role === UserRole.ADMIN) {
            getTeams(currentPage);
        } else {
            getTeamsByUserId(currentPage);
        }
    }, [currentPage,isModalOpen,isCreateTeamModalOpen]);


    const getTeams = async (page:number) => {
        const params = {
           page: page, 
           limit: ITEM_PER_PAGE ,
           name:searchText
        }
        try {
            const response = await dispatch(fetchTeams(params)).unwrap();
            setTotalPages(response?.lastPage||0);
     
        } catch (error: any) {
            console.log(error, "error while fetching teams");
        }
  };
    const getTeamsByUserId = async (page:number) => {
        const params = {
           page: page, 
           limit: ITEM_PER_PAGE ,
           name:searchText
        }
        try {
            await dispatch(fetchTeamsByUserId(params)).unwrap();
            setTotalPages(1);
        } catch (error: any) {
            console.log(error, "error while fetching teams");
        }
    };

    const handlePageChange = (page: any) => {
        setCurrentPage(page);
    };

    return (
        <div className=" w-full overflow-hidden rounded-xl bg-white dark:bg-white/[0.03] shadow-md">
            <div className=" w-full overflow-x-auto">
                <Toaster />

                <div className="w-full ">
                    {loading ? (
                        <Spinner />
                    ) : (
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">S.No</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Name</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Members</TableCell>
                                    {
                                         shouldShowActionsColumn && ( <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Actions</TableCell>)
                                    }
                                   
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teams.length > 0 ? (
                                    teams.map((user: any, index) => (
                                        <TableRow key={user?.id}>
                                            <TableCell className="px-5 py-4 text-start">
                                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                    {(currentPage - 1) * ITEM_PER_PAGE + index + 1}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {capitalizeWords(user?.name)}
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
                                            <TableCell className="px-4 py-3 flex text-primary text-theme-sm dark:text-gray-400">
                                                <div className="flex items-center gap-1 bg-primary/30 p-2 px-4 rounded-full cursor-pointer" onClick={() => {
                                                    router.push(`/team/${user.id}/members`)
                                                }}>
                                                    <MdRemoveRedEye className="h-5 w-5 text-primary cursor-pointer" />Members
                                                </div>
                                            </TableCell>

                                            {
                                                shouldShowActionsColumn && ( <TableCell className="px-4 py-3 text-primary text-theme-sm dark:text-gray-400">
                                                <div className="flex items-center gap-1 cursor-pointer" onClick={() => {
                                                    setEditTeamData(user)
                                                    setIsModalOpen(true)
                                                }}>
                                                    <FiEdit className="h-5 w-5 text-primary" />Edit
                                                </div>
                                            </TableCell>)
                                            }
                                 

                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell className="text-center py-6 text-gray-500">
                                            No team found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
            {
               loggedInUser?.role !== UserRole.B_TEAM && totalPages > 0 && (            
               <div className=" w-full flex justify-end  px-4 py-6 ">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>)
            }

            <TeamAddEdit isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} teamData={editTeamData} type="update" />

        </div>
    );
};


export default TeamTable
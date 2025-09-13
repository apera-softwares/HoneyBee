"use client";
import { useParams } from "next/navigation";
import CommonHeading from "@/components/common/CommonHeading";
//import { HiOutlinePlus } from "react-icons/hi";
import TeamDeleteConfirm from "@/components/common/DeleteConfirmationModal";
import MemberAddModal from "@/components/team/MemberAddModal";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../../../components/ui/table";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useAppDispatch,useAppSelector } from "@/lib/redux/hooks";
import toast, { Toaster } from "react-hot-toast";
import {
  deleteTeamMember,
  fetchTeamMembers,
} from "@/lib/redux/slices/teamManagementSlice";
import Badge from "@/components/ui/badge/Badge";
import Pagination from "@/components/tables/Pagination";
import Spinner from "@/components/common/Spinner";
import { DEFAULT_PROFILE_IMAGE } from "@/constant/defaultImages";
import { BACKEND_API } from "@/api";
import { formatRoleName ,capitalizeWord} from "@/utils/stringUtils";
import { UserRole } from "@/constant/userRoles";

export default function UserManagement() {
  const ITEM_PER_PAGE = 5;
  const { teamId } = useParams();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.teamManagement);
  const { user: loggedInUser } = useAppSelector((state) => state.user);
  const [teamDataMembers, setTeamDataMembers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberId, setMembeId] = useState<any>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  //check wheather to show or not actions column for diffrent role
   const shouldShowActionsColumn = loggedInUser?.role === UserRole.ADMIN;

  useEffect(() => {
    getTeamMembers();
  }, [dispatch, currentPage, isModalOpen, isAddModalOpen]);

  const getTeamMembers = () => {
    dispatch(
      fetchTeamMembers({
        id: teamId,
        page: currentPage,
        limit: ITEM_PER_PAGE,
        search: "",
      })
    ).then((res: any) => {
      if (res.meta.requestStatus === "fulfilled") {
        if (res.payload) {
          setTeamDataMembers(res.payload.data || []);
          const lastPage = res.payload.lastPage;
          setTotalPages(lastPage);
        } else {
          setTeamDataMembers([]);
          setTotalPages(1);
        }
      } else {
        console.log(
          "Failed to fetch Team Members:",
          res.payload || "Unknown error"
        );
      }
    });
  };

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  const handleDeleteMember = () => {
    dispatch(deleteTeamMember(memberId)).then((res: any) => {
      if (res.meta.requestStatus === "fulfilled") {
        if (res.payload) {
          setTeamDataMembers(res.payload.data || []);
          getTeamMembers();
          toast.success("Team member deleted successfully!");
        }
      } else {
        console.log(
          "Failed to Delete Team Member:",
          res.payload || "Unknown error"
        );
        toast.error("Failed to delete team member. Please try again.");
      }
    });
  };

  return (
    <div className="w-full">
      {/* <TeamDeleteConfirm isOpen={true} closeModal={()=>{}} onDeleteConfirm={()=>{}} type="Delete" name="Member"/> */}
      <Toaster />
      {/* Top Bar: Left (Heading), Right (Search + Actions) */}
      <div className="w-full flex flex-col lg:flex-row items-start justify-between  gap-6 mb-6  ">
        {/* Left: Heading */}
        <div className="w-full lg:w-1/2">
          <CommonHeading
            pageTitle="Team Members"
            description="Manage all Teams members"
          />
        </div>

        {/* Right: Actions */}
        <div className=" w-full lg:w-1/2 flex flex-wrap justify-start lg:justify-end items-center gap-3">
          {/* Search Input */}
          {/* <div className="relative h-11">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <CiSearch />
                        </span>
                        <input
                            type="text"
                            placeholder="Search team by name"
                            name="SearchInput"
                            value={SearchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-10 h-11 pr-4 py-2 border border-gray-300 rounded-md focus:outline-[#FFA819]"
                        />
                    </div> */}
          {/* Create User Button */}

          {/* <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="h-11 bg-primary text-white rounded-md text-md px-4 justify-center text-center outline-none flex items-center gap-1 hover:bg-primary-hover ">
                        <HiOutlinePlus className="text-white" />
                        Add Member
                    </button> */}

          {/* <div className="w-32 h-11 relative rounded-md">
                        <div className="w-32 h-11 left-0 top-0 absolute bg-amber-500 rounded-md" />
                        <div className="left-[36px] top-[14.43px] absolute justify-start text-white text-sm font-medium font-['Montserrat']">CSV/PDF</div>
                    </div> */}

          {/* Filter By Asc Des */}
          {/* <select
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        className="border border-[#151D48] w-32 h-11 text-[#151D48] rounded-md text-sm justify-center text-center outline-none">
                        <option value="">Short By</option>
                        <option value="asc">asc to des</option>
                        <option value="desc">des to asc</option>
                    </select> */}
        </div>
      </div>

      {/* Table */}
      <div className="w-full ">
        <div className="w-full overflow-hidden rounded-xl bg-white dark:bg-white/[0.03] shadow-md">
          <div className=" w-full overflow-x-auto">
            <Toaster />

            <div className="w-full ">
              {loading.read ? (
                <Spinner />
              ) : (
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                      >
                        No.
                      </TableCell>
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
                        Email
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                      >
                        Role
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                      >
                        Verified
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                      >
                        Designation
                      </TableCell>
                      {
                        shouldShowActionsColumn && (<TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                      >
                        Actions
                      </TableCell>)
                      }
                  
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamDataMembers.length > 0 ? (
                      teamDataMembers.map((member: any, index) => {
                        const imgSrc = member?.user?.media?.[0]?.imageName
                          ? `${BACKEND_API}uploads/${member?.user?.media?.[0]?.imageName}`
                          : DEFAULT_PROFILE_IMAGE;
                        return (
                          <TableRow key={member?.id}>
                            <TableCell className="px-5 py-4 text-start">
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {(currentPage - 1) * ITEM_PER_PAGE + index + 1}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                              <div className="flex items-center gap-2">
                                <img
                                  alt="Profile Photo"
                                  src={imgSrc}
                                  className="w-8 h-8 object-cover object-center rounded-full border border-primary"
                                />
                                <span className="">
                                  {`${capitalizeWord(member?.user?.firstName)}  ${
                                    capitalizeWord(member?.user?.lastName)
                                  }`}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                              {member?.user?.email}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                              <span className="text-nowrap">{formatRoleName(member?.user?.role)}</span>
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
                                }
                              >
                                {member?.user?.verified
                                  ? "Verified"
                                  : "Not verified"}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start text-theme-sm">
                              {!member?.isMemberOnly ? (
                                <span className="text-green-600 flex items-center gap-1 font-bold">
                                  L1 Manager{" "}
                                  <svg
                                    className="w-4 h-4 text-green-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                              ) : (
                                <span className="text-gray-500 dark:text-gray-400">
                                  Member
                                </span>
                              )}
                            </TableCell>
                            {
                              shouldShowActionsColumn && (      <TableCell className="px-4 py-3 text-theme-sm text-start">
                              {!member?.isMemberOnly ? (
                                <div className="flex items-center gap-1 text-gray-400 cursor-not-allowed">
                                  <RiDeleteBin6Line className="h-5 w-5" />
                                  Remove
                                </div>
                              ) : (
                                <div
                                  className="flex items-center gap-1 text-red-500 cursor-pointer"
                                  onClick={() => {
                                    setMembeId(member?.id);
                                    setIsModalOpen(true);
                                  }}
                                >
                                  <RiDeleteBin6Line className="h-5 w-5" />
                                  Remove
                                </div>
                              )}
                            </TableCell>)
                            }
                      
                          </TableRow>
                        );
                      })
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
          <div className=" w-full flex justify-end px-4 py-6 ">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
        <TeamDeleteConfirm
          isOpen={isModalOpen}
          closeModal={() => {
            setIsModalOpen(false);
            setMembeId("");
          }}
          onDeleteConfirm={handleDeleteMember}
          type="Remove"
          name="Member"
        />

        <MemberAddModal
          isOpen={isAddModalOpen}
          closeModal={() => setIsAddModalOpen(false)}
          id={teamId?.toString()}
        />
      </div>
    </div>
  );
}

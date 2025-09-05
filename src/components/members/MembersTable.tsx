import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useAppDispatch,useAppSelector } from "@/lib/redux/hooks";
import Spinner from "../common/Spinner";
import Pagination from "../tables/Pagination";
import { Toaster } from "react-hot-toast";
//import { MdRemoveRedEye } from "react-icons/md";
import { fetchAssignedMembers } from "@/lib/redux/slices/memberSlice";
// import { EyeIcon } from "@/icons";
import ViewMemberModal from "./ViewMemberModal";
import { FiEdit } from "react-icons/fi";
import { BACKEND_API } from "@/api";
import { DEFAULT_PROFILE_IMAGE } from "@/constant/defaultImages";
import { capitalizeWord,capitalizeWords } from "@/utils/stringUtils";

interface TeamTableProps {
  searchText: string;
  role: string;
  order: string;
}

const AssignedMembersTable: React.FC<TeamTableProps> = ({
  searchText,
  role,
  order,
}) => {
  const ITEM_PER_PAGE = 5;
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const {loading,members} = useAppSelector((state)=>state.member);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setuserData] = useState("");

  useEffect(() => {
    setCurrentPage(1);
    getAssignMembers(1);
  }, [dispatch, searchText, role, order]);

  useEffect(() => {
    getAssignMembers(currentPage);
  }, [dispatch, currentPage]);


    const getAssignMembers = async (page:number) => {
        const payload = {
        page: page,
        limit: ITEM_PER_PAGE,
        name: searchText,
        order: order,
        }
        try {
          const response = await dispatch(fetchAssignedMembers(payload)).unwrap();
          setTotalPages(response?.lastPage||0);
        } catch (error: any) {
          setTotalPages(0);
          console.log(error?.message || "Failed to fetch assigned members");
        }
  };

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  // const handleRemoveMemberProduct = (id: any) => {
  //     dispatch(deleteAssignedMemberProduct(id)).then((res: any) => {
  //         if (res.meta.requestStatus === "fulfilled") {
  //             if (res.payload) {
  //                 // setTeamDataMembers(res.payload.data || []);
  //                 fetchAssignedMembers({ page: currentPage, limit: ITEM_PER_PAGE, name: searchText })
  //                 setIsModalOpen(false)
  //                 toast.success("Product Removed successful!");
  //                 console.log(res.payload, "Member Deleted")
  //             }
  //         } else {
  //             console.log("Failed to Removed Product:", res.payload || "Unknown error");
  //             toast.error("Error in Removed Product!");
  //         }
  //     });
  // }

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
                    Team
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Product Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Action
                  </TableCell>
                  {/* <TableCell isHeader className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400">Actions</TableCell> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.length > 0 ? (
                  members.map((user: any, index) => {
                    const imgSrc = user?.teamMember?.user?.media?.[0]?.imageName
                      ? `${BACKEND_API}uploads/${user?.teamMember?.user?.media?.[0]?.imageName}`
                      : DEFAULT_PROFILE_IMAGE;
                    return (
                      <TableRow key={user?.id}>
                        <TableCell className="px-5 py-4 text-start">
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {(currentPage - 1) * ITEM_PER_PAGE + index + 1}
                          </span>
                        </TableCell>
                        <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <img
                              alt="Profile Photo"
                              src={imgSrc}
                              className="w-8 h-8  object-cover object-center rounded-full border border-primary"
                            />
                            <span className="">
                            {`${capitalizeWord(user?.teamMember?.user?.firstName)} ${capitalizeWord(user?.teamMember?.user?.lastName)} `}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {user?.teamMember?.user?.email}
                        </TableCell>
                        <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {capitalizeWords(user?.teamMember?.team?.name)}
                        </TableCell>
                        <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {user?.product?.name?.length > 32
                            ? `${capitalizeWords(user?.product?.name?.slice(0, 32))}...`
                            : `${capitalizeWords(user?.product?.name)}`}
                        </TableCell>
                        <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <button
                            className="flex items-center text-primary font-medium gap-2 cursor-pointer"
                            onClick={() => {
                              setIsModalOpen(true);
                              setuserData(user);
                            }}
                          >
                            View <FiEdit className="w-4 h-4" />
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
                    );
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

      {totalPages > 0 && (
        <div className=" w-full flex justify-end px-4 py-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <ViewMemberModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        user={userData}
      />
    </div>
  );
};

export default AssignedMembersTable;

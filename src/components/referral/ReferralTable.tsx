import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchReferrals,
  updateReferral,
} from "@/lib/redux/slices/referralSlice";
import Spinner from "../common/Spinner";
import Pagination from "../tables/Pagination";
import toast, { Toaster } from "react-hot-toast";
import { FiEdit } from "react-icons/fi";
import ReferralStatusModal from "./ReferralStatusModal";
import { DEFAULT_PROFILE_IMAGE } from "@/constant/defaultImages";
import { BACKEND_API } from "@/api";
import { capitalizeWord,capitalizeWords } from "@/utils/stringUtils";

interface ReferralTableProps {
  searchText: string;
  status: string;
}
type BadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";

const ReferralTable: React.FC<ReferralTableProps> = ({
  searchText,
  status,
}) => {
  const ITEM_PER_PAGE = 20;
  const dispatch = useAppDispatch();
  const { referralList, loading } = useAppSelector((state) => state.referral);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<any>(null);
  const { user: loggedInUser } = useAppSelector((state) => state.user);

  useEffect(() => {
    if(currentPage === 1 ){
      getReferrals(1);
    }else{
      setCurrentPage(1);
    }
  }, [searchText, status]);

  useEffect(() => {
    getReferrals(currentPage);
  }, [currentPage]);


  const getReferrals = async (page: number) => {
    try {
      const params = {
        page: page,
        limit: ITEM_PER_PAGE,
        searchQuery: searchText,
        status: status,
      };
      const response = await dispatch(fetchReferrals(params)).unwrap();
      setTotalPages(response?.lastPage||0);
    } catch (error: any) {
      console.log(error?.message || "Failed to fetch products");
    }
  };

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  const getBadgeColor = (status: string): BadgeColor => {
    switch (status.toLowerCase()) {
      case "pitched":
        return "primary";
      case "pending":
        return "info";
      case "sold":
        return "light";
      case "payout":
        return "success";
      default:
        return "light";
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    const payload = { id, status };
    try {
      await dispatch(updateReferral(payload));
      toast.success("Status updated successfully!");
      getReferrals(currentPage);
    } catch (error) {
      console.log(error, "error white status update");
      toast.error("Failed to update status. Please try again.");
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white dark:bg-white/[0.03] shadow-md">
      <div className="w-full overflow-x-auto">
        <Toaster />
        {selectedReferral && (
          <ReferralStatusModal
            isOpen={isStatusModalOpen}
            closeModal={() => setIsStatusModalOpen(false)}
            referral={selectedReferral}
            onUpdateStatus={handleStatusUpdate}
          />
        )}

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
                    S.No
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Lead Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Product
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Referred By
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Submitted On
                  </TableCell>
                  {(loggedInUser.role == "A_TEAM" ||
                    loggedInUser.role == "ADMIN") && (
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                      >
                        Actions
                      </TableCell>
                    )}{" "}
                </TableRow>
              </TableHeader>
              <TableBody>
                {referralList.length > 0 ? (
                  referralList.map((item: any, index) => {
                    const imgSrc = item?.referredBy?.user?.media?.[0]?.imageName
                      ? `${BACKEND_API}uploads/${item?.referredBy?.user?.media?.[0]?.imageName}`
                      : DEFAULT_PROFILE_IMAGE;
                    return (
                      <TableRow key={item?.id}>
                        <TableCell className="px-5 py-4 text-start">
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {(currentPage - 1) * ITEM_PER_PAGE + index + 1}
                          </span>
                        </TableCell>
                        <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {`${capitalizeWord(item?.firstName)} ${capitalizeWord(item?.lastName)}`}
                        </TableCell>
                        <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {
                            capitalizeWords(item?.product?.name)
                          }
                        </TableCell>
                        <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <img
                              alt="Profile Photo"
                              src={imgSrc}
                              className="w-8 h-8 object-cover object-center rounded-full border border-primary"
                            />
                            <span className="">

                               {`${capitalizeWord(item?.referredBy?.user?.firstName)} ${capitalizeWord(item?.referredBy?.user?.lastName)}`}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <Badge size="md" color={getBadgeColor(item?.status)}>
                            {item?.status || ""}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {item?.submittedOn?.slice(0, 10) || ""}
                        </TableCell>
                        {(loggedInUser.role == "A_TEAM" ||
                          loggedInUser.role == "ADMIN") && (
                            <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                              <button
                                className="flex items-center text-primary gap-2 cursor-pointer"
                                onClick={() => {
                                  setSelectedReferral(item);
                                  setIsStatusModalOpen(true);
                                }}
                              >
                                Status <FiEdit className="mr-1.5" />
                              </button>
                            </TableCell>
                          )}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell className="text-center py-6 text-gray-500">
                      No referrals found.
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
    </div>
  );
};

export default ReferralTable;

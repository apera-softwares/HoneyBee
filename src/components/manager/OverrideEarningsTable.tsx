import React, { useEffect, useState,useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useAppDispatch,useAppSelector } from "@/lib/redux/hooks";
import Spinner from "../common/Spinner";
import Pagination from "../tables/Pagination";
import { DEFAULT_PROFILE_IMAGE } from "@/constant/defaultImages";
import { BACKEND_API } from "@/api";
import { CHART_RANGES } from "@/data/chartRanges";
import { IoChevronDownSharp } from "react-icons/io5";

const OverrideEarningsTable = () => {
  const ITEM_PER_PAGE = 5;
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(CHART_RANGES[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { loading, users } = useAppSelector((state) => state.userManagement);

    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

   const handleSelect = (option: (typeof CHART_RANGES)[0]) => {
    setSelected(option);
    setIsOpen(false);
  };

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  return (
        <div className="w-full overflow-hidden rounded-xl bg-white shadow-md">
        <div className="w-full flex items-center justify-between gap-2 py-5 px-5 border-b">
            <div className="font-medium">Override Earnings</div>
            <div className="">
            <div ref={dropdownRef} className="relative inline-block w-32 text-sm">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm bg-white border border-gray-600 hover:border-gray-700 rounded-md shadow-sm  focus:outline-none"
            >
              <span className="text-nowrap">{selected.label}</span>{" "}
              <IoChevronDownSharp className=" shrink-0 " />
            </button>

            {isOpen && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                {CHART_RANGES.map((option) => (
                  <li
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className={`text-sm px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                      selected.value === option.value
                        ? "bg-gray-100 font-medium"
                        : ""
                    }`}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
            </div>
        </div>
        <div className="w-full overflow-x-auto">


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
                    Member
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Level
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Lead Sold
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Override %
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Earnings
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user: any, index: number) => {
                    const imgSrc = user?.media?.[0]?.imageName
                      ? `${BACKEND_API}uploads/${user?.media?.[0]?.imageName}`
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
                              className="w-8 h-8 object-cover object-center rounded-full border border-primary"
                            />
                            <span className="">
                              {`${user?.firstName || ""} ${
                                user?.lastName || ""
                              }`}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {user?.email}
                        </TableCell>
                        <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {user?.role}
                        </TableCell>
                        <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {user?.role}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell className=" px-5 py-6 text-gray-500">
                      No data found
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

    </div>
  )
}

export default OverrideEarningsTable

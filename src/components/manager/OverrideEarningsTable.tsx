import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useAppDispatch,useAppSelector } from "@/lib/redux/hooks";
import Spinner from "../common/Spinner";
// import Pagination from "../tables/Pagination";
//import { CHART_RANGES } from "@/data/chartRanges";
// import { IoChevronDownSharp } from "react-icons/io5";
import { fetchOverrideEarnings } from "@/lib/redux/slices/referralSlice";
import { capitalizeWord } from "@/utils/stringUtils";

const OverrideEarningsTable = () => {
  // const ITEM_PER_PAGE = 5;
  const dispatch = useAppDispatch();
  const { loading,overrideEarnings } = useAppSelector((state) => state.referral);
 // const dropdownRef = useRef<HTMLDivElement>(null);
  // const [isOpen, setIsOpen] = useState(false);
  // const [selected, setSelected] = useState(CHART_RANGES[0]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        getOverrideEarnings();
    }, []);


    const getOverrideEarnings = async () => {
        try {
          await dispatch(fetchOverrideEarnings()).unwrap();
            
        } catch (error: any) {

            console.log(error?.message || "Failed to fetch products");
        }
    };

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       dropdownRef.current &&
  //       !dropdownRef.current.contains(event.target as Node)
  //     ) {
  //       setIsOpen(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  //  const handleSelect = (option: (typeof CHART_RANGES)[0]) => {
  //   setSelected(option);
  //   setIsOpen(false);
  // };

  // const handlePageChange = (page: any) => {
  //   setCurrentPage(page);
  // };

  return (
        <div className="w-full overflow-hidden rounded-xl bg-white shadow-md">
        <div className="w-full flex items-center justify-between gap-2 py-5 px-5 border-b">
            <div className="font-medium">Override Earnings</div>
            {/* <div ref={dropdownRef} className="relative inline-block w-32 text-sm">
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
            </div> */}
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
                    No.
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
                    L1 Earning
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                     L2 Earning
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    L3 Earning
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-[#1F1C3B] text-start text-theme-sm dark:text-gray-400"
                  >
                    Total Earning
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overrideEarnings.length > 0 ? (
                  overrideEarnings.map((item: any, index: number) => {
                    return (
                      <TableRow key={index}>
                        <TableCell className="px-5 py-4 text-start">
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            { index + 1}
                          </span>
                        </TableCell>
                        <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
       
                            {`${capitalizeWord(item?.managerName)}`}

                        </TableCell>
                        <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {
                            item?.totalL1Override ? `$ ${item?.totalL1Override?.toFixed(2) || "NA"}`:`NA`
                          }
                        </TableCell>
                        <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {
                            item?.totalL2Override ? `$ ${item?.totalL2Override?.toFixed(2) || "NA"}`:`NA`
                          }
                        </TableCell>
                        <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {
                            item?.totalL3Override ? `$ ${item?.totalL3Override?.toFixed(2) || "NA"}`:`NA`
                          }
                        </TableCell>
                        <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                           {`$ ${item?.totalAllLevels?.toFixed(2) || ""}`}
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
        {/* {totalPages > 0 && (
        <div className=" w-full flex justify-end px-4 py-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )} */}

    </div>
  )
}

export default OverrideEarningsTable

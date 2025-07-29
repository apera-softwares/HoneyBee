"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useAppDispatch } from "@/lib/redux/hooks";
import Spinner from "../common/Spinner";
import { Toaster } from "react-hot-toast";
import { fetchPayout } from "@/lib/redux/slices/referralSlice";




const PayoutTable= () => {
  const dispatch = useAppDispatch();
  const [payout, setPayout] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getPayout();
  }, []);

  const getPayout = async () => {
    setLoading(true);
    try {
      const response = await dispatch(fetchPayout()).unwrap();
      setPayout(response);
    } catch (error: any) {
      console.log(error?.message || "Failed to fetch payout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-hidden  rounded-xl bg-white border border-gray-200 shadow-md">
    <Toaster />
    <div className="px-5 mt-5 mb-2 "><h2 className="font-medium text-[#1F1C3B]">Payout</h2></div>
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
                    As A Team Member Earning
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
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {payout?.selfEarningAsTeamMember?._sum?.submittingMemberAmount ? `$ ${payout?.selfEarningAsTeamMember?._sum?.submittingMemberAmount}`:"NA"}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {payout?.selfEarningAsL1Manager?.[0]?._sum?.managerOverridesL1Amount ? `$ ${payout?.selfEarningAsL1Manager?.[0]?._sum?.managerOverridesL1Amount}`:"NA"}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                       {payout?.selfEarningAsL2Manager?.[0]?._sum?.managerOverridesL2Amount ? `$ ${payout?.selfEarningAsL2Manager?.[0]?._sum?.managerOverridesL2Amount}`:"NA"}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                     {payout?.selfEarningAsL3Manager?.[0]?._sum?.managerOverridesL3Amount ? `$ ${payout?.selfEarningAsL3Manager?.[0]?._sum?.managerOverridesL3Amount}`:"NA"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayoutTable;

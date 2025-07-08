"use client";
import React from "react";
import CommonHeading from "@/components/common/CommonHeading";
import {  useAppSelector } from "@/lib/redux/hooks";
import OverrideEarningsTable from "@/components/manager/OverrideEarningsTable";
import BenefitAllocationChart from "@/components/statistic-charts/BenefitAllocationChart";
import LeadEarningsOverview from "@/components/manager/LeadEarningsOverview";

const Manager = () => {
  const { userProfile } = useAppSelector((state) => state.userProfile);

  return (
    <div className="w-full">
        <div className=" w-full mb-6 ">
          <CommonHeading
            pageTitle={`Hello,${userProfile?.firstName || ""} ${
              userProfile?.lastName || ""
            }`}
            description=""
          />
        </div>
      <div className="w-full mb-6 ">
       <LeadEarningsOverview/>
      </div>
      <div className="w-full mb-6">
        <OverrideEarningsTable />
      </div>
      <div className="w-full">
        <BenefitAllocationChart/>
      </div>
    </div>
  );
};

export default Manager;

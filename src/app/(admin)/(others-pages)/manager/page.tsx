"use client";
import React, { useState, useRef, useEffect } from "react";
import CommonHeading from "@/components/common/CommonHeading";
import { CiSearch } from "react-icons/ci";
import { HiOutlinePlus } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import OverrideEarningsTable from "@/components/manager/OverrideEarningsTable";
import LeadCard from "@/components/LeadCard";
import TeamPerformanceTable from "@/components/manager/TeamPerformanceTable";
import BenefitAllocationChart from "@/components/statistic-charts/BenefitAllocationChart";

const Manager = () => {
  const { userProfile } = useAppSelector((state) => state.userProfile);
  const [searchQuery, setSearchQuery] = useState<string>("");
  return (
    <div className="w-full">
      {/* Top Bar: Left (Heading), Right (Search + Actions) */}
      <div className="w-full flex flex-col lg:flex-row items-start justify-start lg:justify-between  gap-6  mb-6 ">
        {/* Left: Heading */}
        <div className=" w-full lg:w-1/2 ">
          <CommonHeading
            pageTitle={`Hello,${userProfile?.firstName || ""} ${
              userProfile?.lastName || ""
            }`}
            description="Current rank : Level2 -> Next rank goal : Level3"
          />
        </div>

        {/* Right: Actions */}
        <div className="w-full lg:w-1/2 flex flex-wrap justify-start lg:justify-end items-center gap-3  ">
          {/* Search Input */}
          <div className="relative h-11">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <CiSearch className="text-lg " />
            </span>
            <input
              type="text"
              placeholder="Search by name,product,date"
              name="searchQuery"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 pr-4 py-2 border border-gray-300 rounded-md outline-primary "
            />
          </div>

          <button
            onClick={() => {}}
            className="h-11 bg-primary hover:bg-primary-hover text-white rounded-md text-md px-4 justify-center text-center outline-none flex items-center gap-1  "
          >
            <HiOutlinePlus className="text-white" />
            Filter by referral source
          </button>
        </div>
      </div>
      <div className="w-full  grid grid-cols-1  lg:grid-cols-4 justify-center gap-6 mb-6 ">
        <LeadCard
          title="Monthly Leads"
          value={`24`}
          point=""
          active={true}
          onClick={() => {}}
        />

        <LeadCard
          title="This Months Earnings"
          value={`$1250`}
          point=""
          active={false}
          onClick={() => {}}
        />
        <LeadCard
          title="Team Members"
          value={`16`}
          point=""
          active={false}
          onClick={() => {}}
        />
        <LeadCard
          title="Override Earnings"
          value={`${470}`}
          point=""
          active={false}
          onClick={() => {}}
        />
      </div>
      <div className="w-full mb-6">
        <OverrideEarningsTable />
      </div>
      <div className="w-full h-full grid grid-cols-12 gap-5">
        <div className="w-full h-full col-span-12 lg:col-span-6">
            <TeamPerformanceTable/>
        </div>
        <div className="w-full h-full col-span-12 lg:col-span-6">
            <BenefitAllocationChart/>
        </div>
      </div>
    </div>
  );
};

export default Manager;

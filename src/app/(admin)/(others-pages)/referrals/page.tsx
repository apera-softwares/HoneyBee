"use client"
import React, { useState } from "react";
import CommonHeading from "@/components/common/CommonHeading";
import { CiSearch } from "react-icons/ci";
import { Toaster } from "react-hot-toast";
import ReferralTable from "@/components/referral/ReferralTable";
import LeadCard from "@/components/LeadCard";
import { useAppSelector } from "@/lib/redux/hooks";

export default function Referrals() {

    const {
        pieChartLeads: { lifetime, totalLeads },
    } = useAppSelector((state) => state.statistics);
    const [searchInput, setSearchInput] = useState("")
    const [status, setStatus] = useState("");

    const getCountByStatus = (label: string): number => {
        return lifetime.find(item => item?.label === label)?.count || 0;
    }

    return (
        <div className="w-full">
            <Toaster />
            {/* Top Bar: Left (Heading), Right (Search + Actions) */}
            <div className="w-full flex flex-col lg:flex-row items-start justify-between  gap-6 lg:gap-8  mb-6 ">
                {/* Left: Heading */}
                <div className="w-full lg:w-1/2 ">
                    <CommonHeading
                        pageTitle="Referral Leads"
                    // description="Manage all users across Bee-Team, A-Team, Managers, and Admins."
                    />
                </div>

                {/* Right: Actions */}
                <div className=" w-full  flex flex-wrap justify-start lg:justify-end items-center gap-3 ">
                    {/* Search Input */}
                    <div className="relative h-11">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <CiSearch className="text-lg" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by name"
                            name="searchInput"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-10 h-11 pr-4 py-2 border border-gray-300 rounded-md focus:outline-primary"
                        />
                    </div>
                    {/* Create User Button */}

                    {/* <button
                        onClick={() => setIsModalOpen(true)}
                        className="border border-[#151D48] w-32 h-11 text-[#151D48] rounded-md text-sm justify-center text-center outline-none flex items-center gap-1">
                        <HiOutlinePlus />
                        Create User
                    </button> */}

                    {/* Filter Dropdown */}
                    {/* <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="border border-[#151D48] w-32 h-11 text-[#151D48] rounded-md text-sm justify-center text-center outline-none">
                        <option value="">Filter By Role</option>
                        <option value="ADMIN">Admin</option>
                        <option value="A_TEAM">Team A</option>
                        <option value="B_TEAM">Team B</option>
                    </select> */}

                    {/* Filter By Asc Des */}
                    {/* <select
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        className="border border-[#151D48] w-32 h-11 text-[#151D48] rounded-md text-sm justify-center text-center outline-none">
                        <option value="">Short By</option>
                        <option value="asc">asc to des</option>
                        <option value="desc">des to asc</option>
                    </select> */}

                    {/* <button
                        //    onClick={() => setIsAddModalOpen(true)}
                        className="h-11 bg-primary text-white rounded-md text-md px-4 justify-center text-center outline-none flex items-center gap-1 hover:bg-primary-hover ">
                        Filter by referral source
                    </button> */}

                </div>
            </div>
            <div className="w-full  grid grid-cols-1  lg:grid-cols-4 justify-center gap-6 mb-6 ">
                <LeadCard
                    title="Total Referrals"
                    value={totalLeads}
                    point="5+ Increased form last month"
                    active={status === ""}
                    onClick={() => setStatus("")}
                />
                <LeadCard
                    title="Leads Pending"
                    value={getCountByStatus("Pending")}
                    point="15+ Increased form last month"
                    // active={false}
                    active={status === "Pending"}
                    onClick={() => setStatus("Pending")}
                />

                <LeadCard
                    title="Leads Pitched"
                    value={getCountByStatus("Pitched")}
                    point="5+ Increased form last month"
                    active={status === "Pitched"}
                    onClick={() => setStatus("Pitched")}
                />
                <LeadCard
                    title="Leads Sold"
                    value={getCountByStatus("Sold")}
                    point="10+ Increased form last month"
                    active={status === "Sold"}
                    onClick={() => setStatus("Sold")}

                />
            </div>
            {/* Table */}
            <div className="w-full">
                <ReferralTable searchText={searchInput} status={status} />
            </div>
        </div>
    );
}


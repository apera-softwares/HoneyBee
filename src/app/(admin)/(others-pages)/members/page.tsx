"use client"
import React, { useState } from "react";
import CommonHeading from "@/components/common/CommonHeading";
import { CiSearch } from "react-icons/ci";
// import { HiOutlinePlus } from "react-icons/hi";
import { Toaster } from "react-hot-toast";
// import MemberAddAssignProductModal from "@/components/members/MemebrAddAsignProductModal";
import AssignedMembersTable from "@/components/members/MembersTable";

export default function MemberManagement() {

    // const [isModalOpen, setIsModalOpen] = useState(false)
    const [SearchInput, setSearchInput] = useState("")
    const [order, setOrder] = useState("desc")

    return (
        <div className="w-full ">
            <Toaster />
            {/* Top Bar: Left (Heading), Right (Search + Actions) */}
            <div className="w-full flex flex-col lg:flex-row items-start justify-between  gap-6 ">
                {/* Left: Heading */}
                <div className="w-full lg:w-1/2">
                    <CommonHeading
                        pageTitle="Members"
                      description="Members who have been assigned your product for creating leads and generating sales"/>
                </div>

                {/* Right: Actions */}
                <div className="w-full lg:w-1/2 flex flex-wrap justify-start lg:justify-end items-center gap-3 ">
                    {/* Search Input */}
                    <div className="relative h-11">
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
                    </div>
                    {/* Sort By Date */}
                    <select
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        className="border border-[#151D48] w-32 h-11 text-[#151D48] rounded-md text-sm justify-center text-center outline-none">
                        <option value="">Sort By Date</option>
                        <option value="asc">asc to des</option>
                        <option value="desc">des to asc</option>
                    </select>

                </div>
            </div>

            {/* Table */}
            <div className="mt-6">
                <AssignedMembersTable searchText={SearchInput} role="" order={order} />
                {/* <MemberAddAssignProductModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} /> */}

            </div>
        </div>
    );
}

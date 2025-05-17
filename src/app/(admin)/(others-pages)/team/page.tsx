"use client"
import React, { useState } from "react";
import CommonHeading from "@/components/common/CommonHeading";
import { CiSearch } from "react-icons/ci";
import { HiOutlinePlus } from "react-icons/hi";
import { Toaster } from "react-hot-toast";
import TeamAddEdit from "@/components/team/TeamAddEdit";
import TeamTable from "@/components/team/TeamTable";

export default function UserManagement() {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [SearchInput, setSearchInput] = useState("")
    const [filterRole, setFilterRole] = useState("")
    const [order, setOrder] = useState("")

    return (
        <div className="">
            <Toaster />
            {/* Top Bar: Left (Heading), Right (Search + Actions) */}
            <div className="flex flex-col lg:flex-row items-start justify-between lg:items-center gap-4">
                {/* Left: Heading */}
                <div className=" w-auto">
                    <CommonHeading
                        pageTitle="Team Management"
                        description="Manage all Team's manager and members"/>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap justify-start lg:justify-end items-center gap-3 w-1/2">
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
                    {/* Create User Button */}

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="h-11 bg-amber-500 text-white rounded-md text-md px-4 justify-center text-center outline-none flex items-center gap-1 hover:bg-amber-600">
                        <HiOutlinePlus className="text-white"/>
                        Create Team
                    </button>

                     {/* <div className="w-32 h-11 relative rounded-md">
                        <div className="w-32 h-11 left-0 top-0 absolute bg-amber-500 rounded-md" />
                        <div className="left-[36px] top-[14.43px] absolute justify-start text-white text-sm font-medium font-['Montserrat']">CSV/PDF</div>
                    </div> */}

                    {/* Filter By Asc Des */}
                    <select
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        className="border border-[#151D48] w-32 h-11 text-[#151D48] rounded-md text-sm justify-center text-center outline-none">
                        <option value="">Short By</option>
                        <option value="asc">asc to des</option>
                        <option value="desc">des to asc</option>
                    </select>

                </div>
            </div>

            {/* Table */}
            <div className="mt-6">
                <TeamTable searchText={SearchInput} role={filterRole} order={order} />
                <TeamAddEdit isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} type="add" />

            </div>
        </div>
    );
}

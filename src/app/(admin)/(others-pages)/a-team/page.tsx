"use client"
import React, { useState } from "react";
import CommonHeading from "@/components/common/CommonHeading";
import { CiSearch } from "react-icons/ci";
import UserAddEditModal from "@/components/user/UserAddEditModal";
import UserTable from "@/components/user/UserTable";
import { Toaster } from "react-hot-toast";
import ServiceCard from "@/components/ServiceCard";
import { SERVICES } from "@/data/services";
import LeadCard from "@/components/LeadCard";

export default function UserManagement() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [SearchInput, setSearchInput] = useState("")

    return (
        <div className="">
            <Toaster />
            {/* Top Bar: Left (Heading), Right (Search + Actions) */}
            <div className="flex flex-col lg:flex-row items-start justify-between lg:items-center gap-4">
                {/* Left: Heading */}
                <div className=" w-auto">
                    <CommonHeading
                        pageTitle="A-Team member"
                    // description="Manage all users across Bee-Team, A-Team, Managers, and Admins."
                    />
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap justify-start lg:justify-end items-center gap-3 lg:w-1/2 w-full">
                    {/* Search Input */}
                    <div className="relative h-11">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <CiSearch />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by name, product, date"
                            name="SearchInput"
                            value={SearchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-10 h-11 pr-4 py-2 border border-gray-300 rounded-md focus:outline-[#FFA819]"
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

                    <button
                        //    onClick={() => setIsAddModalOpen(true)}
                        className="h-11 bg-amber-500 text-white rounded-md text-md px-4 justify-center text-center outline-none flex items-center gap-1 hover:bg-amber-600">
                        Filter by referral source
                    </button>

                </div>
            </div>
            {/* Table */}
            <div className="w-full max-w-[1500px] grid grid-cols-1  lg:grid-cols-4 justify-center gap-10  lg:gap-6 my-4">
                <LeadCard
                    title="New Referrals"
                    value="30"
                    point="5+ Increased form last month"
                    active={true}
                />
                <LeadCard
                    title="Leads Pitched"
                    value="24"
                    point="5+ Increased form last month"
                    active={false}
                />
                <LeadCard
                    title="Leads Sold"
                    value="12"
                    point="10+ Increased form last month"
                    active={false}

                />
                 <LeadCard
                    title="Total Earned (Team)"
                    value="$2,400"
                    point="15+ Increased form last month"
                    active={false}

                />
            </div>
            <div className="mt-6">
                <UserTable searchText={SearchInput} role="A_TEAM" order="" from="team-a" />
                <div className="w-full max-w-[1500px] grid grid-cols-1  lg:grid-cols-3 justify-center gap-10  lg:gap-6 mt-6">
                    {SERVICES && SERVICES?.length > 0 ? (
                        SERVICES?.map((serviceItems: any) => (
                            <ServiceCard
                                key={serviceItems?.id}
                                title={serviceItems?.title}
                                points={serviceItems?.servicesPoints}
                                images={serviceItems?.images}
                            />
                        ))
                    ) : (
                        <div></div>
                    )}
                </div>
                <UserAddEditModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} type="add" />
            </div>
        </div>
    );
}


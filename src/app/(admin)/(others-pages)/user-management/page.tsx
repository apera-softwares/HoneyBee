"use client"
import React, { useState } from "react";
import CommonHeading from "@/components/common/CommonHeading";
import { CiSearch } from "react-icons/ci";
import { HiOutlinePlus } from "react-icons/hi";
import UserAddEditModal from "@/components/user/UserAddEditModal";
import UserTable from "@/components/user/UserTable";
import { Toaster } from "react-hot-toast";

export default function UserManagement() {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [SearchInput, setSearchInput] = useState("")
    const [filterRole, setFilterRole] = useState("")
    const [order, setOrder] = useState("desc")

    return (
        <div className="w-full ">
            <Toaster />
            {/* Top Bar: Left (Heading), Right (Search + Actions) */}
            <div className="w-full flex flex-col lg:flex-row items-start justify-between  gap-6 mb-6 ">
                {/* Left: Heading */}
                <div className="w-full lg:w-1/2 ">
                    <CommonHeading
                        pageTitle="User Management"
                        description="Manage all users across A-Team and B-Team"
                    />
                </div>

                {/* Right: Actions */}
                <div className="w-full lg:w-1/2 flex flex-wrap justify-start lg:justify-end items-center gap-3">
                    {/* Search Input */}
                    <div className="relative h-11">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <CiSearch className="text-lg " />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by name, product, date"
                            name="SearchInput"
                            value={SearchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-10 h-11 pr-4 py-2 border border-gray-300 rounded-md outline-primary "
                        />
                    </div>
                    {/* Create User Button */}

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="border border-[#151D48] w-32 h-11 text-[#151D48] rounded-md text-sm justify-center text-center outline-none flex items-center gap-1">
                        <HiOutlinePlus />
                        Create User
                    </button>

                    {/* Filter Dropdown */}
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="border border-[#151D48] w-32 h-11 text-[#151D48] rounded-md text-sm justify-center text-center outline-none">
                        <option value="">Filter By Role</option>
                        <option value="ADMIN">Admin</option>
                        <option value="A_TEAM">Team A</option>
                        <option value="B_TEAM">Team B</option>
                    </select>

                    {/* Filter By Asc Des */}
                    <select
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        className="border border-[#151D48] w-32 h-11 text-[#151D48] rounded-md text-sm justify-center text-center outline-none">
                        <option value="">Sort By Date</option>
                        <option value="asc">asc to des</option>
                        <option value="desc">des to asc</option>
                    </select>

                    {/* Upload Button */}
                    {/* <div className="w-32 h-11 relative rounded-md">
                        <div className="w-32 h-11 left-0 top-0 absolute bg-amber-500 rounded-md" />
                        <div className="left-[36px] top-[14.43px] absolute justify-start text-white text-sm font-medium font-['Montserrat']">CSV/PDF</div>
                    </div> */}

                </div>
            </div>

            {/* Table */}
            <div className="w-full">
                <UserTable searchText={SearchInput} role={filterRole} order={order} />
                <UserAddEditModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} type="add" />

            </div>
        </div>
    );
}

"use client";
import React, { useState } from "react";
import CommonHeading from "@/components/common/CommonHeading";
import { CiSearch } from "react-icons/ci";
import { HiOutlinePlus } from "react-icons/hi";
import { Toaster } from "react-hot-toast";
import TeamAddEdit from "@/components/team/TeamAddEdit";
import TeamTable from "@/components/team/TeamTable";
import { useAppSelector } from "@/lib/redux/hooks";
import { UserRole } from "@/constant/userRoles";

export default function TeamManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput,setSearchInput] = useState("");
  const [order] = useState("");
  const { user: loggedUser } = useAppSelector((state) => state.user);
  const { teams, loading } = useAppSelector((state) => state.teamManagement);

  const showCreateTeamButton =
    loggedUser?.role === UserRole.ADMIN ||
    (loggedUser?.role === UserRole.B_TEAM && teams.length === 0) ||
    loading;

  return (
    <div className="w-full">
      <Toaster />
      {/* Top Bar: Left (Heading), Right (Search + Actions) */}
      <div className="w-full flex flex-col lg:flex-row items-start justify-between  gap-6 mb-6 ">
        {/* Left: Heading */}
        <div className="w-full lg:w-1/2">
          <CommonHeading
            pageTitle="Team Management"
            description="Manage Team members"
          />
        </div>

        {/* Right: Actions */}
        <div className="w-full lg:w-1/2 flex flex-wrap justify-start lg:justify-end items-center gap-3">
          {/* Search Input */}
          {
            loggedUser?.role === UserRole.ADMIN && ( <div className="relative h-11">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <CiSearch className="text-lg" />
            </span>
            <input
              type="text"
              placeholder="Search team by name"
              name="searchInput"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 h-11 pr-4 py-2 border border-gray-300 rounded-md focus:outline-primary "
            />
          </div>)
          }

          {/* Create User Button */}

          {showCreateTeamButton && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="h-11 bg-primary hover:bg-primary-hover text-white rounded-md text-md px-4 justify-center text-center outline-none flex items-center gap-1"
            >
              <HiOutlinePlus className="text-white" />
              Create Team
            </button>
          )}

          {/* <div className="w-32 h-11 relative rounded-md">
                        <div className="w-32 h-11 left-0 top-0 absolute bg-amber-500 rounded-md" />
                        <div className="left-[36px] top-[14.43px] absolute justify-start text-white text-sm font-medium font-['Montserrat']">CSV/PDF</div>
                    </div> */}

          {/* Filter By Asc Des */}

        </div>
      </div>

      {/* Table */}
      <div className="w-full ">
        <TeamTable searchText={searchInput} role="" order={order} isCreateTeamModalOpen={isModalOpen} />
        <TeamAddEdit
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          type="add"
        />
      </div>
    </div>
  );
}

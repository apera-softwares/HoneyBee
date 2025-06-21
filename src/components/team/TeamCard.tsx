"use client";
import React, { useState } from "react";
import ChangeTeamModal from "./ChangeTeamModal";
import { FiEdit } from "react-icons/fi";

interface TeamCard {
  team: any;
  teamMembers: any[];
}
const TeamCard: React.FC<TeamCard> = ({ team, teamMembers }) => {




  const [showChangeTeamModal, setShowChangeTeamModal] =
    useState<boolean>(false);
  return (
    <div className="relative w-full h-full rounded-2xl border border-gray-200 bg-white p-5 text-gray-500">
      <div className="w-full flex items-start justify-between gap-3 mb-4 ">
        <h3 className="text-lg font-medium">Team</h3>
        <button
          onClick={() => setShowChangeTeamModal(true)}
          className=" bg-primary hover:bg-primary/50 text-white rounded-lg  p-2  text-center outline-none flex items-center justify-center transition-all duration-300"
        >
          <FiEdit className="text-white" />
        </button>
      </div>

      <div className="w-full ">
        <h2 className=" text-lg font-medium mb-6 pb-2  border-b border-gray-200">
          {team?.team?.name || ""}
        </h2>
        <div className="w-full">
          <h2 className=" mb-3 text-sm font-medium ">Team Members</h2>
          <div className="w-full max-h-36 overflow-y-auto no-scrollbar  border border-gray-200 rounded-md">
            <ul className="space-y-1.5">
              {teamMembers && teamMembers?.length > 0 ? (

                teamMembers.map((member: any) => {
                  console.log(member,"member")
                  return (
                    <li
                      key={member?.id}
                      className="text-sm px-2 py-1.5 bg-gray-100 "
                    >{`${member?.user?.firstName || ""} ${member?.user?.lastName || ""
                      }`}</li>
                  )
                })
              ) : (
                <li className="text-sm px-2 py-1 bg-gray-100 ">
                  No member found
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <ChangeTeamModal
        isOpen={showChangeTeamModal}
        closeModal={() => setShowChangeTeamModal(false)}
      />
    </div>
  );
};

export default TeamCard;

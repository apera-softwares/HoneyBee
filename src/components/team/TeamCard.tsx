"use client";
import React, { useState } from "react";
import ChangeTeamModal from "./ChangeTeamModal";

interface TeamCard {
  team: any;
  teamMembers: any[];
}
const TeamCard: React.FC<TeamCard> = ({ team, teamMembers }) => {
  const [showChangeTeamModal, setShowChangeTeamModal] =
    useState<boolean>(false);
  return (
    <div className="relative w-full h-full rounded-2xl border border-gray-200 bg-white px-4 py-5 text-gray-500">
      <h3 className="font-medium mb-1">Team</h3>
      <div className="w-full">
        <h2 className=" text-lg font-medium mb-6 pb-2  border-b border-gray-200">
          {team?.team?.name || ""}
        </h2>
        <div className="w-full">
          <h2 className=" mb-3 text-sm font-medium ">Team Members</h2>
          <div className="w-full max-h-36 overflow-y-auto no-scrollbar  border border-gray-200 rounded-md">
            <ul className="space-y-1.5">
              {teamMembers && teamMembers?.length > 0 ? (
                teamMembers.map((member: any) => (
                  <li
                    key={member?.id}
                    className="text-sm px-2 py-1.5 bg-gray-100 "
                  >{`${member?.user?.firstName || ""} ${
                    member?.user?.lastName || ""
                  }`}</li>
                ))
              ) : (
                <li className="text-sm px-2 py-1 bg-gray-100 ">
                  No member found
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end mt-6 lg:mt-10 ">
                   <button
              onClick={() => setShowChangeTeamModal(true)}
              className=" bg-primary hover:bg-primary-hover text-white rounded-md text-md  py-2 px-6  text-center outline-none flex items-center justify-center"
            >
              Change Team
            </button>
      </div>
      <ChangeTeamModal
        isOpen={showChangeTeamModal}
        closeModal={() => setShowChangeTeamModal(false)}
      />
    </div>
  );
};

export default TeamCard;

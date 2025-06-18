"use client";
import React from "react";

interface TeamCard {
  team: any;
  teamMembers: any[];
}
const TeamCard: React.FC<TeamCard> = ({ team, teamMembers }) => {
  return (
    <div className="w-full h-full rounded-2xl border border-gray-200 bg-white px-4 py-5 text-gray-500">
      <h3 className="font-medium mb-1">Team</h3>
      <h2 className=" text-lg font-medium mb-6 pb-2  border-b border-gray-200">
        {
          team?.team?.name||""
        }
      </h2>
      <div className="w-full">
        <h2 className=" mb-3 text-sm font-medium ">Team Members</h2>
        <div className="w-full max-h-36 overflow-y-auto no-scrollbar  border border-gray-200 rounded-md">
          <ul className="space-y-1.5">
            {teamMembers && teamMembers?.length > 0 ? (
              teamMembers.map((member: any) => (
                <li key={member?.id} className="text-sm px-2 py-1.5 bg-gray-100 ">{`${
                  member?.user?.firstName || ""
                } ${member?.user?.lastName || ""}`}</li>
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
  );
};

export default TeamCard;

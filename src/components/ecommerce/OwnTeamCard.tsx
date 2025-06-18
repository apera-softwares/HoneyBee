"use client";
import React from "react";

interface OwnTeamCardProps {
  team: any;
  teamMembers: any[];
}
const OwnTeamCard: React.FC<OwnTeamCardProps> = ({ team, teamMembers }) => {
  console.log("team",team);
  return (
    <div className="w-full h-full rounded-2xl border border-gray-200 bg-white px-4 py-5 text-gray-600">
      <h2 className=" bg-gray-100  text-lg font-medium rounded-lg py-1 px-2 mb-6 ">
        Team B
        {/* {
          team?.name||""
        } */}
      </h2>
      <div className="w-full">
        <h2 className=" mb-3 text-sm font-medium ">Team Members</h2>
        <div className="w-full max-h-32 overflow-y-auto no-scrollbar border rounded-md">
          <ul className="space-y-1">
            {teamMembers && teamMembers?.length > 0 ? (
              teamMembers.map((member: any) => (
                <li key={member.id} className="text-sm px-2 py-1 bg-gray-100 ">{`${
                  member.user?.firstName || ""
                } ${member.user?.lastName || ""}`}</li>
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

export default OwnTeamCard;

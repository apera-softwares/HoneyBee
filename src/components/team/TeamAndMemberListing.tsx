"use client";
import React, { useState } from "react";
import ChangeTeamModal from "./ChangeTeamModal";
import { FiEdit } from "react-icons/fi";
import { BACKEND_API } from "@/api";
import { DEFAULT_PROFILE_IMAGE } from "@/constant/defaultImages";
import { capitalizeWord, capitalizeWords } from "@/utils/stringUtils";
interface TeamAndMemberListing {
  team: any;
  teamMembers: any[];
}
const TeamAndMemberListing: React.FC<TeamAndMemberListing> = ({ team, teamMembers }) => {
  const [showChangeTeamModal, setShowChangeTeamModal] =
    useState<boolean>(false);
  return (
    <div className="relative w-full h-full rounded-2xl border border-gray-200 bg-white p-5 text-gray-500">
      <div className="w-full flex items-center justify-between gap-3 mb-2 ">
        <h3 className="text-lg  font-medium">Team</h3>
        <button
          onClick={() => setShowChangeTeamModal(true)}
          className=" bg-primary hover:bg-primary text-white text-xs font-medium rounded-md   p-2  text-center outline-none flex items-center justify-center flex-nowrap gap-2 transition-all duration-300"
        >
          Change Team <FiEdit className=" text-sm text-white" />
        </button>
      </div>

      <div className="w-full ">
        <h2 className=" text-lg font-medium mb-6 pb-2  border-b border-gray-100">
          {capitalizeWords(team?.team?.name)}
        </h2>
        <div className="w-full">
          <h2 className=" mb-2 text-sm font-medium ">Members</h2>
          <div className="w-full max-h-[164px] overflow-y-auto  rounded ">
            <ul className="space-y-1">
              {teamMembers && teamMembers?.length > 0 ? (
                teamMembers.map((member: any) => {
                  const imgSrc = member?.user?.media?.[0]?.imageName
                      ? `${BACKEND_API}uploads/${member?.user?.media?.[0]?.imageName}`
                      : DEFAULT_PROFILE_IMAGE;
                  return (
                    <li
                      key={member?.id}
                      className=" flex items-center gap-2 text-sm px-2 py-1.5  rounded-md"
                    >
                      <img src={imgSrc} alt="Profile" className="w-6 h-6 object-cover object-center border border-primary rounded-full" />
                     <span className="">{`${capitalizeWord(member?.user?.firstName)} ${capitalizeWord(member?.user?.lastName)}`}</span>
                    </li>
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

export default TeamAndMemberListing;

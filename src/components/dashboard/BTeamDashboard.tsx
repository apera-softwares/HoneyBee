"use client";
import React, { useState, useEffect } from "react";
import StatisticsAreaChart from "../statistic-charts/StatisticsAreaChart";
import TeamAndMemberListing from "@/components/team/TeamAndMemberListing";
import StatisticsPieChart from "../statistic-charts/StatisticsPieChart";
import axios from "axios";
import { useAppSelector } from "@/lib/redux/hooks";
import { BACKEND_API } from "@/api";
//import DashboardProductsTable from "../product-catalog/DashboardProductsTable";
import PayoutTable from "../referral/PayoutTable";

const BTeamDashboard = () => {

  const [team, setTeam] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any>([]);
  const { user: loggedInUser } = useAppSelector((state) => state.user);
  const { userProfile } = useAppSelector((state) => state.userProfile);
  const memberId =
    userProfile?.teamMember?.find((member: any) => member.isMemberOnly === true)
      ?.id || null;

  useEffect(() => {
    getTeamUserById();
  }, [memberId]);

  const getTeamUserById = async () => {
    if (!memberId) return;

    try {
      const token = loggedInUser?.token;
      const response = await axios.get(
        `${BACKEND_API}team/getTeamByTeamMember/${memberId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const teamData = response.data?.data || null;
      setTeam(teamData);

      if (teamData?.teamId) {
        const teamId = teamData.teamId;
        getTeamMembersByTeamId(teamId);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error(" error  while getting team", error.response.data);
        } else {
          console.error("error while getting team", error?.message);
        }
      } else {
        console.error("Unexpected Error while getting team:", error);
      }
    }
  };

  const getTeamMembersByTeamId = async (teamId: string) => {
    try {
      const token = loggedInUser?.token;
      const response = await axios.get(`${BACKEND_API}team/members/${teamId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      const teamsMembersData = response.data?.data || [];
      setTeamMembers(teamsMembersData);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error(
            " error response while getting team members",
            error.response.data
          );
        } else {
          console.error("error while getting team members", error?.message);
        }
      } else {
        console.error("Unexpected Error while getting team members", error);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="w-full grid grid-cols-12 gap-5 mb-5">
        <div className="w-full col-span-12 lg:col-span-5 h-full ">
          <StatisticsPieChart />
        </div>
        <div className="w-full col-span-12 lg:col-span-7 ">
          <StatisticsAreaChart />
        </div>
      </div>
      <div className="mb-5">
        <PayoutTable />
      </div>

      {team?.teamId && (
        <div className="w-full mb-5">
          <TeamAndMemberListing team={team} teamMembers={teamMembers} />
        </div>
      )}

      {/* <div className="w-full">
        <DashboardProductsTable />
      </div> */}
    </div>
  );
};

export default BTeamDashboard;

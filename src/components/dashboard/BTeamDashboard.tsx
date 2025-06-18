"use client";
import React,{useState,useEffect} from "react";
// import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
//import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
// import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import OwnTeamCard from "@/components/ecommerce/OwnTeamCard";
// import DemographicCard from "@/components/ecommerce/DemographicCard";
import axios from "axios";
import { useAppSelector } from "@/lib/redux/hooks";
import { BACKEND_API } from "@/api";

const BTeamDashboard = () => {
const [teams,setTeams]=useState<any>([{}]);
const [teamMembers,setTeamMembers]=useState<any>([]);
const {user : loggedInUser} = useAppSelector((state)=>state.user);


  useEffect(() => {
    if (loggedInUser?.token && loggedInUser?.userId) {
      getTeamUserById();
    }
  }, [loggedInUser]);

 const getTeamUserById = async () => {
  try {
    const token = loggedInUser?.token;
    const response = await axios.get(`${BACKEND_API}${loggedInUser?.userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    const teamsData = response.data?.data||[];
    setTeams(teamsData);
    if (teamsData.length > 0) {
      const teamId = teamsData[0]?.id;
      getTeamMembersByTeamId(teamId);
    }

  } catch (error: any) {
    if (axios.isAxiosError(error)) {

      if (error.response) {
        console.error(' error response while getting teams', error.response.data);
      }else {
        console.error('error while getting teams', error?.message);
      }
    } else {
      console.error('Unexpected Error while getting teams:', error);
    }
  }
};

 const getTeamMembersByTeamId = async (teamId: string) => {
  try {
    const token = loggedInUser?.token;
    const response = await axios.get(`${BACKEND_API}team/members/${teamId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    const teamsMembersData = response.data?.data||[];
    setTeamMembers(teamsMembersData);

  } catch (error: any) {
    if (axios.isAxiosError(error)) {

      if (error.response) {
        console.error(' error response while getting team members', error.response.data);
      }else {
        console.error('error while getting team members', error?.message);
      }
    } else {
      console.error('Unexpected Error while getting team members', error);
    }
  }
};



  return (
    <div className="w-full">
      {/* <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div> */}

      {/* <div className="w-full grid grid-cols-12 gap-5 mb-5">
        <div className=" col-span-12 lg:col-span-8 mb-5 lg:mb-0">
          <StatisticsChart />
        </div>
        <div className=" col-span-12 lg:col-span-4 mb-5  ">
          <OwnTeamCard />
        </div>
      </div> */}
      <div className="w-full grid grid-cols-12 gap-5 mb-5">
        <div className={`col-span-12 ${teams.length > 0 ? 'lg:col-span-8' : ''} mb-5 lg:mb-0`}>
          <StatisticsChart />
        </div>
        {teams.length > 0 && (
          <div className="col-span-12 lg:col-span-4 mb-5">
            <OwnTeamCard team={teams} teamMembers={teamMembers} />
          </div>
         )}
      </div>
      {/* 
      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div> */}

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
  );
};

export default BTeamDashboard;

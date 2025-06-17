import type { Metadata } from "next";
// import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
//import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
// import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import OwnTeamCard from "@/components/ecommerce/OwnTeamCard";
// import DemographicCard from "@/components/ecommerce/DemographicCard";

export const metadata: Metadata = {
  title:
    "Honeybee Harry's",
  description: "Admin Dashboard",
};

export default function Ecommerce() {
  return (
    <div className="w-full">
      {/* <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div> */}

      <div className="w-full grid grid-cols-12 gap-5 mb-5">
        <div className=" col-span-12 lg:col-span-8 mb-5 lg:mb-0"><StatisticsChart /></div>
        <div className=" col-span-12 lg:col-span-4 mb-5  "><OwnTeamCard/></div>

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
}

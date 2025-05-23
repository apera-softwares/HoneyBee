import type { Metadata } from "next";
// import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
// import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
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

      <div className="lg:flex justify-between w-full">
        <div className="lg:w-[39%]"><MonthlyTarget /></div>
        <div className="lg:w-[59%]"><StatisticsChart /></div>


      </div>
      {/* 
      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div> */}

      <div className="col-span-12 xl:col-span-7 mt-4">
        <RecentOrders />
      </div>
    </div>
  );
}

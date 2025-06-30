"use client";
import React from "react";
import StatisticsAreaChart from "../statistic-charts/StatisticsAreaChart";
import StatisticsPieChart from "../statistic-charts/StatisticsPieChart";
import DashboardProductsTable from "../product-catalog/DashboardProductsTable";

const AdminDashboard = () => {
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

      <div className="w-full mt-5">
        <DashboardProductsTable />
      </div>
    </div>
  );
};

export default AdminDashboard;

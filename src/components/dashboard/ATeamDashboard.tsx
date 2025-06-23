"use client";
import React from "react";
import StatisticsLineChart from "../statistic-charts/StatisticsLineChart";
import StatisticsChartPie from "../statistic-charts/StatisticsPieChart";
import DashboardProductsTable from "../product-catalog/DashboardProductsTable";

const ATeamDashboard = () => {
  return (
    <div className="w-full">
      <div className="w-full grid grid-cols-12 gap-5 mb-5">
        <div className="w-full col-span-12 lg:col-span-5 h-full ">
          <StatisticsChartPie />
        </div>
        <div className="w-full col-span-12 lg:col-span-7 ">
          <StatisticsLineChart />
        </div>
      </div>

      <div className="w-full mt-5">
        <DashboardProductsTable />
      </div>
    </div>
  );
};

export default ATeamDashboard;

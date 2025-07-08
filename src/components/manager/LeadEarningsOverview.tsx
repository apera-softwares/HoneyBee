"use client";
import React from "react";
import LeadCard from "../common/LeadCard";
import { useAppSelector } from "@/lib/redux/hooks";

interface Lead{
  label:string;
  count:number;
}
interface Earning{
  label:string;
  count:string|number;
}

const LeadEarningsOverview = () => {

const {pieChartEarnings:{monthly:monthlyEarnings},pieChartLeads:{monthly:monthlyLeads}} = useAppSelector((state)=>state.statistics);

  const getMonthlyLeads = (leads:Lead[])=>{
    return leads?.length === 0 ? 0 : leads.reduce((total:number, lead:any) => total + lead.count, 0);
  }

  function getMonthlyEarnings(earnings:Earning[]) {
    if (earnings.length === 0) return 0;
    return earnings.reduce((total, earning) => {
        const value = Number(earning.count);
        return isNaN(value) ? total : total + value;
    }, 0);
}

  return (
    <div className="w-full  grid grid-cols-1  lg:grid-cols-3 justify-center gap-6">
      <LeadCard
        title="Monthly Leads"
        value={getMonthlyLeads(monthlyLeads)}
        point=""
        active={true}
        onClick={() => {}}
      />
      <LeadCard
        title="This Months Earnings"
        value={`$${getMonthlyEarnings(monthlyEarnings)}`}
        point=""
        active={false}
        onClick={() => {}}
      />
      {/* <LeadCard
        title="Team Members"
        value={`16`}
        point=""
        active={false}
        onClick={() => {}}
      /> */}
      {/* <LeadCard
        title="Override Earnings"
        value={`$${470}`}
        point=""
        active={false}
        onClick={() => {}}
      /> */}
    </div>
  );
};

export default LeadEarningsOverview;

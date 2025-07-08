"use client";
import React from "react";
import LeadCard from "../common/LeadCard";

const LeadEarningsOverview = () => {
  return (
    <div className="w-full  grid grid-cols-1  lg:grid-cols-4 justify-center gap-6">
      <LeadCard
        title="Monthly Leads"
        value={`24`}
        point=""
        active={true}
        onClick={() => {}}
      />
      <LeadCard
        title="This Months Earnings"
        value={`$1250`}
        point=""
        active={false}
        onClick={() => {}}
      />
      <LeadCard
        title="Team Members"
        value={`16`}
        point=""
        active={false}
        onClick={() => {}}
      />
      <LeadCard
        title="Override Earnings"
        value={`$${470}`}
        point=""
        active={false}
        onClick={() => {}}
      />
    </div>
  );
};

export default LeadEarningsOverview;

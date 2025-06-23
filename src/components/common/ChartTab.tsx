"use client";
import React, { useState } from "react";
const RANGES = [
  {
    label: "This Month",
    value: "this-month",
  },
  {
    label: "Monthly",
    value: "monthly",
  },
  {
    label: "Yearly",
    value: "yearly",
  },
  {
    label: "Life Time",
    value: "life-time",
  },
];

const ChartTab: React.FC = () => {

  const [selected, setSelected] = useState(RANGES[0]);

  return (
    <div className="flex items-center gap-0.5 flex-wrap rounded-lg bg-white p-1 border border-gray-200 dark:bg-gray-900">
      {RANGES.map((item) => (
        <button
          key={item.value}
          onClick={() => setSelected(item)}
          className={`px-3 py-2 font-medium  rounded-md text-sm   dark:hover:text-white ${
            selected.value === item.value ? " text-white bg-primary" : "bg-white"
          } transition-all duration-300 `}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default ChartTab;

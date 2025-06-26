"use client";
import React from "react";

interface OptionItem {
  label: string;
  value: string;
}
interface ChartTabProps {
  options: OptionItem[];
  selected: OptionItem;
  onSelect: (option: OptionItem) => void;
}

const ChartTab: React.FC<ChartTabProps> = ({ options, selected, onSelect }) => {


  return (
    <div className="flex items-center gap-0.5 flex-wrap rounded-lg bg-white p-1 border border-gray-200 dark:bg-gray-900">
      {options.map((item) => (
        <button
          key={item.value}
          onClick={() => onSelect(item)}
          className={`px-3 py-2 font-medium  rounded-md text-sm   dark:hover:text-white ${selected.value === item.value ? " text-white bg-primary" : "bg-white"
            } transition-all duration-300 `}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default ChartTab;

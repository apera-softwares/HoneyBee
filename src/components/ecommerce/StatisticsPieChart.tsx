"use client";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { IoChevronDownSharp } from "react-icons/io5";
import { IoChevronUpSharp } from "react-icons/io5";

import dynamic from "next/dynamic";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function StatisticsChartPie() {
  const series = [250, 230, 100, 150];
  const options: ApexOptions = {
    colors: ["#fb6514", "#feb273", "#ffead5", "#fffaf5"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
      height: 330,
      sparkline: {
        enabled: false,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              fontSize: "16px",
              formatter: function (w: any) {
                return w.globals.seriesTotals
                  .reduce((a: number, b: number) => a + b, 0)
                  .toString();
              },
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#fb6514", "#feb273", "#ffead5", "#fffaf5"]
    },
    stroke: {
      lineCap: "round",
    },
    legend: {
  position: "right", // can be "top", "bottom", etc., but it won't affect layout
  horizontalAlign: "center",

  itemMargin: {
    vertical: 6,
  },
  formatter: function (seriesName, opts) {
    const value = opts.w.globals.series[opts.seriesIndex];
    return `${seriesName}: ${value}`;
  },
    },
    labels: ["Pending", "Pitch", "Sold", "Paidout"],
  };

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="w-full h-full rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="h-full px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between  mb-6 sm:mb-8">
          <div>
        
            <p className="text-lg text-gray-700 dark:text-white/90">
              Referral pipeline
            </p>
          </div>
          <div className="relative inline-block">
            <button
              onClick={toggleDropdown}
              className="dropdown-toggle flex gap-2 items-center justify-between border border-black p-1 px-3 rounded"
            >
              {/* <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" /> */}
              This Month{" "}
              {isOpen ? <IoChevronUpSharp /> : <IoChevronDownSharp />}
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              <DropdownItem
                tag="a"
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                View More
              </DropdownItem>
              <DropdownItem
                tag="a"
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Delete
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
        <div className="relative  ">
          <div className="max-h-[330px]">
            <ReactApexChart
              options={options}
              series={series}
              type="donut"
              height={330}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

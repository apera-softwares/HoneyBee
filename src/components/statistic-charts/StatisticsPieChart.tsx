"use client";
import React, { useState, useEffect, useRef } from "react";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { IoChevronDownSharp } from "react-icons/io5";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { fetchStatisticsNumbers } from "@/lib/redux/slices/statisticsSlice";

import dynamic from "next/dynamic";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const RANGES = [
  {
    label: "This Month",
    value: "this-month",
  },
  {
    label: "Life Time",
    value: "life-time",
  },
];

export default function StatisticsPieChart() {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(RANGES[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { pieChartData } = useAppSelector((state) => state.statistic);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    getStatNumbers();
  }, []);

  const handleSelect = (option: (typeof RANGES)[0]) => {
    setSelected(option);
    setIsOpen(false);
    console.log("Selected range:", option.value); // Call chart update here
  };

  const getStatNumbers = async () => {
    try {
      const payload = {};
      const response = await dispatch(fetchStatisticsNumbers(payload)).unwrap();
      console.log("state numbers response in compoennt", response);
    } catch (error: any) {
      console.log("error while getting stat numbers", error);
    }
  };

  const series = pieChartData.series;
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
      colors: ["#fb6514", "#feb273", "#ffead5", "#fffaf5"],
    },
    stroke: {
      lineCap: "round",
    },
    legend: {
      position: "right", 
      horizontalAlign: "center",

      itemMargin: {
        vertical: 6,
      },
      formatter: function (seriesName, opts) {
        const value = opts.w.globals.series[opts.seriesIndex];
        return `${seriesName}: ${value}`;
      },
    },
    labels: pieChartData.labels,
  };

  return (
    <div className="w-full h-full rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="h-full px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex  items-center justify-between  mb-6 sm:mb-8">
          <div className="">
            <p className="text-lg text-gray-700 dark:text-white/90">
              Referral pipeline
            </p>
          </div>
          <div ref={dropdownRef} className="relative inline-block w-36 text-sm">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="w-full flex items-center justify-between gap-2 px-4 py-2 text-sm bg-white border border-gray-600 hover:border-gray-700 rounded-md shadow-sm  focus:outline-none"
            >
              <span className="text-nowrap">{selected.label}</span>{" "}
              <IoChevronDownSharp className="" />
            </button>

            {isOpen && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                {RANGES.map((option) => (
                  <li
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className={`text-sm px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                      selected.value === option.value
                        ? "bg-gray-100 font-medium"
                        : ""
                    }`}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="relative  ">
          {
            series.length === 0 || series.every((item)=>item===0) ? (<div className="flex items-center justify-center mt-10 lg:mt-20 ">
              <p className=" bg-gray-200 font-medium text-gray-500  px-6 py-3 rounded-lg">No data available</p>

            </div>):(    <div className="max-h-[330px]">
            <ReactApexChart
              options={options}
              series={series}
              type="donut"
              height={330}
            />
          </div>)
          }
      
        </div>
      </div>
    </div>
  );
}

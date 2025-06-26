"use client";
import React, { useState, useEffect, useRef } from "react";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { IoChevronDownSharp } from "react-icons/io5";
import { useAppSelector } from "@/lib/redux/hooks";
import { CHART_RANGES } from "@/data/chartRanges";
import NoChartData from "../common/NoChartData";

import dynamic from "next/dynamic";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function StatisticsPieChart() {

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(CHART_RANGES[0]);
  const [chartData, setChartData] = useState<{
    labels: string[];
    series: number[];
  } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    pieChart: { monthly, lifetime },
  } = useAppSelector((state) => state.statistic);
      console.log( monthly, lifetime ,"pie chart data")


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
    const selectedData = selected.value === "monthly" ? monthly : lifetime;

    if (!selectedData || selectedData.length === 0) {
      setChartData(null);
      return;
    }

    const labels = selectedData.map((item) => item.label);
    const series = selectedData.map((item) => item.count);
    setChartData({ labels, series });
  }, [selected, monthly, lifetime]);

  const handleSelect = (option: (typeof CHART_RANGES)[0]) => {
    setSelected(option);
    setIsOpen(false);
  };

  const series = chartData?.series;
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
      // colors: ["#fb6514", "#feb273", "#ffead5", "#fffaf5"],
      colors: ["#FF9912", "#FF9912", "#FF9912", "#FF9912"],
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
    dataLabels: {
    enabled: true,
    style: {
      colors: ["#FFFFFF"], // ✅ This makes the slice label text white
      fontSize: "12px",
      fontWeight: "bold",
    },
    dropShadow: {
      enabled: false,
    },
  },
    tooltip: {
    theme: "light",
    style: {
      fontSize: "12px",
      fontFamily: "Outfit, sans-serif",
    },
    fillSeriesColor: false,
    marker: {
      show: false,
    },
  },
    labels: chartData?.labels,
  };

  return (
 
      <div className="w-full h-full px-5 py-5 sm:px-6 bg-white border border-gray-200 shadow-default rounded-2xl pb-11 dark:border-gray-800 dark:bg-white/[0.03] ">
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
                {CHART_RANGES.map((option) => (
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
        <div className="relative p-[1px]  ">
          {!chartData ? (
          <NoChartData message="No data available"/>
          ) : (
            <div className="max-h-[330px]">
              <ReactApexChart
                options={options}
                series={series}
                type="donut"
                height={330}
              />
            </div>
          )}
        </div>
      </div>

  );
}

"use client";
import React, { useState, useEffect } from "react";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
// import { IoChevronDownSharp } from "react-icons/io5";
import { useAppSelector } from "@/lib/redux/hooks";
// import { CHART_RANGES } from "@/data/chartRanges";
import NoChartData from "../common/NoChartData";
import dynamic from "next/dynamic";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function BenefitAllocationChart() {
  const {
    benefitAllocation
  } = useAppSelector((state) => state.statistics);
  //const dropdownRef = useRef<HTMLDivElement>(null);
  // const [isOpen, setIsOpen] = useState(false);
  // const [selected, setSelected] = useState(CHART_RANGES[0]);
  const [chartData, setChartData] = useState<{
    labels: string[];
    leadSeries: number[];
  } | null>(null);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       dropdownRef.current &&
  //       !dropdownRef.current.contains(event.target as Node)
  //     ) {
  //       setIsOpen(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);


  useEffect(() => {
    const selectedData = benefitAllocation;

    if (!selectedData || selectedData.length === 0) {
      setChartData(null);
      return;
    }

    const labels = selectedData.map((item) => item.label);
    const leadSeries = selectedData.map((item) => item.count);


    setChartData({ labels, leadSeries });
  }, [benefitAllocation]);

  // const handleSelect = (option: (typeof CHART_RANGES)[0]) => {
  //   setSelected(option);
  //   setIsOpen(false);
  // };

  const series = chartData?.leadSeries;
  const options: ApexOptions = {
    colors: ["#A700FF", "#EF4444","#3CD856", "#FF9912", "#FFCE67","#EBEBEB"],
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
                return `$${w.globals.seriesTotals
                  .reduce((a: number, b: number) => a + b, 0)?.toFixed(2)}`;
              },
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      // colors: ["#fb6514", "#feb273", "#ffead5", "#fffaf5"],
      colors: ["#A700FF", "#EF4444","#3CD856", "#FF9912", "#FFCE67","#EBEBEB"],
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
      formatter: function (seriesName) {
        // const value = opts.w.globals.series[opts.seriesIndex];
        // return `${seriesName}: ${value}`;
       
        return `${seriesName}`;
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
    custom: function ({ series, seriesIndex, w }) {
  
        const label = w.globals.labels[seriesIndex];
        const count = series[seriesIndex];
        return `
          <div class="apex-tooltip font-medium">
          ${label}<br/>
          $${count}
          </div>
        `;
      },
  },
    labels: chartData?.labels,
  };

  return (
 
      <div className="  w-full h-full bg-white border border-gray-200 shadow-default rounded-2xl pb-11 ">
        <div className="flex  items-center justify-between gap-2 px-5 py-5 mb-6 lg:mb-8  border-b border-gray-200 ">
          <div className="">
            <p className="font-medium text-gray-700 dark:text-white/90">
              Benefit allocation summary
            </p>
          </div>
          {/* <div ref={dropdownRef} className="relative inline-block w-32 text-sm">
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
          </div> */}
        </div>
        <div className="relative px-5">
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

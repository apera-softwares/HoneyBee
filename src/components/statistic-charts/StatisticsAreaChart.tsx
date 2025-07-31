"use client";
import React, { useState, useEffect,useMemo,useRef } from "react";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useAppSelector } from "@/lib/redux/hooks";
import { CHART_RANGES } from "@/data/chartRanges";
import NoChartData from "../common/NoChartData";
import { IoChevronDownSharp } from "react-icons/io5";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface OptionItem {
  label: string;
  value: string;
}

interface ChartData {
  categories: string[];
  series1: {
    name: string;
    data: number[];
  };
  series2: {
    name: string;
    data: number[];
  };
}

export default function StatisticsAreaChart() {

  const {
    lineChartLeads: {weekly:weeklyLeads, monthly:monthlyLeads,quarterly:quarterlyLeads,yearly:yearlyLeads, lifetime:lifetimeLeads },
    lineChartEarnings:{weekly:weeklyEarnings,monthly:monthlyEarning,quarterly:quarterlyEarnings,yearly:yearlyRevenue, lifetime:lifetimeRevenue}
  } = useAppSelector((state) => state.statistics);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [selected, setSelected] = useState<OptionItem>(CHART_RANGES[0]);

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
  
  const transformedChartData = useMemo(() => {
    const selectedKey = selected.value;

    const leadData =
      selectedKey === "weekly" ? weeklyLeads : selectedKey === "monthly" ? monthlyLeads : selectedKey === "quarterly" ? quarterlyLeads :
      selectedKey === "yearly" ? yearlyLeads :
      lifetimeLeads;

    const revenueData =
      selectedKey === "weekly" ? weeklyEarnings : selectedKey === "monthly" ? monthlyEarning : selectedKey === "quarterly" ? quarterlyEarnings :
      selectedKey === "yearly" ? yearlyRevenue :
      lifetimeRevenue;

    if (!leadData?.length || !revenueData?.length) return null;

    return {
      categories: leadData.map((item) => item.label),
      series1: {
        name: "Lead",
        data: leadData.map((item) => Number(item.count) || 0),
      },
      series2: {
        name: "Total Earning",
        data: revenueData.map((item) => ((parseFloat(item.count) / 1000)||0)),
      },
    };
  }, [selected, monthlyLeads, yearlyLeads, lifetimeLeads, monthlyEarning, yearlyRevenue, lifetimeRevenue]);


  useEffect(() => {
    setChartData(transformedChartData);
  }, [transformedChartData]);


  // const handleChange = (option: OptionItem) => {
  //   setSelected(option);
  // };

  const handleSelect = (option: (typeof CHART_RANGES)[0]) => {
    setSelected(option);
    setIsOpen(false);
  };


  const options: ApexOptions = {
    legend: {
      show: false, // Hide legend
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#fd9a00", "#fd9a00"], // Define line colors
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area", // Set the chart type to 'line'
      toolbar: {
        show: false, // Hide chart toolbar
      },
    },
    stroke: {
      curve: "smooth", // Define the line style (straight, smooth, or step)
      width: [1, 1], // Line width for each dataset
    },

    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 4, // Size of the marker points
      strokeColors: "#fff", // Marker border color
      strokeWidth: 0,
      hover: {
        size: 6, // Marker size on hover
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Hide grid lines on x-axis
        },
      },
      yaxis: {
        lines: {
          show: true, // Show grid lines on y-axis
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    // tooltip: {
    //   enabled: true, // Enable tooltip
    //   x: {
    //     format: "dd MMM yyyy", // Format for x-axis tooltip
    //   },
    // },

  tooltip: {
  shared: true,
  y: {
    formatter: (val, { seriesIndex }) => {
      if (seriesIndex === 0) return `${val}`;        // Lead
      // if (seriesIndex === 1) return `$${val.toFixed(1)}K`; // Revenue
      if (seriesIndex === 1) return val < 1 ? `$${(val * 1000).toFixed(0)}` : `$${val.toFixed(2)}K`; // Revenue
      return `${val}`;
    },
  },
},
    xaxis: {
      type: "category", // Category-based x-axis
      categories: chartData?.categories,
      axisBorder: {
        show: false, // Hide x-axis border
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
      tooltip: {
        enabled: false, // Disable tooltip for x-axis points
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => (Number.isInteger(val) ? `${val.toString()}` : `${val.toFixed(0)}`),
        // formatter: (val) => (Number.isInteger(val) ? `${val}` : ""),
        style: {
          fontSize: "12px", // Adjust font size for y-axis labels
          colors: ["#6B7280"], // Color of the labels
        },
      },
      title: {
        text: "", // Remove y-axis title
        style: {
          fontSize: "0px",
        },
      },
    },
  };

    const series = useMemo(() => {
    return chartData ? [chartData.series1, chartData.series2] : [];
  }, [chartData]);

  return (
    <div className="w-full h-full rounded-2xl border border-gray-200 bg-white px-5 py-5 sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex  items-center justify-between  mb-6 sm:mb-8">
          <div className="">
            <p className="text-lg text-gray-700 dark:text-white/90">
              Total leads submitted
            </p>
          </div>
          <div ref={dropdownRef} className="relative inline-block w-36 text-sm">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="w-full flex items-center justify-between gap-2 px-4 py-2 text-sm bg-primary text-white border border-gray-200 hover:border-grray-300 rounded-md  focus:outline-none"
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
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        {!chartData ? (
            <NoChartData message="No data available"/>
        ) : (
          <div className="min-w-[1000px] xl:min-w-full ">
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              height={310}
            />
          </div>
        )}
      </div>
    </div>
  );
}

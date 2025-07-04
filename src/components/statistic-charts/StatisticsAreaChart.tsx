"use client";
import React, { useState, useEffect } from "react";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";
import dynamic from "next/dynamic";
import { useAppSelector } from "@/lib/redux/hooks";
import { CHART_RANGES } from "@/data/chartRanges";
import NoChartData from "../common/NoChartData";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface OptionItem {
  label: string;
  value: string;
}
export default function StatisticsAreaChart() {

  const {
    lineChart: { monthly,yearly, lifetime },
  } = useAppSelector((state) => state.statistics);
  const [chartData, setChartData] = useState<any>({});
  const [selected, setSelected] = useState<OptionItem>(CHART_RANGES[0]);


  useEffect(() => {
    
    const selectedData = selected.value === "monthly" ? monthly : selected.value === "yearly" ? yearly :  lifetime;

    if (!selectedData || selectedData.length === 0) {
      setChartData(null);
      return;
    }

    const data = {
      categories: selectedData.map((item) => item.label),
      series: {
        name: "Lead",
        data: selectedData.map((item) => item.count),
      },
    };

    setChartData(data);
  }, [selected, monthly,yearly,lifetime]);

  const handleChange = (option: OptionItem) => {
    setSelected(option);
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
      type: "line", // Set the chart type to 'line'
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
    tooltip: {
      enabled: true, // Enable tooltip
      x: {
        format: "dd MMM yyyy", // Format for x-axis tooltip
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
        formatter: (val) => (Number.isInteger(val) ? `${val}` : ""),
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

  const series = [
    {
      ...chartData?.series,
    },
  ];

  return (
    <div className="w-full h-full rounded-2xl border border-gray-200 bg-white px-5 py-5 sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-col  gap-3 sm:gap-5 mb-6  sm:flex-row items-start sm:items-center sm:justify-between">
        <div className="w-full">
          <p className="text-lg text-gray-700 dark:text-white/90">
            Total leads submitted
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab
            options={CHART_RANGES}
            selected={selected}
            onSelect={handleChange}
          />
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

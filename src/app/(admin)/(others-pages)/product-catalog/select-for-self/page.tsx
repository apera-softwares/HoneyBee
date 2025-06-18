"use client";
import React, { useState, useRef, useEffect } from "react";
import CommonHeading from "@/components/common/CommonHeading";
import { CiSearch } from "react-icons/ci";
// import { FiEdit } from "react-icons/fi";
import ProductSelectTable from "@/components/product-catalog/ProductSelectTable";
import ServiceCard from "@/components/ServiceCard";
import { SERVICES } from "@/data/services";

interface FiltersState {
  searchQuery: string;
  status: string;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
}

export default function SelectForSelect() {
  const [filters, setFilters] = useState<FiltersState>({
    searchQuery: "",
    status: "",
  });

  const [paginationData, setPaginationData] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 0,
  });
  const formRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPaginationData({
      currentPage: 1,
      totalPages: 0,
    });
  }, [filters]);

  const handleEditProductCatalog = (data: any) => {
    const { bulletPoints, ...rest } = data;
    const bulletPointsArray = bulletPoints
      ? data.bulletPoints.split(",").map((point: string) => point.trim())
      : [];

    const bulletPointsObject: { [key: string]: string } = {};
    bulletPointsArray.forEach((point: string, index: number) => {
      bulletPointsObject[`bulletPoint${index + 1}`] = point;
    });
    //handleScrollFormToTop();
  };

  const handleScrollFormToTop = () => {
    if (formRef && formRef.current) {
      formRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const handleScrollHeadingToTop = () => {
    if (headingRef && headingRef.current) {
      headingRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full">
      {/* Top Bar: Left (Heading), Right (Search + Actions) */}
      <div className="w-full flex flex-col lg:flex-row items-start justify-start lg:justify-between  gap-6  mb-6 lg:mb-8 ">
        {/* Left: Heading */}
        <div className=" w-full lg:w-1/2 " ref={headingRef}>
          <CommonHeading pageTitle="Select Proudct" description="" />
        </div>

        {/* Right: Actions */}
        <div className="w-full lg:w-1/2 flex flex-wrap justify-start lg:justify-end items-center gap-3  ">
          {/* Search Input */}
          <div className="relative h-11">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <CiSearch className="text-lg " />
            </span>
            <input
              type="text"
              placeholder="Search by name, product, date"
              name="searchQuery"
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters((prevFilters: FiltersState) => ({
                  ...prevFilters,
                  searchQuery: e.target.value,
                }))
              }
              className="pl-10 h-11 pr-4 py-2 border border-gray-300 rounded-md outline-primary "
            />
          </div>

          {/* Filter By Asc Des */}
          <select
            className="border border-[#151D48] w-32 h-11 text-[#151D48] rounded-md text-sm justify-center text-center outline-none"
            value={`${filters.status}`}
            onChange={(e) =>
              setFilters((prevFilters: FiltersState) => ({
                ...prevFilters,
                status: e.target.value,
              }))
            }
          >
            <option value="">Filter : Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      <div className="w-full overflow-x-auto  no-scrollbar mb-6 lg:mb-8 ">
        <div className="w-full max-w-[900px] flex space-x-5 ">
          {SERVICES && SERVICES?.length > 0 ? (
            SERVICES?.map((serviceItems: any) => (
              <ServiceCard
                key={serviceItems?.id}
                title={serviceItems?.title}
                points={serviceItems?.servicesPoints}
                images={serviceItems?.images}
              />
            ))
          ) : (
            <div></div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="w-full mb-8 ">
        <ProductSelectTable
          filters={filters}
          paginationData={paginationData}
          setPaginationData={setPaginationData}
          onEdit={handleEditProductCatalog}
        />
      </div>
    </div>
  );
}

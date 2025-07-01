"use client";
import React, { useState, useRef, useEffect } from "react";
import CommonHeading from "@/components/common/CommonHeading";
import { CiSearch } from "react-icons/ci";
import { HiOutlinePlus } from "react-icons/hi";
import ProductCatalogTable from "@/components/product-catalog/ProductCatalogTable";
// import { FiEdit } from "react-icons/fi";
import AddEditProductCatalogForm from "@/components/product-catalog/AddEditProductCatalogForm";
import ViewProductDetailsModal from "@/components/product-catalog/ViewProductDetailsModal";
import { BACKEND_API } from "@/api";

interface FiltersState {
  searchQuery: string;
  status: string;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
}

export default function ProductCatalog() {
  const [filters, setFilters] = useState<FiltersState>({
    searchQuery: "",
    status: "",
  });
  const [paginationData, setPaginationData] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 0,
  });
  const [editProductCatalogData, setEditProductCatalogData] = useState<
    any | null
  >(null);
  const [selectedProduct,setSelectedProduct] = useState<any>(null);
  const [showAddEditForm, setShowAddEditForm] = useState<boolean>(false);
  const[showViewProductDetailsModal,setShowViewProductViewDetailsModal] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPaginationData({
      currentPage: 1,
      totalPages: 0,
    });
  }, [filters]);

  useEffect(() => {
    if (showAddEditForm && formRef && formRef?.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }

    if (!showAddEditForm && headingRef && headingRef.current) {
      headingRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [showAddEditForm]);

  const handleEditProductCatalog = (data: any) => {
    const { bulletPoints, ...rest } = data;
    const bulletPointsArray = bulletPoints
      ? data.bulletPoints.split(",").map((point: string) => point.trim())
      : [];

    const bulletPointsObject: { [key: string]: string } = {};
    bulletPointsArray.forEach((point: string, index: number) => {
      bulletPointsObject[`bulletPoint${index + 1}`] = point;
    });

    setEditProductCatalogData({ ...rest, ...bulletPointsObject });
    handleShowFormAndScrollToTop();
  };

  const handleViewProductDetails = (data:any)=>{
    if(data)
    {
       const images = data?.media?.length > 0 ? data?.media?.map((mediaItem: any) => `${BACKEND_API}${mediaItem?.imageName?.slice(2, mediaItem?.imageName?.length)}`) : ["/assets/images/image-not-available.png"];
       setSelectedProduct({...data,images});
       setShowViewProductViewDetailsModal(true);
       return ;
    }
    setShowViewProductViewDetailsModal(false);
    setSelectedProduct(null);
  }

  const handleShowFormAndScrollToTop = () => {
    if (!showAddEditForm) {
      setShowAddEditForm(true);
    } else if (formRef && formRef.current) {
      formRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const handleHideFormOrScrollToHeading = () => {
    if (showAddEditForm) {
      setShowAddEditForm(false);
    } else if (headingRef && headingRef.current) {
      headingRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full">
      {/* Top Bar: Left (Heading), Right (Search + Actions) */}
      <div className="w-full flex flex-col lg:flex-row items-start justify-start lg:justify-between  gap-6  mb-6 ">
        {/* Left: Heading */}
        <div className=" w-full lg:w-1/2 " ref={headingRef}>
          <CommonHeading
            pageTitle="Product Catalog"
            description="Manage products available for referral, member will select products."
          />
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
              placeholder="Search by product name"
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
          {/* <select
                    className="border border-[#151D48] w-32 h-11 text-[#151D48] rounded-md text-sm justify-center text-center outline-none"
                    value={`${filters.status}`}
                    onChange={(e) => setFilters((prevFilters: FiltersState) => ({ ...prevFilters, status: e.target.value }))}>
                    <option value="">Filter : Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select> */}

          <button
            onClick={()=>{
              setEditProductCatalogData(null);
              handleShowFormAndScrollToTop();
            }}
            className="h-11 bg-primary hover:bg-primary-hover text-white rounded-md text-md px-4 justify-center text-center outline-none flex items-center gap-1  "
          >
            <HiOutlinePlus className="text-white" />
            Add New Product
          </button>

          {/* <div className="w-32 h-11 relative rounded-md">
                        <div className="w-32 h-11 left-0 top-0 absolute bg-amber-500 rounded-md" />
                        <div className="left-[36px] top-[14.43px] absolute justify-start text-white text-sm font-medium font-['Montserrat']">CSV/PDF</div>
                    </div> */}

          {/* Upload Button */}
          {/* <div className="w-32 h-11 relative rounded-md">
                        <div className="w-32 h-11 left-0 top-0 absolute bg-amber-500 rounded-md" />
                        <div className="left-[36px] top-[14.43px] absolute justify-start text-white text-sm font-medium font-['Montserrat']">CSV/PDF</div>
                    </div> */}
        </div>
      </div>

      {/* Table */}
      <div className="w-full mb-8 ">
        <ProductCatalogTable
          filters={filters}
          paginationData={paginationData}
          setPaginationData={setPaginationData}
          onEdit={handleEditProductCatalog}
          onView={handleViewProductDetails}
        />
      </div>

      {/* add or edit product form */}

      <div className="w-full " ref={formRef}>
        {showAddEditForm && (
          <div className="w-full">
            <div className="w-full flex  items-start sm:items-center justify-between gap-6 mb-6 ">
              <h1 className=" text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-white/90">
                {editProductCatalogData ? "Edit Product" : "Add New Product"}
              </h1>
            </div>

            <AddEditProductCatalogForm
              filters={filters}
              paginationData={paginationData}
              setPaginationData={setPaginationData}
              editData={editProductCatalogData}
              onEditSuccess={() => {
                setEditProductCatalogData(null);
                handleHideFormOrScrollToHeading();
              }}
            />
          </div>
        )}
      </div>

      <ViewProductDetailsModal isOpen={showViewProductDetailsModal} closeModal={()=>handleViewProductDetails(null)} selectedProduct={selectedProduct}/>
    </div>
  );
}

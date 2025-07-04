"use client";
import React, { useState, useEffect } from "react";
import CommonHeading from "@/components/common/CommonHeading";
import { CiSearch } from "react-icons/ci";
import ProductSelectTable from "@/components/product-catalog/ProductSelectTable";
import ProductCard from "@/components/product-catalog/ProductCard";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchSelectedProducts, selectProductCatalog, unselectProductCatalog } from "@/lib/redux/slices/productCatalogSlice";
import toast, { Toaster } from "react-hot-toast";
import { BACKEND_API } from "@/api";
import ViewProductDetailsModal from "@/components/product-catalog/ViewProductDetailsModal";
import { DEFAULT_PRODUCT_IMAGE } from "@/constant/defaultImages";

interface FiltersState {
  searchQuery: string;
  status: string;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
}

export default function SelectForSelect() {
  const MAX_ALLOWED_PRODUCTS = 3;
  const dispatch = useAppDispatch();
  const { user: loggedInUser } = useAppSelector((state) => state.user);
  const { userProfile } = useAppSelector((state) => state.userProfile);
  const { selectedProducts } = useAppSelector((state) => state.productCatalog)
  const [filters, setFilters] = useState<FiltersState>({
    searchQuery: "",
    status: "",
  });
  const [paginationData, setPaginationData] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 0,
  });
  const [selectedProductId, setSelectedProductId] = useState<any>(null);
  const [showViewProductDetailsModal,setShowViewProductDetailsModal] = useState<boolean>(false);
  const[selectedProduct,setSelectedProduct] = useState<any>(null);

  const memberId =
    userProfile?.teamMember?.find((member: any) => member.isMemberOnly === true)
      ?.id || null;

  useEffect(() => {
    setPaginationData({
      currentPage: 1,
      totalPages: 0,
    });
  }, [filters]);

  useEffect(() => {
    getSelectedProducts();
  }, [memberId]);


  const getSelectedProducts = async () => {
    const userId = loggedInUser?.userId;
    try {
      await dispatch(fetchSelectedProducts(userId)).unwrap();
    } catch (error: any) {
      console.error("Error getting selected products:", error?.message || error);
    }
  };

  const handleSubmitSelectedProduct = async (productId: string) => {
    if (!memberId) {
      toast.error("You are not a member of any team.");
      return;
    }
    if (selectedProducts.length >= MAX_ALLOWED_PRODUCTS) {
      toast.error("You can select up to 3 products");
      return;
    }
    const payload = {
      teamMemberId: memberId,
      productId: productId,
    };
    setSelectedProductId(productId);
    try {

      await dispatch(selectProductCatalog(payload)).unwrap();
      toast.success("Product selected successfully");
      getSelectedProducts();
    } catch (error: any) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Failed to select product";
      toast.error(errorMessage);

    } finally {
      setSelectedProductId(null);
    }
  };

  const handleSubmitUnselectedProduct = async (productId: string) => {
    if (!memberId) {
      toast.error("You are not a member of any team.");
      return;
    }

    const payload = {
      teamMemberId: memberId,
      productId: productId,
    };
    setSelectedProductId(productId);
    try {
      await dispatch(unselectProductCatalog(payload)).unwrap();
      toast.success("Product unselected successfully");
      getSelectedProducts();
    } catch (error: any) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Failed to unselect product";
      toast.error(errorMessage);

    } finally {
      setSelectedProductId(null);
    }
  };

  const handleViewProductDetails = (product:any)=>{
    if(product){
      const images = product?.media?.length > 0 ? product?.media?.map((mediaItem: any) => `${BACKEND_API}${mediaItem?.imageName?.slice(2, mediaItem?.imageName?.length)}`) : ["/assets/images/image-not-available.png"];
      setSelectedProduct({...product,images});
      setShowViewProductDetailsModal(true);
      return ;
    }
    setShowViewProductDetailsModal(false);
    setSelectedProduct(null);
  }

  return (
    <div className="w-full">
      <Toaster />
      {/* Top Bar: Left (Heading), Right (Search + Actions) */}
      <div className="w-full flex flex-col lg:flex-row items-start justify-start lg:justify-between  gap-6  mb-6 lg:mb-8 ">
        {/* Left: Heading */}
        <div className=" w-full lg:w-1/2 ">
          <CommonHeading pageTitle="Select Product" description="" />
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

      {selectedProducts && selectedProducts.length > 0 && (
        <div className="w-full overflow-x-auto  no-scrollbar mb-6 lg:mb-8  ">
          <div className="w-full max-w-[900px] flex space-x-5 ">
            {selectedProducts?.map((product: any) => {

              const images = product?.media?.length > 0 ? product?.media?.map((mediaItem: any) => `${BACKEND_API}${mediaItem?.imageName?.slice(2)}`) : [DEFAULT_PRODUCT_IMAGE];

              return (
                <ProductCard
                  key={product?.id}
                  title={product?.name}
                  points={product?.bulletPoints?.split(",")}
                  images={images}
                  onClickViewMore={()=>handleViewProductDetails(product)}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="w-full ">
        <div className="w-full mb-5">
          <h2 className="text-lg lg:text-xl font-semibold">Products</h2>
        </div>
        <ProductSelectTable
          filters={filters}
          paginationData={paginationData}
          setPaginationData={setPaginationData}
          selectedProductId={selectedProductId}
          selectedProducts={selectedProducts}
          onProductSelect={handleSubmitSelectedProduct}
          onProductUnselect={handleSubmitUnselectedProduct}
          onView={handleViewProductDetails}
        />
      </div>
      <ViewProductDetailsModal isOpen={showViewProductDetailsModal} closeModal={()=>handleViewProductDetails(null)} selectedProduct={selectedProduct} />
    </div>
  );
}

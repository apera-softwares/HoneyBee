"use client";
import React, { useEffect,useState } from "react";
import CommonHeading from "@/components/common/CommonHeading";
import ReferralForm from "@/components/referral/ReferralForm";
import ProductCard from "@/components/product-catalog/ProductCard";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchSelectedProducts } from "@/lib/redux/slices/productCatalogSlice";
import { UserRole } from "@/constant/userRoles";
import { BACKEND_API } from "@/api";
import toast from "react-hot-toast";
import ViewProductDetailsModal from "@/components/product-catalog/ViewProductDetailsModal";

export default function ReferralFormPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showViewProductDetailsModal,setShowViewProductDetailsModal] = useState<boolean>(false);
  const[selectedProduct,setSelectedProduct] = useState<any>(null);
  const { selectedProducts } = useAppSelector((state) => state.productCatalog);
  const { user: loggedInUser } = useAppSelector((state) => state.user)
  const { userProfile } = useAppSelector((state) => state.userProfile);
  const memberId =
    userProfile?.teamMember?.find((member: any) => member.isMemberOnly === true)
      ?.id || null;

  useEffect(() => {
    if (loggedInUser?.role !== UserRole.B_TEAM) return;
    getSelectedProducts();
  }, [memberId]);


  const getSelectedProducts = async () => {

    try {
      const response = await dispatch(fetchSelectedProducts(loggedInUser?.userId)).unwrap();
      console.log("response of selected products", response);
    } catch (error: any) {
      console.error(
        "Error getting selected products:",
        error?.message || error
      );
    }
  };

  const handleRedirectToLandingPage = () => {
    router.push(`http://209.182.232.11:3033/landing/${loggedInUser.userId}`);
  }
  const handleCopyLink = async () => {
    const url = `http://209.182.232.11:3033/landing/${loggedInUser.userId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleViewProductDetails = (product:any)=>{

    if(product){

      setSelectedProduct(product);
      setShowViewProductDetailsModal(true);
      return ;
    }
    setShowViewProductDetailsModal(false);
    setSelectedProduct(null);
  }


  return (
    <div>
      <div className="w-full flex flex-col lg:flex-row items-start lg:justify-between  gap-4 mb-8 ">
        {/* Left: Heading */}
        <div className=" w-auto">
          <CommonHeading
            pageTitle="Landing page and submit referral"
            description=""
          />
        </div>
        <div className="flex items-center gap-2">
          <button className=" px-6 py-3.5 rounded-md text-sm text-white bg-primary hover:bg-primary-hover transition-all duration-500"
            onClick={handleRedirectToLandingPage}
          >Landing Page</button>
          <button className=" px-6 py-3.5 rounded-md text-sm  border border-black transition-all duration-500"
            onClick={handleCopyLink}
          >Copy Link</button>
        </div>
      </div>
      {loggedInUser?.role === UserRole.B_TEAM && selectedProducts && selectedProducts.length > 0 && (
        <div className="w-full overflow-x-auto  no-scrollbar mb-6 lg:mb-8 ">
          <div className="w-full max-w-[900px] flex space-x-5 ">
            {selectedProducts?.map((product: any) => {

              const images = product?.media?.length > 0 ? product?.media?.map((mediaItem: any) => `${BACKEND_API}${mediaItem?.imageName?.slice(2, mediaItem?.imageName?.length)}`) : ["/assets/images/image-not-available.png"];
              return (
                <ProductCard
                  key={product?.id}
                  title={product?.name}
                  points={product?.bulletPoints?.split(",")}
                  images={images}
                  onClickViewMore={()=>handleViewProductDetails({...product,images})}
                />
              )
            })}
          </div>
        </div>
      )}

      <div className="w-full mt-10">
        <div className="w-full mb-5">
          <h1
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-white/90"
            x-text="pageName"
          >
            Referral Submission Form
          </h1>
        </div>
        <ReferralForm />
      </div>
      <ViewProductDetailsModal isOpen={showViewProductDetailsModal} closeModal={()=>handleViewProductDetails(null)} selectedProduct={selectedProduct} />
    </div>
  );
}

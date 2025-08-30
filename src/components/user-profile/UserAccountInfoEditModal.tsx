"use client";
import React, { useState,useEffect } from "react";
import { Modal } from "../ui/modal";
import { GridIcon } from "../../icons/index";
import toast, { Toaster } from "react-hot-toast";
import { useAppDispatch,useAppSelector } from "@/lib/redux/hooks";
import { fetchUserProfile, updateAccountDetails } from "@/lib/redux/slices/loginPersonProfile";

interface FormData {
  accountNumber: string;
  routingNumber: string;
}
interface UserAccountInfoModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const UserAccountInfoEditModal: React.FC<UserAccountInfoModalProps> = ({
  isOpen,
  closeModal,
}) => {

  const dispatch = useAppDispatch();
  const { userProfile,loading } = useAppSelector((state) => state.userProfile);
  const [formData, setFormData] = useState<FormData>({
    accountNumber: userProfile?.accountNumber||"",
    routingNumber: userProfile?.routingNumber||"",
  });

  const [errors, setErrors] = useState({
    accountNumber: "",
    routingNumber: "",
  });

  useEffect(()=>{

    setFormData({
    accountNumber: userProfile?.accountNumber||"",
    routingNumber: userProfile?.routingNumber||"",
  })

  },[isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
        // Allow only digits, remove any non-numeric characters
    if (/^\d*$/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
  };

  const validateFormData = () => {
    let isValidData = true;
    const tempErrors = { ...errors };

    //validate account number
    if (formData.accountNumber.trim() === "") {
      tempErrors.accountNumber = "Account number is required";
      isValidData = false;
    } else if (
      formData.accountNumber.length < 8 ||
      formData.accountNumber.length > 12
    ) {
      tempErrors.accountNumber = "Account number must be between 8 and 12 digits.";
      isValidData = false;
    } else {
      tempErrors.accountNumber = "";
    }

    //validate routing number
    if (formData.routingNumber.trim() === "") {
      tempErrors.routingNumber = "Routing number is required";
      isValidData = false;
    } else if (
      formData.routingNumber.length !== 9
    ) {
      tempErrors.routingNumber = "Routing number must be exactly 9 digits.";
      isValidData = false;
    } else {
      tempErrors.routingNumber = "";
    }
    setErrors(tempErrors);
    return isValidData;
  };

  const clearFormData = () => {
    setFormData({
      accountNumber:userProfile?.accountNumber||"",
      routingNumber:userProfile?.routingNumber||""
    });
    setErrors({
      accountNumber:"",
      routingNumber:""
    });
  };

  const handleCloseModal = () => {
    clearFormData();
    closeModal();
  };

  const handleSubmit = async (e:React.FocusEvent<HTMLFormElement>) => {
    e.preventDefault();
    
       if (!validateFormData()) return;
      const payload = {
        accountNumber: formData.accountNumber || "",
        routingNumber: formData?.routingNumber || "",
      };
    try {
   

      await dispatch(updateAccountDetails(payload)).unwrap();
      toast.success("Account Details updated successfully");
      handleCloseModal();
      getUserProfile();
    } catch (error: any) {
      console.error("Error while update account details:", error);
      const message = "Failed to update account details";
      const errorMessage =
        typeof error === "string" ? error : error?.message || message;
      toast.error(errorMessage);
    } finally {
    }
  };

  const getUserProfile = async () => {
  try {
    await dispatch(fetchUserProfile()).unwrap();
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
  }
};

  return (
    <Modal
      isOpen={isOpen}
      onClose={()=>{
        if(!loading)
        {
          handleCloseModal();
        }
      }}
      className="max-w-2xl px-6 lg:px-8 py-8"
    >
      <Toaster/>
      <div className="w-full  ">
        <div className="w-full flex items-center gap-4 mb-6 sm:mb-8 ">
          <span className="bg-primary text-white p-2  flex justify-center items-center rounded-full">
            <GridIcon />
          </span>
          <div className="">
            <h5 className="font-semibold text-gray-800 text-xl sm:text-2xl  dark:text-white/90">
              Edit Account Details
            </h5>
          </div>
        </div>

        <div className="w-full px-2">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 mb-6">
              <div className="w-full">
                <label className=" block text-sm font-medium text-gray-700 mb-1.5">
                  Account Number
                </label>
                <input
                  type="text"
                  placeholder="Enter Account Number"
                  name="accountNumber"
                  className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-primary bg-transparent text-gray-800 border-gray-300 focus:border-primary  focus:ring-primary/10`}
                  value={formData?.accountNumber}
                  onChange={handleInputChange}
                />
                <span className={`text-sm text-red-500`}>
                  {errors?.accountNumber || ""}
                </span>
              </div>
              <div className="w-full">
                <label className=" block text-sm font-medium text-gray-700 mb-1.5">
                  Routing Number
                </label>
                <input
                  type="text"
                  placeholder="Enter Routing Number"
                  name="routingNumber"
                  className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-primary bg-transparent text-gray-800 border-gray-300 focus:border-primary  focus:ring-primary/10`}
                  value={formData?.routingNumber}
                  onChange={handleInputChange}
                />
                <span className={`text-sm text-red-500`}>
                  {errors?.routingNumber || ""}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 ">

              <button
                type="submit"
                disabled={loading}
                className=" bg-primary hover:bg-primary-hover text-white px-8 py-3 text-sm inline-flex items-center justify-center font-medium gap-2 rounded-lg  transition-all duration-300 shadow-theme-xs border border-primary disabled:bg-primary/70 disabled:cursor-not-allowed "
              >
                {
                  loading ? ("Saving Changes..."):("Save Changes")
                }
              </button>
              <button
                type="reset"
                disabled={loading}
                onClick={handleCloseModal}
                className=" bg-white border border-gray-600 disabled:border-gray-400 hover:bg-gray-50  px-8 py-3 text-sm  inline-flex items-center justify-center font-medium gap-2 rounded-lg  transition-all duration-300 shadow-theme-xs disabled:border disabled:cursor-not-allowed"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default UserAccountInfoEditModal;

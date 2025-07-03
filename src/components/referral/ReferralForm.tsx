"use client";
import React, { useState, useEffect, useRef } from "react";
import Button from "../ui/button/Button";
// import Checkbox from "./form/input/Checkbox";
import { FORM_INPUT_CLASS, REQUIRED_ERROR } from "@/constant/constantClassName";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { createReferral } from "@/lib/redux/slices/referralSlice";
import { fetchStatisticsNumbers } from "@/lib/redux/slices/statisticsSlice";
import { fetchStateAndCity } from "@/lib/redux/slices/appSlice";
import toast, { Toaster } from "react-hot-toast";
import ProductDropdown from "../product-catalog/ProductDropdown";

interface FormDataState {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: string;
  postalCode: string;
  notes: string;
  productId: string;
  teamMemberId: string;
  cityId?: string;
  stateId?: string;
}

type ParsedLocation = | {
  type: "city";
  cityId: number;
  cityName: string;
  stateName: string;
  stateId: number;
}
  | {
    type: "state";
    stateId: number;
    stateName: string;
  };

type LocationData = {
  [key: string]: [number, "city", string, number] | [number, "state"];
};


const ReferralForm = () => {


  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<FormDataState>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    address: "",
    postalCode: "",
    notes: "",
    productId: "",
    teamMemberId: "",
    cityId: "",
    stateId: "",
  })
  const [errors, setErrors] = useState<FormDataState>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    address: "",
    postalCode: "",
    notes: "",
    productId: "",
    teamMemberId: "",
    cityId: "",
    stateId: "",
  })
  const [loading, setLoading] = useState<boolean>(false);
  const [stateCityList, setStateCityList] = useState<any[]>([])
  const [isStateCityDropdownOpen, setIsStateCityDropdownOpen] = useState(false);
  const [stateCityName, setStateCityName] = useState('');
  const [selectedStateCity, setSelectedStateCity] = useState<ParsedLocation | null>(null);
  const stateCityDropdownRef = useRef<HTMLDivElement | null>(null);
   const { selectedProducts } = useAppSelector((state) => state.productCatalog);
  const {user:loggedInUser} = useAppSelector((state)=>state.user);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  useEffect(() => {

    const timeoutId = setTimeout(() => {
      getStateAndCity();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [stateCityName]);



  const getStateAndCity = async () => {
    const query = stateCityName.trim();

    if (!query) {
      setStateCityList([]);
      return;
    }
    try {
      const response = await dispatch(fetchStateAndCity(query)).unwrap();
      const locationData = response?.data as LocationData;
      const parsedLocations: ParsedLocation[] = Object.entries(locationData)?.map(([key, value]) => {
        if (value[1] === "city") {
          const [cityId, , stateName, stateId] = value;
          return {
            type: "city",
            cityId,
            cityName: key,
            stateName,
            stateId,
          };
        } else {
          const [stateId] = value;
          return {
            type: "state",
            stateId,
            stateName: key,
          };
        }
      });
      setStateCityList(parsedLocations || []);
    } catch (error: any) {
      setStateCityList([]);
      console.log("error while fetching state and city", error);
    } 
  };

   const getStatNumbers = async () => {
    try {
      await dispatch(fetchStatisticsNumbers()).unwrap();
    } catch (error: any) {
      console.log("error while getting statistics number", error);
    }
  };


  const handleSubmitReferrals = async () => {
    
    if (!validateFormData()) return;
    setLoading(true);
    
    try {

      const payload = {...formData,teamMemberId:loggedInUser?.userId}; 
      await dispatch(createReferral(payload)).unwrap();
      toast.success("Referral created successfully");
      handleClearFormData();
      getStatNumbers();

    } catch (error: any) {
      console.error("Error while creating referral:", error);
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Failed to create referral.";

      toast.error(errorMessage);
    }
    finally {
      setLoading(false);
    }
  };


  const validateFormData = () => {
    let isValidData = true;
    const tempErrors = { ...errors };

    const nameRegex = /^[A-Za-z]+(-[A-Za-z]+)*$/;;
    // Validate firstName
    if (formData.firstName.trim() === "") {
      tempErrors.firstName = "First name is required";
      isValidData = false;
    } else if (!nameRegex?.test(formData.firstName)) {
      tempErrors.firstName = "Please enter valid first name";
      isValidData = false;
    } else {
      tempErrors.firstName = "";
    }

    // Validate lastName
    if (formData?.lastName.trim() === "") {
      tempErrors.lastName = "Last name is required";
      isValidData = false;
    } else if (!nameRegex?.test(formData.lastName)) {
      tempErrors.lastName = "Please enter valid last name";
      isValidData = false;
    } else {
      tempErrors.lastName = "";
    }


    // Validate phone number
    //const phoneRegex = /^\d{10}$/;
    if (formData.phoneNumber.trim() === "") {
      tempErrors.phoneNumber = "phone number is required";
      isValidData = false;
    } else if (formData.phoneNumber.length < 10) {
      tempErrors.phoneNumber = "Please enter a valid phone number";
      isValidData = false;
    } else {
      tempErrors.phoneNumber = "";
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (formData.email.trim() === "") {
      tempErrors.email = "Email is required";
      isValidData = false;
    } else if (!emailRegex?.test(formData.email)) {
      tempErrors.email = "Please enter a valid email";
      isValidData = false;
    } else {
      tempErrors.email = "";
    }



    // Validate address
    if (formData?.address.trim() === "") {
      tempErrors.address = "Address is required";
      isValidData = false;
    } else {
      tempErrors.address = "";
    }





    // Validate postal code
    if (formData.postalCode.trim() === "") {
      tempErrors.postalCode = "Postal code  is required";
      isValidData = false;
    } else if (formData.postalCode.length < 6) {
      tempErrors.postalCode = "Please enter valid postal code";
      isValidData = false;

    }
    else {
      tempErrors.postalCode = "";
    }


    if (formData.productId.trim()==="") {
      tempErrors.productId = "Product is required";
      isValidData = false;
    } else {

      tempErrors.productId = "";

    }

    // Validate notes
    if (formData.notes.trim() === "") {
      tempErrors.notes = "Notes is required";
      isValidData = false;
    } else {
      tempErrors.notes = "";
    }

    setErrors(tempErrors);
    return isValidData;

  };

  const handleClickOutside = (e: MouseEvent) => {
    if (stateCityDropdownRef.current && !stateCityDropdownRef.current.contains(e.target as Node)) {
      setIsStateCityDropdownOpen(false);
      setStateCityName("");
      setStateCityList([]);
    }
  };



  const handleOpenStateCityDropdown = () => {
    setIsStateCityDropdownOpen(true);
  };

  const handleSelectStateCity = (value: any) => {

    if (value) {
      setSelectedStateCity(value);
      setIsStateCityDropdownOpen(false);
      setFormData((prev: FormDataState) => ({
        ...prev,
        stateId: `${value?.stateId}`,
        cityId: value?.type === "city" ? `${value?.cityId}` : "",
      }));
      setStateCityList([]);
      setStateCityName("");
      return;
    }

    setSelectedStateCity(null);
    setFormData((prev: FormDataState) => ({
      ...prev,
      stateId: "",
      cityId: "",
    }));

  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormDataState) => ({ ...prev, [name]: value }));

  }

  const handleClearFormData = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      address: "",
      postalCode: "",
      notes: "",
      productId: "",
      teamMemberId: "",
      cityId: "",
      stateId: "",
    });
    setErrors({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      address: "",
      postalCode: "",
      notes: "",
      productId: "",
      teamMemberId: "",
      cityId: "",
      stateId: "",
    });
    setSelectedStateCity(null);
    setStateCityList([]);
    setStateCityName("");
  }
  
  return (
    <div className="w-full max-w-[1500px] bg-white p-6 lg:p-8 rounded-xl">
      <Toaster />
      <div className="w-full ">
        <div className="w-full space-y-8 lg:space-y-14 mb-8">
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-14 ">
            <div className="w-full">
              <input
                type="text"
                placeholder="First name"
                name="firstName"
                className={`${FORM_INPUT_CLASS}`}
                value={formData.firstName}
                onChange={handleChange}
              />
              <span className={`${REQUIRED_ERROR}`}>{errors.firstName || ""}</span>
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Last name"
                name="lastName"
                className={`${FORM_INPUT_CLASS}`}
                value={formData.lastName}
                onChange={handleChange}
              />
              <span className={`${REQUIRED_ERROR}`}>{errors.lastName || ""}</span>
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Phone number"
                name="phoneNumber"
                className={`${FORM_INPUT_CLASS}`}
                value={formData.phoneNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers and max 10 digits
                  if (/^\d{0,10}$/.test(value)) {

                    setFormData((prev: FormDataState) => ({ ...prev, phoneNumber: value }))
                  }
                }}
              />
              <span className={`${REQUIRED_ERROR}`}>{errors.phoneNumber || ""}</span>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-14 ">
            <div className="w-full">
              <input
                type="text"
                placeholder="Email"
                name="email"
                className={`${FORM_INPUT_CLASS}`}
                value={formData.email}
                onChange={handleChange}
              />
              <span className={`${REQUIRED_ERROR}`}>{errors.email || ""}</span>
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Address"
                name="address"
                className={`${FORM_INPUT_CLASS}`}
                value={formData.address}
                onChange={handleChange}
              />
              <span className={`${REQUIRED_ERROR}`}>{errors.address || ""}</span>
            </div>
            <div className="relative w-full" ref={stateCityDropdownRef}>
              <input
                type="text"
                readOnly
                value={
                  selectedStateCity
                    ? selectedStateCity?.type === "city"
                      ? `${selectedStateCity?.cityName}, ${selectedStateCity?.stateName}`
                      : selectedStateCity.stateName
                    : ""
                }
                onClick={handleOpenStateCityDropdown}
                placeholder="City or state"
                className={`${FORM_INPUT_CLASS} cursor-pointer`}
              />
              <span className={`${REQUIRED_ERROR}`}></span>

              {isStateCityDropdownOpen && (
                <div className="absolute z-50 top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 px-2 py-2">
                  {selectedStateCity && (
                    <div className="mb-2 flex items-center justify-between gap-2 px-3 py-1 bg-gray-100 rounded">
                      <span className="text-sm text-gray-800">
                        {selectedStateCity.type === "city"
                          ? `${selectedStateCity.cityName}, ${selectedStateCity.stateName}`
                          : selectedStateCity.stateName}
                      </span>
                      <button
                        onClick={() => handleSelectStateCity(null)}
                        className="ml-2 text-gray-500 hover:text-red-500 transition-all duration-300 "
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Search state or city"
                    value={stateCityName}
                    onChange={(e) => setStateCityName(e.target.value)}
                    className="w-full px-3 py-2 rounded-md outline-none border border-gray-200 mb-1 "
                    autoFocus
                  />
                  <ul className="max-h-48 overflow-y-auto">
                    {stateCityList.length > 0 ? (
                      stateCityList.map((item, index) => (
                        <li
                          key={index}
                          onClick={() => handleSelectStateCity(item)}
                          className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
                        >
                          {item?.type === "city" ? (`${item?.cityName} (city)`) : (`${item?.stateName} (state)`)}
                        </li>
                      ))
                    ) : (
                      <li className=" px-3 py-1 text-gray-400">{stateCityName.trim().length > 0 && stateCityList.length === 0 ? "No result found" : ""}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-14 ">

            <div className="w-full">
              <input
                type="text"
                placeholder="Postal code"
                name="postalCode"
                className={`${FORM_INPUT_CLASS}`}
                value={formData.postalCode}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,6}$/.test(value)) { // Only allow up to 6 digits
                    setFormData((prev: FormDataState) => ({ ...prev, postalCode: value }));
                  }
                }}
              />
              <span className={`${REQUIRED_ERROR}`}>{errors.postalCode || ""}</span>
            </div>
            {/* <div className="w-full">
              <select
                name="productId"
                className={`${FORM_INPUT_CLASS}`}
                value={`${formData.productId}`}
                onChange={handleChange}
              >
                <option className="" value="">Select Product</option>
                {
                  selectedProducts && selectedProducts?.length > 0 ? (selectedProducts.map((prod:any)=>(<option key={prod?.id} value={prod?.id}>{prod?.name}</option>))):(<option value="">No product found</option>) 
                
                }
              </select>
              <span className={`${REQUIRED_ERROR}`}>{errors.productId || ""}</span>
            </div> */}
            <div className="w-full">
              <ProductDropdown products={selectedProducts||[]} selectedProductId={formData.productId} onChange={(value)=>setFormData((prev:FormDataState)=>({...prev,productId:value}))}  />
              <span className={`${REQUIRED_ERROR}`}>{errors.productId || ""}</span>
            </div>
          </div>
          <div className="w-full grid grid-cols-1 ">
            <div className="w-full">
              <textarea
                name="notes"
                placeholder="Additional Info and Notes"
                className={`h-24 md:h-32 ${FORM_INPUT_CLASS}`}
                value={formData.notes}
                onChange={handleChange}
              />
              <span className="text-sm text-red-500">{errors.notes || ""}</span>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-center sm:justify-end gap-6 flex-wrap mb-8 md:mb-12 ">
          {/* <div className=" w-full  md:w-3/5 flex items-start gap-3 text-sm font-medium  ">
             <Checkbox checked={true} onChange={()=>{}} />
            Customer Consents to receive SMS Notifications, Alerts & Occasional
            Marketing Communication from the company. Message frequency varies.
            Message & data rates may apply. You can reply STOP to unsubscribe at
            any time.
          </div> */}
          <Button size="md" variant="primary" disabled={loading} onClick={handleSubmitReferrals} >
            Send Referral
          </Button>
          <Button size="md" variant="outline" disabled={loading} onClick={handleClearFormData}>
            Clear
          </Button>

        </div>

      </div>


    </div>
  );
};

export default ReferralForm;

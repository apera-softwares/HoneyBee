"use client";
import React, { useState, useEffect, useRef } from "react";
import Button from "./ui/button/Button";
// import Checkbox from "./form/input/Checkbox";
import { FORM_INPUT_CLASS, REQUIRED_ERROR } from "@/constant/constantClassName";
import axios from "axios";
import { BACKEND_API } from "@/api";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { createReferral } from "@/lib/redux/slices/referralSlice";
import SearchAndSelectMemberModal from "./referral/SearchAndSelectMemberModal";
// import SearchAndSelectMemberProductModal from "./referral/SearchAndSelectMemberProductModal";
//import SearchAndSelectPreferredSalesModal from "./referral/SearchAndSelectPreferredSalesPersonModal";
import toast, { Toaster } from "react-hot-toast";

interface FormDataState {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: string;
  postalCode: string;
  MemberFirstName: string;
  MemberLastName: string;
  notes: string;
  status: string;
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

const statusList = [{ label: "Pitched", value: "Pitched" }, { label: "Pending", value: "Pending" }, { label: "Payout", value: "Payout" }, { label: "Sold", value: "Sold" }];
const ReferralFromSection = () => {


  const dispatch = useAppDispatch();
  const loggedInUser = useAppSelector((state) => state.user.user);
  const [formData, setFormData] = useState<FormDataState>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    address: "",
    postalCode: "",
    MemberFirstName: "",
    MemberLastName: "",
    notes: "",
    status: "",
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
    MemberFirstName: "",
    MemberLastName: "",
    notes: "",
    status: "",
    productId: "",
    teamMemberId: "",
    cityId: "",
    stateId: "",
  })
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [selectedMemberProduct, setSelectedMemberProduct] = useState<any | null>(null);
  // const [selectedPreferredSalesPerson, setSelectedPreferredSalesPerson] = useState<any | null>(null);
  const [isMemberSelectModalOpen, setIsMemberSelectedModalOpen] = useState<boolean>(false);
  // const [isMemberProductSelectModalOpen,setIsMemberProductSelectModalOpen]= useState<boolean>(false);
  //const [isPreferredSalesPersonSelectModalOpen, setIsPreferredSalesPersonSelectModalOpen] = useState<boolean>(false);
  const [stateCityList, setStateCityList] = useState<any[]>([])
  const [isStateCityDropdownOpen, setIsStateCityDropdownOpen] = useState(false);
  const [stateCityName, setStateCityName] = useState('');
  const [selectedStateCity, setSelectedStateCity] = useState<ParsedLocation | null>(null);
  const stateCityDropdownRef = useRef<HTMLDivElement | null>(null);
  const memberProductDropdownRef = useRef<HTMLDivElement | null>(null);
  const [isMemberProductDropdownOpen, setIsMemberProductDropdownOpen] = useState(false);
  const [memberProductName, setMemberProductName] = useState<string>("");
  const [memberProductsList, setMemberProductsList] = useState<any[]>([]);



  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  useEffect(() => {

    const timeoutId = setTimeout(() => {
      fetchStateCity();
    }, 300); // debounce

    return () => clearTimeout(timeoutId);
  }, [stateCityName]);

  useEffect(() => {

    const timeoutId = setTimeout(() => {
      fetchMemberProducts();
    }, 300); // debounce

    return () => clearTimeout(timeoutId);
  }, [memberProductName]);


  const fetchStateCity = async () => {
    if (!stateCityName.trim()) {
      setStateCityList([]);
      return;
    }


    try {
      const token = loggedInUser?.token;
      const response = await axios.get(`${BACKEND_API}user/getStateCity?name=${stateCityName.trim()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
      const locationData = response?.data?.data as LocationData;

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
      console.log("error while fetching state and city", error);
    } finally {

    }
  };


  const fetchMemberProducts = async () => {
    if (!memberProductName.trim()) {
      setMemberProductsList([]);
      return;
    }

    const token = loggedInUser?.token;



    try {
      const response = await axios.get(`${BACKEND_API}product/${selectedMember?.id}?name=${memberProductName.trim()}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
      setMemberProductsList(response?.data?.data || []);

    } catch (error: any) {
      console.log("error while fetching member products", error)

    } finally {

    }
  };




  const handleSubmitReferrals = async () => {

    try {

      if (!validateFormData()) return;

      setLoading(true);
      await dispatch(createReferral(formData)).unwrap();
      toast.success("Created referral successfully");
      handleClearFormData();

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
  console.log("loading", loading);


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


    // Validate members firstName
    if (!selectedMember) {
      tempErrors.MemberFirstName = "Member is required";
      isValidData = false;
    } else {
      tempErrors.MemberFirstName = "";
    }



    if (!selectedMemberProduct) {
      tempErrors.productId = "Product is required";
      isValidData = false;
    } else {

      tempErrors.productId = "";

    }

    //validate preferred sales person
    // if (!selectedPreferredSalesPerson) {
    //   tempErrors.preferredSalesPersonId = "Preferred salesperson is required";
    //   isValidData = false;
    // } else {

    //   tempErrors.preferredSalesPersonId = "";

    // }


    // Validate status
    if (formData.status.trim() === "") {
      tempErrors.status = "Status is required";
      isValidData = false;
    } else {
      tempErrors.status = "";
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
    if (memberProductDropdownRef.current && !memberProductDropdownRef.current.contains(e.target as Node)) {
      setIsMemberProductDropdownOpen(false);
      setMemberProductName("");
      setMemberProductsList([]);
    }
  };



  const handleOpenStateCityDropdown = () => {
    setIsStateCityDropdownOpen(true);
  };

  const handleOpenMemberProductDropdown = () => {
    if (!selectedMember) return;
    setIsMemberProductDropdownOpen(true);
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
  const handleSelectMember = (member: any) => {


    if (member) {

      setSelectedMember(member);
      setFormData((prev: FormDataState) => ({ ...prev, MemberFirstName: member?.user?.firstName, MemberLastName: member?.user?.lastName, teamMemberId: member?.id }));
      return;

    }
    setSelectedMember(null);
    setFormData((prev: FormDataState) => ({ ...prev, MemberFirstName: "", MemberLastName: "", teamMemberId: "" }));

  }

  const handleMemberProductSelect = (product: any) => {

    if (product) {

      setSelectedMemberProduct(product);
      setFormData((prev: FormDataState) => ({ ...prev, productId: product?.id }));
      setIsMemberProductDropdownOpen(false);
      setMemberProductName("");
      setMemberProductsList([]);
      return;
    }
    setSelectedMemberProduct(null);
    setFormData((prev: FormDataState) => ({ ...prev, productId: "" }));
  }

  // const handlePreferredSalesPersonSelect = (person: any) => {

  //   if (person) {
  //     setSelectedPreferredSalesPerson(person);
  //     setFormData((prev: FormDataState) => ({ ...prev, preferredSalesPersonId: person?.id }))
  //     return;
  //   }
  //   setSelectedPreferredSalesPerson(null);
  //   setFormData((prev: FormDataState) => ({ ...prev, preferredSalesPersonId: "" }))
  //   return;


  // }

  const handleOpenSelectMemberModal = () => {
    setIsMemberSelectedModalOpen(true);
  }
  const handlecloseSelectMemberModal = () => {
    setIsMemberSelectedModalOpen(false);
  }
  // const handleOpenSelectMemberProductModal=()=>{
  //   if(!selectedMember) return ;
  //    setIsMemberProductSelectModalOpen(true);
  // }
  // const handlecloseSelectMemberProductModal = ()=>{
  //   setIsMemberProductSelectModalOpen(false);
  // }

  // const handleOpenSelectPreferredSalesPersonModal = () => {
  //   setIsPreferredSalesPersonSelectModalOpen(true);
  // }
  // const handlecloseSelectPreferredSalesPersonModal = () => {
  //   setIsPreferredSalesPersonSelectModalOpen(false);
  // }


  const handleClearFormData = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      address: "",
      postalCode: "",
      MemberFirstName: "",
      MemberLastName: "",
      notes: "",
      status: "",
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
      MemberFirstName: "",
      MemberLastName: "",
      notes: "",
      status: "",
      productId: "",
      teamMemberId: "",
      cityId: "",
      stateId: "",
    });
    setSelectedMember(null);
    setSelectedMemberProduct(null);
    //setSelectedPreferredSalesPerson(null);
    setSelectedStateCity(null);
  }

  return (
    <div className="w-full max-w-[1500px] bg-white p-8 rounded-xl mb-14 md:mb-20">
      <Toaster />
      <div className="w-full ">
        <div className="w-full space-y-10 lg:space-y-14 mb-8">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 ">
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

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 ">
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

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 ">

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
            <div className="w-full">
              <input
                type="text"
                placeholder={`Member's first and last name`}
                className={`${FORM_INPUT_CLASS}`}
                readOnly
                value={selectedMember ? `${selectedMember?.user?.firstName || ""} ${selectedMember?.user?.lastName || ""} ${selectedMember?.user?.role || ""} ` : ""}
                onClick={handleOpenSelectMemberModal}

              />
              <span className={`${REQUIRED_ERROR}`}>{errors.MemberFirstName || ""}</span>
            </div>
            <div className="w-full relative " ref={memberProductDropdownRef}>
              <input
                type="text"
                placeholder="Product Referring"
                className={`${FORM_INPUT_CLASS}`}
                readOnly
                value={selectedMemberProduct ? `${selectedMemberProduct?.name || ""}` : ""}
                onClick={handleOpenMemberProductDropdown}
              />
              <span className={`${REQUIRED_ERROR}`}>{errors.productId || ""}</span>

              {isMemberProductDropdownOpen && (
                <div className="absolute z-50 top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 px-2 py-2">
                  {selectedMemberProduct && (
                    <div className="mb-2 flex items-center justify-between gap-2 px-3 py-1 bg-gray-100 rounded">
                      <span className="text-sm text-gray-800 text-wrap ">
                        {`${selectedMemberProduct?.name}`}
                      </span>
                      <button
                        onClick={() => handleMemberProductSelect(null)}
                        className="ml-2 text-gray-500 hover:text-red-500 transition-all duration-300 "
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Search member product"
                    value={memberProductName}
                    onChange={(e) => setMemberProductName(e.target.value)}
                    className="w-full px-3 py-2 rounded-md outline-none border border-gray-200 mb-1  "
                    autoFocus
                  />
                  <ul className="max-h-48 overflow-y-auto ">
                    {memberProductsList.length > 0 ? (
                      memberProductsList.map((member, index) => (
                        <li
                          key={index}
                          onClick={() => {
                            handleMemberProductSelect(member);
                          }}
                          className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
                        >
                          {`${member?.name || ""}`}
                        </li>
                      ))
                    ) : (
                      <li className=" px-3 py-1 text-gray-400">{memberProductName.trim().length > 0 && memberProductsList.length === 0 ? "No result found" : ""}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 ">

            {/* <div className="w-full">
              <input
                type="text"
                placeholder="Preferred salesperson"
                className={`${FORM_INPUT_CLASS}`}
                readOnly
                value={selectedPreferredSalesPerson ? `${selectedPreferredSalesPerson?.firstName || ""} ${selectedPreferredSalesPerson?.lastName || ""}` : ""}
                onClick={handleOpenSelectPreferredSalesPersonModal}
              />
              <span className={`${REQUIRED_ERROR}`}>{errors.preferredSalesPersonId || ""}</span>
            </div> */}
            <div className="w-full">
              <select
                name="status"
                className={`${FORM_INPUT_CLASS}`}
                value={`${formData.status}`}
                onChange={handleChange}
              >
                <option className="" value="">Select Status</option>
                {
                  statusList.map((item: { label: string, value: string }) => (<option key={item.value} value={item.value}>{item.label}</option>))
                }


              </select>
              <span className={`${REQUIRED_ERROR}`}>{errors.status || ""}</span>
            </div>

          </div>


          <div className="w-full grid grid-cols-1 ">
            <div className="w-full">
              <textarea
                name="notes"
                placeholder="Additional pb-4 border-b  Info and Notes (LEAD GEN GUIDELINE ANSWERS, ETC)"
                className={`h-24 md:h-32 ${FORM_INPUT_CLASS}`}
                value={formData.notes}
                onChange={handleChange}
              />
              <span className="text-sm text-red-500">{errors.notes || ""}</span>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-center sm:justify-end gap-6 flex-wrapj mb-8 md:mb-12 ">
          {/* <div className=" w-full  md:w-3/5 flex items-start gap-3 text-sm font-medium  ">
      
             <Checkbox checked={true} onChange={()=>{}} />
            Customer Consents to receive SMS Notifications, Alerts & Occasional
            Marketing Communication from the company. Message frequency varies.
            Message & data rates may apply. You can reply STOP to unsubscribe at
            any time.
          </div> */}

          <Button size="md" variant="primary" onClick={handleSubmitReferrals} >
            Send Referral
          </Button>
          <Button size="md" variant="outline" onClick={handleClearFormData}>
            Clear
          </Button>

        </div>

      </div>

      <SearchAndSelectMemberModal isOpen={isMemberSelectModalOpen} closeModal={handlecloseSelectMemberModal} selectedMember={selectedMember} onMemberSelect={handleSelectMember} />
      {/* <SearchAndSelectMemberProductModal isOpen={isMemberProductSelectModalOpen} closeModal={handlecloseSelectMemberProductModal} memberId={selectedMember?.id} selectedProduct={selectedMemberProduct} onProductSelect={handleMemberProductSelect} /> */}
      {/* <SearchAndSelectPreferredSalesModal isOpen={isPreferredSalesPersonSelectModalOpen} closeModal={handlecloseSelectPreferredSalesPersonModal} selectedPreferredSalesPerson={selectedPreferredSalesPerson} onPreferredSalesPersonSelect={handlePreferredSalesPersonSelect} /> */}

    </div>
  );
};

export default ReferralFromSection;

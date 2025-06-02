"use client";
import { FORM_INPUT_CLASS, REQUIRED_ERROR } from "@/constant/constantClassName";
import React, { useState, useEffect,useRef } from "react";
import { useAppDispatch,useAppSelector } from "@/lib/redux/hooks";
import { createProductCatalog, fetchProductCatalogs, updateProductCatalog } from "@/lib/redux/slices/productCatalogSlice";
import axios from "axios";
import { BACKEND_API } from "@/api";
import toast from "react-hot-toast";
import Radio from "../form/input/Radio";
import Button from "../ui/button/Button";
import Loader from "../ui/loader/Loader";



interface FormState {
  name: string;
  bulletPoint1: string;
  bulletPoint2: string;
  bulletPoint3: string;
  elevatorPitch: string;
  stateId: string;
  status: string;
  preferredSalesPersonId:string;
}

interface PaginationState {
  currentPage: number,
  totalPages: number,
}

interface FiltersState {
  searchQuery: string,
  status: string,
}



interface AddEditProductCatalogFormProps {

  filters: FiltersState,
  paginationData: PaginationState,
  setPaginationData: React.Dispatch<React.SetStateAction<PaginationState>>,
  onEditSuccess: () => void;
  editData: any;

}


const TEXT_SIZE = "text-base";


const AddEditProductCatalogForm: React.FC<AddEditProductCatalogFormProps> = ({ filters, paginationData, setPaginationData, editData, onEditSuccess }) => {

  const dispatch = useAppDispatch();
  const loggedInUser = useAppSelector((state)=>state.user.user)
  const [formData, setFormData] = useState<FormState>({ name: "", bulletPoint1: "", bulletPoint2: "", bulletPoint3: "", elevatorPitch: "", status: "", stateId: "",preferredSalesPersonId:"" });
  const [states, setStates] = useState<any[]>([]);
  const[stateName,setStateName] = useState<string>("");
  const[selectedState,setSelectedState]=useState<any>(null);
  const [isStateCityDropdownOpen, setIsStateCityDropdownOpen] = useState(false);
  const stateDropdownRef = useRef<HTMLDivElement | null>(null);

  const [selectedPreferredSalesPerson, setSelectedPreferredSalesPerson] = useState<any | null>(null);
  const[preferredSalesPersonName,setPreferredSalesPersonName] = useState<string>("");
  const [preferredSalesPersonList, setPreferredSalesPersonList] = useState<any[]>([]);
  const [isPersonDropdownOpen, setIsPersonDropdownOpen] = useState(false);
  const personDropdownRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState({
    name: "", bulletPoint1: "", bulletPoint2: "", bulletPoint3: "", elevatorPitch: "", status: "", stateId: "",preferredSalesPersonId:""
  })





  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  useEffect(() => {

    const timeoutId = setTimeout(() => {
      fetchStates();
    }, 300); // debounce

    return () => clearTimeout(timeoutId);
  }, [stateName]);

    useEffect(() => {

    const timeoutId = setTimeout(() => {
      fetchPreferredSalesPerson();
    }, 300); // debounce

    return () => clearTimeout(timeoutId);
  }, [preferredSalesPersonName]);



  useEffect(() => {
    if (editData) {
      setFormData({ ...formData, 
        name:editData?.name, 
        bulletPoint1:editData?.bulletPoint1||"", 
        bulletPoint2:editData?.bulletPoint1||"", 
        bulletPoint3:editData?.bulletPoint1||"", 
        elevatorPitch:editData?.elevatorPitch|| "", 
        status:`${editData.status}`, 
        stateId:editData?.states?.length > 0 ? `${editData?.states[0]?.stateId}` : "",
        preferredSalesPersonId:editData?.preferredSalesPersonId||"",
       });
    }
  }, [editData]);

    const handleClickOutside = (e: MouseEvent) => {
    if (stateDropdownRef.current && !stateDropdownRef.current.contains(e.target as Node)) {
      setIsStateCityDropdownOpen(false);
      setStateName("");
      setStates([]);
    }

    if (personDropdownRef.current && !personDropdownRef.current.contains(e.target as Node)) {
      setIsPersonDropdownOpen(false);
      setPreferredSalesPersonName("");
      setPreferredSalesPersonList([]); 
    }

  };

  const handleOpenStateCityDropdown = () => {
    setIsStateCityDropdownOpen(true);
  };
  const handleOpenPersonDropdown = () => {
    setIsPersonDropdownOpen(true);
  };


  const validateFormData = () => {
    let isValidData = true;
    const tempErrors = { ...errors };


    //validate name 
    if (formData.name.trim() === "") {
      tempErrors.name = "Name is required";
      isValidData = false;
    } else {
      tempErrors.name = "";
    }


    //validate  bullet points

    if (formData.bulletPoint1.trim() === "") {
      tempErrors.bulletPoint1 = "Bullet point1 is required";
      isValidData = false;
    } else {
      tempErrors.bulletPoint1 = "";
    }

    if (formData.bulletPoint2.trim() === "") {
      tempErrors.bulletPoint2 = "Bullet point2 is required";
      isValidData = false;
    } else {
      tempErrors.bulletPoint2 = "";
    }

    if (formData.bulletPoint3.trim() === "") {
      tempErrors.bulletPoint3 = "Bullet point3 is required";
      isValidData = false;
    } else {
      tempErrors.bulletPoint3 = "";
    }


    //validate elevatorPitch
    if (formData.elevatorPitch.trim() === "") {
      tempErrors.elevatorPitch = "Elevator Pitch is required";
      isValidData = false;
    } else {
      tempErrors.elevatorPitch = "";
    }

    //validate team
    // if (formData.team.trim() === "") {
    //   tempErrors.team= "Team is required";
    //   isValidData = false;
    // } else {
    //   tempErrors.team = "";
    // }

    //validate members 
    // if (formData.members.trim() === "") {
    //   tempErrors.members= "Members is required";
    //   isValidData = false;
    // } else {
    //   tempErrors.members = "";
    // }

    //validate status
    if (formData.status.trim() === "") {
      tempErrors.status = "Status is required";
      isValidData = false;
    } else {
      tempErrors.status = "";
    }

    //validate state
    if (formData.stateId.trim() === "") {
      tempErrors.stateId = "State is required";
      isValidData = false;
    } else {
      tempErrors.stateId = "";
    }

        //validate state
    if (formData.preferredSalesPersonId.trim() === "") {
      tempErrors.preferredSalesPersonId = "Preferred sales person is required";
      isValidData = false;
    } else {
      tempErrors.preferredSalesPersonId = "";
    }


    setErrors(tempErrors);
    return isValidData;

  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


    const handleSelectState = (value: any) => {

    if (value) {
      setSelectedState(value);
      setIsStateCityDropdownOpen(false);
      setFormData((prev:FormState) => ({
        ...prev,
        stateId: `${value?.id}`,
      }));
      setStates([]);
      setStateName("");
      return;
    }

    setSelectedState(null);
    setFormData((prev:FormState) => ({
      ...prev,
      stateId: "",
    }));


  };
    const handleSelectPreferredSalesPerson = (value: any) => {

    if (value) {
      setSelectedPreferredSalesPerson(value);
      setIsPersonDropdownOpen(false);
      setFormData((prev:FormState) => ({
        ...prev,
        preferredSalesPersonId: `${value?.id}`,
      }));
      setPreferredSalesPersonList([]);
      setPreferredSalesPersonName("");
      return;
    }

    setSelectedPreferredSalesPerson(null);
    setFormData((prev:FormState) => ({
      ...prev,
      preferredSalesPersonId: "",
    }));


  };


  const handleClearFormData = () => {
    setFormData({ name: "", bulletPoint1: "", bulletPoint2: "", bulletPoint3: "", elevatorPitch: "", status: "", stateId: "" ,preferredSalesPersonId:""});
    setErrors({
    name: "", bulletPoint1: "", bulletPoint2: "", bulletPoint3: "", elevatorPitch: "", status: "", stateId: "",preferredSalesPersonId:""
  })
  setSelectedState(null);
  setSelectedPreferredSalesPerson(null);
  };


  const handleSubmit = async () => {

    try {


      if (!validateFormData()) return;

      setLoading(true);

      const payload = {
        name: formData.name,
        bulletPoints: `${formData.bulletPoint1},${formData.bulletPoint2},${formData.bulletPoint3}`,
        elevatorPitch: formData.elevatorPitch,
        status: formData.status === "true" ? true : false,
        stateId: formData.stateId,
        preferredSalesPersonId:formData.preferredSalesPersonId,
      }

      const params = {
        searchQuery: filters.searchQuery,
        status: filters.status === "" ? "" : filters.status === "true" ? "true" : "false",
        page: paginationData.currentPage,
        limit: 5,
      }

      if (editData) {
        await dispatch(updateProductCatalog({ id: editData?.id, ...payload })).unwrap();

        toast.success("Updated product catalog successfully");
        onEditSuccess();

      } else {
        await dispatch(createProductCatalog(payload)).unwrap();

        toast.success("Created product catalog successfully");
        onEditSuccess();
        
      }

      handleClearFormData();

      const res = await dispatch(fetchProductCatalogs(params)).unwrap();
      setPaginationData((prev: PaginationState) => ({ ...prev, totalPages: res?.lastPage || 0 }))

    } catch (error: any) {
       console.error("Error while creating product:", error);
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Failed to create Product.";

      toast.error(errorMessage);
    }
    finally {
      setLoading(false);


    }
  };



  // const handleDelete = async (id: string) => {

  //   try {
  //     await dispatch(deleteProductCatalog(id)).unwrap();
  //     toast.success("Deleted successfully");
  //     dispatch(fetchProductCatalogs({...filters,...paginationData}));
  //   } catch (err: any) {
  //     toast.error(err || "Failed to delete");
  //   }
  // };

  const fetchStates = async () => {

    if (!stateName.trim()) {
      setStates([]);
      return;
    }

    try {
 
      const response = await axios.get(
        `${BACKEND_API}state?name=${stateName}`,
        {
          headers: { 'ngrok-skip-browser-warning': 'true', },
        }
      );

      setStates(response?.data?.data || []);
    }
    catch (error) {
      console.log("error while fetching state", error);

    }



  }

  const fetchPreferredSalesPerson = async () => {
  if (!preferredSalesPersonName.trim()) {
      setPreferredSalesPersonList([]);
      return;
  }

  const token = loggedInUser?.token;

       

  try {
        const response = await axios.get(`${BACKEND_API}admin/users?name=${preferredSalesPersonName.trim()}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}`, 
                     'ngrok-skip-browser-warning': 'true', },
        }
        );
        setPreferredSalesPersonList(response?.data?.data||[]);

        } catch (error: any) {
         console.log("error while fetching users", error)
        } finally {

        }
      };


  console.log("form data",formData);
  console.log("edit data",editData);
  return (
    <div className="w-full max-w-[1500px] bg-white px-6 md:px-8 py-8 rounded-xl ">

      <div className="w-full ">
        <div className="w-full space-y-8  md:space-10 lg:space-y-12 mb-8 md:mb-10">
          <div className="w-full grid grid-cols-1  ">
            <div className="w-full">
              <input
                type="text"
                placeholder="Product Name"
                name="name"
                className={`${FORM_INPUT_CLASS} ${TEXT_SIZE}`}
                value={formData.name}
                onChange={handleInputChange}
              />
              <span className={`${REQUIRED_ERROR}`}>{errors.name || ""}</span>
            </div>

          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 ">
            <div className="w-full">
              <input
                type="text"
                placeholder="Bullet point 1"
                name="bulletPoint1"
                className={`${FORM_INPUT_CLASS} ${TEXT_SIZE}`}
                value={formData.bulletPoint1}
                onChange={handleInputChange}
              />
              <span className={`${REQUIRED_ERROR}`}>{errors.bulletPoint1 || ""}</span>
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Bullet point 2"
                name="bulletPoint2"
                className={`${FORM_INPUT_CLASS} ${TEXT_SIZE}`}
                value={formData.bulletPoint2}
                onChange={handleInputChange}
              />
              <span className={`${REQUIRED_ERROR}`}>{errors.bulletPoint2 || ""}</span>
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Bullet point  3"
                name="bulletPoint3"
                className={`${FORM_INPUT_CLASS} ${TEXT_SIZE}`}
                value={formData.bulletPoint3}
                onChange={handleInputChange}
              />
              <span className={`${REQUIRED_ERROR}`}>{errors.bulletPoint3 || ""}</span>
            </div>
          </div>
          <div className="w-full grid grid-cols-1 ">
            <div className="w-full">
              <textarea
                placeholder="Write an elevator pitch"
                name="elevatorPitch"
                className={`  ${FORM_INPUT_CLASS} ${TEXT_SIZE} h-24 `}
                value={formData.elevatorPitch}
                onChange={handleInputChange}

              />
              <span className="text-sm text-red-500">{errors.elevatorPitch || ""}</span>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 ">

            <div className="relative w-full" ref={stateDropdownRef}>
              <input
                type="text"
                readOnly
                value={
                  selectedState ? `${selectedState?.name}`: ""
                }
                onClick={handleOpenStateCityDropdown}
                placeholder="City or state"
                className={`${FORM_INPUT_CLASS} cursor-pointer`}
              />
              <span className={`${REQUIRED_ERROR}`}>{errors.stateId || ""}</span>

              {isStateCityDropdownOpen && (
                <div className="absolute z-50 top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 px-2 py-2">
                  {selectedState && (
                    <div className="mb-2 flex items-center justify-between gap-2 px-3 py-1 bg-gray-100 rounded">
                      <span className="text-sm text-gray-800">
                        {`${selectedState.name}`}
                      </span>
                      <button
                        onClick={() => handleSelectState(null)}
                        className="ml-2 text-gray-500 hover:text-red-500 transition-all duration-300 "
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Search"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full px-3 py-2 rounded-md outline-none border border-gray-200 mb-1 "
                    autoFocus
                  />
                  <ul className="max-h-48 overflow-y-auto">
                    {states.length > 0 ? (
                      states.map((item, index) => (
                        <li
                          key={index}
                          onClick={() => handleSelectState(item)}
                          className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
                        >
                          {`${item?.name}`}
                        </li>
                      ))
                    ) : (
                      <li className=" px-3 py-1 text-gray-400">{stateName.trim().length > 0 && states.length === 0 ? "No result found" : ""}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
              <div className="relative w-full" ref={personDropdownRef}>
              <input
                type="text"
                readOnly
                value={
                  selectedPreferredSalesPerson ? `${selectedPreferredSalesPerson?.firstName} ${selectedPreferredSalesPerson?.lastName}`: ""
                }
                onClick={handleOpenPersonDropdown}
                placeholder="Preferred sales person"
                className={`${FORM_INPUT_CLASS} cursor-pointer`}
              />
              <span className={`${REQUIRED_ERROR}`}>{errors.preferredSalesPersonId || ""}</span>

              {isPersonDropdownOpen && (
                <div className="absolute z-50 top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 px-2 py-2">
                  {selectedPreferredSalesPerson && (
                    <div className="mb-2 flex items-center justify-between gap-2 px-3 py-1 bg-gray-100 rounded">
                      <span className="text-sm text-gray-800">
                        {`${selectedPreferredSalesPerson?.firstName} ${selectedPreferredSalesPerson?.lastName}`}
                      </span>
                      <button
                        onClick={() => handleSelectPreferredSalesPerson(null)}
                        className="ml-2 text-gray-500 hover:text-red-500 transition-all duration-300 "
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Search"
                    value={preferredSalesPersonName}
                    onChange={(e) => setPreferredSalesPersonName(e.target.value)}
                    className="w-full px-3 py-2 rounded-md outline-none border border-gray-200 mb-1 "
                    autoFocus
                  />
                  <ul className="max-h-48 overflow-y-auto">
                    {preferredSalesPersonList.length > 0 ? (
                      preferredSalesPersonList.map((item, index) => (
                        <li
                          key={index}
                          onClick={() => handleSelectPreferredSalesPerson(item)}
                          className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
                        >
                          {`${item?.firstName} ${item?.lastName} `}
                        </li>
                      ))
                    ) : (
                      <li className=" px-3 py-1 text-gray-400">{preferredSalesPersonName.trim().length > 0 && preferredSalesPersonList.length === 0 ? "No result found" : ""}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            <div className="w-full ">
              <div className="flex items-center  gap-6 ">
                <label className="block text-base font-medium text-gray-700  ">Status</label>
                <div className="flex items-center flex-wrap space-x-6  ">
                  <Radio
                    id="radio1"
                    label="Active"
                    name="status"
                    value="true"
                    checked={formData.status === "true"}
                    onChange={(value) => { setFormData((prev: FormState) => ({ ...prev, status: value })) }}

                  />
                  <Radio
                    id="radio2"
                    label="Inactive"
                    name="status"
                    value="false"
                    checked={formData.status === "false"}
                    onChange={(value) => { setFormData((prev: FormState) => ({ ...prev, status: value })) }}

                  />

                </div>
              </div>

              <span className={`${REQUIRED_ERROR}`}>{errors.status || ""}</span>
            </div>

          </div>



        </div>
        <div className="w-full flex justify-center md:justify-start items-center gap-4  ">

          <Button size="md" onClick={handleSubmit}>
            {loading ? (<Loader />) : (editData ? "Update Product" : "Save Product")}
          </Button>
          <Button size="md" variant="outline" onClick={() => {
            handleClearFormData();
            onEditSuccess();
          }}>
            Cancel
          </Button>

        </div>

      </div>
    </div>
  );
};

export default AddEditProductCatalogForm;

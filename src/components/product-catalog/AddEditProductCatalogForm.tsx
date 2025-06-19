"use client";
import { FORM_INPUT_CLASS, REQUIRED_ERROR, TEXT_SIZE } from "@/constant/constantClassName";
import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { createProductCatalog, fetchProductCatalogs, updateProductCatalog } from "@/lib/redux/slices/productCatalogSlice";
import axios from "axios";
import { BACKEND_API } from "@/api";
import toast from "react-hot-toast";
import Radio from "../form/input/Radio";
import Button from "../ui/button/Button";
import Loader from "../ui/loader/Loader";
import ImageUploading from 'react-images-uploading';
import { RiImageAddFill } from "react-icons/ri";

interface FormState {
  name: string;
  bulletPoint1: string;
  bulletPoint2: string;
  bulletPoint3: string;
  elevatorPitch: string;
  stateId: string;
  status: string;
  preferredSalesPersonId: string;
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

const AddEditProductCatalogForm: React.FC<AddEditProductCatalogFormProps> = ({ filters, paginationData, setPaginationData, editData, onEditSuccess }) => {

  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<FormState>({ name: "", bulletPoint1: "", bulletPoint2: "", bulletPoint3: "", elevatorPitch: "", status: "", stateId: "", preferredSalesPersonId: "" });
  const [states, setStates] = useState<any[]>([]);
  const [stateName, setStateName] = useState<string>("");
  const [selectedState, setSelectedState] = useState<any>(null);
  const [isStateCityDropdownOpen, setIsStateCityDropdownOpen] = useState(false);
  const stateDropdownRef = useRef<HTMLDivElement | null>(null);

  const [images, setImages] = React.useState([]);
  const maxNumber = 3;

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState({
    name: "", bulletPoint1: "", bulletPoint2: "", bulletPoint3: "", elevatorPitch: "", status: "", stateId: ""
  })

  const onChange = (imageList: any, addUpdateIndex: any) => {
    // data for submit
    console.log(imageList, "Images List in Array", addUpdateIndex, "index of Images");
    setImages(imageList);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (editData) {
      setImages(editData.media)
      setFormData({
        ...formData,
        name: editData?.name,
        bulletPoint1: editData?.bulletPoint1 || "",
        bulletPoint2: editData?.bulletPoint1 || "",
        bulletPoint3: editData?.bulletPoint1 || "",
        elevatorPitch: editData?.elevatorPitch || "",
        status: `${editData.status}`,
        stateId: editData?.states?.length > 0 ? `${editData?.states[0]?.stateId}` : "",
      });
    }
  }, [editData]);

  const handleClickOutside = (e: MouseEvent) => {
    if (stateDropdownRef.current && !stateDropdownRef.current.contains(e.target as Node)) {
      setIsStateCityDropdownOpen(false);
      setStateName("");
      setStates([]);
    }
  };

  const handleOpenStateCityDropdown = () => {
    setIsStateCityDropdownOpen(true);
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
      setFormData((prev: FormState) => ({
        ...prev,
        stateId: `${value?.id}`,
      }));
      setStates([]);
      setStateName("");
      return;
    }

    setSelectedState(null);
    setFormData((prev: FormState) => ({
      ...prev,
      stateId: "",
    }));
  };

  const handleClearFormData = () => {
    setFormData({ name: "", bulletPoint1: "", bulletPoint2: "", bulletPoint3: "", elevatorPitch: "", status: "", stateId: "", preferredSalesPersonId: "" });
    setErrors({
      name: "", bulletPoint1: "", bulletPoint2: "", bulletPoint3: "", elevatorPitch: "", status: "", stateId: ""
    })
    setSelectedState(null);
  };

  const handleSubmit = async () => {

    try {
      if (!validateFormData()) return;
      setLoading(true);
      const payload = {
        name: formData.name,
        bulletPoints: `${formData.bulletPoint1},${formData.bulletPoint2},${formData.bulletPoint3}`,
        elevatorPitch: formData.elevatorPitch,
        status: formData.status,
        stateId: formData.stateId,
      }
      const data = new FormData();

      // Append other fields
      data.append("name", formData.name);
      data.append("bulletPoints", `${formData.bulletPoint1},${formData.bulletPoint2},${formData.bulletPoint3}`);
      data.append("elevatorPitch", formData.elevatorPitch);
      data.append("status", formData.status);
      data.append("stateId", formData.stateId);

      // Append each file using 'files' as the field name
      images.forEach((imgObj: any) => {
        if (imgObj?.file) {
          data.append("files", imgObj.file);
        }
      });

      console.log(data, "data")

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
        await dispatch(createProductCatalog(data)).unwrap();
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

  useEffect(() => {

    const timeoutId = setTimeout(() => {
      fetchStates();
    }, 300); // debounce

    return () => clearTimeout(timeoutId);
  }, [stateName]);


  console.log("form data", formData);
  console.log("edit data", editData);
  return (
    <div className="w-full max-w-[1500px] bg-white px-6 md:px-8 py-8 rounded-xl ">

      <div className="w-full ">
        <div className="w-full space-y-8  md:space-10 lg:space-y-12 mb-8 md:mb-10">
          <div className="w-full grid grid-cols-1 ">
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
                  selectedState ? `${selectedState?.name}` : ""
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

          <div className="w-full grid grid-cols-1">
            <div className="w-full">
              <ImageUploading
                multiple
                value={images}
                onChange={onChange}
                maxNumber={maxNumber}
                dataURLKey="data_url"
              >
                {({
                  imageList,
                  onImageUpload,
                  onImageRemoveAll,
                  onImageUpdate,
                  onImageRemove,
                  isDragging,
                  dragProps,
                }) => (
                  <div className="space-y-4 p-4 border border-gray-300 rounded-lg bg-white">
                    {/* Upload/Drop Button */}
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={onImageUpload}
                        {...dragProps}
                        className={`px-4 py-2 flex items-center gap-2 rounded-md border bg-gray-100 ${isDragging ? 'border-red-500 text-red-500' : 'border-gray-500 text-gray-500'
                          } hover:bg-blue-100 transition-all`}
                      >
                        <RiImageAddFill />
                        Upload Product Images
                      </button>
                      <button
                        type="button"
                        onClick={onImageRemoveAll}
                        className="px-4 py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-100 transition-all"
                      >
                        Remove All
                      </button>
                    </div>
                    <span className="text-orange-400">note: upload only 3 images</span>

                    {/* Uploaded Images Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className="relative rounded-lg border border-gray-200 overflow-hidden shadow-sm"
                        >
                          <img
                            src={image['data_url']}
                            alt={`uploaded-${index}`}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-0 right-0 flex flex-col gap-1 m-2">
                            <button
                              onClick={() => onImageUpdate(index)}
                              className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 text-xs rounded shadow"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => onImageRemove(index)}
                              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded shadow"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </ImageUploading>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center md:justify-start items-center gap-4 ">

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

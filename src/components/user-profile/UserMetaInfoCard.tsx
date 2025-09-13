"use client";
import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import ImageUploading, { ImageListType } from "react-images-uploading";
import toast,{Toaster} from "react-hot-toast";
import { fetchUserProfile, uploadProfileImage } from "@/lib/redux/slices/loginPersonProfile";
import { useAppDispatch,useAppSelector } from "@/lib/redux/hooks";
import { BACKEND_API } from "@/api";
import { DEFAULT_PROFILE_IMAGE } from "@/constant/defaultImages";
import { formatRoleName,capitalizeWord } from "@/utils/stringUtils";
import ButtonLoader from "../ui/loader/ButtonLoader";
import { FiEdit } from "react-icons/fi";

export default function UserMetaInfoCard() {
  const { isOpen, closeModal, openModal } = useModal();
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch();
  const { userProfile } = useAppSelector((state) => state.userProfile);
  const [image, setImage] = useState<ImageListType>([]);
  const maxNumber = 1;

  const handleImageChange = (imageList: ImageListType) => {
    setImage(imageList);
  };


  const handleImageSave = async () => {
    if (!image[0]?.file) {
      toast.error("Please select an image.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("file", image[0].file as Blob);
      await dispatch(uploadProfileImage(data)).unwrap();
      toast.success("Profile image updated successfully");
      dispatch(fetchUserProfile());
      setImage([]);
      closeModal();
    } catch (error: any) {
      console.error("Error while uploading image:", error);
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Failed to upload image.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const imageSrc =
    userProfile?.media?.[0]?.imageName
      ? `${BACKEND_API}uploads/${userProfile.media[0].imageName}`
      : DEFAULT_PROFILE_IMAGE;
      
  return (
    <div className="">
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <Toaster/>
        <div className="w-full">
          <div className="flex flex-col items-center w-full gap-6 lg:flex-row">
            <div className="relative flex flex-col items-center">
              <div className=" w-24 h-24 overflow-hidden border-2 border-primary rounded-full">
                <img
                  width={96}
                  height={96}
                  src={imageSrc}
                  alt="user"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <button
                onClick={openModal}
                className=" absolute bottom-1 right-1 bg-primary flex items-center justify-center text-sm p-1 text-white rounded"
                >
                <FiEdit/>
              </button>
            </div>

            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800  lg:text-left">
              {
                `${capitalizeWord(userProfile?.firstName)} ${capitalizeWord(userProfile?.lastName)}`
              }
              </h4>
              <div className="flex flex-col items-center gap-1 text-center lg:flex-row lg:gap-3 lg:text-left">
                <p className="text-sm text-gray-500 ">
                  {formatRoleName(userProfile?.role)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Image Upload Modal */}
      <Modal isOpen={isOpen} onClose={()=>{
        if(loading) return ;
        closeModal();
      }} className="max-w-[500px] m-4">
        <div className="relative w-full rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
          <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
            Update Profile Image
          </h4>
          <ImageUploading
            multiple={false}
            value={image}
            onChange={handleImageChange}
            maxNumber={maxNumber}
            dataURLKey="data_url"
            acceptType={["jpg", "jpeg", "png"]}
          >
            {({
              imageList,
              onImageUpload,

              onImageRemove,
              isDragging,
              dragProps,
            }) => (
              <div className="upload__image-wrapper">
                <div
                  className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center ${isDragging ? "border-blue-500" : "border-gray-300"
                    }`}
                  onClick={onImageUpload}
                  {...dragProps}
                >
                  Click or Drop here to upload image
                </div>
                {imageList.map((image, index) => (
                  <div key={index} className="mt-4 flex flex-col items-center gap-4">
                    <img src={image.data_url} alt="preview" className="w-24 h-24 rounded-full object-cover" />
                    <div className="flex gap-3">
                      {/* <Button size="sm" onClick={() => onImageUpdate(index)}>Update</Button> */}
                      <Button size="sm" variant="outline" onClick={() => onImageRemove(index)}>Remove</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ImageUploading>

          <div className="flex justify-end gap-3 mt-6">
            <Button size="sm" disabled={loading} onClick={handleImageSave} className=" w-44 ">
              {loading ? (<ButtonLoader/>) : ("Save Changes") }
            </Button>
            <Button size="sm" variant="outline" disabled={loading} onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

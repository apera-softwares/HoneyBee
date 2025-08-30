"use client";
import React from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
// import { GridIcon } from "../../icons/index";
// import { TbArrowNarrowLeft, TbArrowNarrowRight } from "react-icons/tb";
// import { capitalizeWords } from "@/utils/stringUtils";

interface UserInfoEditModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const UserInfoEditModal: React.FC<UserInfoEditModalProps> = ({
  isOpen,
  closeModal,
}) => {


  const clear = () => {
  };
  const handleCloseModal = () => {
    clear();
    closeModal();
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      className="max-w-3xl px-6 lg:px-8 py-8 "
    >
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Personal Information
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Update your details to keep your profile up-to-date.
          </p>
        </div>
        <form className="flex flex-col">
          <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Social Links
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Facebook</Label>
                  <Input
                    type="text"
                    defaultValue="https://www.facebook.com/PimjoHQ"
                  />
                </div>

                <div>
                  <Label>X.com</Label>
                  <Input type="text" defaultValue="https://x.com/PimjoHQ" />
                </div>

                <div>
                  <Label>Linkedin</Label>
                  <Input
                    type="text"
                    defaultValue="https://www.linkedin.com/company/pimjo"
                  />
                </div>

                <div>
                  <Label>Instagram</Label>
                  <Input
                    type="text"
                    defaultValue="https://instagram.com/PimjoHQ"
                  />
                </div>
              </div>
            </div>
            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Personal Information
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>First Name</Label>
                  <Input type="text" defaultValue="Musharof" />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Last Name</Label>
                  <Input type="text" defaultValue="Chowdhury" />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Email Address</Label>
                  <Input type="text" defaultValue="randomuser@pimjo.com" />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Phone</Label>
                  <Input type="text" defaultValue="+09 363 398 46" />
                </div>

                <div className="col-span-2">
                  <Label>Bio</Label>
                  <Input type="text" defaultValue="Team Manager" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UserInfoEditModal;

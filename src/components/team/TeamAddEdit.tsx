"use client";
import React, { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { Users1 } from "../../icons/index";
import { FORM_INPUT_CLASS, REQUIRED_ERROR } from "@/constant/constantClassName";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import toast,{Toaster} from "react-hot-toast";
import {
  createTeam,
  fetchTeams,
  updateTeam,
} from "@/lib/redux/slices/teamManagementSlice";
import { fetchUsers } from "@/lib/redux/slices/userManagementSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { RxCross2 } from "react-icons/rx";
import { UserRole } from "@/constant/userRoles";
import { capitalizeWord } from "@/utils/stringUtils";

interface TeamAddEditProps {
  isOpen: boolean;
  closeModal: () => void;
  teamData?: any;
  type?: string;
}

const TeamAddEdit: React.FC<TeamAddEditProps> = ({
  isOpen,
  closeModal,
  teamData,
  type,
}) => {
  const ITEM_PER_PAGE = 5;
  const dispatch = useDispatch<AppDispatch>();
  const { userProfile } = useAppSelector((state) => state.userProfile);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    member: "",
  });
  const [searchText, setSearchText] = useState("");
  const [selectedMember, setSelectedMember] = useState<any | null>(null);


  useEffect(() => {
    if (teamData) {
      setFormData({
        id: teamData?.id || "",
        name: teamData?.name || "",
      });
    }
  }, [teamData]);

  useEffect(() => {
    if (!searchText.trim()) return;

    const delayDebounce = setTimeout(() => {
      dispatch(
        fetchUsers({
          page: 1,
          limit: ITEM_PER_PAGE,
          name: searchText,
          role: "B_TEAM",
          order: "",
        })
      ).then((res: any) => {
        if (res.meta.requestStatus === "fulfilled") {
          if (res.payload) {
            setUsersData(res.payload.data || []);
          } else {
            setUsersData([]);
          }
        } else {
          console.log("Failed to fetch users:", res.payload || "Unknown error");
        }
      });
    }, 500); // debounce by 500ms

    return () => clearTimeout(delayDebounce);
  }, [searchText, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const validateFormData = () => {
    let isValidData = true;
    const tempErrors = { ...errors };

    // Validate name
    if (formData.name.trim() === "") {
      tempErrors.name = "Team name is required";
      isValidData = false;
    } else {
      tempErrors.name = "";
    }

    // Validate selectedMember
    if (
      type === "add" &&
      !selectedMember &&
      userProfile.role == UserRole.ADMIN
    ) {
      tempErrors.member = "Team Member is required";
      isValidData = false;
    } else {
      tempErrors.member = "";
    }

    setErrors(tempErrors);
    return isValidData;
  };


  const handleEdit = () => {

    if (!validateFormData()) return;
    dispatch(updateTeam(formData)).then((res: any) => {
      if (res.meta.requestStatus === "fulfilled") {
        if (res.payload) {
          toast.success("Team Updated successful!");
          dispatch(fetchTeams({ page: 1, limit: 5 }));
          closeModal();
          clear();
        }
      } else {
        console.log("Failed to Update Team:", res.payload || "Unknown error");
        toast.error("Failed to Update Team");
      }
    });
  };

  const handleAddUser = () => {

    if (!validateFormData()) return;
    dispatch(
      createTeam({ name: formData?.name, mangerId: selectedMember?.id })
    ).then((res: any) => {
      if (res.meta.requestStatus === "fulfilled") {
        if (res.payload) {
          toast.success("Team Created successful!");
          closeModal();
          clear();
        }
      } else {
        console.log("Failed to Create Team:", res.payload || "Unknown error");
        toast.error(res?.payload || "Failed to Create Team");
      }
    });
  };

  const clear = () => {
    setFormData({
      id: "",
      name: "",
    });
    setErrors({
      name: "",
      member: "",
    });
    setSearchText("");
    setSelectedMember(null);
    setUsersData([]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        clear();
        closeModal();
      }}
      className="max-w-[800px] p-6 lg:p-10 pt-10 "
    >
      <Toaster />
      <div className="w-full ">
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-primary p-1 sm:p-2 flex justify-center items-center rounded-full">
            <Users1 />
          </span>
          <div className=" w-4/5">
            <h5 className="font-semibold text-gray-800 text-xl sm:text-2xl lg:text-3xl dark:text-white/90">
              {type == "add" ? "Create New Team" : "Edit Team Name"}
            </h5>
          </div>
        </div>
        <div className="px-2 max-h-80 overflow-y-auto  space-y-6 mb-6  ">
            <div className="w-full">
              <input
                type="text"
                name="name"
                placeholder="Team name"
                value={formData.name}
                onChange={handleInputChange}
                className={FORM_INPUT_CLASS}
                required
              />
              <span className={REQUIRED_ERROR}>{errors.name}</span>
            </div>
            {userProfile?.role == UserRole.ADMIN && type == "add" && (
              <div className=" relative">
                <label className="block font-medium mb-1">
                  Add Team Manager
                </label>
                <input
                  type="text"
                  placeholder="search here"
                  className={FORM_INPUT_CLASS}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                {usersData &&
                  searchText.trim().length > 0 &&
                  !selectedMember && (
                    <ul className=" w-full mt-1 bg-white border border-gray-300 rounded shadow max-h-36 overflow-auto">
                      {usersData?.length > 0 ? (
                        usersData?.map((member) => (
                          <li
                            key={member.id}
                            onClick={() => {
                              setSelectedMember(member);
                              setSearchText("");
                              setUsersData([]);
                            }}
                            className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer"
                          >
                            {`${capitalizeWord(member?.firstName)} ${capitalizeWord(member?.lastName)} ${member?.email}`}
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-gray-500 hover:bg-gray-100 cursor-pointer">
                          No data found
                        </li>
                      )}
                    </ul>
                  )}
                <span className={REQUIRED_ERROR}>{errors.member}</span>
              </div>
            )}
            {selectedMember && type == "add" && (
              <div className="p-3 border rounded-md bg-gray-50 flex justify-between items-center gap-3">
                <div>
                  <p className="text-sm text-gray-500">{`${selectedMember?.firstName} ${selectedMember?.lastName}`}</p>
                  <p className="text-sm text-gray-500">
                    {selectedMember?.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedMember?.role}
                  </p>
                </div>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => setSelectedMember(null)}
                >
                  <RxCross2 className="h-6 w-6" />
                </button>
              </div>
            )}
        </div>
        <div className="flex items-center justify-end w-full gap-3">
          <Button
            size="sm"
            onClick={type == "add" ? handleAddUser : handleEdit}
          >
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              clear();
              closeModal();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TeamAddEdit;

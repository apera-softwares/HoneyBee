"use client";
import React, { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { Users1 } from "../../icons/index";
import { FORM_INPUT_CLASS, REQUIRED_ERROR } from "@/constant/constantClassName";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import toast from "react-hot-toast";
import { CreateTeam, fetchTeams, UpdateTeam } from "@/lib/redux/slices/teamManagementSlice";
import { fetchUsers } from "@/lib/redux/slices/userManagementSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { RxCross2 } from "react-icons/rx";

interface TeamAddEditProps {
    isOpen: boolean;
    closeModal: () => void;
    teamData?: any
    type?: string
}

const TeamAddEdit: React.FC<TeamAddEditProps> = ({ isOpen, closeModal, teamData, type }) => {
    const ITEM_PER_PAGE = 5;
    const [usersData, setUsersData] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        managerId: ""
    });

    const [errors, setErrors] = useState({
        name: "",
    })

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { loading } = useSelector((state: RootState) => state.UserManagement);
    const [searchText, setSearchText] = useState("")
    const [selectedMember, setSelectedMember] = useState<any | null>(null);
    const { userProfile } = useAppSelector((state) => state.userProfile);

    console.log(usersData, "All team B users")
    console.log(selectedMember, "selectedMember")

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (teamData) {
            setFormData({
                id: teamData?.id || "",
                name: teamData?.name || "",
                managerId: ""
            });
        }
    }, [teamData]);

    useEffect(() => {
        dispatch(fetchUsers({ page: currentPage, limit: ITEM_PER_PAGE, name: searchText, role: "B_TEAM", order: "" })).then((res: any) => {
            if (res.meta.requestStatus === "fulfilled") {
                if (res.payload) {
                    setUsersData(res.payload.data || []);
                    const lastPage = res.payload.lastPage;
                    setTotalPages(lastPage);
                } else {
                    setUsersData([]);
                    setTotalPages(1);
                }
            } else {
                console.log("Failed to fetch users:", res.payload || "Unknown error");
            }
        });

    }, [dispatch, currentPage, searchText]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateFormData = () => {
        let isValidData = true;
        const tempErrors = { ...errors };

        // Validate firstName
        if (formData.name.trim() === "") {
            tempErrors.name = "Team name is required";
            isValidData = false;
        } else {
            tempErrors.name = "";
        }

        setErrors(tempErrors);
        return isValidData;
    };

    console.log(teamData, "Team Data 1")

    const handleEdit = () => {
        console.log("Form Data: Update User", formData);
        if (!validateFormData()) return
        dispatch(UpdateTeam(formData)).then((res: any) => {
            if (res.meta.requestStatus === "fulfilled") {
                if (res.payload) {
                    toast.success("Team Updated successful!");
                    dispatch(fetchTeams({ page: 1, limit: 5 }))
                    console.log(res.payload)
                    closeModal();
                    clear()
                } else {
                }
            } else {
                console.log("Failed to Update Team:", res.payload || "Unknown error");
                toast.error("Failed to Update Team");
            }
        });
    };

    const handleAddUser = () => {
        console.log("Form Data: Add Team", formData);
        if (!validateFormData()) return
        dispatch(CreateTeam(formData)).then((res: any) => {
            if (res.meta.requestStatus === "fulfilled") {
                if (res.payload) {
                    toast.success("Team Created successful!");
                    console.log("Team Created successful!");
                    console.log(res.payload)
                    closeModal();
                    clear()
                } else {
                }
            } else {
                console.log("Failed to Create Team:", res.payload || "Unknown error");
                toast.error("Failed to Create Team");
            }
        });
    }

    const clear = () => {
        setFormData({
            id: "",
            name: "",
            managerId: ""
        })
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                closeModal()
                clear()
            }}
            className="max-w-[800px] p-6 lg:p-10 pt-10 ">
            {/* <Toaster /> */}

            <div className="w-full ">
                <div className="flex items-center">
                    <span className="bg-primary p-1 sm:p-2 flex justify-center items-center rounded-full">
                        <Users1 />
                    </span>
                    <div className="ml-4 w-4/5">
                        <h5 className="font-semibold text-gray-800 text-xl sm:text-2xl lg:text-3xl dark:text-white/90">
                            {type == "add" ? "Create New Team" : "Edit Team Name"}
                        </h5>
                        {/* <span className="text-md">
                            Add a new Team to the Honeybee Hive. add Members, team.
                        </span> */}
                    </div>
                </div>

                <div className="p-2">
                    <div>
                        <div className="w-full my-6">
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

                        {userProfile?.role == "ADMIN" && <div className="mb-4 relative">
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
                            {usersData?.length > 0 && !selectedMember && (
                                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow max-h-60 overflow-auto">
                                    {usersData?.map((member) => (
                                        <li
                                            key={member.id}
                                            onClick={() => {
                                                setSelectedMember(member);
                                                setSearchText("");
                                                setUsersData([]);
                                            }}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {member?.firstName} {member?.lastName} ({member?.email})
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {/* <span className={REQUIRED_ERROR}>{errors.member}</span> */}
                        </div>}
                        {selectedMember && (
                            <div className="p-4 border rounded-md bg-gray-50 flex justify-between items-center mb-4">
                                <div>

                                    <p className="text-sm text-gray-500">{selectedMember?.firstName}</p>
                                    <p className="text-sm text-gray-500">{selectedMember?.email}</p>
                                    <p className="text-sm text-gray-500">{selectedMember?.role}</p>
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
                </div>

                <div className="flex items-center justify-end w-full gap-3 mt-4">
                    <Button size="sm" onClick={type == "add" ? handleAddUser : handleEdit}>
                        Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => {
                        closeModal()
                        clear()
                    }}>
                        Cancel
                    </Button>
                </div>

            </div>
        </Modal>
    );
};

export default TeamAddEdit;


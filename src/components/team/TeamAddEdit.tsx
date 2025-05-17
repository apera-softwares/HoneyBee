"use client";
import React, { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { Users1 } from "../../icons/index";
import { FORM_INPUT_CLASS, REQUIRED_ERROR } from "@/constant/constantClassName";

import { CreateUser, UpdateUser } from "@/lib/redux/slices/userManagementSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import toast from "react-hot-toast";
import { CreateTeam, UpdateTeam } from "@/lib/redux/slices/TeamManagementSlice";

interface TeamAddEditProps {
    isOpen: boolean;
    closeModal: () => void;
    teamData?: any
    type?: string
}

const TeamAddEdit: React.FC<TeamAddEditProps> = ({ isOpen, closeModal, teamData, type }) => {
    const [formData, setFormData] = useState({
        id: "",
        name: ""
    });

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (teamData) {
            setFormData({
                id: teamData?.id || "",
                name: teamData?.name || "",
            });
        }
    }, [teamData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    console.log(teamData, "Team Data 1")

    const handleEdit = () => {
        console.log("Form Data: Update User", formData);

        dispatch(UpdateTeam(formData)).then((res: any) => {
            if (res.meta.requestStatus === "fulfilled") {
                if (res.payload) {
                    toast.success("Team Updated successful!");

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
        })
    }

    console.log("tyoe", type)

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                closeModal()
                clear()
            }}
            className="max-w-[800px] p-5 lg:p-10"
        >
            {/* <Toaster /> */}

            <div>
                <div className="flex items-center">
                    <span className="bg-amber-500 p-2 flex justify-center items-center rounded-full">
                        <Users1 />
                    </span>
                    <div className="ml-4 w-4/5">
                        <h5 className="font-semibold text-gray-800 text-title-sm dark:text-white/90">
                            {type == "add" ? "Create New Team" : "Edit New Name"}
                        </h5>
                        {/* <span className="text-md">
                            Add a new Team to the Honeybee Hive. add Members, team.
                        </span> */}
                    </div>
                </div>

                <div className="p-2">
                    <form>
                        <div className="w-full my-6">
                            <input
                                type="text"
                                name="name"
                                placeholder="Team name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={FORM_INPUT_CLASS}
                            />
                            <span className={REQUIRED_ERROR}></span>
                        </div>
                    </form>
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


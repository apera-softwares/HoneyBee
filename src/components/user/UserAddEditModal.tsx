"use client";
import React, { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { Users1 } from "../../icons/index";
import { FORM_INPUT_CLASS, REQUIRED_ERROR } from "@/constant/constantClassName";
import Select from "../form/Select";
import Radio from "../form/input/Radio";
import Checkbox from "../form/input/Checkbox";
import { CreateUser, UpdateUser } from "@/lib/redux/slices/userManagementSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import toast from "react-hot-toast";

const Role = [
    { value: "ADMIN", label: "Admin" },
    { value: "A_TEAM", label: "Team A" },
    { value: "B_TEAM", label: "Team B" },
];

interface UserAddEditModalProps {
    isOpen: boolean;
    closeModal: () => void;
    userData?: any
    type?: string
}

const UserAddEditModal: React.FC<UserAddEditModalProps> = ({ isOpen, closeModal, userData, type }) => {
    const [formData, setFormData] = useState({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        team: "",
        status: true,
        verified: true,
        sendWelcomeEmail: true,
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: ""
    })

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (userData) {
            setFormData({
                id: userData?.id || "",
                firstName: userData?.firstName || "",
                lastName: userData?.lastName || "",
                email: userData?.email || "",
                role: userData?.role || "",
                team: userData?.team || "",
                status: Boolean(userData?.status),
                verified: Boolean(userData?.verified),
                sendWelcomeEmail: false,
            });
        }
    }, [userData]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: "role" | "team", value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            status: value === "active",
        }));
    };


    const handleVerifiedChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            verified: value === "yes",
        }));
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

        // Validate role
        if (formData.role.trim() === "") {
            tempErrors.role = "Role is required";
            isValidData = false;
        } else {
            tempErrors.role = "";
        }

        setErrors(tempErrors);
        return isValidData;

    };


    const handleEdit = () => {
        if (!validateFormData()) return
        dispatch(UpdateUser(formData)).then((res: any) => {
            if (res.meta.requestStatus === "fulfilled") {
                if (res.payload) {
                    toast.success("User Updated successful!");
                    closeModal();
                    clear()
                } else {
                }
            } else {
                console.log("Failed to Update User:", res.payload || "Unknown error");
                toast.error("Failed to Update user");

            }
        });
    };

    const handleAddUser = () => {

        if (!validateFormData()) return
        dispatch(CreateUser(formData)).then((res: any) => {
            if (res.meta.requestStatus === "fulfilled") {
                if (res.payload) {
                    toast.success("User created successful!");
                    closeModal();
                    clear()
                } else {
                }
            } else {
                console.log("Failed to Create user:", res.payload || "Unknown error");
                toast.error("Failed to Create user");
            }
        });
    }

    const clear = () => {
        setFormData({
            id: "",
            firstName: "",
            lastName: "",
            email: "",
            role: "",
            team: "",
            status: false,
            sendWelcomeEmail: true,
            verified: false
        });
        setErrors({
            firstName: "",
            lastName: "",
            email: "",
            role: "",
        });
    }
    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                closeModal()
                clear()
            }}
            className="max-w-[800px] p-6 lg:p-10 pt-10 "
        >
            {/* <Toaster /> */}

            <div className="w-full">
                <div className="flex items-center gap-4 lg:gap-6 mb-6">
                    <span className="bg-primary p-1 sm:p-2 flex justify-center items-center rounded-full">
                        <Users1 />
                    </span>
                    <div className=" w-4/5">
                        <h5 className="font-semibold text-gray-800 text-xl sm:text-2xl lg:text-3xl dark:text-white/90">
                            {type == "add" ? "Create New User" : "Edit User"}
                        </h5>
                        <span className="text-base">
                            {type == "add" && "Add a new user to the Honeybee Hive. Assign their role, and send a welcome email to get them started."}
                        </span>
                    </div>
                </div>

                <div className=" max-h-72 overflow-y-auto px-2 mb-8">
                    <div className="space-y-6">
                        <div className="w-full">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First name"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className={FORM_INPUT_CLASS}
                            />
                            <span className={REQUIRED_ERROR}>{errors.firstName || ""}</span>
                        </div>

                        <div className="w-full">
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last name"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className={FORM_INPUT_CLASS}
                            />
                            <span className={REQUIRED_ERROR}>{errors.lastName || ""}</span>
                        </div>

                        <div className="w-full">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={FORM_INPUT_CLASS}
                            />
                            <span className={REQUIRED_ERROR}>{errors.email || ""}</span>
                        </div>

                        <div className="w-full">
                            <Select
                                options={Role}
                                defaultValue={formData.role}
                                placeholder="User role"
                                onChange={(value: string) => handleSelectChange("role", value)}
                                className="dark:bg-dark-900"
                            />
                            <span className={REQUIRED_ERROR}>{errors.role || ""}</span>
                        </div>

                        {/* <div className="w-full my-6">
                            <Select
                                options={Teams}
                                defaultValue={formData.team}
                                placeholder="Assign to team"
                                onChange={(value: string) => handleSelectChange("team", value)}
                                className="dark:bg-dark-900"
                            />
                            <span className={REQUIRED_ERROR}></span>
                        </div> */}

                        <div className="flex flex-wrap items-center gap-8 text-[#717171] ">
                            <div className="w-20">Verified:</div>
                            <Radio
                                id="radio3"
                                name="status"
                                value="yes"
                                checked={formData.verified === true}
                                onChange={() => handleVerifiedChange("yes")}
                                label="Yes"
                            />
                            <Radio
                                id="radio4"
                                name="status"
                                value="no"
                                checked={formData.verified === false}
                                onChange={() => handleVerifiedChange("no")}
                                label="No"
                            />
                        </div>



                        <div className="flex justify-between text-[#717171]">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="w-20">Status:</div>
                                <Radio
                                    id="radio1"
                                    name="status"
                                    value="active"
                                    checked={formData.status === true}
                                    onChange={() => handleStatusChange("active")}
                                    label="Active"
                                />
                                <Radio
                                    id="radio2"
                                    name="status"
                                    value="inactive"
                                    checked={formData.status === false}
                                    onChange={() => handleStatusChange("inactive")}
                                    label="Inactive"
                                />
                            </div>

                            {/* {type == "add" && <Checkbox
                                checked={formData.sendWelcomeEmail}
                                onChange={(val: boolean) =>
                                    setFormData((prev) => ({ ...prev, sendWelcomeEmail: val }))
                                }
                                label="Send Welcome Email"
                            />} */}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end w-full gap-3">
                    <Button size="sm" onClick={type == "add" ? handleAddUser : handleEdit}>
                        Save User
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

export default UserAddEditModal;

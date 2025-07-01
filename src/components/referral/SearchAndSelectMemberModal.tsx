"use client";
import React, { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { Users1 } from "../../icons/index";
import { FORM_INPUT_CLASS } from "@/constant/constantClassName";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { BACKEND_API } from "@/api";

interface SearchAndSelectMemberModalProps {
    isOpen: boolean;
    closeModal: () => void;
    selectedMember: any | null;
    onMemberSelect: (member: any) => void;
}

const SearchAndSelectMemberModal: React.FC<SearchAndSelectMemberModalProps> = ({ isOpen, closeModal, selectedMember, onMemberSelect }) => {
    const [memberName, setMemberName] = useState<string>("");
    const [membersList, setMembersList] = useState<any[]>([]);
    const loggedInUser = useAppSelector((state) => state.user.user);
    const dispatch = useAppDispatch();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMemberName(e.target.value);
    };

    useEffect(() => {

        const timeoutId = setTimeout(() => {
            fetchMembers();

        }, 300); // debounce

        return () => clearTimeout(timeoutId);
    }, [dispatch, memberName]);

    const fetchMembers = async () => {

        if (!memberName.trim()) {
            setMembersList([]);
            return;
        }

        const token = loggedInUser?.token;

        try {

            const response = await axios.get(`${BACKEND_API}team/members?name=${memberName.trim()}&limit=10`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'ngrok-skip-browser-warning': 'true',
                    },
                }
            );
            setMembersList(response?.data?.data || []);

        } catch (error: any) {

            console.log("error while fetching members", error)

        } finally {

        }
    };



    const clear = () => {
        setMemberName("");
        setMembersList([]);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                closeModal();
                clear();
            }}
            className="max-w-[800px] p-6 pt-10 lg:p-10 ">
            <div>
                <div className="flex items-center ">
                    <span className="bg-primary p-1 sm:p-2 flex justify-center items-center rounded-full">
                        <Users1 />
                    </span>
                    <div className="ml-4 w-4/5">
                        <h5 className="font-semibold text-gray-800 text-xl sm:text-3xl dark:text-white/90">
                            Select Member
                        </h5>
                    </div>
                </div>

                <div className="">
                    <div className="w-full my-6 relative">
                        <input
                            type="text"
                            name="name"
                            placeholder="Search member by name"
                            value={memberName}
                            onChange={handleInputChange}
                            className={FORM_INPUT_CLASS}
                        />
                        <span className="text-[#717171]">
                            {memberName.trim().length > 0 && membersList.length === 0 ? "No result found" : ""}
                        </span>

                        {/* Dropdown list */}
                        {membersList.length > 0 && (
                            <ul className=" w-full bg-white border border-gray-200 rounded-md shadow-md mt-1 max-h-60 overflow-y-auto">
                                {membersList.map((member) => (
                                    <li
                                        key={member.id}
                                        onClick={() => {

                                            onMemberSelect(member);
                                            setMemberName("");
                                            setMembersList([]);
                                            closeModal();

                                        }}
                                        className="p-2 cursor-pointer hover:bg-gray-100"
                                    >
                                        {
                                            `${member?.user?.firstName || ""} ${member?.user?.lastName} (${member?.user?.role}) `
                                        }

                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                {/* Selected user card */}
                {selectedMember && (
                    <div className="px-4 py-2 border rounded-md bg-gray-50 flex justify-between gap-2 items-center mb-4">
                        <div>
                            <p className="font-semibold">{selectedMember?.user?.firstName} {selectedMember?.user?.lastName}</p>
                            <p className="text-sm text-gray-500">{selectedMember?.user?.role}</p>
                        </div>
                        <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => onMemberSelect(null)}
                        >
                            <RxCross2 className="h-6 w-6" />

                        </button>
                    </div>
                )}
                <div className="flex items-center justify-end w-full gap-3 mt-4">

                    <Button size="sm" variant="outline" onClick={() => {
                        closeModal();
                        clear();
                    }}>
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default SearchAndSelectMemberModal;

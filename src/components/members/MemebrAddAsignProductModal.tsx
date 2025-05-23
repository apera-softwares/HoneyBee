"use client";
import React, { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { Users1 } from "../../icons";
import {
    FORM_INPUT_CLASS,
    REQUIRED_ERROR,
} from "@/constant/constantClassName";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import {
    fetchTeams,
    fetchTeamMembers,
} from "@/lib/redux/slices/teamManagementSlice";
import { fetchProductCatalogs } from "@/lib/redux/slices/productCatalogSlice";
import { createMember } from "@/lib/redux/slices/membersSlice";

interface MemberAddModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

const MemberAddAssignProductModal: React.FC<MemberAddModalProps> = ({
    isOpen,
    closeModal,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [teams, setTeams] = useState<any[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<string>("");
    const [memberQuery, setMemberQuery] = useState<string>("");
    const [members, setMembers] = useState<any[]>([]);
    const [selectedMember, setSelectedMember] = useState<any | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string>("");

    console.log(selectedTeam, "selectedTeam")

    useEffect(() => {
        dispatch(fetchTeams({ page: 1, limit: 50 })).then((res: any) => {
            if (res.meta.requestStatus === "fulfilled") {
                setTeams(res.payload.data);
            }
        });
    }, [dispatch]);

    useEffect(() => {
        if (!selectedTeam || !memberQuery) {
            setMembers([]);
            return;
        }



        const timeout = setTimeout(() => {
            dispatch(
                fetchTeamMembers({
                    page: 1,
                    limit: 5,
                    id: selectedTeam,
                    search: memberQuery,
                })
            ).then((res: any) => {
                if (res.meta.requestStatus === "fulfilled") {
                    console.log(res.payload, "res.payload")
                    setMembers(res.payload.data || []);
                }
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [selectedTeam, memberQuery, dispatch]);

    useEffect(() => {
        dispatch(
            fetchProductCatalogs({ page: 1, limit: 50, searchQuery: "" })
        ).then((res: any) => {
            if (res.meta.requestStatus === "fulfilled") {
                setProducts(res.payload.data || []);
            }
        });
    }, [dispatch]);

    const handleAssign = () => {
        if (!selectedMember || !selectedProduct) {
            toast.error("Please select both a team member and a product.");
            return;
        }

        dispatch(
            createMember({
                userId: selectedMember.id,
                productId: selectedProduct,
            })
        ).then((res: any) => {
            if (res.meta.requestStatus === "fulfilled") {
                toast.success("Product assigned to member successfully.");
                clear();
                closeModal();
            } else {
                toast.error("Failed to assign product.");
            }
        });
    };

    const clear = () => {
        setSelectedTeam("");
        setMemberQuery("");
        setSelectedMember(null);
        setSelectedProduct("");
        setMembers([]);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                closeModal();
                clear();
            }}
            className="max-w-[700px] p-5 lg:p-10"
        >
            <div>
                <div className="flex items-center mb-6">
                    <span className="bg-amber-500 p-2 rounded-full">
                        <Users1 />
                    </span>
                    <h5 className="ml-4 font-semibold text-gray-800 dark:text-white/90">
                        Assign Product to Team Member
                    </h5>
                </div>

                {/* Team selection */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Select Team</label>
                    <select
                        className={FORM_INPUT_CLASS}
                        value={selectedTeam}
                        onChange={(e) => {
                            setSelectedTeam(e.target.value);
                            setSelectedMember(null);
                            setMemberQuery("");
                        }}
                    >
                        <option value="">-- Select Team --</option>
                        {teams.map((team) => (
                            <option key={team.id} value={team.id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Member search */}
                {selectedTeam && (
                    <div className="mb-4 relative">
                        <label className="block font-medium mb-1">
                            Search Team Member
                        </label>
                        <input
                            type="text"
                            placeholder="Enter member name"
                            className={FORM_INPUT_CLASS}
                            value={memberQuery}
                            onChange={(e) => setMemberQuery(e.target.value)}
                        />
                        {members.length > 0 && !selectedMember && (
                            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow max-h-60 overflow-auto">
                                {members.map((member) => (
                                    <li
                                        key={member.id}
                                        onClick={() => {
                                            setSelectedMember(member);
                                            setMemberQuery("");
                                            setMembers([]);
                                        }}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {member.user.firstName} {member.user.lastName} ({member.user.email})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* Selected member display */}
                {selectedMember && (
                    <div className="p-4 border rounded-md bg-gray-50 flex justify-between items-center mb-4">
                        <div>
                            <p className="font-semibold">
                                {selectedMember.firstName} {selectedMember.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{selectedMember.user.firstName}</p>
                            <p className="text-sm text-gray-500">{selectedMember.user.email}</p>
                            <p className="text-sm text-gray-500">{selectedMember.user.role}</p>
                        </div>
                        <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => setSelectedMember(null)}
                        >
                            <RxCross2 className="h-6 w-6" />
                        </button>
                    </div>
                )}

                {/* Product selection */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Select Product</label>
                    <select
                        className={FORM_INPUT_CLASS}
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                        <option value="">-- Select Product --</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end gap-3">
                    <Button size="sm" onClick={handleAssign}>
                        Assign
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            closeModal();
                            clear();
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default MemberAddAssignProductModal;

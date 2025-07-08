"use client";
import React from "react";
import Image from "next/image";

interface LeadCardProps {
    title: string;
    value: any;
    point: string;
    active: boolean;
    onClick?: () => void;
    from?: string
}

const LeadCard: React.FC<LeadCardProps> = ({ title, value, point, active, onClick, from }) => {
    return (
        <div
            className={`relative overflow-hidden max-w-6xl rounded-3xl shadow-md w-full cursor-pointer transition-transform transform hover:scale-[1.01] ${active
                ? "bg-gradient-to-br from-orange-500 to-amber-400 shadow-[0px_28px_44.8px_0px_rgba(255,148,16,0.34)] text-white"
                : "bg-white text-gray-800"
                }`}
            onClick={onClick}
        >
            {active && (
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/common-images/grid.png"
                        alt="bg-image"
                        fill
                        className="object-cover object-center rounded-3xl"
                    />
                </div>
            )}
            <div className={`relative z-10 w-full flex flex-col justify-center border-b ${from ? "p-2 pl-4 pt-4" : "p-4 pl-6 pt-8"}`}>
                <h1 className={`${from ? "text-xl mb-1" : "text-3xl mb-4"} font-bold`}>{value}</h1>
                <h2 className={`font-bold ${from ? "text-md mb-2" : "text-xl mb-4"}`}>{title}</h2>
            </div>
            <div className={`p-4 pl-6 text-sm font-medium ${active ? "" : "text-[#B1B1B1]"}`}>
                {point}
            </div>
        </div>
    );
};

export default LeadCard;

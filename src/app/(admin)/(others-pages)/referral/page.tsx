import CommonHeading from "@/components/common/CommonHeading";
import ReferralFromSection from "@/components/ReferralFromSection";
import ServiceCard from "@/components/ServiceCard";
import { SERVICES } from "@/data/services";
import React from "react";


export default function Referral() {
    return (
        <div className="w-full">
            <div className="flex flex-col lg:flex-row items-start justify-between lg:items-center gap-4 mb-8 ">
                {/* Left: Heading */}
                <div className=" w-auto">
                    <CommonHeading
                        pageTitle="Catherine Chen "
                    description="Check out my top picks and refer someone who needs them!"
                    />
                </div>
                </div>
            <div className=" overflow-x-auto  no-scrollbar ">
                          <div className=" max-w-[900px] flex space-x-5 ">
                {SERVICES && SERVICES?.length > 0 ? (
                    SERVICES?.map((serviceItems: any) => (
                        <ServiceCard
                            key={serviceItems?.id}
                            title={serviceItems?.title}
                            points={serviceItems?.servicesPoints}
                            images={serviceItems?.images}
                        />
                    ))
                ) : (
                    <div></div>
                )}
            </div>
            </div>

            <div className=" mt-10">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-white/90"
                    x-text="pageName">
                    Referral Submission Form
                </h1>

            </div>
            <ReferralFromSection />

        </div>
    );
}

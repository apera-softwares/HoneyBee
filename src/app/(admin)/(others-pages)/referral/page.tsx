import CommonHeading from "@/components/common/CommonHeading";
import ReferralFromSection from "@/components/ReferralFromSection";
import ServiceCard from "@/components/ServiceCard";
import { SERVICES } from "@/data/services";
import React from "react";


export default function BlankPage() {
    return (
        <div>
               <div className="flex flex-col lg:flex-row items-start justify-between lg:items-center gap-4">
                {/* Left: Heading */}
                <div className=" w-auto">
                    <CommonHeading
                        pageTitle="Catherine Chen "
                    description="Check out my top picks and refer someone who needs them!"
                    />
                </div>
                </div>
            <div className="w-full max-w-[1500px] grid grid-cols-1  lg:grid-cols-3 justify-center gap-10  lg:gap-6 my-4">
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

            <div className="mb-4 mt-10">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-white/90"
                    x-text="pageName">
                    Referral Submission Form
                </h1>

            </div>
            <ReferralFromSection />

        </div>
    );
}

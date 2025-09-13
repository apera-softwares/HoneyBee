"use client";
import React from "react";
import { IoWarningOutline } from "react-icons/io5";

const NoProductSelectedWarningCard = () => {
  return (
    <div className="w-full flex items-center flex-wrap border px-4 py-3 rounded-md">
      <p className=" inline-flex items-center gap-2">
        {" "}
        <IoWarningOutline className="shrink-0" /> No product selected. Please
        select a product to start referring
      </p>
    </div>
  );
};

export default NoProductSelectedWarningCard;

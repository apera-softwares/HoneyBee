"use client";
import React from "react";


interface ButtonLoaderProps {
size?: "sm" | "md" | "lg";
color?: string;
}


const sizeClasses: Record<string, string> = {
sm: "w-3 h-3 border-2",
md: "w-4 h-4 border-2",
lg: "w-5 h-5 border-2",
};


const ButtonLoader: React.FC<ButtonLoaderProps> = ({ size = "md", color = "text-white" }) => {
return (
<div
className={` shrink-0 animate-spin rounded-full border-t-transparent border-solid border- ${sizeClasses[size]} ${color}`}
/>
);
};


export default ButtonLoader;
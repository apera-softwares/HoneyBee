// components/ui/Spinner.tsx
import React from "react";

const Spinner = () => {
    return (
        <div className="flex justify-center items-center py-10">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );
};

export default Spinner;

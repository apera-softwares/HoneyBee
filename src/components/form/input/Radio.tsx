import React from "react";

interface RadioProps {
  id: string; // Unique ID for the radio button
  name: string; // Radio group name
  value: any; // Value of the radio button
  checked: boolean; // Whether the radio button is checked
  label: string; // Label for the radio button
  onChange: (value: string) => void; // Handler for value change
  className?: string; // Optional additional classes
  disabled?: boolean; // Optional disabled state for the radio button
}

const Radio: React.FC<RadioProps> = ({
  id,
  name,
  value,
  checked,
  label,
  onChange,
  className = "",
  disabled = false,
}) => {
  return (
    <label
      htmlFor={id}
      className={`relative flex cursor-pointer  select-none items-center gap-3 text-sm font-medium ${disabled
          ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
          : "text-[#717171] dark:text-gray-400"
        } ${className}`}
    >
      <input
        id={id}
        name={name}
        type="radio"
        value={value}
        checked={checked}
        onChange={() => !disabled && onChange(value)} // Prevent onChange when disabled
        className="sr-only"
        disabled={disabled} // Disable input
      />
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full border-[1.25px] ${checked
            ? "border-primary bg-primary  "
            : "bg-transparent border-gray-300 dark:border-gray-700"
          } ${disabled
            ? "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-700"
            : ""
          }`}
      >
      </span>
      {label}
    </label>
  );
};

export default Radio;

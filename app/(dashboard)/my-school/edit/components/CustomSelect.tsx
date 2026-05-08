"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";

type Option = {
  value: string | number;
  label: string;
};

type CustomSelectProps = {
  value: string | number | "";
  options: Option[];
  onChange: (value: string | number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export default function CustomSelect({
  value,
  options,
  onChange,
  placeholder = "Select an option",
  className = "",
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string | number) => {
    if (disabled) return;
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative  rounded-lg ${className}`.trim()} ref={dropdownRef}>
      <Button
        type="button"
        onClick={() => {
          if (disabled) return;
          setIsOpen(!isOpen);
        }}
        variant="outlined"
        rounded="lg"
        borderColor="none"
        hoverBgColor="none"
        className={`w-full py-2.5 text-sm px-3 !justify-between !bg-inherit ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        <span className={`text-left flex-1 ${selectedOption ? "text-custom-gray/95" : "text-custom-gray/50"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`text-custom-gray/60 transition-transform shrink-0 ${
            isOpen ? "transform rotate-180" : ""
          }`}
          size={18}
        />
      </Button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 border border-custom-gray/20 rounded-lg shadow-lg max-h-60 overflow-auto hide-scrollbar bg-custom-white">
          {options.map((option) => (
            <Button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              variant="ghosted"
              hoverBgColor="none"
              textColor={value === option.value ? "text-custom-teal" : "text-custom-gray/95"}
              bgColor={value === option.value ? "bg-custom-teal/10" : undefined}
              className={`w-full !justify-start text-left px-3 py-2.5 ${
                value === option.value ? "font-medium" : ""
              }`}
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}


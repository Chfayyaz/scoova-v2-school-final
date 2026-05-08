"use client";

import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";

const ChevronDownIcon = ({ open }: { open: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-custom-gray/60 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
    aria-hidden
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

type SelectInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  error?: string;
};

export default function SelectInput({
  label,
  value,
  onChange,
  options,
  placeholder = "Select",
  required = false,
  error,
}: SelectInputProps) {
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

  const selectedOption = value
    ? options.find((option) => option === value)
    : null;

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-custom-gray/95 mb-2">
        {label}
        {required && <span className="text-custom-purple/80 ml-1">*</span>}
      </label>
      <div className="relative" ref={dropdownRef}>
        <Button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          variant="outlined"
          rounded="lg"
          borderColor={error ? "border-red-500" : "border-custom-gray/10"}
          bgColor="bg-custom-white"
          textColor={!selectedOption ? "text-custom-gray/60" : "text-custom-gray/95"}
          hoverBgColor="hover:border-custom-gray/20"
          className="w-full px-4 py-2.5 !justify-between !border"
        >
          <span className={`flex-1 text-left ${!selectedOption ? "text-custom-gray/60" : ""}`}>
            {selectedOption || placeholder}
          </span>
          <span className="ml-2 flex items-center justify-center w-5 h-5 shrink-0">
            <ChevronDownIcon open={isOpen} />
          </span>
        </Button>

        {isOpen && (
          <div className="absolute hide-scrollbar z-50 w-full mt-1 bg-custom-white  border border-custom-gray/10 px-2 pt-2 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <Button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                variant="ghosted"
                hoverBgColor="hover:bg-custom-gray/5"
                textColor={value === option ? "text-custom-teal" : "text-custom-gray/95"}
                bgColor={value === option ? "bg-custom-teal/10" : undefined}
                className="w-full !justify-start px-4 py-2.5 text-left text-sm first:rounded-t-lg last:rounded-b-lg"
              >
                {option}
              </Button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

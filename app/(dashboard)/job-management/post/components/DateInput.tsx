"use client";

import { useRef } from "react";
import { Calendar } from "lucide-react"; // ya apna custom SVG component use kar sakte ho
import Button from "@/components/ui/Button";


type DateInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
};

export const CalendarIcon = () => (
  <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.75 2.25V0.75M15.75 2.25V0.75" stroke="#555555" stroke-width="1.5" stroke-linecap="round"/>
<path d="M7.75 12.75L9.25 11.25V15.25" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20.25 7.25H9.5M0.75 7.25H4.625M11.75 14.25V12.25C11.75 11.9848 11.8554 11.7304 12.0429 11.5429C12.2304 11.3554 12.4848 11.25 12.75 11.25C13.0152 11.25 13.2696 11.3554 13.4571 11.5429C13.6446 11.7304 13.75 11.9848 13.75 12.25V14.25C13.75 14.5152 13.6446 14.7696 13.4571 14.9571C13.2696 15.1446 13.0152 15.25 12.75 15.25C12.4848 15.25 12.2304 15.1446 12.0429 14.9571C11.8554 14.7696 11.75 14.5152 11.75 14.25Z" stroke="#555555" stroke-width="1.5" stroke-linecap="round"/>
<path d="M12.75 20.25H8.75C4.979 20.25 3.093 20.25 1.922 19.078C0.751 17.906 0.75 16.021 0.75 12.25V10.25C0.75 6.479 0.75 4.593 1.922 3.422C3.094 2.251 4.979 2.25 8.75 2.25H12.75C16.521 2.25 18.407 2.25 19.578 3.422C20.749 4.594 20.75 6.479 20.75 10.25V12.25C20.75 16.021 20.75 17.907 19.578 19.078C18.925 19.732 18.05 20.021 16.75 20.148" stroke="#555555" stroke-width="1.5" stroke-linecap="round"/>
</svg>

)
export default function DateInput({
  label,
  value,
  onChange,
  required = false,
  error,
}: DateInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mb-6">
      {/* Label */}
      <label className="block text-sm font-medium text-custom-gray/95 mb-2">
        {label}
        {required && <span className="text-custom-purple/80 ml-1">*</span>}
      </label>

      {/* Input wrapper */}
      <div className="relative">
  <input
    type="date"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    ref={inputRef}
    className={`w-full px-4 py-2.5 rounded-lg border bg-transparent text-custom-gray/95 focus:outline-none focus:border-custom-teal cursor-pointer hover:border-custom-gray/20 pr-10 appearance-none [&::-webkit-calendar-picker-indicator]:hidden ${error ? "border-red-500" : "border-custom-gray/10"}`}
  />
  <Button
  bgColor="none"
  hoverBgColor="none"
  textColor="text-custom-gray/60"
    type="button"
    onClick={() => inputRef.current?.showPicker?.()}
    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-custom-gray/60 hover:text-custom-gray/80"
  >
    <CalendarIcon/>
  </Button>
</div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

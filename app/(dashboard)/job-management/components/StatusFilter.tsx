"use client";

import { ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";
import { statusOptions } from "../data";
import Button from "@/components/ui/Button";

export interface JobTypeOption {
  id: string;
  name: string;
}

type StatusFilterProps = {
  onFilterChange: (statusOrId: string) => void;
  /** When provided, dropdown uses these (id + name) with "All Status" first */
  options?: JobTypeOption[];
  /** Controlled selected value (job type id or "" for All Status) */
  value?: string;
};

export default function StatusFilter({ onFilterChange, options, value }: StatusFilterProps) {
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [isOpen, setIsOpen] = useState(false);

  const displayOptions = useMemo(
    () =>
      options !== undefined
        ? [{ id: "", name: "All Status" }, ...options]
        : statusOptions.map((s) => ({ id: s, name: s })),
    [options]
  );

  const displayValue =
    value !== undefined
      ? value === ""
        ? "All Status"
        : options?.find((o) => o.id === value)?.name ?? "All Status"
      : selectedStatus;

  const handleSelect = (id: string, name: string) => {
    setIsOpen(false);
    if (options === undefined) {
      setSelectedStatus(name);
      onFilterChange(name);
    } else {
      onFilterChange(id);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outlined"
        rounded="lg"
        borderColor="border-custom-gray/10"
        bgColor="bg-transparent"
        textColor="text-custom-gray/95"
        hoverTextColor="none"
        hoverBgColor="none"
        className="flex items-center gap-2 px-4 py-2.5 text-sm min-w-[150px] justify-between !border"
      >
        <span>{displayValue}</span>
        <ChevronDown
          size={16}
          className={`text-custom-gray/60 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-full bg-custom-white border border-custom-gray/20 rounded-lg shadow-lg z-20">
            {displayOptions.map((opt) => (
              <Button
                key={opt.id || "all"}
                onClick={() => handleSelect(opt.id, opt.name)}
                variant="ghosted"
                textColor={
                  (options ? value === opt.id : displayValue === opt.name)
                    ? "text-custom-teal"
                    : "text-custom-gray/95"
                }
                bgColor={
                  (options ? value === opt.id : displayValue === opt.name)
                    ? "bg-custom-teal/10"
                    : undefined
                }
                className="w-full !justify-start text-left px-4 py-2 first:rounded-t-lg last:rounded-b-lg hover:bg-transparent"
              >
                {opt.name}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}


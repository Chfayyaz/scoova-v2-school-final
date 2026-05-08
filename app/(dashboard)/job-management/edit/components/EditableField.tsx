"use client";

import { useState, useEffect } from "react";
import { Pencil, ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";

function toDateInputValue(value: string): string {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

function formatDateDisplay(value: string): string {
  if (!value) return value;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const d = new Date(value + "T12:00:00");
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }
  return value;
}

type EditableFieldProps = {
  label: string;
  value: string;
  onSave: (value: string) => void;
  type?: "text" | "select" | "date";
  options?: string[];
  showEditIcon?: boolean;
  error?: string;
};

export default function EditableField({
  label,
  value,
  onSave,
  type = "text",
  options,
  showEditIcon = true,
  error,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  useEffect(() => {
    setEditedValue(type === "date" ? toDateInputValue(value) : value);
  }, [value, type]);

  const handleSave = () => {
    onSave(editedValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedValue(value);
    setIsEditing(false);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-custom-gray/95 mb-2">
        {label}
      </label>
      {isEditing ? (
        <div className="space-y-2">
          {type === "date" ? (
            <input
              type="date"
              value={editedValue || toDateInputValue(value)}
              onChange={(e) => setEditedValue(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-custom-gray/10  text-custom-gray/95 focus:outline-none focus:border-custom-teal"
            />
          ) : type === "select" && options ? (
            <select
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-custom-gray/10  text-custom-gray/95 focus:outline-none focus:border-custom-teal appearance-none"
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-custom-gray/10  text-custom-gray/95 focus:outline-none focus:border-custom-teal"
            />
          )}
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              variant="filled"
              rounded="lg"
              bgColor="bg-custom-teal"
              hoverBgColor="hover:bg-custom-teal/90"
              textColor="text-custom-white"
              className="px-4 py-2 text-sm"
            >
              Save
            </Button>
            <Button
              onClick={handleCancel}
              variant="outlined"
              rounded="lg"
              borderColor="border-custom-gray/10"
              textColor="text-custom-gray/95"
            
              className="px-4 py-2 text-sm"
            >
              Cancel
            </Button>
          </div>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      ) : (
        <div className="relative">
          {type === "select" && options ? (
            <div
              className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-custom-gray/10  cursor-pointer"
              onClick={showEditIcon ? undefined : () => setIsEditing(true)}
            >
              <span className="text-sm text-custom-gray/95">{value}</span>
              <div className="flex items-center gap-2">
                <ChevronDown size={16} className="text-custom-gray/60" />
                {showEditIcon && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    variant="ghosted"
                    hoverBgColor="hover:bg-custom-gray/5"
                    className="p-1 w-auto h-auto"
                  >
                    <Pencil size={14} className="text-custom-gray/60" />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-custom-gray/10">
              <span className="text-sm text-custom-gray/95">{type === "date" ? formatDateDisplay(value) : value}</span>
              {showEditIcon && (
                <Button
                  type="button"
                  variant="ghosted"
                  rounded="md"
                  bgColor="bg-transparent"
                  hoverBgColor="none"
                  onClick={() => setIsEditing(true)}
                  className="p-1 w-auto h-auto min-w-0"
                >
                  <Pencil size={14} className="text-custom-gray/60" />
                </Button>
              )}
            </div>
          )}
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      )}
    </div>
  );
}


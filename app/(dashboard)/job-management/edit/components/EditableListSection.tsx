"use client";

import { useState, useEffect } from "react";
import { Pencil, X } from "lucide-react";
import Button from "@/components/ui/Button";

type EditableListSectionProps = {
  title: string;
  items: string[];
  onSave: (items: string[]) => void;
  error?: string;
};

export default function EditableListSection({
  title,
  items,
  onSave,
  error,
}: EditableListSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItems, setEditedItems] = useState(items);

  useEffect(() => {
    setEditedItems(items);
  }, [items]);

  const handleSave = () => {
    onSave(editedItems);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedItems(items);
    setIsEditing(false);
  };

  const handleAddItem = () => {
    setEditedItems([...editedItems, ""]);
  };

  const handleRemoveItem = (index: number) => {
    setEditedItems(editedItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...editedItems];
    newItems[index] = value;
    setEditedItems(newItems);
  };

  return (
    <div className="mb-6  rounded-lg border border-custom-gray/10 shadow-sm p-6 relative">
      <h3 className="text-2xl font-bold text-custom-gray/95 mb-3">{title}</h3>

      {isEditing ? (
        <div className="space-y-3">
          {editedItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-custom-gray/60">•</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 rounded-border  border-custom-gray/10 bg-custom-white text-custom-gray/95 focus:outline-none focus:border-custom-teal"
                />
              </div>
              <Button
                onClick={() => handleRemoveItem(index)}
                variant="ghosted"
                hoverBgColor="hover:bg-custom-gray/5"
                rounded="lg"
                className="p-1.5 w-auto h-auto"
              >
                <X size={16} className="text-custom-gray/60" />
              </Button>
            </div>
          ))}
          <Button
            onClick={handleAddItem}
            variant="ghosted"
            textColor="text-custom-teal"
            hoverTextColor="hover:text-custom-teal/80"
            className="text-sm p-0 h-auto"
          >
            + Add requirement
          </Button>
          <div className="flex gap-2 pt-2">
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
              hoverBgColor="hover:bg-custom-gray/5"
              className="px-4 py-2 text-sm"
            >
              Cancel
            </Button>
          </div>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      ) : (
        <div className="relative">
          <ul className="space-y-2 pr-8">
            {items.map((item, index) => (
              <li key={index} className="text-base text-custom-gray/80 flex items-center gap-2">
                <span className="text-custom-gray/60">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Button
            onClick={() => setIsEditing(true)}
            variant="ghosted"
            hoverBgColor="hover:bg-custom-gray/5"
            className="absolute bottom-0 right-0 p-1 w-auto h-auto"
          >
            <Pencil size={14} className="text-custom-gray/60" />
          </Button>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      )}
    </div>
  );
}


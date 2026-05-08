"use client";

import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import Button from "@/components/ui/Button";

type EditableSectionProps = {
  title: string;
  content: string;
  onSave: (content: string) => void;
  multiline?: boolean;
  error?: string;
};

export default function EditableSection({
  title,
  content,
  onSave,
  multiline = false,
  error,
}: EditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const handleSave = () => {
    onSave(editedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  return (
    <div className="mb-6  rounded-lg border border-custom-gray/10 shadow-sm p-6 relative">
      <h3 className="text-2xl font-bold text-custom-gray/95 mb-3">{title}</h3>

      {isEditing ? (
        <div className="space-y-2">
          {multiline ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full px-4 py-3  rounded-lg border border-custom-gray/10 bg-custom-white text-custom-gray/95 focus:outline-none focus:border-custom-teal resize-none"
              rows={6}
            />
          ) : (
            <input
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-custom-gray/10 bg-custom-white text-custom-gray/95 focus:outline-none focus:border-custom-teal"
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
          <p className="text-base text-custom-gray/80 leading-relaxed whitespace-pre-wrap pr-8">
            {content}
          </p>
          <Button
            onClick={() => setIsEditing(true)}
            variant="ghosted"
            hoverBgColor="hover:bg-custom-gray/5"
            className="absolute bottom-0 right-0 p-1 w-auto h-auto"
          >
            <Pencil size={14} className="text-custom-gray/60" />
          </Button>
        </div>
      )}
      {error && !isEditing && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}


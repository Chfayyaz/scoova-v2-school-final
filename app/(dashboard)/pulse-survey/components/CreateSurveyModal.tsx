"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import type { CreateSurveyPayload } from "@/lib/api/survey.api";

const CATEGORIES = ["Students", "Parents", "Staff", "Alumni", "General"] as const;
const MIN_ESTIMATED = 1;
const MAX_ESTIMATED = 120;

type CreateSurveyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateSurveyPayload) => void;
  isSubmitting: boolean;
};

export default function CreateSurveyModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: CreateSurveyModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [estimatedTime, setEstimatedTime] = useState(10);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ title?: string; category?: string; estimatedTime?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!category.trim()) newErrors.category = "Category is required.";
    const num = Number(estimatedTime);
    if (Number.isNaN(num) || num < MIN_ESTIMATED || num > MAX_ESTIMATED) {
      newErrors.estimatedTime = `Estimated time must be between ${MIN_ESTIMATED} and ${MAX_ESTIMATED} minutes.`;
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    onSubmit({
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      estimatedTime: Math.min(MAX_ESTIMATED, Math.max(MIN_ESTIMATED, num)),
    });
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setTitle("");
    setCategory("");
    setEstimatedTime(10);
    setDescription("");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto p-4">
      <div className="bg-custom-white rounded-xl shadow-lg w-full max-w-lg my-8">
        <div className="flex items-center justify-between p-6 border-b border-custom-gray/10">
          <h2 className="text-xl font-bold text-custom-gray/95">Create draft survey</h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg hover:bg-custom-gray/10 text-custom-gray/60"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-custom-gray/95 mb-1.5">Title (required)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((p) => ({ ...p, title: undefined }));
              }}
              placeholder="e.g. Annual Satisfaction Survey"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm text-custom-gray/95 focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal ${errors.title ? "border-red-500" : "border-custom-gray/20"}`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-custom-gray/95 mb-1.5">Category (required)</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (errors.category) setErrors((p) => ({ ...p, category: undefined }));
              }}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm text-custom-gray/95 focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal bg-white ${errors.category ? "border-red-500" : "border-custom-gray/20"}`}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-custom-gray/95 mb-1.5">Estimated time in minutes (required)</label>
            <input
              type="number"
              min={MIN_ESTIMATED}
              max={MAX_ESTIMATED}
              value={estimatedTime}
              onChange={(e) => {
                setEstimatedTime(Number(e.target.value) || 10);
                if (errors.estimatedTime) setErrors((p) => ({ ...p, estimatedTime: undefined }));
              }}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm text-custom-gray/95 focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal ${errors.estimatedTime ? "border-red-500" : "border-custom-gray/20"}`}
            />
            {errors.estimatedTime && <p className="text-red-500 text-xs mt-1">{errors.estimatedTime}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-custom-gray/95 mb-1.5">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief description of the survey"
              className="w-full px-3 py-2.5 border border-custom-gray/20 rounded-lg text-sm text-custom-gray/95 focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outlined"
              rounded="full"
              borderColor="border-custom-gray/20"
              textColor="text-custom-gray/95"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="filled"
              rounded="full"
              bgColor="bg-custom-teal"
              hoverBgColor="hover:bg-custom-teal/90"
              textColor="text-custom-white"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Creating…" : "Create survey"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

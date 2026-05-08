"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { SurveyDetails, SurveyCategory } from "../data";
import { CheckIcon } from "@/app/(dashboard)/pulse-survey/details/components/SurveyOverview";
import CustomSelect from "@/app/(dashboard)/my-school/edit/components/CustomSelect";

type SurveyInformationProps = {
  survey: SurveyDetails;
  onUpdate: (updatedData: Partial<SurveyDetails>) => void;
};

const categories: SurveyCategory[] = ["Students", "Parents", "Staff", "Alumni"];

const categoryOptions = categories.map((cat) => ({
  value: cat,
  label: cat,
}));

export default function SurveyInformation({
  survey,
  onUpdate,
}: SurveyInformationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: survey.title,
    category: survey.category,
    description: survey.description,
    estimatedTime: survey.estimatedTime,
  });

  const handleChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
    // In real app, this would call: await updateSurvey(survey.id, formData);
  };

  const handleCancel = () => {
    setFormData({
      title: survey.title,
      category: survey.category,
      description: survey.description,
      estimatedTime: survey.estimatedTime,
    });
    setIsEditing(false);
  };

  return (
    <div className=" rounded-lg border bg-transparent border-custom-gray/10 shadow-sm p-6">
      {/* Header: stack on mobile so Completed badge doesn't disturb title/para; side-by-side on md+ */}
      <div className="flex flex-col gap-3 mb-6 md:flex-row md:items-start md:justify-between md:gap-0">
        <div>
          <h2 className="text-lg font-bold text-custom-gray/95 mb-1">
            Survey Information
          </h2>
          <p className="text-sm text-custom-gray/60">
            Start by giving your survey a title and some context.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-custom-green/20 text-[#16A34A] rounded-full text-xs font-medium w-fit shrink-0">
          <CheckIcon/>
          Completed
        </span>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Survey Title and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-custom-gray/95 mb-2">
              Survey Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              onBlur={handleSave}
              className="w-full px-4  py-3 border bg-transparent  border-custom-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal text-sm text-custom-gray/95"
              placeholder="Enter survey title"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold  text-custom-gray/95 mb-2">
              Category
            </label>
            <CustomSelect
              value={formData.category}
              options={categoryOptions}
              onChange={(value) => {
                handleChange("category", value as SurveyCategory);
                handleSave();
              }}
              placeholder="Select category"
              className="!bg-transparent"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-custom-gray/95 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            onBlur={handleSave}
            rows={4}
            className="w-full px-4 py-2.5 border bg-transparent border-custom-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal text-sm text-custom-gray/95 resize-none "
            placeholder="Enter survey description"
          />
        </div>

        {/* Estimated Completion Time */}
        <div>
          <label className="block text-sm font-semibold text-custom-gray/95 mb-2">
            Estimated completion time (minutes)
          </label>
          <input
            type="number"
            value={formData.estimatedTime}
            onChange={(e) =>
              handleChange("estimatedTime", parseInt(e.target.value) || 0)
            }
            onBlur={handleSave}
            min="1"
            className="w-full px-4 py-2.5 border bg-transparent border-custom-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal text-sm text-custom-gray/95"
            placeholder="Enter time in minutes"
          />
        </div>
      </div>
    </div>
  );
}


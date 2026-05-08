"use client";

import { SurveyDetails } from "../data";

type SurveyInformationCardProps = {
  survey: SurveyDetails;
  onUpdate: (updatedData: Partial<SurveyDetails>) => void;
};

export default function SurveyInformationCard({
  survey,
  onUpdate,
}: SurveyInformationCardProps) {
  return (
    <div className="bg-transparent rounded-lg border border-custom-gray/10 shadow-sm p-4 sm:p-5 md:p-6 lg:p-6 overflow-hidden">
      <h2 className="text-base sm:text-lg md:text-lg lg:text-lg font-bold text-custom-gray/95 mb-1">
        Survey Information
      </h2>
      <p className="text-xs sm:text-sm md:text-sm lg:text-sm text-custom-gray/60 mb-4 sm:mb-5 md:mb-6 lg:mb-6">
        Start by giving your survey a title and some context.
      </p>

      <div className="space-y-3 sm:space-y-4 md:space-y-4 lg:space-y-4">
        {/* Survey Title and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-4 lg:gap-4">
          <div>
            <label className="block text-xs sm:text-sm md:text-sm lg:text-sm font-medium text-custom-gray/95 mb-1.5 sm:mb-2 lg:mb-2">
              Survey Title
            </label>
            <input
              type="text"
              value={survey.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="w-full px-3 sm:px-4 md:px-4 lg:px-4 py-2 border border-custom-gray/20 rounded-lg text-xs sm:text-sm md:text-sm lg:text-sm text-custom-gray/95 bg-custom-gray/5 focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal"
              placeholder="Enter survey title"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm md:text-sm lg:text-sm font-medium text-custom-gray/95 mb-1.5 sm:mb-2 lg:mb-2">
              Category
            </label>
            <input
              type="text"
              value={survey.category}
              onChange={(e) => onUpdate({ category: e.target.value as any })}
              className="w-full px-3 sm:px-4 md:px-4 lg:px-4 py-2 border border-custom-gray/20 rounded-lg text-xs sm:text-sm md:text-sm lg:text-sm text-custom-gray/95 bg-custom-gray/5 focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal"
              placeholder="Enter category"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs sm:text-sm md:text-sm lg:text-sm font-medium text-custom-gray/95 mb-1.5 sm:mb-2 lg:mb-2">
            Description
          </label>
          <textarea
            value={survey.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={4}
            className="w-full px-3 sm:px-4 md:px-4 lg:px-4 py-2 border border-custom-gray/20 rounded-lg text-xs sm:text-sm md:text-sm lg:text-sm text-custom-gray/95 bg-custom-gray/5 focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal resize-none"
            placeholder="Enter survey description"
          />
        </div>

        {/* Estimated Time */}
        <div>
          <label className="block text-xs sm:text-sm md:text-sm lg:text-sm font-medium text-custom-gray/95 mb-1.5 sm:mb-2 lg:mb-2">
            Estimated completion time (minutes)
          </label>
          <input
            type="number"
            value={survey.estimatedTime}
            onChange={(e) => onUpdate({ estimatedTime: parseInt(e.target.value) || 0 })}
            className="w-full px-3 sm:px-4 md:px-4 lg:px-4 py-2 border border-custom-gray/20 rounded-lg text-xs sm:text-sm md:text-sm lg:text-sm text-custom-gray/95 bg-custom-gray/5 focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal"
            placeholder="Enter estimated time"
            min="1"
          />
        </div>
      </div>
    </div>
  );
}

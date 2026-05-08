"use client";

import { Calendar } from "lucide-react";
import { SurveySettings } from "@/app/(dashboard)/pulse-survey/generate/ai/data";

type SurveySettingsSectionProps = {
  settings: SurveySettings;
  onUpdateSettings: (settings: Partial<SurveySettings>) => void;
};

export default function SurveySettingsSection({
  settings,
  onUpdateSettings,
}: SurveySettingsSectionProps) {
  return (
    <div className="bg-transparent border border-custom-gray/10 rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-bold text-custom-gray/95 mb-6">
        Survey Settings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column: Survey Name, Anonymity */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-custom-gray/95 mb-2">
              Survey Name
            </label>
            <input
              type="text"
              value={settings.surveyName}
              onChange={(e) => onUpdateSettings({ surveyName: e.target.value })}
              placeholder="Parent Satisfaction Survey (AI Draft)"
              className="w-full px-4 py-2 border border-custom-gray/20 rounded-lg text-sm text-custom-gray/95 bg-transparent focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-custom-gray/95 mb-2">
              Anonymity
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="anonymity"
                  checked={settings.anonymity === true}
                  onChange={() => onUpdateSettings({ anonymity: true })}
                  className="w-4 h-4 text-custom-teal border-custom-gray/30 focus:ring-custom-teal/20"
                />
                <span className="text-sm text-custom-gray/95">
                  Enable Anonymity
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="anonymity"
                  checked={settings.anonymity === false}
                  onChange={() => onUpdateSettings({ anonymity: false })}
                  className="w-4 h-4 text-custom-teal border-custom-gray/30 focus:ring-custom-teal/20"
                />
                <span className="text-sm text-custom-gray/95">
                  Disable Anonymity
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right column: Target Audience, Start Date, End Date */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-custom-gray/95 mb-2">
              Target Audience
            </label>
            <select
              value={settings.targetAudience}
              onChange={(e) =>
                onUpdateSettings({
                  targetAudience: e.target.value as SurveySettings["targetAudience"],
                })
              }
              className="w-full px-4 py-2 border border-custom-gray/20 rounded-lg text-sm text-custom-gray/95 bg-transparent focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal"
            >
              <option value="Parents">Parents</option>
              <option value="Students">Students</option>
              <option value="Staff">Staff</option>
              <option value="Alumni">Alumni</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-custom-gray/95 mb-2">
              Start Date
            </label>
            <div className="relative">
              <input
                type="text"
                value={settings.startDate}
                onChange={(e) => onUpdateSettings({ startDate: e.target.value })}
                placeholder="mm/dd/yyyy"
                className="w-full px-4 py-2 pr-10 border border-custom-gray/20 rounded-lg text-sm text-custom-gray/95 bg-transparent focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Calendar size={18} className="text-custom-gray/60" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-custom-gray/95 mb-2">
              End Date
            </label>
            <div className="relative">
              <input
                type="text"
                value={settings.endDate}
                onChange={(e) => onUpdateSettings({ endDate: e.target.value })}
                placeholder="mm/dd/yyyy"
                className="w-full px-4 py-2 pr-10 border border-custom-gray/20 rounded-lg text-sm text-custom-gray/95 bg-transparent focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Calendar size={18} className="text-custom-gray/60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

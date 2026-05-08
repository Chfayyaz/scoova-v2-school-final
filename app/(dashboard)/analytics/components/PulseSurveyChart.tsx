"use client";

import { PulseSurveyData } from "../data";
import { Check } from "lucide-react";

type PulseSurveyChartProps = {
  data: PulseSurveyData;
};

export default function PulseSurveyChart({ data }: PulseSurveyChartProps) {
  const { participationRate, satisfactionScores } = data;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (participationRate / 100) * circumference;

  return (
    <div className="w-full min-w-0 max-w-full lg:max-w-[440px] bg-custom-white rounded-lg border border-custom-gray/20 px-4 py-3 shadow-sm box-border overflow-x-auto lg:overflow-x-visible">
      <h3 className="text-[18px] font-bold text-custom-gray/95 mb-6 text-center">
        Pulse Survey Insights
      </h3>

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8 min-w-0 w-full">
        {/* Donut Chart - Left Section */}
        <div className="flex  flex-col items-center">
          <div className="relative">
            <svg width="200" height="200" className="transform -rotate-90">
              {/* Background circle (light grey) */}
              <circle
                cx="100"
                cy="100"
                r="60"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="20"
              />
              {/* Progress circle (vibrant pink) */}
              <circle
                cx="100"
                cy="100"
                r="60"
                fill="none"
                stroke="#E88AED"
                strokeWidth="20"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl  text-custom-gray/95">
                {participationRate}%
              </span>
            </div>
          </div>
          <span className="text-sm text-custom-gray/60">
            Participation Rate
          </span>
        </div>

        {/* Satisfaction Scores - Right Section */}
        <div className="flex-1 w-full lg:w-auto min-w-0">
          <h4 className="text-sm font-medium text-custom-gray/60 mb-4">
            Top Satisfaction Scores
          </h4>
          <div className="space-y-3">
            {satisfactionScores.map((score) => (
              <div
                key={score.id}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-4 h-4 rounded-full bg-custom-green flex items-center justify-center flex-shrink-0">
                    <Check
                      size={8}
                      className="text-custom-white"
                    />
                  </div>
                  <span className="text-sm text-custom-gray/95 whitespace-nowrap truncate">
                    {score.category}
                  </span>
                </div>
                <span className="text-sm font-bold text-custom-gray/95 whitespace-nowrap flex-shrink-0">
                  {score.score}/{score.maxScore}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


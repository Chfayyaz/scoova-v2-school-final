"use client";

import { ActivityItem } from "../data";
import { Star } from "lucide-react";

type SchoolActivityOverviewProps = {
  activities: ActivityItem[];
};

export default function SchoolActivityOverview({
  activities,
}: SchoolActivityOverviewProps) {
  return (
    <div className="min-w-0 max-w-full bg-custom-white rounded-lg border border-custom-gray/20 p-4 sm:p-6 shadow-sm">
      <h3 className="text-lg font-bold  mb-6">
        School Activity Overview
      </h3>

      <div className="space-y-0">
        {activities.map((activity) => (
          <div key={activity.id} className="py-2">
            <div className="flex items-start bg-custom-gray/5 rounded-lg p-3 justify-between">
              {/* Left Section - Title and Description */}
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold ">
                  {activity.title}
                </h4>
                <p className="text-sm text-custom-gray/60">
                  {activity.description}
                </p>
              </div>

              {/* Right Section - Metrics/Values */}
              <div className="flex flex-col items-end ml-4 flex-shrink-0">
                {activity.type === "job" && activity.metrics && (
                  <>
                    <span className="text-sm font-bold text-custom-gray/95">
                      {activity.metrics.views}
                    </span>
                    <span className="text-xs text-custom-gray/60 mt-0.5">
                      {activity.metrics.applications} Applications
                    </span>
                  </>
                )}

                {activity.type === "follows" && activity.followers && (
                  <span className="text-sm font-medium text-custom-green">
                    {activity.followers}
                  </span>
                )}

                {activity.type === "review" &&
                  activity.rating !== undefined && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-[#EAB308]">
                        {activity.rating}/{activity.maxRating}
                      </span>
                      <Star
                        size={16}
                        className="fill-[#EAB308] text-custom-yellow"
                      />
                    </div>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


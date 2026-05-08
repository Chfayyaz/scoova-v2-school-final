"use client";

import { ReviewStat } from "../data";
import { Star, ArrowUp, ArrowDown } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

type ReviewStatsCardsProps = {
  stats: ReviewStat[];
  isLoading?: boolean;
};

export default function ReviewStatsCards({
  stats,
  isLoading = false,
}: ReviewStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-custom-white rounded-lg px-3 sm:px-4 py-3 sm:py-3.5 shadow-[0_0_12px_2px_rgba(0,0,0,0.08)]"
          >
            <Skeleton className="h-4 w-3/4 rounded-md mb-3" />
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-10 w-20 rounded-md" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <Skeleton className="h-4 w-2/3 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-custom-white rounded-lg px-3 sm:px-4 py-3 sm:py-3.5 shadow-[0_0_12px_2px_rgba(0,0,0,0.08)]"
        >
          <p className="text-xs sm:text-base text-custom-gray/70 mb-2 sm:mb-3">{stat.title}</p>
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <h3 className="text-2xl sm:text-[44px] font-bold text-custom-gray/95">
              {stat.value}
            </h3>
            {stat.id === 1 && (
              <Star
                size={20}
                className="sm:w-6 sm:h-6 fill-custom-yellow text-custom-yellow"
              />
            )}
          </div>
          {stat.change ? (
            <div
              className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${
                stat.changeType === "positive"
                  ? "text-custom-green"
                  : "text-[#FF0000]"
              }`}
            >
              {stat.changeType === "positive" ? (
                <ArrowUp size={14} className="sm:w-4 sm:h-4" />
              ) : (
                <ArrowDown size={14} className="sm:w-4 sm:h-4" />
              )}
              <span>{stat.change}</span>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}


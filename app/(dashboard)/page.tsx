"use client";

import { useEffect, useState } from "react";
import SchoolInfoHeader from "./components/SchoolInfoHeader";
import MetricCard from "./components/MetricCard";
import ActivityList from "./components/ActivityList";
import ReviewsList from "./components/ReviewsList";
import Skeleton from "@/components/ui/Skeleton";
import {
  getSchoolAdminDashboardApi,
  mapDashboardActivities,
  mapDashboardMetrics,
  mapDashboardReviews,
  type SchoolAdminDashboardData,
} from "@/lib/api/dashboard.api";
import type { ActivityItem, MetricCard as MetricCardType, ReviewItem } from "./data";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: SchoolAdminDashboardData };

export default function DashboardPage() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    getSchoolAdminDashboardApi()
      .then((data) => {
        if (!cancelled) setState({ status: "success", data });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Failed to load dashboard.";
          setState({ status: "error", message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <div className="min-h-screen md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Skeleton className="h-36 w-full rounded-xl" />
          </div>

          <div className="mb-8">
            <Skeleton className="h-6 w-40 rounded-md mb-4" />
            <div className="grid grid-cols-1 mt-5 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="rounded-lg border border-custom-gray/10 bg-custom-white p-5 space-y-4">
              <Skeleton className="h-6 w-36 rounded-md" />
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
            <div className="rounded-lg border border-custom-gray/10 bg-custom-white p-5 space-y-4">
              <Skeleton className="h-6 w-36 rounded-md" />
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="min-h-screen md:p-6 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 text-sm font-medium mb-2">Could not load dashboard</p>
          <p className="text-custom-gray/70 text-sm">{state.message}</p>
        </div>
      </div>
    );
  }

  const { school, stats, recentActivities, recentReviews } = state.data;

  const metrics: MetricCardType[] = mapDashboardMetrics(stats);
  const activities: ActivityItem[] = mapDashboardActivities(recentActivities);
  const reviews: ReviewItem[] = mapDashboardReviews(recentReviews);

  return (
    <div className="min-h-screen md:p-6">
      <div className="max-w-7xl mx-auto">
        <SchoolInfoHeader
          name={school.name}
          location={school.location}
          principalName={school.principalName}
          profileImage={school.profileImage}
        />

        <div>
          <div>
            <h2 className="text-[20px] font-semibold mb-3 text-custom-gray/90">School Insights</h2>
          </div>
          <div className="grid grid-cols-1 mt-5 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-6">
            {metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <ActivityList activities={activities} />
          <ReviewsList reviews={reviews} />
        </div>
      </div>
    </div>
  );
}

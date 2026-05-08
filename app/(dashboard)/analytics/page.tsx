"use client";

import { useEffect, useState } from "react";
import AnalyticsMetricsCard from "./components/AnalyticsMetricsCard";
import RatingDistributionChart from "./components/RatingDistributionChart";
import PulseSurveyChart from "./components/PulseSurveyChart";
import SchoolActivityOverview from "./components/SchoolActivityOverview";
import Skeleton from "@/components/ui/Skeleton";
import {
  fetchAnalyticsDashboard,
  type AnalyticsDashboardView,
} from "@/lib/api/analytics.api";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: AnalyticsDashboardView };

function AnalyticsPageSkeleton() {
  return (
    <div className="min-h-screen" aria-busy="true" aria-label="Loading analytics">
      <div className="px-4 sm:px-6 py-1 min-w-0 max-w-full">
        <div className="mb-6 min-w-0">
          <Skeleton className="h-9 w-64 max-w-full rounded-md" />
          <Skeleton className="h-5 w-full max-w-xl mt-3 rounded-md" />
        </div>
        <div className="md:border md:border-custom-gray/20 rounded-xl md:px-3 py-5 min-w-0 max-w-full">
          <div className="bg-custom-white rounded-lg border border-custom-gray/20 mb-6 overflow-hidden min-w-0">
            <div className="flex flex-col sm:flex-row min-w-0 max-w-full p-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-1 space-y-2">
                  <Skeleton className="h-8 w-24 rounded-md" />
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-2/3 rounded-md" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 mb-6 min-w-0 max-w-full">
            <div className="w-full min-w-0 lg:flex-[63_1_0%] lg:max-w-[630px] max-w-full rounded-lg border border-custom-gray/20 p-6">
              <Skeleton className="h-6 w-48 rounded-md mb-6" />
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </div>
            <div className="w-fulal min-w-0 lg:flex-[44_1_0%] lg:max-w-[440px] max-w-full rounded-lg border border-custom-gray/20 p-4">
              <Skeleton className="h-6 w-full rounded-md mb-6" />
              <Skeleton className="h-[180px] w-full rounded-full max-w-[200px] mx-auto" />
            </div>
          </div>
          <div className="rounded-lg border border-custom-gray/20 p-6 min-w-0 max-w-full">
            <Skeleton className="h-6 w-56 rounded-md mb-6" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    fetchAnalyticsDashboard()
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Failed to load analytics.";
          setState({ status: "error", message });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return <AnalyticsPageSkeleton />;
  }

  if (state.status === "error") {
    return (
      <div className="min-h-[40vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 text-sm font-medium mb-2">Could not load analytics</p>
          <p className="text-custom-gray/70 text-sm">{state.message}</p>
        </div>
      </div>
    );
  }

  const { metrics, pulse, activities, ratingMonthly, ratingYearly } = state.data;

  return (
    <div className="min-h-screen">
      <div className="px-4 sm:px-6 py-1 min-w-0 max-w-full">
        <div className="mb-6 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#4A4A4A] mb-2">
            Analytics Overview
          </h1>
          <p className="text-base sm:text-lg text-custom-gray/80">
            Real-time insights into your school&apos;s performance
          </p>
        </div>

        <div className="md:border md:border-custom-gray/20 rounded-xl md:px-3 py-5 min-w-0 max-w-full">
          <div className="bg-custom-white rounded-lg border border-custom-gray/20 mb-6 overflow-hidden min-w-0">
            <div className="flex flex-col sm:flex-row min-w-0 max-w-full">
              {metrics.map((metric, index, array) => (
                <AnalyticsMetricsCard
                  key={metric.id}
                  metric={metric}
                  isLast={index === array.length - 1}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mb-6 min-w-0 max-w-full">
            <div className="w-full min-w-0 max-w-full lg:flex-[63_1_0%] lg:max-w-[630px]">
              <RatingDistributionChart monthlyData={ratingMonthly} yearlyData={ratingYearly} />
            </div>
            <div className="w-full min-w-0 max-w-full lg:flex-[44_1_0%] lg:max-w-[440px]">
              <PulseSurveyChart data={pulse} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0 max-w-full">
            <SchoolActivityOverview activities={activities} />
          </div>
        </div>
      </div>
    </div>
  );
}

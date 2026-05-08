"use client";

import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import SummaryCard from "./components/SummaryCard";
import LastSurveyPerformanceChart from "./components/LastSurveyPerformanceChart";
import AllSurveysTable from "./components/AllSurveysTable";
import {
  summaryCardsData,
} from "./data";
import {
  getSurveyAnalyticsDashboardApi,
  type SurveyAnalyticsDashboardData,
} from "@/lib/api/survey.api";

export default function PulseSurveyPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<SurveyAnalyticsDashboardData | null>(null);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);

  const handleCreateNewSurvey = () => {
    // No surveyId: generate page uses POST /survey/create on continue; a fake id would trigger GET/PATCH for a non-existent survey (404).
    router.push("/pulse-survey/generate");
  };

  useEffect(() => {
    let cancelled = false;
    setIsAnalyticsLoading(true);

    getSurveyAnalyticsDashboardApi()
      .then((data) => {
        if (!cancelled) setAnalytics(data);
      })
      .catch((err) => {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to load survey analytics.";
          toast.error(message);
        }
      })
      .finally(() => {
        if (!cancelled) setIsAnalyticsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const summaryCards = useMemo(() => {
    if (!analytics) return summaryCardsData;

    return summaryCardsData.map((card) => {
      if (card.id === 1) return { ...card, value: analytics.totalSurveys };
      if (card.id === 2) return { ...card, value: analytics.activeSurveys };
      if (card.id === 3) {
        return {
          ...card,
          value: `${Number(analytics.responseRateAvg ?? 0).toFixed(2)}%`,
        };
      }
      if (card.id === 4) return { ...card, value: analytics.approvedReviewsCount };
      return card;
    });
  }, [analytics]);

  const chartData = useMemo(() => {
    const weekly = analytics?.lastFinishedSurveyAnalytics?.weeklyResponseRate;
    if (!weekly || weekly.length === 0) return [];
    return weekly.map((item) => ({
      week: `Week ${item.week}`,
      rate: Number(item.responseRate ?? 0),
    }));
  }, [analytics]);

  const chartTitle = analytics?.lastFinishedSurveyAnalytics?.title || "Last Survey";

  return (
    <div className="min-h-screen  md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#4A4A4A] mb-2">
              Pulse Survey Dashboard
            </h1>
            <p className="text-base text-custom-gray/80">
              Monitor and manage all school-wide surveys from here.
            </p>
          </div>
          <Button
            variant="filled"
            rounded="full"
            onClick={handleCreateNewSurvey}
            className="flex items-center text-sm gap-2 whitespace-nowrap"
          >
            <Plus size={18} />
            Create New Survey
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="md:border md:border-custom-gray/20 md:p-6 mt-6 rounded-lg">

        <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10 mb-12">
          {summaryCards.map((card) => (
            <SummaryCard
              key={card.id}
              title={card.title}
              value={isAnalyticsLoading ? "..." : card.value}
              icon={card.icon}
              iconBgColor={card.iconBgColor}
              isLoading={isAnalyticsLoading}
            />
          ))}
        </div>

        {/* Last Survey Performance Chart */}
        <LastSurveyPerformanceChart
          data={chartData}
          surveyTitle={chartTitle}
          isLoading={isAnalyticsLoading}
        />

        {/* All Surveys Table */}
        <AllSurveysTable />
      </div>
        </div>
    </div>
  );
}

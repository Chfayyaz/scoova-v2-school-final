"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getSurveyAiTextSummaryApi,
  getSurveyAnalyticsBySurveyIdApi,
  getSurveyByIdApi,
} from "@/lib/api/survey.api";
import {
  getSurveyDetailsById,
  isStrictNumericSurveyId,
  mapCreateSurveyDataToSurveyDetails,
  mapSurveyAiTextSummaryToDetailsSlice,
  mapSurveyAnalyticsDetailToSurveyDetails,
  mapTargetGroupToAudience,
  surveyDetailsData,
  SurveyDetails,
} from "../data";
import { allSurveysData } from "../../data";
import SurveyOverview from "../components/SurveyOverview";
import ResponseRateCard from "../components/ResponseRateCard";
import ParticipationTrendCard from "../components/ParticipationTrendCard";
import ActionsCard from "../components/ActionsCard";
import AISummary from "../components/AISummary";
import SentimentDistributionCard from "../components/SentimentDistributionCard";
import QuestionBreakdown from "../components/QuestionBreakdown";
import TargetAudienceCard from "../components/TargetAudienceCard";
import SurveyDurationCard from "../components/SurveyDurationCard";
import Skeleton from "@/components/ui/Skeleton";

function SurveyDetailsPageSkeleton() {
  return (
    <div className="min-h-screen p-4 md:p-6 overflow-x-hidden" aria-busy="true" aria-label="Loading survey details">
      <div className="max-w-7xl mx-auto w-full">
        {/* Survey overview */}
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-0">
            <div className="flex-1 space-y-2 md:space-y-3">
              <Skeleton className="h-8 md:h-9 w-full max-w-xl rounded-lg" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-4 w-28 rounded-md hidden sm:block" />
                <Skeleton className="h-4 w-36 rounded-md" />
              </div>
              <Skeleton className="h-4 w-full max-w-3xl rounded-md" />
              <Skeleton className="h-4 w-full max-w-2xl rounded-md" />
            </div>
            <Skeleton className="h-8 w-24 rounded-full shrink-0" />
          </div>
        </div>

        <div className="border border-custom-gray/20 p-4 md:p-6 mt-4 md:mt-6 rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row gap-4 mb-4 md:mb-6">
            <Skeleton className="flex-1 min-h-[140px] rounded-lg" />
            <Skeleton className="flex-1 min-h-[140px] rounded-lg" />
            <Skeleton className="flex-1 min-h-[140px] rounded-lg md:max-w-[200px]" />
          </div>

          <div className="mb-4 md:mb-6 space-y-3">
            <Skeleton className="h-6 w-40 rounded-md" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[64.30%_1fr] gap-4 md:gap-6 mb-4 md:mb-6">
            <Skeleton className="min-h-[280px] w-full rounded-lg" />
            <Skeleton className="min-h-[280px] w-full rounded-lg" />
          </div>

          <div>
            <Skeleton className="h-7 w-48 rounded-md mb-3 md:mb-4" />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 md:gap-6 mb-4 md:mb-6 items-start">
              <div className="space-y-4 md:space-y-6">
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-4 md:gap-6">
                <Skeleton className="min-h-[160px] w-full rounded-lg" />
                <Skeleton className="min-h-[120px] w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SurveyDetailsPage() {
  const params = useParams();
  const [survey, setSurvey] = useState<SurveyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const surveyIdParam =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0] ?? ""
        : "";

  const [aiSlice, setAiSlice] = useState<
    Pick<SurveyDetails, "aiSummary" | "sentimentDistribution"> | null
  >(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRegenerating, setAiRegenerating] = useState(false);

  const fetchAiSummary = useCallback(async () => {
    const id = surveyIdParam?.trim();
    if (!id) return;
    const data = await getSurveyAiTextSummaryApi(id);
    setAiSlice(mapSurveyAiTextSummaryToDetailsSlice(data));
  }, [surveyIdParam]);

  useEffect(() => {
    if (!surveyIdParam?.trim()) return;
    let cancelled = false;
    setAiLoading(true);
    fetchAiSummary()
      .catch(() => {
        /* keep mock / existing survey copy */
      })
      .finally(() => {
        if (!cancelled) setAiLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [surveyIdParam, fetchAiSummary]);

  useEffect(() => {
    const idStr = surveyIdParam?.trim();
    if (!idStr) {
      setSurvey(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const numericId = isStrictNumericSurveyId(idStr) ? parseInt(idStr, 10) : NaN;
        const surveyFromTable = allSurveysData.find(
          (s) => String(s.id) === idStr || (!Number.isNaN(numericId) && s.id === numericId)
        );
        const surveyDetails = !Number.isNaN(numericId) ? getSurveyDetailsById(numericId) : null;

        let mergedSurvey: SurveyDetails | null = surveyDetails ?? null;

        if (surveyFromTable) {
          if (surveyDetails) {
            mergedSurvey = {
              ...surveyDetails,
              title: surveyFromTable.title,
              status: surveyFromTable.status,
              targetAudience: mapTargetGroupToAudience(surveyFromTable.targetGroup) as SurveyDetails["targetAudience"],
              totalRecipients: surveyFromTable.totalRecipients,
              completed: surveyFromTable.responses,
              pending: surveyFromTable.totalRecipients - surveyFromTable.responses,
              responseRate:
                surveyFromTable.totalRecipients > 0
                  ? Math.round(
                      (surveyFromTable.responses / surveyFromTable.totalRecipients) * 100
                    )
                  : surveyDetails.responseRate,
            };
          } else {
            const baseDetails = surveyDetailsData[0];
            mergedSurvey = {
              ...baseDetails,
              id: surveyFromTable.id,
              title: surveyFromTable.title,
              status: surveyFromTable.status,
              targetAudience: mapTargetGroupToAudience(surveyFromTable.targetGroup) as SurveyDetails["targetAudience"],
              totalRecipients: surveyFromTable.totalRecipients,
              completed: surveyFromTable.responses,
              pending: surveyFromTable.totalRecipients - surveyFromTable.responses,
              responseRate:
                surveyFromTable.totalRecipients > 0
                  ? Math.round(
                      (surveyFromTable.responses / surveyFromTable.totalRecipients) * 100
                    )
                  : 0,
            };
          }
        }

        if (!mergedSurvey) {
          try {
            const analytics = await getSurveyAnalyticsBySurveyIdApi(idStr);
            if (!cancelled) {
              mergedSurvey = mapSurveyAnalyticsDetailToSurveyDetails(analytics);
            }
          } catch {
            try {
              const draft = await getSurveyByIdApi(idStr);
              if (!cancelled) {
                mergedSurvey = mapCreateSurveyDataToSurveyDetails(draft);
              }
            } catch {
              if (!cancelled) mergedSurvey = null;
            }
          }
        }

        if (!cancelled) {
          setSurvey(mergedSurvey);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setSurvey(null);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [surveyIdParam]);

  if (loading) {
    return <SurveyDetailsPageSkeleton />;
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-custom-white md:p-6 flex items-center justify-center">
        <p className="text-custom-gray/80">Survey not found</p>
      </div>
    );
  }

  const handleSendReminder = () => {
    alert("Reminder sent to pending respondents.");
  };

  const handleCloseSurvey = () => {
    setSurvey((prev) => (prev ? { ...prev, status: "ended" as const } : null));
    alert("Survey has been closed.");
  };

  const handleExportData = () => {
    const csvRows = [
      ["Survey Title", survey.title],
      ["Status", survey.status],
      ["Response Rate (%)", String(survey.responseRate)],
      ["Completed", String(survey.completed)],
      ["Pending", String(survey.pending)],
      ["Total Recipients", String(survey.totalRecipients)],
    ];
    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${survey.title.replace(/\s+/g, "-")}-export.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRegenerateAI = async () => {
    const id = surveyIdParam?.trim();
    if (!id) return;
    setAiRegenerating(true);
    try {
      await fetchAiSummary();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not refresh AI summary.", {
        id: "survey-ai-summary-refresh",
      });
    } finally {
      setAiRegenerating(false);
    }
  };

  const sent =
    survey.recipientsSent ?? Math.max(0, survey.totalRecipients - survey.pending);

  const displayAiSummary = aiSlice?.aiSummary ?? survey.aiSummary;
  const displaySentiment = aiSlice?.sentimentDistribution ?? survey.sentimentDistribution;

  return (
    <div className="min-h-screen  p-4 md:p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* Survey Overview */}
        <SurveyOverview
          title={survey.title}
          createdOn={survey.createdOn}
          lastUpdated={survey.lastUpdated}
          description={survey.description}
          status={survey.status}
        />

        {/* Response Rate, Participation Trend, and Actions Row */}
        <div className="border border-custom-gray/20 p-4 md:p-6 mt-4 md:mt-6 rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row gap-4 mb-4 md:mb-6">
            <ResponseRateCard
              responseRate={survey.responseRate}
              completed={survey.completed}
              pending={survey.pending}
            />
            <ParticipationTrendCard data={survey.participationTrend} />
            <ActionsCard
              onSendReminder={handleSendReminder}
              onCloseSurvey={handleCloseSurvey}
              onExportData={handleExportData}
            />
          </div>

          {/* AI Summary */}
          <div className="mb-4 md:mb-6">
            <AISummary
              summary={displayAiSummary.text}
              keyFindings={displayAiSummary.keyFindings}
              loading={aiLoading && !aiSlice}
              regenerating={aiRegenerating}
              onRegenerate={handleRegenerateAI}
            />
          </div>

          {/* Sentiment Distribution, Target Audience, and Survey Duration Row */}
          <div className="flex flex-col lg:flex-row gap-4 md:gap-6 mb-4 md:mb-6">
            <div className="flex-1 min-w-0">
              <SentimentDistributionCard data={displaySentiment} />
            </div>
            <div className="flex-1 min-w-0">
              <TargetAudienceCard
                targetAudience={survey.targetAudience}
                totalRecipients={survey.totalRecipients}
                sent={sent}
                pending={survey.pending}
              />
            </div>
            <div className="flex-1 min-w-0">
              <SurveyDurationCard
                startDate={survey.startDate}
                endDate={survey.endDate}
                timeRemaining={undefined}
              />
            </div>
          </div>

          {/* Question Breakdown */}
          <div>
            {/* Question Breakdown Title */}
            <h2 className="text-lg md:text-[20px] font-bold text-custom-gray/95 mb-3 md:mb-4">
              Question Breakdown
            </h2>

            <div className="mb-4 md:mb-6">
              {survey.questionBreakdown.map((question, index) => (
                <QuestionBreakdown
                  key={question.id}
                  question={question}
                  questionNumber={index + 1}
                  showTitle={false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


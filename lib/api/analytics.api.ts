import apiClient from "./axios";
import type {
  ActivityItem,
  MetricCard,
  PulseSurveyData,
  RatingDataPoint,
} from "@/app/(dashboard)/analytics/data";

// --- Raw API types ---

export type SchoolAnalyticsDto = {
  totalApprovedReviews: number;
  averageSchoolRating: number;
  totalFollowers: number;
  totalJobApplications: number;
};

export type TopSatisfactionScoreDto = {
  category?: string;
  name?: string;
  label?: string;
  score?: number;
  rating?: number;
  maxScore?: number;
};

export type SurveyInsightsDto = {
  participationRate: number;
  topSatisfactionScores: TopSatisfactionScoreDto[];
};

export type RecentActivityDto = {
  _id: string;
  type: string;
  description: string;
  metadata?: Record<string, unknown>;
  isRead?: boolean;
  createdAt: string;
};

export type AnalyticsInsightsData = {
  schoolAnalytics: SchoolAnalyticsDto;
  surveyInsights: SurveyInsightsDto;
  recentActivities: RecentActivityDto[];
};

type AnalyticsInsightsResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: AnalyticsInsightsData;
};

export type RatingDistributionFilter = "month" | "year";

export type ReviewCountByPeriodDto = {
  period: string;
  count: number;
};

export type RatingDistributionData = {
  filter: string;
  reviewsCountByPeriod: ReviewCountByPeriodDto[];
};

type RatingDistributionResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: RatingDistributionData;
};

export type AnalyticsDashboardView = {
  metrics: MetricCard[];
  pulse: PulseSurveyData;
  activities: ActivityItem[];
  ratingMonthly: RatingDataPoint[];
  ratingYearly: RatingDataPoint[];
};

const EMPTY_TREND: MetricCard["trend"] = {
  value: "",
  change: "",
  type: "positive",
};

function formatCount(value: number): string {
  return Number.isFinite(value) ? value.toLocaleString() : "0";
}

function formatAverageRating(value: number): string {
  if (!Number.isFinite(value) || value === 0) return "0";
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

/** Map school analytics to the four metric cards (ids aligned with static layout; id 4 is omitted on the page). */
export function mapSchoolAnalyticsToMetricCards(
  school: SchoolAnalyticsDto
): MetricCard[] {
  return [
    {
      id: 1,
      value: formatCount(school.totalApprovedReviews),
      title: "Total Reviews Received",
      trend: EMPTY_TREND,
      icon: "/images/svg/bluetext.svg",
    },
    {
      id: 2,
      value: `${formatAverageRating(school.averageSchoolRating)}/10`,
      title: "Average School Rating",
      trend: EMPTY_TREND,
      icon: "/images/svg/greenstar.svg",
    },
    {
      id: 3,
      value: formatCount(school.totalFollowers),
      title: "New Followers",
      trend: EMPTY_TREND,
      icon: "/images/svg/purpleperson.svg",
    },
    {
      id: 5,
      value: formatCount(school.totalJobApplications),
      title: "Job Applications",
      trend: EMPTY_TREND,
      icon: "/images/svg/yellowcalander.svg",
    },
  ];
}

function pickScore(row: TopSatisfactionScoreDto): number {
  if (typeof row.score === "number" && Number.isFinite(row.score)) return row.score;
  if (typeof row.rating === "number" && Number.isFinite(row.rating)) return row.rating;
  return 0;
}

function pickCategory(row: TopSatisfactionScoreDto): string {
  const c = row.category ?? row.name ?? row.label;
  return typeof c === "string" && c.trim() ? c.trim() : "—";
}

export function mapSurveyInsightsToPulseData(insights: SurveyInsightsDto): PulseSurveyData {
  const raw = Array.isArray(insights.topSatisfactionScores)
    ? insights.topSatisfactionScores
    : [];
  const participationRate = Number.isFinite(insights.participationRate)
    ? Math.max(0, Math.min(100, Math.round(insights.participationRate)))
    : 0;

  return {
    participationRate,
    satisfactionScores: raw.map((row, index) => ({
      id: index + 1,
      category: pickCategory(row),
      score: pickScore(row),
      maxScore:
        typeof row.maxScore === "number" && Number.isFinite(row.maxScore) ? row.maxScore : 5,
    })),
  };
}

function formatMonthPeriodLabel(period: string): string {
  const trimmed = period.trim();
  const ym = /^(\d{4})-(\d{2})(?:-\d{2})?/.exec(trimmed);
  if (ym) {
    const y = Number(ym[1]);
    const m = Number(ym[2]) - 1;
    if (m >= 0 && m <= 11) {
      return new Date(y, m, 1).toLocaleString(undefined, { month: "short" });
    }
  }
  const d = Date.parse(trimmed);
  if (!Number.isNaN(d)) {
    return new Date(d).toLocaleString(undefined, { month: "short" });
  }
  return trimmed || "—";
}

export function mapReviewsCountToRatingPoints(
  rows: ReviewCountByPeriodDto[],
  filter: RatingDistributionFilter
): RatingDataPoint[] {
  if (!Array.isArray(rows) || rows.length === 0) {
    return filter === "year"
      ? [{ year: "—", reviews: 0 }]
      : [{ month: "—", reviews: 0 }];
  }
  return rows.map((row) => {
    const count = typeof row.count === "number" && Number.isFinite(row.count) ? row.count : 0;
    const period = typeof row.period === "string" ? row.period : "";
    if (filter === "year") {
      return { year: period || "—", reviews: count };
    }
    return { month: formatMonthPeriodLabel(period), reviews: count };
  });
}

function mapRecentActivityToItem(item: RecentActivityDto): ActivityItem {
  const meta = item.metadata ?? {};

  switch (item.type) {
    case "school_followed": {
      const name =
        typeof meta.followerName === "string" && meta.followerName.trim()
          ? meta.followerName.trim()
          : "";
      return {
        id: item._id,
        type: "follows",
        title: "New follower",
        description: item.description,
        followers: name || undefined,
      };
    }
    case "review_submitted": {
      const rating =
        typeof meta.overallRating === "number" && Number.isFinite(meta.overallRating)
          ? meta.overallRating
          : undefined;
      return {
        id: item._id,
        type: "review",
        title: "Review submitted",
        description: item.description,
        rating,
        maxRating: 10,
      };
    }
    default: {
      if (item.type.includes("job") || item.type === "job_posted") {
        return {
          id: item._id,
          type: "job",
          title:
            typeof meta.jobTitle === "string" && meta.jobTitle.trim()
              ? meta.jobTitle.trim()
              : "Job activity",
          description: item.description,
          metrics: {
            views: typeof meta.views === "string" ? meta.views : undefined,
            applications:
              typeof meta.applications === "number" ? meta.applications : undefined,
          },
        };
      }
      const title = item.type
        .split(/_/g)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      return {
        id: item._id,
        type: "follows",
        title: title || "Activity",
        description: item.description,
      };
    }
  }
}

export function mapRecentActivitiesToItems(activities: RecentActivityDto[]): ActivityItem[] {
  if (!Array.isArray(activities)) return [];
  return activities.map(mapRecentActivityToItem);
}

/**
 * GET /school-admin/dashboard/analytics-insights
 */
export async function getAnalyticsInsightsApi(): Promise<AnalyticsInsightsData> {
  const { data } = await apiClient.get<AnalyticsInsightsResponse>(
    "/school-admin/dashboard/analytics-insights",
    { skipErrorToast: true }
  );
  if (!data?.success || !data.data) {
    throw new Error(data?.message ?? "Failed to load analytics insights");
  }
  return data.data;
}

/**
 * GET /school-admin/dashboard/rating-distribution?filter=month|year
 */
export async function getRatingDistributionApi(
  filter: RatingDistributionFilter
): Promise<RatingDistributionData> {
  const { data } = await apiClient.get<RatingDistributionResponse>(
    "/school-admin/dashboard/rating-distribution",
    { params: { filter }, skipErrorToast: true }
  );
  if (!data?.success || !data.data) {
    throw new Error(data?.message ?? "Failed to load rating distribution");
  }
  return data.data;
}

/**
 * Loads insights plus month and year rating series in parallel (single paint, no staggered flicker).
 */
export async function fetchAnalyticsDashboard(): Promise<AnalyticsDashboardView> {
  const [insights, monthDist, yearDist] = await Promise.all([
    getAnalyticsInsightsApi(),
    getRatingDistributionApi("month"),
    getRatingDistributionApi("year"),
  ]);

  return {
    metrics: mapSchoolAnalyticsToMetricCards(insights.schoolAnalytics),
    pulse: mapSurveyInsightsToPulseData(insights.surveyInsights),
    activities: mapRecentActivitiesToItems(insights.recentActivities),
    ratingMonthly: mapReviewsCountToRatingPoints(
      monthDist.reviewsCountByPeriod,
      "month"
    ),
    ratingYearly: mapReviewsCountToRatingPoints(
      yearDist.reviewsCountByPeriod,
      "year"
    ),
  };
}

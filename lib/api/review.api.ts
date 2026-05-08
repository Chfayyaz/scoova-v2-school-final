import apiClient from "./axios";

export interface ApiCategoryRatings {
  visionMissionValues: number;
  leadershipCommunicationTrust: number;
  learningAcademicGrowth: number;
  studentBehaviourSafetyWellbeing: number;
  widerOpportunitiesPathwaysPartnerships: number;
}

export interface ApiReview {
  id: string;
  reviewerRole: string;
  categoryRatings: ApiCategoryRatings;
  overallRating: number;
  reviewTitle: string;
  reviewExperience: string;
  replies: ApiReviewReply[];
  createdAt: string;
  /** When provided by the backend, used as the display time (e.g. "2 weeks ago") */
  timeAgo?: string;
}

export interface GetSchoolPublicReviewsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    reviews: ApiReview[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalReviews: number;
      limit: number;
    };
    averageRatings: {
      categoryRatings: ApiCategoryRatings;
      overallRating: number;
    };
  };
}

/**
 * Fetch school public reviews – GET /review/school/:schoolId?page=1&limit=10
 */
export const getSchoolPublicReviewsApi = async (
  schoolId: string,
  params?: { page?: number; limit?: number }
): Promise<GetSchoolPublicReviewsResponse["data"]> => {
  const searchParams = new URLSearchParams();
  if (params?.page != null) searchParams.set("page", String(params.page));
  if (params?.limit != null) searchParams.set("limit", String(params.limit));
  const query = searchParams.toString();
  const url = query
    ? `/review/school/${schoolId}?${query}`
    : `/review/school/${schoolId}`;

  const response = await apiClient.get<GetSchoolPublicReviewsResponse>(url, {
    skipErrorToast: true,
  });

  if (!response.data?.success || !response.data?.data) {
    throw new Error(response.data?.message ?? "Failed to fetch reviews.");
  }

  return response.data.data;
};

// --- School admin review stats – GET /school-admin/reviews/stats ---

export type SchoolReviewStats = {
  averageRating: number;
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  rejectedReviews: number;
};

type GetSchoolReviewStatsResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: SchoolReviewStats;
};

/**
 * GET /school-admin/reviews/stats — aggregate review metrics for the current school admin.
 */
export async function getSchoolAdminReviewStatsApi(): Promise<SchoolReviewStats> {
  const response = await apiClient.get<GetSchoolReviewStatsResponse>(
    "/school-admin/reviews/stats",
    { skipErrorToast: true }
  );

  if (!response.data?.success || response.data.data == null) {
    throw new Error(response.data?.message ?? "Failed to fetch review stats.");
  }

  return response.data.data;
}

function formatAverageRatingForDisplay(value: number): string | number {
  if (!Number.isFinite(value)) return "—";
  return Number.isInteger(value) ? value : Number(value.toFixed(2));
}

/** Map API stats to dashboard card rows (no period-over-period delta from API — trend row hidden when `change` is empty). */
export function mapSchoolReviewStatsToCards(data: SchoolReviewStats) {
  return [
    {
      id: 1,
      title: "Average Rating",
      value: formatAverageRatingForDisplay(data.averageRating),
      change: "",
      changeType: "positive" as const,
    },
    {
      id: 2,
      title: "Total Reviews",
      value: data.totalReviews,
      change: "",
      changeType: "positive" as const,
    },
    {
      id: 3,
      title: "Pending Moderation",
      value: data.pendingReviews,
      change: "",
      changeType: "positive" as const,
    },
    {
      id: 4,
      title: "Approved Reviews",
      value: data.approvedReviews,
      change: "",
      changeType: "positive" as const,
    },
    {
      id: 5,
      title: "Rejected Reviews",
      value: data.rejectedReviews,
      change: "",
      changeType: "positive" as const,
    },
  ];
}

// --- Get replies for a review – GET /review-reply/review/:reviewId ---

export interface ApiReviewReply {
  id?: string;
  replyText?: string;
  text?: string;
  body?: string;
  repliedBy?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  repliedByType?: string;
  editedBy?: {
    _id?: string;
    name?: string;
    email?: string;
  } | null;
  editedAt?: string | null;
  createdAt?: string;
  /** When provided by the backend */
  timeAgo?: string;
}

export interface GetReviewRepliesResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    reviewId: string;
    replies: ApiReviewReply[];
  };
}

/**
 * Fetch replies for a review – GET /review-reply/review/:reviewId
 */
export const getReviewRepliesApi = async (
  reviewId: string
): Promise<GetReviewRepliesResponse["data"]> => {
  const response = await apiClient.get<GetReviewRepliesResponse>(
    `/review-reply/review/${reviewId}`,
    { skipErrorToast: true }
  );

  if (!response.data?.success || !response.data?.data) {
    throw new Error(response.data?.message ?? "Failed to fetch replies.");
  }

  return response.data.data;
};

// --- Create reply for a review – POST /review-reply/school-admin/reply/:reviewId ---

export interface CreateReviewReplyResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data?: {
    reviewId: string;
    replies: ApiReviewReply[];
  };
}

/**
 * Create a reply for a review – POST /review-reply/school-admin/reply/:reviewId
 * Sends the reply text; backend may return updated replies list.
 */
export const createReviewReplyApi = async (
  reviewId: string,
  text: string
): Promise<CreateReviewReplyResponse["data"]> => {
  try {
    const response = await apiClient.post<CreateReviewReplyResponse>(
      `/review-reply/school-admin/reply/${reviewId}`,
      { replyText: text.trim() },
      { skipErrorToast: true }
    );

    if (!response.data?.success) {
      throw new Error(response.data?.message ?? "Failed to send reply.");
    }

    return response.data?.data;
  } catch (err: unknown) {
    const ax = err as { response?: { data?: { message?: string } }; message?: string };
    const message =
      ax?.response?.data?.message ??
      (err instanceof Error ? err.message : "Failed to send reply.");
    throw new Error(message);
  }
};

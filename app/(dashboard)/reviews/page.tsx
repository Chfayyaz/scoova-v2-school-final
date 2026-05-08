"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import ReviewStatsCards from "./components/ReviewStatsCards";
import ReviewTabs from "./components/ReviewTabs";
import ReviewCard from "./components/ReviewCard";
import Pagination from "@/app/utils/Pagination";
import Skeleton from "@/components/ui/Skeleton";
import { ReviewStatus, Review, type ReviewStat } from "./data";
import { useAppSelector } from "@/redux";
import {
  getSchoolPublicReviewsApi,
  getSchoolAdminReviewStatsApi,
  mapSchoolReviewStatsToCards,
  type ApiReview,
} from "@/lib/api/review.api";

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 1) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }
  const years = Math.floor(diffDays / 365);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

function mapApiReviewToReview(api: ApiReview): Review {
  const hasReply = api.replies.length > 0;
  const firstReply = api.replies[0];
  const replyText = firstReply
    ? (firstReply.replyText ?? firstReply.text ?? firstReply.body ?? "")
    : undefined;
  const initials =
    api.reviewerRole.length >= 2
      ? api.reviewerRole.slice(0, 2).toUpperCase()
      : api.reviewerRole[0]?.toUpperCase() ?? "?";
  const reviewText = [api.reviewTitle, api.reviewExperience]
    .filter(Boolean)
    .join(" – ");
  return {
    id: api.id,
    reviewerInitials: initials,
    reviewerRole: api.reviewerRole,
    rating: Math.round(api.overallRating * 2),
    timeAgo: api.timeAgo ?? formatTimeAgo(api.createdAt),
    reviewText: reviewText || api.reviewExperience,
    hasReply,
    replyText,
    replies: (api.replies ?? []).map((reply) => ({
      ...reply,
      text: reply.replyText ?? reply.text ?? reply.body ?? "",
    })),
    status: hasReply ? "replied" : "pending",
  };
}

export default function ReviewsPage() {
  const schoolId = useAppSelector((s) => s.auth?.user?.school);
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalReviews: number;
    limit: number;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<ReviewStatus>("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statsCards, setStatsCards] = useState<ReviewStat[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const pageSize = 10;

  const fetchReviews = useCallback(
    async (p = 1, options?: { silent?: boolean }) => {
      if (!schoolId) {
        setLoading(false);
        return;
      }
      if (!options?.silent) setLoading(true);
      try {
        const data = await getSchoolPublicReviewsApi(schoolId, {
          page: p,
          limit: pageSize,
        });
        setReviews(data.reviews);
        setPagination(data.pagination);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to fetch reviews.", {
          id: options?.silent ? "fetch-reviews-silent-error" : "fetch-reviews-error",
        });
      } finally {
        if (!options?.silent) setLoading(false);
      }
    },
    [schoolId]
  );

  useEffect(() => {
    fetchReviews(page);
  }, [fetchReviews, page]);

  useEffect(() => {
    if (!schoolId) {
      setStatsLoading(false);
      setStatsCards([]);
      return;
    }
    let cancelled = false;
    setStatsLoading(true);
    getSchoolAdminReviewStatsApi()
      .then((data) => {
        if (!cancelled) setStatsCards(mapSchoolReviewStatsToCards(data));
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(err instanceof Error ? err.message : "Failed to load review stats.", {
            id: "fetch-review-stats-error",
          });
          setStatsCards([]);
        }
      })
      .finally(() => {
        if (!cancelled) setStatsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [schoolId]);

  const mappedReviews = reviews.map(mapApiReviewToReview);

  const getFilteredReviews = (): Review[] => {
    if (activeTab === "all") return mappedReviews;
    if (activeTab === "replied") {
      return mappedReviews.filter((r) => r.status === "replied");
    }
    return mappedReviews.filter((r) => r.status === "pending");
  };

  const filteredReviews = getFilteredReviews();

  const handleTabChange = (tab: ReviewStatus) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleReviewReplySuccess = useCallback(() => {
    void fetchReviews(page, { silent: true });
  }, [fetchReviews, page]);

  return (
    <div className=" min-h-screen">
      <div className=" sm:px-6  sm:py-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#4A4A4A] mb-2">
          View Reviews & Feedback
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-custom-gray/80 mb-4 sm:mb-6">
          Monitor reviews, reply to feedback, and gain insights from your
          community.
        </p>

        <ReviewStatsCards stats={statsCards} isLoading={statsLoading} />

        {/* Tabs */}
        <ReviewTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Review Cards */}
        <div>
          {loading ? (
            <div className="bg-custom-white rounded-lg border border-custom-gray/20 p-8 text-center">
              <div className="flex flex-col items-center justify-center gap-3 mb-6">
                <Skeleton className="h-4 w-32 rounded-md" />
              </div>

              <div className="space-y-4 text-left">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-custom-gray/10 bg-custom-white p-5"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-40 rounded-md" />
                        <Skeleton className="h-3 w-28 rounded-md" />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Skeleton className="h-3 w-full rounded-md" />
                      <Skeleton className="h-3 w-5/6 rounded-md" />
                      <Skeleton className="h-3 w-2/3 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : !schoolId ? (
            <div className="bg-custom-white rounded-lg border border-custom-gray/20 p-8 text-center">
              <p className="text-custom-gray/70">School not found. Please log in again.</p>
            </div>
          ) : filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onReplySuccess={handleReviewReplySuccess}
              />
            ))
          ) : (
            <div className="bg-custom-white rounded-lg border border-custom-gray/20 p-8 text-center">
              <p className="text-custom-gray/70">
                No reviews found for this filter.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && schoolId && pagination && (
          <div className="mt-4">
            <Pagination
              totalRecords={pagination.totalReviews}
              pageSize={pageSize}
              currentPage={page}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>
    </div>
  );
}



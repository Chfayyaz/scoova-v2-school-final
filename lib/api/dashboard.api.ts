import apiClient from "./axios";
import type { ActivityItem, MetricCard, ReviewItem } from "@/app/(dashboard)/data";

export type DashboardSchool = {
  name: string;
  location: string;
  principalName: string;
  profileImage: string | null;
};

export type DashboardStats = {
  totalReviews: number;
  averageRating: number;
  totalFollowers: number;
};

export type DashboardActivity = {
  _id: string;
  type: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export type DashboardReview = {
  _id: string;
  reviewerRole: string;
  overallRating: number;
  reviewTitle: string;
  reviewExperience: string;
  status: string;
  createdAt: string;
};

export type SchoolAdminDashboardData = {
  school: DashboardSchool;
  stats: DashboardStats;
  recentActivities: DashboardActivity[];
  recentReviews: DashboardReview[];
};

type SchoolAdminDashboardResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: SchoolAdminDashboardData;
};

/**
 * GET /school-admin/dashboard — school admin overview (school, stats, activities, reviews).
 */
export async function getSchoolAdminDashboardApi(): Promise<SchoolAdminDashboardData> {
  const response = await apiClient.get<SchoolAdminDashboardResponse>("/school-admin/dashboard");

  if (!response.data?.success || !response.data.data) {
    throw new Error(response.data?.message ?? "Failed to load dashboard");
  }

  return response.data.data;
}

function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";

  const diffMs = Date.now() - d.getTime();
  const sec = Math.floor(diffMs / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);

  if (sec < 60) return "Just now";
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  if (day < 7) return `${day}d ago`;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

function activityPresentation(type: string): { icon: string; bgColor: string; title: string } {
  switch (type) {
    case "school_followed":
      return {
        icon: "/images/svg/persons.svg",
        bgColor: "bg-[#D0BCFF4D]",
        title: "New follower",
      };
    case "review_submitted":
      return {
        icon: "/images/svg/star.svg",
        bgColor: "bg-custom-yellow/10",
        title: "Review submitted",
      };
    case "survey_created":
      return {
        icon: "/images/svg/puls.svg",
        bgColor: "bg-custom-teal/10",
        title: "Survey created",
      };
    case "survey_published":
      return {
        icon: "/images/svg/bell.svg",
        bgColor: "bg-custom-green/10",
        title: "Survey published",
      };
    case "school_staff_added":
      return {
        icon: "/images/svg/personplus.svg",
        bgColor: "bg-custom-teal/10",
        title: "Staff added",
      };
    case "school_staff_removed":
      return {
        icon: "/images/svg/alert.svg",
        bgColor: "bg-custom-gray/10",
        title: "Staff updated",
      };
    default:
      return {
        icon: "/images/svg/clock.svg",
        bgColor: "bg-custom-gray/10",
        title: "Activity",
      };
  }
}

export function mapDashboardActivities(items: DashboardActivity[]): ActivityItem[] {
  return items.map((item) => {
    const v = activityPresentation(item.type);
    return {
      id: item._id,
      type: "profile",
      title: v.title,
      description: item.description,
      time: formatRelativeTime(item.createdAt),
      icon: v.icon,
      bgColor: v.bgColor,
    };
  });
}

export function mapDashboardMetrics(stats: DashboardStats): MetricCard[] {
  const rating =
    typeof stats.averageRating === "number"
      ? Number.isInteger(stats.averageRating)
        ? stats.averageRating
        : stats.averageRating.toFixed(2)
      : stats.averageRating;

  return [
    {
      id: 1,
      title: "Total Reviews",
      value: stats.totalReviews,
      change: "",
      changeType: "positive",
      icon: "/images/svg/text.svg",
      bgColor: "bg-custom-blue/10",
    },
    {
      id: 2,
      title: "Avg Rating",
      value: rating,
      change: "",
      changeType: "positive",
      icon: "/images/svg/outlinestar.svg",
      bgColor: "bg-custom-yellow/10",
    },
    {
      id: 3,
      title: "Total Followers",
      value: stats.totalFollowers,
      change: "",
      changeType: "positive",
      icon: "/images/svg/persons.svg",
      bgColor: "bg-[#D0BCFF4D]",
    },
  ];
}

function reviewAccentClass(status: string): string {
  switch (status) {
    case "approved":
      return "bg-custom-green/10";
    case "rejected":
      return "bg-red-100";
    case "pending":
      return "bg-custom-yellow/10";
    default:
      return "bg-custom-gray/10";
  }
}

export function mapDashboardReviews(items: DashboardReview[]): ReviewItem[] {
  return items.map((r) => ({
    id: r._id,
    author: r.reviewerRole,
    authorType: r.reviewerRole,
    time: formatRelativeTime(r.createdAt),
    title: r.reviewTitle,
    description: r.reviewExperience,
    helpfulCount: 0,
    icon: "/images/svg/star.svg",
    bgColor: reviewAccentClass(r.status),
    rating: r.overallRating,
  }));
}

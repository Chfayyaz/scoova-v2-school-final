import apiClient from "./axios";

export type SchoolActivityItem = {
  _id: string;
  type: string;
  description: string;
  metadata?: Record<string, unknown>;
  isRead?: boolean;
  createdAt: string;
};

export type SchoolActivitiesPagination = {
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type SchoolActivitiesData = {
  activities: SchoolActivityItem[];
  pagination: SchoolActivitiesPagination;
};

type SchoolActivitiesApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: SchoolActivitiesData;
};

type UnreadCountApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: unknown;
};

function parseUnreadCountFromPayload(data: unknown): number {
  if (data == null) return 0;
  if (typeof data === "number" && Number.isFinite(data)) {
    return Math.max(0, Math.floor(data));
  }
  if (typeof data === "object" && !Array.isArray(data)) {
    const o = data as Record<string, unknown>;
    const raw = o.unreadCount ?? o.count ?? o.unread;
    if (typeof raw === "number" && Number.isFinite(raw)) {
      return Math.max(0, Math.floor(raw));
    }
    if (typeof raw === "string") {
      const parsed = Number(raw.trim());
      if (Number.isFinite(parsed)) {
        return Math.max(0, Math.floor(parsed));
      }
    }
  }
  return 0;
}

/** Shapes mapped for the dashboard header bell dropdown (matches existing UI variants). */
export type HeaderNotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  image: string;
  type: "review" | "subscription" | "default";
  isNew: boolean;
};

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

function activityLabelAndIcon(type: string): { title: string; icon: string } {
  switch (type) {
    case "school_followed":
      return { title: "New follower", icon: "/images/svg/persons.svg" };
    case "review_submitted":
      return { title: "Review submitted", icon: "/images/svg/star.svg" };
    case "survey_created":
      return { title: "Survey created", icon: "/images/svg/puls.svg" };
    case "survey_published":
      return { title: "Survey published", icon: "/images/svg/bell.svg" };
    case "school_staff_added":
      return { title: "Staff added", icon: "/images/svg/personplus.svg" };
    case "school_staff_removed":
      return { title: "Staff updated", icon: "/images/svg/alert.svg" };
    default:
      return { title: "Activity", icon: "/images/svg/clock.svg" };
  }
}

function activityToUiType(type: string): HeaderNotificationItem["type"] {
  if (type === "review_submitted") return "review";
  if (type === "survey_created" || type === "survey_published") return "subscription";
  return "default";
}

export function mapSchoolActivityToHeaderItem(item: SchoolActivityItem): HeaderNotificationItem {
  const { title, icon } = activityLabelAndIcon(item.type);
  return {
    id: item._id,
    title,
    message: item.description,
    time: formatRelativeTime(item.createdAt),
    image: icon,
    type: activityToUiType(item.type),
    isNew: item.isRead !== true,
  };
}

export type FetchSchoolActivitiesParams = {
  page?: number;
  limit?: number;
};

/**
 * GET /school-admin/activities — paginated school activity feed (header notifications).
 */
export async function fetchSchoolActivitiesApi(
  params: FetchSchoolActivitiesParams = {}
): Promise<SchoolActivitiesData> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  const { data } = await apiClient.get<SchoolActivitiesApiResponse>("/school-admin/activities", {
    params: { page, limit },
    skipErrorToast: true,
  });

  if (!data?.success || !data.data) {
    throw new Error(data?.message ?? "Failed to load notifications");
  }

  return data.data;
}

/**
 * GET /school-admin/activities/unread-count — server-side unread total for the bell badge.
 */
export async function fetchSchoolActivitiesUnreadCountApi(): Promise<number> {
  const { data } = await apiClient.get<UnreadCountApiResponse>(
    "/school-admin/activities/unread-count",
    { skipErrorToast: true }
  );

  if (!data?.success) {
    throw new Error(data?.message ?? "Failed to load unread count");
  }

  return parseUnreadCountFromPayload(data.data);
}

type MarkActivityReadApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: SchoolActivityItem;
};

/**
 * PATCH /school-admin/activities/:activityId/read — mark a single activity as read.
 */
export async function markSchoolActivityAsReadApi(activityId: string): Promise<SchoolActivityItem> {
  const id = encodeURIComponent(activityId.trim());
  if (!id) {
    throw new Error("Invalid activity id");
  }

  const { data } = await apiClient.patch<MarkActivityReadApiResponse>(
    `/school-admin/activities/${id}/read`,
    {},
    { skipErrorToast: true }
  );

  if (!data?.success || !data.data) {
    throw new Error(data?.message ?? "Failed to mark activity as read");
  }

  return data.data;
}

export async function fetchHeaderNotificationsApi(
  params?: FetchSchoolActivitiesParams
): Promise<HeaderNotificationItem[]> {
  const { activities } = await fetchSchoolActivitiesApi(params);
  return activities.map(mapSchoolActivityToHeaderItem);
}

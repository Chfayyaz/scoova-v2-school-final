// Settings Data Types

import type { MySchoolData } from "@/lib/api/myshool.api";
import type { UserMeSubscriptionData } from "@/lib/api/account.api";

/** Item ids that PATCH school notification settings when toggled */
export const NOTIFICATION_API_ITEM_IDS = {
  newReview: "new-review",
  followersUpdates: "followers-updates",
} as const;

export type SettingsTab = {
  id: string;
  title: string;
  slug: string;
};

export const settingsTabs: SettingsTab[] = [
  {
    id: "user-profile",
    title: "User Profile",
    slug: "user-profile",
  },
  {
    id: "school-profile",
    title: "School Profile",
    slug: "school-profile",
  },
  {
    id: "subscription-detail",
    title: "Subscription Detail",
    slug: "subscription-detail",
  },
  {
    id: "notifications",
    title: "Notifications",
    slug: "notifications",
  },
  {
    id: "change-password",
    title: "Change Password",
    slug: "change-password",
  },
];

export type SchoolProfileData = {
  schoolName: string;
  currentPassword: string;
  imageUrl: string | null;
};

export type SubscriptionDetail = {
  plan: string;
  billingCycle: "Monthly" | "Yearly";
  renewalDate: string;
  status: "active" | "expired" | "cancelled";
  startDate: string;
  /** Omitted when the API does not return card / wallet details */
  paymentMethod?: {
    type: "visa" | "mastercard" | "amex" | "paypal";
    lastFour: string;
  };
  features: string[];
};

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  enabled: boolean;
};

export type NotificationCategory = {
  id: string;
  title: string;
  icon: string;
  iconColor: string;
  items: NotificationItem[];
};

export type NotificationSettings = {
  categories: NotificationCategory[];
};

export type PasswordChangeData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// Mock Data
export const initialSchoolProfile: SchoolProfileData = {
  schoolName: "Greenwood Academy",
  currentPassword: "",
  imageUrl: null,
};

export const subscriptionDetail: SubscriptionDetail = {
  plan: "Professional",
  billingCycle: "Yearly",
  renewalDate: "2025-10-21",
  status: "active",
  startDate: "2024-10-21",
  paymentMethod: {
    type: "visa",
    lastFour: "4242",
  },
  features: [
    "Up to 500 students",
    "Parent communication tools",
    "Custom branding",
    "Advanced reporting",
    "Priority email support",
    "API Access",
  ],
};

export type PlanDetails = {
  planName: string;
  description: string;
  price: number;
  priceUnit: string;
  icon?: string;
  toolkitFeatures: string[];
};

export const currentPlanDetails: PlanDetails = {
  planName: "Premium School Plan",
  description: "Complete school management platform",
  price: 29.99,
  priceUnit: "/month",
  toolkitFeatures: [
    "Update general information",
    "Create image gallery",
    "Reply to reviews",
    "Manage senior leadership",
    "Access Pulse Survey Tool",
    "Recruitment platform (job postings & applications)",
    "System Support + Notifications",
  ],
};

/**
 * Apply school notification flags from GET /school-admin/my-school onto the static notification layout.
 * Only items backed by the API are updated; other toggles keep template defaults until wired.
 */
export function mergeNotificationSettingsFromMySchool(
  base: NotificationSettings,
  school: Pick<MySchoolData, "receiveReviewSubmissionActivity" | "receiveFollowActivity">
): NotificationSettings {
  return {
    categories: base.categories.map((category) => ({
      ...category,
      items: category.items.map((item) => {
        if (item.id === NOTIFICATION_API_ITEM_IDS.newReview) {
          return { ...item, enabled: school.receiveReviewSubmissionActivity };
        }
        if (item.id === NOTIFICATION_API_ITEM_IDS.followersUpdates) {
          return { ...item, enabled: school.receiveFollowActivity };
        }
        return item;
      }),
    })),
  };
}

export const initialNotificationSettings: NotificationSettings = {
  categories: [
    {
      id: "system-alerts",
      title: "System Alerts",
      icon: "/images/svg/bluealert.svg",
      iconColor: "custom-teal",
      items: [
        {
          id: "system-alerts-item",
          title: "System Alerts",
          description: "Subscription reminders, updates, and maintenance notices",
          icon: "/images/svg/bluealert.svg",
          iconColor: "blue",
          enabled: true,
        },
      ],
    },
    {
      id: "school-activity",
      title: "School Activity Notifications",
      icon: "/images/svg/school.svg",
      iconColor: "custom-teal",
      items: [
        {
          id: "new-review",
          title: "New Review Received",
          description: "Notifications when parents or students leave reviews",
          icon: "/images/svg/star.svg",
          iconColor: "yellow",
          enabled: true,
        },
      ],
    },
    {
      id: "engagement",
      title: "Engagement Notifications",
      icon: "/images/svg/heart.svg",
      iconColor: "pink",
      items: [
        {
          id: "followers-updates",
          title: "Followers Updates",
          description: "When someone follows your school page",
          icon: "/images/svg/greencheck.svg",
          iconColor: "green",
          enabled: false,
        },
        {
          id: "review-replies",
          title: "Review Replies or Likes",
          description: "Interactions on your review responses",
          icon: "/images/svg/thumb.svg",
          iconColor: "red",
          enabled: false,
        },
        {
          id: "comments",
          title: "Comments on School Page",
          description: "New comments on your school's public page",
          icon: "/images/svg/yellowtext.svg",
          iconColor: "yellow",
          enabled: true,
        },
      ],
    },
  ],
};

function titleCasePlan(plan: string): string {
  const p = plan.trim().toLowerCase();
  if (!p) return "Plan";
  return p.charAt(0).toUpperCase() + p.slice(1);
}

function mapApiBillingCycle(
  raw: string | undefined
): SubscriptionDetail["billingCycle"] {
  const b = (raw ?? "").toLowerCase();
  return b === "monthly" ? "Monthly" : "Yearly";
}

function mapApiSubscriptionStatus(
  raw: string | undefined
): SubscriptionDetail["status"] {
  const s = (raw ?? "").toLowerCase();
  if (s === "expired") return "expired";
  if (s === "cancelled" || s === "canceled") return "cancelled";
  return "active";
}

/**
 * Map GET /user/me/subscription `data` into the subscription settings card model.
 */
export function mapUserMeSubscriptionToSubscriptionDetail(
  api: UserMeSubscriptionData,
  featureList: string[] = subscriptionDetail.features
): SubscriptionDetail {
  const sub = api.subscription;
  if (!api.isSubscriber || !sub) {
    return {
      plan: "No active subscription",
      billingCycle: "Monthly",
      renewalDate: "",
      status: mapApiSubscriptionStatus(api.subscriptionStatus),
      startDate: "",
      features: [],
    };
  }

  return {
    plan: titleCasePlan(sub.plan),
    billingCycle: mapApiBillingCycle(sub.billingCycle),
    renewalDate: sub.endDate,
    status: mapApiSubscriptionStatus(sub.status),
    startDate: sub.startDate,
    features: featureList,
  };
}


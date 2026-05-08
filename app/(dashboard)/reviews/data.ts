// Review statistics and data types

export type ReviewStatus = "all" | "replied" | "pending";

export type Review = {
  id: number | string;
  reviewerInitials: string;
  reviewerRole: string;
  rating: number;
  timeAgo: string;
  reviewText: string;
  hasReply: boolean;
  replyText?: string;
  replies?: Array<{
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
    timeAgo?: string;
  }>;
  status: ReviewStatus;
};

export type ReviewStat = {
  id: number;
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative";
  icon?: string;
};

export const reviewStats: ReviewStat[] = [
  {
    id: 1,
    title: "Average Rating",
    value: "4.8",
    change: "+0.2",
    changeType: "positive",
  },
  {
    id: 2,
    title: "Total Reviews",
    value: "342",
    change: "+12%",
    changeType: "positive",
  },
  {
    id: 3,
    title: "Pending Moderation",
    value: "12",
    change: "-5%",
    changeType: "negative",
  },
  {
    id: 4,
    title: "Approved Reviews",
    value: "310",
    change: "+15%",
    changeType: "positive",
  },
  {
    id: 5,
    title: "Rejected Reviews",
    value: "20",
    change: "+2%",
    changeType: "positive",
  },
];

export const reviewsData: Review[] = [
  {
    id: 1,
    reviewerInitials: "Ra",
    reviewerRole: "Parent",
    rating: 5,
    timeAgo: "2 weeks ago",
    reviewText:
      "The service was excellent but the waiting time could be improved. Staff was very friendly and professional.",
    hasReply: true,
    replyText:
      "The service was excellent but the waiting time could be improved. Staff was very friendly and professional.",
    status: "replied",
  },
  {
    id: 2,
    reviewerInitials: "Ed",
    reviewerRole: "Educator",
    rating: 4,
    timeAgo: "3 weeks ago",
    reviewText:
      "Great educational environment with dedicated staff. The curriculum is well-structured and engaging for students.",
    hasReply: false,
    status: "pending",
  },
  {
    id: 3,
    reviewerInitials: "Ra",
    reviewerRole: "Parent",
    rating: 5,
    timeAgo: "1 month ago",
    reviewText:
      "The service was excellent but the waiting time could be improved. Staff was very friendly and professional.",
    hasReply: true,
    replyText:
      "The service was excellent but the waiting time could be improved. Staff was very friendly and professional.",
    status: "replied",
  },
  {
    id: 4,
    reviewerInitials: "Jo",
    reviewerRole: "Parent",
    rating: 4,
    timeAgo: "1 month ago",
    reviewText:
      "Overall good experience. The facilities are modern and the teachers are supportive.",
    hasReply: false,
    status: "pending",
  },
  {
    id: 5,
    reviewerInitials: "Mi",
    reviewerRole: "Educator",
    rating: 5,
    timeAgo: "2 months ago",
    reviewText:
      "Excellent school with outstanding academic programs and extracurricular activities.",
    hasReply: true,
    replyText: "Thank you for your positive feedback!",
    status: "replied",
  },
  {
    id: 6,
    reviewerInitials: "Sa",
    reviewerRole: "Parent",
    rating: 3,
    timeAgo: "2 months ago",
    reviewText:
      "Decent school but communication with parents could be better.",
    hasReply: false,
    status: "pending",
  },
];


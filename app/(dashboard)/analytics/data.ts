// Analytics data types and mock data

export type MetricCard = {
  id: number;
  value: string | number;
  title: string;
  trend: {
    value: string;
    change: string;
    type: "positive" | "negative";
    period?: string;
  };
  icon: string;
};

export type RatingDataPoint = {
  month?: string;
  week?: string;
  year?: string;
  reviews: number;
};

export type PulseSurveyData = {
  participationRate: number;
  satisfactionScores: {
    id: number;
    category: string;
    score: number;
    maxScore: number;
  }[];
};

export type ActivityItem = {
  id: string | number;
  type: "job" | "follows" | "review";
  title: string;
  description: string;
  metrics?: {
    views?: string;
    applications?: number;
  };
  followers?: string;
  rating?: number;
  maxRating?: number;
};

export const metricsData: MetricCard[] = [
  {
    id: 1,
    value: "1,284",
    title: "Total Reviews Received",
    trend: {
      value: "10.2",
      change: "+1.01% this week",
      type: "positive",
      period: "this week",
    },
    icon: "/images/svg/bluetext.svg",
  },
  {
    id: 2,
    value: "8.7/10",
    title: "Average School Rating",
    trend: {
      value: "0.2",
      change: "",
      type: "positive",
    },
    icon: "/images/svg/greenstar.svg",
  },
  {
    id: 3,
    value: "46,827",
    title: "New Followers",
    trend: {
      value: "2.56",
      change: "",
      type: "negative",
    },
    icon: "/images/svg/purpleperson.svg",
  },
  {
    id: 4,
    value: "20 x 16",
    title: "",
    trend: {
      value: "",
      change: "",
      type: "positive",
    },
    icon: "/images/svg/yellowcalander.svg",
  },
  {
    id: 5,
    value: "77",
    title: "Job Applications",
    trend: {
      value: "7.2",
      change: "+1.51% this week",
      type: "positive",
      period: "this week",
    },
    icon: "/images/svg/yellowcalander.svg",
  },
];

export const ratingDistributionDataMonthly: RatingDataPoint[] = [
  { month: "Jan", reviews: 12 },
  { month: "Feb", reviews: 28 },
  { month: "Mar", reviews: 60 },
  { month: "Apr", reviews: 42 },
  { month: "May", reviews: 35 },
  { month: "Jun", reviews: 38 },
  { month: "Jul", reviews: 62 },
  { month: "Aug", reviews: 62 },
  { month: "Sep", reviews: 62 },
  { month: "Oct", reviews: 62 },
  { month: "Nov", reviews: 62 },
  { month: "Dec", reviews: 62 },
];

export const ratingDistributionDataWeekly: RatingDataPoint[] = [
  { week: "Week 1", reviews: 8 },
  { week: "Week 2", reviews: 15 },
  { week: "Week 3", reviews: 22 },
  { week: "Week 4", reviews: 18 },
  { week: "Week 5", reviews: 25 },
  { week: "Week 6", reviews: 30 },
  { week: "Week 7", reviews: 28 },
  { week: "Week 8", reviews: 35 },
];

export const ratingDistributionDataYearly: RatingDataPoint[] = [
  { year: "2018", reviews: 320 },
  { year: "2019", reviews: 450 },
  { year: "2020", reviews: 380 },
  { year: "2021", reviews: 520 },
  { year: "2022", reviews: 680 },
  { year: "2023", reviews: 750 },
  { year: "2024", reviews: 820 },
];

// Legacy export for backward compatibility
export const ratingDistributionData = ratingDistributionDataMonthly;

export const pulseSurveyData: PulseSurveyData = {
  participationRate: 78,
  satisfactionScores: [
    {
      id: 1,
      category: "Work-life Balance",
      score: 4.8,
      maxScore: 5,
    },
    {
      id: 2,
      category: "Peer Collaboration",
      score: 4.7,
      maxScore: 5,
    },
    {
      id: 3,
      category: "Resource Availability",
      score: 4.6,
      maxScore: 5,
    },
  ],
};

export const schoolActivityData: ActivityItem[] = [
  {
    id: 1,
    type: "job",
    title: "New Job: Math Teacher",
    description: "Posted 2 days ago",
    metrics: {
      views: "1.2k Views",
      applications: 34,
    },
  },
  {
    id: 2,
    type: "follows",
    title: "Follows Gained",
    description: "This month",
    followers: "+217 Followers",
  },
  {
    id: 3,
    type: "review",
    title: "Recent Review",
    description: '"A fantastic place to work..."',
    rating: 9,
    maxRating: 10,
  },
];


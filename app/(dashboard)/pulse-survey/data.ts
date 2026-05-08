// Mock data for pulse survey

export type SurveyStatus = "draft" | "active" | "ended";

export type Survey = {
  id: number | string;
  title: string;
  targetGroup: string;
  status: SurveyStatus;
  sentDate: string | null;
  responses: number;
  totalRecipients: number;
};

export type SummaryCard = {
  id: number;
  title: string;
  value: string | number;
  icon: string;
  iconBgColor: string;
};

export type ResponseRateDataPoint = {
  week: string;
  rate: number;
};

export const summaryCardsData: SummaryCard[] = [
  {
    id: 1,
    title: "Total Surveys Created",
    value: 124,
    icon: "/images/svg/check.svg",
    iconBgColor: "bg-custom-teal/10",
  },
  {
    id: 2,
    title: "Active Surveys",
    value: 3,
    icon: "/images/svg/greentower.svg",
    iconBgColor: "bg-custom-green/10",
  },
  {
    id: 3,
    title: "Response Rate",
    value: "82.5%",
    icon: "/images/svg/purplecheck.svg",
    iconBgColor: "bg-custom-purple/10",
  },
  {
    id: 4,
    title: "Verified Reviews",
    value: 47,
    icon: "/images/svg/star.svg",
    iconBgColor: "bg-custom-yellow/10",
  },
];

export const lastSurveyPerformanceData: ResponseRateDataPoint[] = [
  { week: "Week 1", rate: 65 },
  { week: "Week 2", rate: 78 },
  { week: "Week 3", rate: 85 },
  { week: "Week 4", rate: 90 },
];

export const allSurveysData: Survey[] = [
  {
    id: 1,
    title: "Student Tech Access 2025",
    targetGroup: "Students",
    status: "active",
    sentDate: "2025-11-15",
    responses: 120,
    totalRecipients: 350,
  },
  {
    id: 2,
    title: "Parent-Teacher Communication",
    targetGroup: "Parents",
    status: "active",
    sentDate: "2025-10-20",
    responses: 289,
    totalRecipients: 320,
  },
  {
    id: 3,
    title: "Staff Wellbeing Q3",
    targetGroup: "Staff",
    status: "ended",
    sentDate: "2025-09-01",
    responses: 45,
    totalRecipients: 50,
  },
  {
    id: 4,
    title: "Alumni Network Engagement",
    targetGroup: "Alumni",
    status: "draft",
    sentDate: null,
    responses: 0,
    totalRecipients: 0,
  },
];


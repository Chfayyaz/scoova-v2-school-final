import type {
  CreateSurveyData,
  SurveyAiTextSummaryData,
  SurveyAnalyticsDetailData,
} from "@/lib/api/survey.api";

// Mock data for survey details page

export type SurveyStatus = "draft" | "active" | "ended";
export type QuestionType = "rating" | "text" | "likert";

export type SentimentType = "positive" | "neutral" | "negative";

export type RespondentType = "Parent" | "Educator" | "Student" | "Alumni";

export type ResponseStatus = "Completed" | "Pending";

export interface SurveyDetails {
  id: number | string;
  title: string;
  createdOn: string;
  lastUpdated: string;
  description: string;
  status: SurveyStatus;
  responseRate: number; // percentage
  completed: number;
  pending: number;
  recipientsSent?: number;
  totalRecipients: number;
  startDate: string;
  endDate: string;
  targetAudience: RespondentType[];
  participationTrend: {
    date: string;
    responses: number;
  }[];
  aiSummary: {
    text: string;
    keyFindings: {
      label: string;
      value: string;
      color: string;
    }[];
  };
  questionRatings: {
    category: string;
    averageScore: number;
  }[];
  sentimentDistribution: {
    type: SentimentType;
    percentage: number;
  }[];
  questionBreakdown: {
    id: string;
    question: string;
    type: QuestionType;
    averageRating?: number;
    maxRating?: number;
    ratingDistribution?: {
      rating: number;
      count: number;
    }[];
    mostUsedWords?: string[];
    likertDistribution?: { label: string; count: number }[];
    sampleResponses?: string[];
  }[];
  individualResponses: {
    id: string;
    respondentType: RespondentType;
    date: string | null;
    status: ResponseStatus;
  }[];
}

// Mock survey details data
export const surveyDetailsData: SurveyDetails[] = [
  {
    id: 1,
    title: "Parent Satisfaction Survey - Q1",
    createdOn: "12 Jan 2025",
    lastUpdated: "20 Jan 2025",
    description:
      "A brief survey to gather feedback from parents about the school environment, curriculum, and communication channels for the first quarter.",
    status: "active",
    responseRate: 62,
    completed: 154,
    pending: 94,
    totalRecipients: 248,
    startDate: "18 Jan 2025",
    endDate: "30 Jan 2025",
    targetAudience: ["Parent", "Educator", "Student"],
    participationTrend: [
      { date: "Jan 17", responses: 20 },
      { date: "Jan 18", responses: 45 },
      { date: "Jan 19", responses: 68 },
      { date: "Jan 20", responses: 92 },
      { date: "Jan 21", responses: 110 },
      { date: "Jan 22", responses: 125 },
      { date: "Jan 23", responses: 140 },
      { date: "Jan 24", responses: 154 },
    ],
    aiSummary: {
      text: "The overall sentiment from the survey is largely positive, with an 82% satisfaction rate. Parents frequently praise the dedication and support from teachers. However, a recurring theme is the need for more frequent and clear communication regarding student progress and school events. While curriculum satisfaction is high, concerns about the availability of extracurricular activities were noted by a minority of respondents.",
      keyFindings: [
        {
          label: "Overall Satisfaction",
          value: "82%",
          color: "bg-custom-green",
        },
        {
          label: "Common Concern",
          value: "Communication",
          color: "bg-custom-yellow",
        },
        {
          label: "Strong Area",
          value: "Teacher Support",
          color: "bg-custom-blue",
        },
        {
          label: "Sentiment",
          value: "Mostly Positive",
          color: "bg-custom-blue",
        },
      ],
    },
    questionRatings: [
      { category: "Activities", averageScore: 3.8 },
      { category: "Teachers", averageScore: 3.0 },
      { category: "Communication", averageScore: 3.5 },
      { category: "Curriculum", averageScore: 4.0 },
      { category: "Teacher Support", averageScore: 4.2 },
    ],
    sentimentDistribution: [
      { type: "positive", percentage: 65 },
      { type: "neutral", percentage: 25 },
      { type: "negative", percentage: 10 },
    ],
    questionBreakdown: [
      {
        id: "q1",
        question: "How satisfied are you with the school environment?",
        type: "rating",
        averageRating: 7.4,
        maxRating: 10,
        ratingDistribution: [
          { rating: 1, count: 2 },
          { rating: 2, count: 3 },
          { rating: 3, count: 5 },
          { rating: 4, count: 8 },
          { rating: 5, count: 12 },
          { rating: 6, count: 18 },
          { rating: 7, count: 25 },
          { rating: 8, count: 35 },
          { rating: 9, count: 28 },
          { rating: 10, count: 18 },
        ],
      },
      {
        id: "q2",
        question: "What improvements would you like to see in our communication?",
        type: "text",
        mostUsedWords: [
          "communication",
          "app",
          "teachers",
          "updates",
          "more frequent",
        ],
      },
    ],
    individualResponses: Array.from({ length: 154 }, (_, i) => {
      const types: RespondentType[] = ["Parent", "Educator", "Student"];
      const statuses: ResponseStatus[] = ["Completed", "Pending"];
      const isCompleted = i < 154 - 94; // First 154-94 are completed
      
      return {
        id: `r${i + 1}`,
        respondentType: types[i % 3] as RespondentType,
        date: isCompleted
          ? `2025-01-${17 + Math.floor(i / 10)}`
          : null,
        status: (isCompleted ? "Completed" : "Pending") as ResponseStatus,
      };
    }),
  },
];

// Map targetGroup from AllSurveysTable to targetAudience for TargetAudienceCard
export function mapTargetGroupToAudience(targetGroup: string): string[] {
  switch (targetGroup?.toLowerCase()) {
    case "students":
      return ["Student"];
    case "parents":
      return ["Parent"];
    case "staff":
      return ["Educator"];
    case "alumni":
      return ["Alumni"];
    default:
      return targetGroup ? [targetGroup] : [];
  }
}

// Function to get survey details by ID
export function getSurveyDetailsById(id: number): SurveyDetails | null {
  return surveyDetailsData.find((survey) => survey.id === id) || null;
}

function formatSatisfactionPercent(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const rounded = Math.round(value);
  if (Math.abs(value - rounded) < 0.05) {
    return `${rounded}%`;
  }
  const s = value.toFixed(1);
  return `${s.endsWith(".0") ? String(Math.round(value)) : s}%`;
}

function normalizeAiSentimentDistribution(
  raw: SurveyAiTextSummaryData["sentimentDistribution"]
): SurveyDetails["sentimentDistribution"] {
  let pos = Math.round(raw.positive);
  let neu = Math.round(raw.neutral);
  let neg = Math.round(raw.negative);
  const drift = 100 - (pos + neu + neg);
  pos += drift;
  return [
    { type: "positive", percentage: Math.max(0, pos) },
    { type: "neutral", percentage: Math.max(0, neu) },
    { type: "negative", percentage: Math.max(0, neg) },
  ];
}

/**
 * Maps GET .../ai-text-summary `data` into `SurveyDetails` fields used by the details page
 * (AI summary card + sentiment pie when you merge this slice into local state).
 */
export function mapSurveyAiTextSummaryToDetailsSlice(
  data: SurveyAiTextSummaryData
): Pick<SurveyDetails, "aiSummary" | "sentimentDistribution"> {
  const keyFindings: SurveyDetails["aiSummary"]["keyFindings"] = [
    {
      label: "Overall Satisfaction",
      value: formatSatisfactionPercent(data.overallSatisfactionPercentage),
      color: "bg-custom-green",
    },
  ];

  if (data.commonConcern?.trim()) {
    keyFindings.push({
      label: "Common Concern",
      value: data.commonConcern.trim(),
      color: "bg-custom-yellow",
    });
  }

  if (data.strongArea?.trim()) {
    keyFindings.push({
      label: "Strong Area",
      value: data.strongArea.trim(),
      color: "bg-custom-blue",
    });
  }

  keyFindings.push({
    label: "Sentiment",
    value: data.sentiment,
    color: "bg-custom-blue",
  });

  return {
    aiSummary: {
      text: data.summaryText,
      keyFindings,
    },
    sentimentDistribution: normalizeAiSentimentDistribution(data.sentimentDistribution),
  };
}

/** Use mock `getSurveyDetailsById` only when the route param is a plain numeric id (avoids parseInt on Mongo ids). */
export function isStrictNumericSurveyId(id: string): boolean {
  return /^\d+$/.test(id.trim());
}

const LIKERT_OPTION_ORDER = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
] as const;

function formatSurveyDateFromIso(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function normalizeSurveyStatus(raw: string): SurveyStatus {
  const s = raw?.toLowerCase();
  if (s === "draft" || s === "active" || s === "ended") return s;
  return "active";
}

function mapRecipientTypeToAudience(type: string): RespondentType {
  const t = type?.trim().toLowerCase();
  if (t === "parent") return "Parent";
  if (t === "staff") return "Educator";
  if (t === "educator") return "Educator";
  if (t === "student") return "Student";
  if (t === "alumni") return "Alumni";
  return "Parent";
}

function shortQuestionCategory(text: string, max = 28): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function orderLikertDistribution(
  dist: Record<string, number>
): { label: string; count: number }[] {
  const ordered: { label: string; count: number }[] = LIKERT_OPTION_ORDER.filter((k) =>
    Object.prototype.hasOwnProperty.call(dist, k)
  ).map((label) => ({ label, count: dist[label] ?? 0 }));
  const known = new Set<string>([...LIKERT_OPTION_ORDER]);
  const extras = Object.keys(dist)
    .filter((k) => !known.has(k))
    .sort();
  extras.forEach((label) => ordered.push({ label, count: dist[label] ?? 0 }));
  return ordered;
}

function likertWeightedAverage(dist: Record<string, number>): number {
  const scale: Record<string, number> = {
    "Strongly Disagree": 1,
    Disagree: 2,
    Neutral: 3,
    Agree: 4,
    "Strongly Agree": 5,
  };
  let sum = 0;
  let n = 0;
  for (const [label, count] of Object.entries(dist)) {
    const w = scale[label];
    if (w != null && count > 0) {
      sum += w * count;
      n += count;
    }
  }
  if (!n) return 0;
  return Math.round((sum / n) * 100) / 100;
}

function buildParticipationTrendFromAnalytics(
  data: SurveyAnalyticsDetailData
): SurveyDetails["participationTrend"] {
  const formatTrendDate = (d: Date): string =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const total = data.totalResponses ?? 0;
  const start = new Date(data.surveyStartDate);
  const end = new Date(data.surveyEndDate);
  const now = new Date();
  if (Number.isNaN(start.getTime())) {
    return [{ date: "—", responses: total }];
  }
  const effectiveEnd = Number.isNaN(end.getTime()) || end > now ? now : end;
  const span = Math.max(effectiveEnd.getTime() - start.getTime(), 1);
  const steps = 6;
  const points: SurveyDetails["participationTrend"] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const ts = start.getTime() + span * t;
    const d = new Date(ts);
    points.push({
      date: formatTrendDate(d),
      responses: Math.round(total * t),
    });
  }
  return points;
}

function sentimentFromAnalyticsLikert(
  questions: SurveyAnalyticsDetailData["questionAnalytics"]
): SurveyDetails["sentimentDistribution"] {
  let pos = 0;
  let neg = 0;
  let neu = 0;
  for (const q of questions) {
    if (q.questionType !== "likert_scale" || !q.optionDistribution) continue;
    const d = q.optionDistribution;
    pos += (d["Strongly Agree"] ?? 0) + (d["Agree"] ?? 0);
    neg += (d["Strongly Disagree"] ?? 0) + (d["Disagree"] ?? 0);
    neu += d["Neutral"] ?? 0;
  }
  const sum = pos + neg + neu;
  if (!sum) {
    return [
      { type: "positive", percentage: 34 },
      { type: "neutral", percentage: 33 },
      { type: "negative", percentage: 33 },
    ];
  }
  let pPos = Math.round((pos / sum) * 100);
  let pNeu = Math.round((neu / sum) * 100);
  let pNeg = Math.round((neg / sum) * 100);
  const drift = 100 - (pPos + pNeu + pNeg);
  pPos += drift;
  return [
    { type: "positive", percentage: Math.max(0, pPos) },
    { type: "neutral", percentage: Math.max(0, pNeu) },
    { type: "negative", percentage: Math.max(0, pNeg) },
  ];
}

function topTokensFromSamples(samples: string[], limit = 10): string[] {
  const freq = new Map<string, number>();
  for (const s of samples) {
    const parts = s.toLowerCase().match(/[a-z0-9']{3,}/gi) ?? [];
    for (const w of parts) {
      freq.set(w, (freq.get(w) ?? 0) + 1);
    }
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w);
}

function buildNumericRatingDistribution(
  dist: Record<string, number> | undefined,
  minRating: number,
  maxRating: number,
  averageRating?: number
): { rating: number; count: number }[] {
  const start = Number.isFinite(minRating) ? Math.floor(minRating) : 1;
  const end = Number.isFinite(maxRating) ? Math.floor(maxRating) : 10;
  if (end < start) return [];

  const scoreMap = new Map<number, number>();
  for (let r = start; r <= end; r++) scoreMap.set(r, 0);

  for (const [rawKey, rawCount] of Object.entries(dist ?? {})) {
    const count = Number(rawCount) || 0;
    if (count <= 0) continue;

    const key = rawKey.trim();
    const asInt = Number.parseInt(key, 10);
    if (Number.isFinite(asInt) && String(asInt) === key && asInt >= start && asInt <= end) {
      scoreMap.set(asInt, (scoreMap.get(asInt) ?? 0) + count);
      continue;
    }

    const rangeMatch = key.match(/(\d+)\s*[-–]\s*(\d+)/);
    if (rangeMatch) {
      const low = Number.parseInt(rangeMatch[1], 10);
      const high = Number.parseInt(rangeMatch[2], 10);
      if (Number.isFinite(low) && Number.isFinite(high)) {
        const from = Math.max(start, Math.min(low, high));
        const to = Math.min(end, Math.max(low, high));
        if (to >= from) {
          const buckets = to - from + 1;
          const perBucket = count / buckets;
          for (let r = from; r <= to; r++) {
            scoreMap.set(r, (scoreMap.get(r) ?? 0) + perBucket);
          }
          continue;
        }
      }
    }

    const nums = key.match(/\d+/g)?.map((n) => Number.parseInt(n, 10)) ?? [];
    if (nums.length === 1) {
      const n = nums[0];
      if (n >= start && n <= end) {
        scoreMap.set(n, (scoreMap.get(n) ?? 0) + count);
      }
    }
  }

  const rows: { rating: number; count: number }[] = [];
  for (let r = start; r <= end; r++) {
    rows.push({ rating: r, count: scoreMap.get(r) ?? 0 });
  }

  const total = rows.reduce((sum, row) => sum + row.count, 0);
  if (total <= 0 && averageRating != null && Number.isFinite(averageRating)) {
    const nearest = Math.min(end, Math.max(start, Math.round(averageRating)));
    return rows.map((row) => (row.rating === nearest ? { ...row, count: 1 } : row));
  }

  return rows;
}

function buildPlaceholderAiSummary(data: SurveyAnalyticsDetailData): SurveyDetails["aiSummary"] {
  const n = data.questionAnalytics?.length ?? 0;
  const text = `${data.surveyTitle}: ${data.responseRate}% response rate (${data.totalResponses} responses, ${data.recipients.total} recipients). ${n} question(s) — see breakdown below.`;
  const keyFindings: SurveyDetails["aiSummary"]["keyFindings"] = [
    { label: "Response rate", value: `${data.responseRate}%`, color: "bg-custom-green" },
    { label: "Completed", value: String(data.recipients.completed), color: "bg-custom-blue" },
    { label: "Pending", value: String(data.recipients.pending), color: "bg-custom-yellow" },
  ];
  if (data.ageDistribution?.length) {
    const top = [...data.ageDistribution].sort((a, b) => b.count - a.count)[0];
    keyFindings.push({
      label: "Top age group",
      value: top.range,
      color: "bg-custom-teal",
    });
  }
  return { text, keyFindings };
}

/**
 * Maps GET /survey/:id/analytics into the full details page model.
 */
export function mapSurveyAnalyticsDetailToSurveyDetails(
  data: SurveyAnalyticsDetailData
): SurveyDetails {
  const questions = [...(data.questionAnalytics ?? [])].sort(
    (a, b) => a.questionIndex - b.questionIndex
  );

  const targetAudience: RespondentType[] =
    data.participationByType?.length > 0
      ? [
          ...new Set(
            data.participationByType.map((p) => mapRecipientTypeToAudience(p.recipientType))
          ),
        ]
      : data.responsesByRecipientType?.length > 0
        ? [
            ...new Set(
              data.responsesByRecipientType.map((r) =>
                mapRecipientTypeToAudience(r.recipientType)
              )
            ),
          ]
        : ["Parent"];

  const questionRatings: SurveyDetails["questionRatings"] = [];
  for (const q of questions) {
    if (q.questionType === "likert_scale" && q.optionDistribution) {
      const avg = likertWeightedAverage(q.optionDistribution);
      if (avg > 0) {
        questionRatings.push({
          category: shortQuestionCategory(q.questionText),
          averageScore: Math.min(5, Math.max(0, avg)),
        });
      }
    } else if (q.questionType === "numeric_rating" && q.averageRating != null && q.maxRating) {
      const normalized = (q.averageRating / q.maxRating) * 5;
      questionRatings.push({
        category: shortQuestionCategory(q.questionText),
        averageScore: Math.min(5, Math.max(0, Math.round(normalized * 100) / 100)),
      });
    }
  }

  const questionBreakdown: SurveyDetails["questionBreakdown"] = questions.map((q, i) => {
    const id = `q-${q.questionIndex ?? i}`;
    if (q.questionType === "likert_scale" && q.optionDistribution) {
      return {
        id,
        question: q.questionText,
        type: "likert" as const,
        likertDistribution: orderLikertDistribution(q.optionDistribution),
      };
    }
    if (q.questionType === "numeric_rating") {
      const minR = q.minRating ?? 1;
      const maxR = q.maxRating ?? 10;
      return {
        id,
        question: q.questionText,
        type: "rating" as const,
        averageRating:
          q.averageRating != null ? Math.round(q.averageRating * 100) / 100 : undefined,
        maxRating: maxR,
        ratingDistribution: buildNumericRatingDistribution(
          q.optionDistribution,
          minR,
          maxR,
          q.averageRating
        ),
      };
    }
    const samples = q.sampleResponses ?? [];
    return {
      id,
      question: q.questionText,
      type: "text" as const,
      mostUsedWords: samples.length ? topTokensFromSamples(samples) : undefined,
      sampleResponses: samples.length ? samples : undefined,
    };
  });

  const published = data.surveyPublishedAt
    ? formatSurveyDateFromIso(data.surveyPublishedAt)
    : formatSurveyDateFromIso(data.surveyStartDate);

  return {
    id: data.surveyId,
    title: data.surveyTitle,
    createdOn: published,
    lastUpdated: published,
    description: data.surveyDescription ?? "",
    status: normalizeSurveyStatus(data.status),
    responseRate: Math.round(data.responseRate ?? 0),
    completed: data.recipients?.completed ?? 0,
    pending: data.recipients?.pending ?? 0,
    recipientsSent: data.recipients?.sent,
    totalRecipients: data.recipients?.total ?? data.surveyTotalRecipients ?? 0,
    startDate: formatSurveyDateFromIso(data.surveyStartDate),
    endDate: formatSurveyDateFromIso(data.surveyEndDate),
    targetAudience,
    participationTrend: buildParticipationTrendFromAnalytics(data),
    aiSummary: buildPlaceholderAiSummary(data),
    questionRatings:
      questionRatings.length > 0
        ? questionRatings
        : [{ category: "No scale questions yet", averageScore: 0 }],
    sentimentDistribution: sentimentFromAnalyticsLikert(questions),
    questionBreakdown,
    individualResponses: [],
  };
}

function mapApiQuestionTypeToBreakdownType(
  raw: string
): QuestionType {
  const t = raw?.toLowerCase() ?? "";
  if (t.includes("likert")) return "likert";
  if (t.includes("numeric") || t.includes("rating")) return "rating";
  return "text";
}

/**
 * Fallback when analytics is unavailable: build a minimal details view from GET /survey/:id.
 */
export function mapCreateSurveyDataToSurveyDetails(data: CreateSurveyData): SurveyDetails {
  const template = surveyDetailsData[0];
  const ordered = [...(data.questions ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const start = formatSurveyDateFromIso(data.startDate ?? new Date().toISOString());
  const end = formatSurveyDateFromIso(data.endDate ?? new Date().toISOString());
  const created = formatSurveyDateFromIso(data.createdAt ?? new Date().toISOString());

  return {
    ...template,
    id: data.id,
    title: data.title,
    description: data.description,
    status: normalizeSurveyStatus(data.status),
    createdOn: created,
    lastUpdated: created,
    startDate: start,
    endDate: end,
    targetAudience: mapTargetGroupToAudience(data.category) as RespondentType[],
    responseRate: 0,
    completed: 0,
    pending: 0,
    totalRecipients: 0,
    recipientsSent: undefined,
    participationTrend: [{ date: start, responses: 0 }],
    questionRatings: [],
    sentimentDistribution: template.sentimentDistribution,
    aiSummary: template.aiSummary,
    questionBreakdown: ordered.map((q, i) => {
      const t = mapApiQuestionTypeToBreakdownType(q.questionType);
      const id = `q-${q.order ?? i}`;
      if (t === "rating") {
        return {
          id,
          question: q.questionText,
          type: "rating" as const,
          maxRating: q.maxValue ?? 10,
        };
      }
      if (t === "likert") {
        return {
          id,
          question: q.questionText,
          type: "likert" as const,
          likertDistribution: (q.options ?? []).map((label) => ({ label, count: 0 })),
        };
      }
      return {
        id,
        question: q.questionText,
        type: "text" as const,
      };
    }),
    individualResponses: [],
  };
}

import apiClient from "./axios";

/** Single question in create survey response */
export interface CreateSurveyQuestion {
  questionText: string;
  questionType: string;
  required?: boolean;
  order: number;
  options?: string[];
  minValue?: number | null;
  maxValue?: number | null;
  minLabel?: string | null;
  maxLabel?: string | null;
}

/** Survey created by POST /survey/create */
export interface CreateSurveyData {
  id: string;
  title: string;
  category: string;
  description: string;
  estimatedTime: number;
  questions: CreateSurveyQuestion[];
  status: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
}

export interface CreateSurveyResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: CreateSurveyData;
}

// --- AI Generate Survey Questions ---

export interface AiGenerateSurveyQuestionsPayload {
  prompt: string;
}

export interface AiGenerateSurveyQuestionsQuestion {
  questionText?: string;
  text?: string;
  questionType?: string;
  type?: string;
  order?: number;
  required?: boolean;
  options?: string[];
  minValue?: number | null;
  maxValue?: number | null;
  minLabel?: string | null;
  maxLabel?: string | null;
}

export interface AiGenerateSurveyQuestionsData {
  surveyId?: string;
  id?: string;
  title?: string;
  surveyTitle?: string;
  category?: string;
  description?: string;
  estimatedTime?: number;
  questions?: AiGenerateSurveyQuestionsQuestion[];
  generatedQuestions?: AiGenerateSurveyQuestionsQuestion[];
  survey?: {
    id?: string;
    surveyId?: string;
    title?: string;
    questions?: AiGenerateSurveyQuestionsQuestion[];
  };
}

export interface AiGenerateSurveyQuestionsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: AiGenerateSurveyQuestionsData;
}

/** Payload for creating a survey – API requires title, category, description, estimatedTime, startDate, endDate; questions optional */
export interface CreateSurveyPayload {
  title: string;
  category: string;
  description: string;
  estimatedTime?: number; // 1–120 minutes
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  questions?: CreateSurveyQuestion[];
}

const MIN_ESTIMATED_TIME = 1;
const MAX_ESTIMATED_TIME = 120;

/** Start of day in UTC as ISO string */
function toStartOfDayISO(d: Date): string {
  const date = new Date(d);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
}

/** Add days to a date (returns new Date) */
function addDays(d: Date, days: number): Date {
  const out = new Date(d);
  out.setUTCDate(out.getUTCDate() + days);
  return out;
}

/**
 * Create a new survey (draft) – POST /survey/create
 * Sends default title, category, description, estimatedTime, startDate and endDate if not provided (API requires all).
 * estimatedTime is clamped to 1–120 minutes. startDate defaults to today (UTC), endDate to startDate + 30 days.
 * @param payload optional – title, category, description, estimatedTime (1–120), startDate, endDate (ISO strings)
 * @returns Created survey data (id, title, questions, etc.)
 * @throws Error if statusCode !== 201 or success !== true or request fails
 */
export const createSurveyApi = async (
  payload?: Partial<CreateSurveyPayload>
): Promise<CreateSurveyData> => {
  const defaultTitle = `New Survey ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`;
  const defaultCategory = "Students";
  const defaultDescription = "We value your feedback. This survey helps us understand your experience and improve.";
  const rawEstimated = payload?.estimatedTime ?? 10;
  const estimatedTime = Math.min(
    MAX_ESTIMATED_TIME,
    Math.max(MIN_ESTIMATED_TIME, Number(rawEstimated) || 10)
  );
  const today = new Date();
  const defaultStart = payload?.startDate?.trim() || toStartOfDayISO(today);
  const defaultEnd =
    payload?.endDate?.trim() ||
    toStartOfDayISO(addDays(new Date(defaultStart), 30));
  const body = {
    title: payload?.title?.trim() || defaultTitle,
    category: payload?.category?.trim() || defaultCategory,
    description: payload?.description?.trim() || defaultDescription,
    estimatedTime,
    startDate: defaultStart,
    endDate: defaultEnd,
    ...(payload?.questions != null && payload.questions.length > 0 && { questions: payload.questions }),
  };
  const response = await apiClient.post<CreateSurveyResponse>("/survey/create", body, {
    skipErrorToast: true,
  });

  if (response.status !== 201 || !response.data?.success || !response.data?.data) {
    throw new Error(
      response.data?.message ?? "Failed to create survey."
    );
  }

  const { statusCode, success, data } = response.data;
  if (statusCode !== 201 || !success || !data?.id) {
    throw new Error(
      response.data?.message ?? "Survey was not created successfully."
    );
  }

  return data;
};

/**
 * Generate survey questions with AI.
 * POST /school-admin/surveys/ai-generate-questions
 */
export const aiGenerateSurveyQuestionsApi = async (
  payload: AiGenerateSurveyQuestionsPayload
): Promise<AiGenerateSurveyQuestionsData> => {
  const prompt = payload?.prompt?.trim();
  if (!prompt) {
    throw new Error("Prompt is required.");
  }

  const response = await apiClient.post<AiGenerateSurveyQuestionsResponse>(
    "/school-admin/surveys/ai-generate-questions",
    { prompt },
    { skipErrorToast: true }
  );

  if (!response.data?.success || !response.data?.data) {
    throw new Error(
      response.data?.message ?? "Failed to generate survey questions."
    );
  }

  return response.data.data;
};

// --- Add Recipients – POST /survey/:surveyId/recipients ---

export type RecipientType = "Parent" | "Staff" | "Alumni";

export interface AddRecipientItem {
  fullName: string;
  email: string;
  recipientType: RecipientType;
}

export interface AddRecipientsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data?: {
    added: number;
    duplicatesSkipped: number;
    totalRecipients: number;
  };
}

/**
 * Add recipients to a draft survey – POST /survey/:surveyId/recipients
 * Survey must be in draft status. On 400 "Recipients can only be added to draft surveys", throw with that message.
 */
export const addRecipientsApi = async (
  surveyId: string,
  recipients: AddRecipientItem[]
): Promise<{ added: number; duplicatesSkipped: number; totalRecipients: number }> => {
  try {
    const response = await apiClient.post<AddRecipientsResponse>(
      `/survey/${surveyId}/recipients`,
      { recipients },
      { skipErrorToast: true }
    );

    const data = response.data;
    if (response.status === 400 || (data && !data.success)) {
      const msg = data?.message ?? "Recipients can only be added to draft surveys.";
      throw new Error(msg);
    }

    if (response.status !== 201 || !data?.success || !data?.data) {
      throw new Error(data?.message ?? "Failed to add recipients.");
    }

    return {
      added: data.data.added ?? 0,
      duplicatesSkipped: data.data.duplicatesSkipped ?? 0,
      totalRecipients: data.data.totalRecipients ?? 0,
    };
  } catch (err: unknown) {
    const ax = err as { response?: { data?: { message?: string } }; message?: string };
    const msg = ax?.response?.data?.message ?? (err instanceof Error ? err.message : "Failed to add recipients.");
    throw new Error(msg);
  }
};

// --- Upload Recipients CSV – POST /survey/:surveyId/recipients/csv ---

export interface UploadRecipientsCsvResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data?: {
    added: number;
    duplicatesSkipped: number;
    totalRecipients: number;
  };
}

/**
 * Upload CSV file to add recipients to a draft survey – POST /survey/:surveyId/recipients/csv
 * Survey must be in draft status.
 */
export const uploadRecipientsCsvApi = async (
  surveyId: string,
  file: File
): Promise<{ added: number; duplicatesSkipped: number; totalRecipients: number }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<UploadRecipientsCsvResponse>(
    `/survey/${surveyId}/recipients/csv`,
    formData,
    { skipErrorToast: true }
  );

  const data = response.data;
  if (!data?.success || !data?.data) {
    throw new Error(data?.message ?? "Failed to upload CSV.");
  }

  return {
    added: data.data.added ?? 0,
    duplicatesSkipped: data.data.duplicatesSkipped ?? 0,
    totalRecipients: data.data.totalRecipients ?? 0,
  };
};

// --- Get My Surveys – GET /survey/my-surveys ---

export interface MySurveyItem {
  id: string;
  title: string;
  category: string;
  description: string;
  estimatedTime: number;
  status: "draft" | "active" | "ended";
  startDate?: string;
  endDate?: string;
  totalRecipients: number;
  totalResponses: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetMySurveysResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    surveys: MySurveyItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalSurveys: number;
      limit: number;
    };
  };
}

/**
 * Fetch all surveys for the current user – GET /survey/my-surveys
 * @param params optional – page, limit for pagination
 */
export const getMySurveysApi = async (
  params?: { page?: number; limit?: number }
): Promise<GetMySurveysResponse["data"]> => {
  const searchParams = new URLSearchParams();
  if (params?.page != null) searchParams.set("page", String(params.page));
  if (params?.limit != null) searchParams.set("limit", String(params.limit));
  const query = searchParams.toString();
  const url = query ? `/survey/my-surveys?${query}` : "/survey/my-surveys";

  const response = await apiClient.get<GetMySurveysResponse>(url, {
    skipErrorToast: true,
  });

  if (!response.data?.success || !response.data?.data) {
    throw new Error(response.data?.message ?? "Failed to fetch surveys.");
  }

  return response.data.data;
};

// --- Delete Survey – DELETE /survey/:surveyId ---

export interface DeleteSurveyResponse {
  statusCode: number;
  success: boolean;
  message: string;
}

/**
 * Delete a survey – DELETE /survey/:surveyId
 * Deletes the survey and all related data.
 */
export const deleteSurveyApi = async (surveyId: string): Promise<void> => {
  const response = await apiClient.delete<DeleteSurveyResponse>(
    `/survey/${surveyId}`,
    { skipErrorToast: true }
  );

  if (!response.data?.success) {
    throw new Error(response.data?.message ?? "Failed to delete survey.");
  }
};

// --- Publish Survey (draft → published) ---

export interface PublishSurveyResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data?: CreateSurveyData & { status?: string };
}

/**
 * Publish a survey – POST /survey/:surveyId/publish
 * After publishing, recipients cannot be added.
 * @throws Error with API message on failure (e.g. "Survey must have at least one recipient before publishing")
 */
export const publishSurveyApi = async (surveyId: string): Promise<PublishSurveyResponse["data"]> => {
  try {
    const response = await apiClient.post<PublishSurveyResponse>(
      `/survey/${surveyId}/publish`,
      {},
      { skipErrorToast: true }
    );

    if (!response.data?.success) {
      throw new Error(response.data?.message ?? "Failed to publish survey.");
    }

    return response.data?.data;
  } catch (err: unknown) {
    const ax = err as { response?: { data?: { message?: string } }; message?: string };
    const msg =
      ax?.response?.data?.message ??
      (err instanceof Error ? err.message : "Failed to publish survey.");
    throw new Error(msg);
  }
};

// --- Get/Update Survey by Id ---

export interface GetSurveyByIdResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: CreateSurveyData;
}

/**
 * Fetch a survey by id – GET /survey/:surveyId
 */
export const getSurveyByIdApi = async (surveyId: string): Promise<CreateSurveyData> => {
  const response = await apiClient.get<GetSurveyByIdResponse>(`/survey/${surveyId}`, {
    skipErrorToast: true,
  });

  if (!response.data?.success || !response.data?.data) {
    throw new Error(response.data?.message ?? "Failed to fetch survey.");
  }

  return response.data.data;
};

export interface UpdateSurveyResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data?: CreateSurveyData;
}

/**
 * Update a draft survey – PATCH /survey/edit/:surveyId
 */
export const updateSurveyApi = async (
  surveyId: string,
  payload: CreateSurveyPayload
): Promise<CreateSurveyData> => {
  const response = await apiClient.patch<UpdateSurveyResponse>(
    `/survey/edit/${surveyId}`,
    payload,
    { skipErrorToast: true }
  );

  if (!response.data?.success || !response.data?.data) {
    throw new Error(response.data?.message ?? "Failed to update survey.");
  }

  return response.data.data;
};

// --- Survey Analytics Dashboard ---

export interface SurveyAnalyticsWeeklyPoint {
  week: number;
  weekStart: string;
  weekEnd: string;
  cumulativeResponses: number;
  responseRate: number;
}

export interface LastFinishedSurveyAnalytics {
  surveyId: string;
  title: string;
  status: "draft" | "active" | "ended" | string;
  startDate: string;
  endDate: string;
  totalRecipients: number;
  totalResponses: number;
  weeklyResponseRate: SurveyAnalyticsWeeklyPoint[];
}

export interface SurveyAnalyticsDashboardData {
  totalSurveys: number;
  activeSurveys: number;
  responseRateAvg: number;
  reviewsCount: number;
  approvedReviewsCount: number;
  lastFinishedSurveyAnalytics: LastFinishedSurveyAnalytics | null;
}

export interface SurveyAnalyticsDashboardResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: SurveyAnalyticsDashboardData;
}

/**
 * Fetch pulse survey analytics dashboard.
 * GET /survey/analytics/dashboard
 */
export const getSurveyAnalyticsDashboardApi =
  async (): Promise<SurveyAnalyticsDashboardData> => {
    const response = await apiClient.get<SurveyAnalyticsDashboardResponse>(
      "/survey/analytics/dashboard",
      { skipErrorToast: true }
    );

    if (!response.data?.success || !response.data?.data) {
      throw new Error(
        response.data?.message ?? "Failed to fetch survey analytics dashboard."
      );
    }

    return response.data.data;
  };

// --- Survey detail analytics – GET /survey/:surveyId/analytics ---

export interface SurveyAnalyticsRecipients {
  total: number;
  pending: number;
  sent: number;
  completed: number;
}

export interface SurveyAnalyticsResponseByRecipientType {
  recipientType: string;
  responses: number;
}

export interface SurveyAnalyticsParticipationByType {
  recipientType: string;
  total: number;
  completed: number;
  rate: number;
}

export interface SurveyAnalyticsAgeBucket {
  range: string;
  count: number;
}

export interface SurveyAnalyticsQuestionItem {
  questionIndex: number;
  questionText: string;
  questionType: string;
  totalResponses: number;
  optionDistribution?: Record<string, number>;
  averageRating?: number;
  minRating?: number;
  maxRating?: number;
  sampleResponses?: string[];
}

export interface SurveyAnalyticsDetailData {
  surveyId: string;
  surveyTitle: string;
  surveyDescription: string;
  surveyEstimatedTime: number;
  surveyStartDate: string;
  surveyEndDate: string;
  surveyTotalRecipients: number;
  surveyTotalResponses: number;
  surveyPublishedAt: string;
  status: string;
  responseRate: number;
  totalResponses: number;
  recipients: SurveyAnalyticsRecipients;
  responsesByRecipientType: SurveyAnalyticsResponseByRecipientType[];
  participationByType: SurveyAnalyticsParticipationByType[];
  ageDistribution: SurveyAnalyticsAgeBucket[];
  questionAnalytics: SurveyAnalyticsQuestionItem[];
}

export interface SurveyAnalyticsDetailResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: SurveyAnalyticsDetailData;
}

/**
 * Per-survey analytics for the pulse survey details page.
 * GET /survey/:surveyId/analytics
 */
export const getSurveyAnalyticsBySurveyIdApi = async (
  surveyId: string
): Promise<SurveyAnalyticsDetailData> => {
  const id = surveyId?.trim();
  if (!id) {
    throw new Error("Survey id is required.");
  }

  const response = await apiClient.get<SurveyAnalyticsDetailResponse>(
    `/survey/${id}/analytics`,
    { skipErrorToast: true }
  );

  if (!response.data?.success || !response.data?.data) {
    throw new Error(
      response.data?.message ?? "Failed to fetch survey analytics."
    );
  }

  return response.data.data;
};

// --- School admin survey AI text summary – GET /school-admin/surveys/:surveyId/ai-text-summary ---

export interface SurveyAiTextSummarySentimentDistribution {
  positive: number;
  neutral: number;
  negative: number;
}

export interface SurveyAiTextSummaryData {
  surveyId: string;
  surveyTitle: string;
  summaryText: string;
  overallSatisfactionPercentage: number;
  commonConcern: string | null;
  strongArea: string | null;
  sentiment: string;
  sentimentDistribution: SurveyAiTextSummarySentimentDistribution;
  cached: boolean;
}

export interface SurveyAiTextSummaryResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: SurveyAiTextSummaryData;
}

/**
 * AI-generated narrative summary and sentiment for a survey.
 * GET /school-admin/surveys/:surveyId/ai-text-summary
 * (baseURL is expected to include /api/v1.)
 */
export const getSurveyAiTextSummaryApi = async (
  surveyId: string
): Promise<SurveyAiTextSummaryData> => {
  const id = surveyId?.trim();
  if (!id) {
    throw new Error("Survey id is required.");
  }

  const response = await apiClient.get<SurveyAiTextSummaryResponse>(
    `/school-admin/surveys/${id}/ai-text-summary`,
    { skipErrorToast: true }
  );

  if (!response.data?.success || !response.data?.data) {
    throw new Error(
      response.data?.message ?? "Failed to fetch survey AI summary."
    );
  }

  return response.data.data;
};

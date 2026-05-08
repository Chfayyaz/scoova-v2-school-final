import axios from "axios";
import apiClient from "./axios";

/** Payload for creating a job opening */
export interface CreateJobPayload {
  school: string;
  title: string;
  department: string;
  jobType: string;
  yearsOfExperience: number;
  applicationDeadline: string;
  salary?: number;
  salaryBenefit?: number;
  startDate?: string;
  requirements: string[];
  aboutRole: string;
  responsibilities: string[];
  documents?: string[];
}

/** Job object returned from the API */
export interface Job {
  id: string;
  school: string;
  title: string;
  department: string;
  jobType: string;
  yearsOfExperience: number;
  applicationDeadline: string;
  requirements: string[];
  aboutRole: string;
  responsibilities: string[];
  documents: string[];
  status: string;
  createdAt: string;
}

/** API response wrapper for create job */
export interface CreateJobResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Job;
}

/**
 * Create a job opening – POST {baseURL}/job/create (baseURL already includes /api/v1)
 *
 * - If no file: sends JSON payload.
 * - If file selected: sends FormData (required for binary file upload).
 *   Array fields (requirements, responsibilities) are JSON-stringified in FormData.
 *
 * @param payload - Job creation payload
 * @param documentFile - Optional PDF/DOC file to attach
 * @returns The created job (response.data.data)
 * @throws Error with API message on failure
 */
export const createJobApi = async (
  payload: CreateJobPayload,
  documentFile?: File | null
): Promise<Job> => {
  const body: CreateJobPayload | FormData = documentFile
    ? buildJobFormData(payload, documentFile)
    : payload;

  let response: { data: CreateJobResponse };
  try {
    response = await apiClient.post<CreateJobResponse>("/job/create", body, {
      skipErrorToast: true,
    });
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.data && typeof err.response.data === "object") {
      const msg = (err.response.data as { message?: unknown }).message;
      if (typeof msg === "string" && msg.trim()) {
        throw new Error(msg);
      }
    }
    if (err instanceof Error) throw err;
    throw new Error("Failed to create job. Please try again.");
  }

  if (!response.data?.success || !response.data?.data) {
    throw new Error(
      response.data?.message ?? "Failed to create job. Please try again."
    );
  }

  return response.data.data;
};

/** Build FormData for job create with file – arrays as JSON strings */
function buildJobFormData(payload: CreateJobPayload, documentFile: File): FormData {
  const formData = new FormData();
  formData.append("school", payload.school);
  formData.append("title", payload.title);
  formData.append("department", payload.department);
  formData.append("jobType", payload.jobType);
  formData.append("yearsOfExperience", String(payload.yearsOfExperience));
  formData.append("applicationDeadline", payload.applicationDeadline);
  formData.append("requirements", JSON.stringify(payload.requirements));
  formData.append("aboutRole", payload.aboutRole);
  formData.append("responsibilities", JSON.stringify(payload.responsibilities));

  if (payload.salary != null) formData.append("salary", String(payload.salary));
  if (payload.startDate) formData.append("startDate", payload.startDate);

  formData.append("documents", documentFile);
  return formData;
}

// --- Update Job – PATCH /job/edit/:id ---

/** Payload for updating a job (same shape as create, without school) */
export interface UpdateJobPayload {
  title?: string;
  department?: string;
  jobType?: string;
  yearsOfExperience?: number;
  applicationDeadline?: string;
  salary?: number;
  startDate?: string;
  requirements?: string[];
  aboutRole?: string;
  responsibilities?: string[];
  documents?: string[];
}

export interface UpdateJobResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: JobDetailsData;
}

/**
 * Update a job – PATCH /job/edit/:id
 * @param id - Job id
 * @param payload - Fields to update
 * @param documentFile - Optional new document file to attach
 */
export const updateJobApi = async (
  id: string,
  payload: UpdateJobPayload,
  documentFile?: File | null
): Promise<JobDetailsData> => {
  let body: UpdateJobPayload | FormData;

  if (documentFile) {
    const formData = new FormData();
    if (payload.title) formData.append("title", payload.title);
    if (payload.department) formData.append("department", payload.department);
    if (payload.jobType) formData.append("jobType", payload.jobType);
    if (payload.yearsOfExperience != null) formData.append("yearsOfExperience", String(payload.yearsOfExperience));
    if (payload.applicationDeadline) formData.append("applicationDeadline", payload.applicationDeadline);
    if (payload.salary != null) formData.append("salary", String(payload.salary));
    if (payload.startDate) formData.append("startDate", payload.startDate);
    if (payload.requirements) formData.append("requirements", JSON.stringify(payload.requirements));
    if (payload.aboutRole) formData.append("aboutRole", payload.aboutRole);
    if (payload.responsibilities) formData.append("responsibilities", JSON.stringify(payload.responsibilities));
    formData.append("documents", documentFile);
    body = formData;
  } else {
    body = payload;
  }

  const response = await apiClient.patch<UpdateJobResponse>(
    `/job/edit/${id}`,
    body
  );

  if (!response.data?.success || !response.data?.data) {
    throw new Error(
      response.data?.message ?? "Failed to update job. Please try again."
    );
  }

  return response.data.data;
};

// --- Remove Job Document – PATCH /job/:id/remove-document ---

export interface RemoveJobDocumentResponse {
  statusCode: number;
  success: boolean;
  message: string;
}

/** JSON config for job document removal (errors handled in the UI). */
const removeJobDocumentRequestConfig = {
  headers: { "Content-Type": "application/json" },
  skipErrorToast: true,
} as const;

interface RemoveJobDocumentBody {
  /** Backend validates this (e.g. “Document URL is required”). */
  documentUrl: string;
}

/**
 * Remove the job’s attached file.
 * PATCH `/job/{jobId}/remove-document` with the stored file URL.
 */
export const removeJobDocumentApi = async (
  jobId: string,
  documentUrl: string
): Promise<void> => {
  const trimmed = documentUrl.trim();
  if (!trimmed) {
    throw new Error("No document URL to remove.");
  }

  try {
    const { data } = await apiClient.patch<RemoveJobDocumentResponse>(
      `/job/${jobId}/remove-document`,
      { documentUrl: trimmed } satisfies RemoveJobDocumentBody,
      removeJobDocumentRequestConfig
    );

    if (!data?.success) {
      throw new Error(data?.message ?? "Failed to remove document. Please try again.");
    }
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data && typeof err.response.data === "object") {
      const msg = (err.response.data as { message?: unknown }).message;
      if (typeof msg === "string" && msg.length > 0) {
        throw new Error(msg);
      }
    }
    throw err;
  }
};

// --- My Jobs (list) API ---

/** Single job in my-jobs list response (includes optional gallery) */
export interface MyJobsJob {
  id: string;
  title: string;
  department: string;
  jobType: string;
  yearsOfExperience: number;
  applicationDeadline: string;
  requirements?: string[];
  aboutRole?: string;
  responsibilities?: string[];
  documents?: string[];
  status: string;
  createdAt: string;
  updatedAt?: string;
  gallery?: string[];
}

export interface MyJobsPagination {
  currentPage: number;
  totalPages: number;
  totalJobs: number;
  limit: number;
}

export interface MyJobsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    jobs: MyJobsJob[];
    pagination: MyJobsPagination;
  };
}

/** Params for my-jobs list: search, jobTypeId (visible in Network tab), pagination */
export interface MyJobsParams {
  search?: string;
  jobTypeId?: string;
  page?: number;
  limit?: number;
}

/**
 * Fetch current user's jobs – GET /job/my-jobs?search=...&jobTypeId=...&page=...&limit=...
 * Selected jobTypeId is sent as query param (visible in Network tab).
 */
export const getMyJobsApi = async (
  params?: MyJobsParams
): Promise<{ jobs: MyJobsJob[]; pagination: MyJobsPagination }> => {
  const search = params?.search?.trim();
  const jobTypeId = params?.jobTypeId?.trim();
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;

  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (jobTypeId) {
    query.set("jobTypeId", jobTypeId);
    query.set("jobType", jobTypeId);
  }
  query.set("page", String(page));
  query.set("limit", String(limit));

  const url = `/job/my-jobs?${query.toString()}`;
  const response = await apiClient.get<MyJobsResponse>(url);

  if (!response.data?.success || !response.data?.data) {
    throw new Error(
      response.data?.message ?? "Failed to load jobs."
    );
  }

  const { jobs, pagination } = response.data.data;
  return { jobs: jobs ?? [], pagination: pagination ?? { currentPage: 1, totalPages: 1, totalJobs: 0, limit: 20 } };
};

// --- Job by ID (details) API ---

/** CreatedBy from job details API */
export interface JobCreatedBy {
  _id: string;
  name: string;
  email: string;
}

/** Document can be URL string or object with url and optional filename */
export type DocumentItem = string | { url: string; originalName?: string; filename?: string };

/** Extract filename from document URL or object (e.g. https://.../path/file.pdf -> file.pdf) */
export function getDocumentFileName(doc: DocumentItem): string {
  if (!doc) return "Document";
  if (typeof doc === "object") {
    const name = doc.originalName ?? doc.filename;
    if (name) return name;
    return getDocumentFileName(doc.url);
  }
  if (typeof doc !== "string") return "Document";
  try {
    const url = doc.startsWith("http") ? doc : `https://${doc}`;
    const path = new URL(url).pathname;
    const fileName = path.split("/").filter(Boolean).pop() || "";
    if (fileName && fileName.includes(".")) return decodeURIComponent(fileName);
    return "Document";
  } catch {
    return "Document";
  }
}

/** Get document URL from DocumentItem */
export function getDocumentUrl(doc: DocumentItem): string {
  if (!doc) return "";
  if (typeof doc === "object") return doc.url ?? "";
  return doc;
}

/** Single job details – matches GET /job/:id response */
export interface JobDetailsData {
  id: string;
  school?: string;
  createdBy?: JobCreatedBy;
  title: string;
  department?: string;
  jobType?: string;
  yearsOfExperience?: number;
  applicationDeadline?: string;
  salary?: number;
  salaryBenefit?: number;
  startDate?: string;
  requirements?: string[];
  aboutRole?: string;
  responsibilities?: string[];
  documents?: DocumentItem[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobDetailsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: JobDetailsData;
}

/**
 * Fetch a single job by id – GET /job/{id}
 * @param id - Job id
 * @returns Job details (title, aboutRole, responsibilities, requirements, documents)
 */
export const getJobByIdApi = async (id: string): Promise<JobDetailsData> => {
  const response = await apiClient.get<JobDetailsResponse>(`/job/${id}`);

  if (!response.data?.success || !response.data?.data) {
    throw new Error(
      response.data?.message ?? "Failed to load job details."
    );
  }

  return response.data.data;
};

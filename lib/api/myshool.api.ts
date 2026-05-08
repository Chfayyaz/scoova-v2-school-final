import axios from "axios";
import apiClient from "./axios";
import type { HeaderCardProps, InfoCard } from "@/app/(dashboard)/my-school/data";

export type MySchoolManagementMember = {
  fullName: string;
  image: string;
  role: string;
  _id: string;
};

export type MySchoolData = {
  profileImage: string | null;
  name: string;
  foundedYear: number;
  principalName: string;
  totalStudents: number;
  overallRating: number;
  type: string;
  bio: string;
  location: string;
  country: string;
  state: string;
  city: string;
  gallery: string[];
  managementTeam: MySchoolManagementMember[];
  websiteUrl: string;
  receiveReviewSubmissionActivity: boolean;
  receiveFollowActivity: boolean;
};

type MySchoolResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: Partial<MySchoolData> & {
    profileImage?: string | null;
    name?: string;
    foundedYear?: number;
    principalName?: string;
    totalStudents?: number;
    overallRating?: number;
    type?: string;
    bio?: string;
    location?: string;
    country?: string;
    state?: string;
    city?: string;
    gallery?: string[];
    managementTeam?: MySchoolManagementMember[];
    websiteUrl?: string;
    receiveReviewSubmissionActivity?: boolean;
    receiveFollowActivity?: boolean;
  };
};

/** PATCH /school-admin/my-school/gallery/add | .../remove */
type GalleryMutationApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: { gallery?: string[] };
};

export type GalleryMutationResult = {
  gallery: string[];
  message: string;
};

/** Form field name for multipart uploads (must match backend multer / parser). */
const GALLERY_UPLOAD_FIELD = "gallery";

function mapGalleryAxiosError(error: unknown, fallback: string): Error {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data;
    if (body && typeof body === "object" && "message" in body) {
      const msg = (body as { message: unknown }).message;
      if (typeof msg === "string" && msg.trim()) return new Error(msg);
    }
  }
  if (error instanceof Error) return error;
  return new Error(fallback);
}

function parseGalleryMutationResponse(data: GalleryMutationApiResponse): GalleryMutationResult {
  if (!data.success || !Array.isArray(data.data?.gallery)) {
    throw new Error(data.message ?? "Gallery request failed.");
  }
  return { gallery: data.data.gallery, message: data.message };
}

/**
 * PATCH /school-admin/my-school/gallery/add — multipart, at least one image file.
 */
export async function addMySchoolGalleryImages(files: File[]): Promise<GalleryMutationResult> {
  if (files.length === 0) {
    throw new Error("Please upload at least one gallery image");
  }

  const formData = new FormData();
  for (const file of files) {
    formData.append(GALLERY_UPLOAD_FIELD, file);
  }

  try {
    const { data } = await apiClient.patch<GalleryMutationApiResponse>(
      "/school-admin/my-school/gallery/add",
      formData,
      { skipErrorToast: true }
    );
    return parseGalleryMutationResponse(data);
  } catch (e) {
    throw mapGalleryAxiosError(e, "Failed to add gallery images.");
  }
}

/**
 * PATCH /school-admin/my-school/gallery/remove — body `{ galleryToRemove: string[] }`.
 */
export async function removeMySchoolGalleryImage(imageUrl: string): Promise<GalleryMutationResult> {
  const trimmed = imageUrl.trim();
  if (!trimmed) {
    throw new Error("Missing gallery image URL.");
  }

  try {
    const { data } = await apiClient.patch<GalleryMutationApiResponse>(
      "/school-admin/my-school/gallery/remove",
      { galleryToRemove: [trimmed] },
      { skipErrorToast: true }
    );
    return parseGalleryMutationResponse(data);
  } catch (e) {
    throw mapGalleryAxiosError(e, "Failed to remove gallery image.");
  }
}

type ManagementTeamMutationApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: { managementTeam?: MySchoolManagementMember[] };
};

export type ManagementTeamMutationResult = {
  managementTeam: MySchoolManagementMember[];
  message: string;
};

function parseManagementTeamMutationResponse(
  data: ManagementTeamMutationApiResponse
): ManagementTeamMutationResult {
  if (!data.success) {
    throw new Error(data.message ?? "Management team request failed.");
  }
  const raw = data.data?.managementTeam;
  if (!Array.isArray(raw)) {
    return { managementTeam: [], message: data.message };
  }
  return { managementTeam: raw, message: data.message };
}

/** One row for `managementTeamAdd` JSON array (multipart). */
export type ManagementTeamAddEntry = {
  fullName: string;
  role: string;
};

function buildManagementTeamAddFormData(
  entries: ManagementTeamAddEntry[],
  imageFiles: File[]
): FormData {
  if (entries.length === 0) {
    throw new Error("Add at least one management team member.");
  }
  if (imageFiles.length !== entries.length) {
    throw new Error(
      "Please upload one managementTeamImages file per managementTeamAdd member."
    );
  }

  const formData = new FormData();
  formData.append("managementTeamAdd", JSON.stringify(entries));
  for (const file of imageFiles) {
    formData.append("managementTeamImages", file);
  }
  return formData;
}

/**
 * PATCH /school-admin/my-school/management-team/add — multipart:
 * - `managementTeamAdd`: JSON array `[{ fullName, role }, …]`
 * - `managementTeamImages`: one file per entry (same field name, repeated).
 */
export async function addMySchoolManagementTeamMembers(
  entries: ManagementTeamAddEntry[],
  imageFiles: File[]
): Promise<ManagementTeamMutationResult> {
  const formData = buildManagementTeamAddFormData(entries, imageFiles);

  try {
    const { data } = await apiClient.patch<ManagementTeamMutationApiResponse>(
      "/school-admin/my-school/management-team/add",
      formData,
      { skipErrorToast: true }
    );
    return parseManagementTeamMutationResponse(data);
  } catch (e) {
    throw mapGalleryAxiosError(e, "Failed to add team member.");
  }
}

/**
 * PATCH /school-admin/my-school/management-team/remove
 * Body: `{ managementTeamToRemove: string[] }` — each string is the member's **image URL** (e.g. Cloudinary).
 */
export async function removeMySchoolManagementTeamMembers(
  imageUrls: string[]
): Promise<ManagementTeamMutationResult> {
  const urls = imageUrls.map((u) => u.trim()).filter(Boolean);
  if (urls.length === 0) {
    throw new Error("managementTeamToRemove must include at least one image URL.");
  }

  try {
    const { data } = await apiClient.patch<ManagementTeamMutationApiResponse>(
      "/school-admin/my-school/management-team/remove",
      { managementTeamToRemove: urls },
      {
        headers: { "Content-Type": "application/json" },
        skipErrorToast: true,
      }
    );
    return parseManagementTeamMutationResponse(data);
  } catch (e) {
    throw mapGalleryAxiosError(e, "Failed to remove team member.");
  }
}

const LEADER_ICON = "/images/svg/whitepersonicon.svg";

function splitLocation(full: unknown): { city: string; country: string } {
  const raw = typeof full === "string" ? full : "";
  const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return { city: parts[0], country: parts.slice(1).join(", ") };
  }
  return { city: raw, country: "" };
}

function normalizeMySchoolData(raw: MySchoolResponse["data"]): MySchoolData {
  const fromLocation = splitLocation(raw.location);
  const city = (raw.city ?? fromLocation.city ?? "").trim();
  const country = (raw.country ?? fromLocation.country ?? "").trim();
  const state = (raw.state ?? "").trim();
  const location = [city, state, country].filter(Boolean).join(", ");

  return {
    profileImage: raw.profileImage ?? null,
    name: raw.name ?? "",
    foundedYear: raw.foundedYear ?? 0,
    principalName: raw.principalName ?? "",
    totalStudents: raw.totalStudents ?? 0,
    overallRating: raw.overallRating ?? 0,
    type: raw.type ?? "",
    bio: raw.bio ?? "",
    location,
    country,
    state,
    city,
    gallery: Array.isArray(raw.gallery) ? raw.gallery : [],
    managementTeam: Array.isArray(raw.managementTeam) ? raw.managementTeam : [],
    websiteUrl: raw.websiteUrl ?? "",
    receiveReviewSubmissionActivity: raw.receiveReviewSubmissionActivity ?? false,
    receiveFollowActivity: raw.receiveFollowActivity ?? false,
  };
}

function capitalizeSchoolType(t: string): string {
  if (!t) return "";
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}

export function mapMySchoolToHeaderCard(
  data: MySchoolData,
  options: { editRouteId: string }
): HeaderCardProps {
  const logo = data.profileImage?.trim() || "/images/GreenwoodAcademyLogo.png";

  return {
    id: options.editRouteId,
    schoolname: data.name,
    logo,
    location: {
      city: data.city,
      state: data.state,
      country: data.country,
    },
    types: [capitalizeSchoolType(data.type)].filter(Boolean),
    stats: [
      {
        id: 1,
        icon: "/images/svg/calander.svg",
        text: "Founded",
        year: data.foundedYear,
        bgColor: "bg-custom-blue/10",
      },
      {
        id: 2,
        icon: "/images/svg/yellow-person.svg",
        text: "Principal",
        name: data.principalName,
        bgColor: "bg-custom-yellow/10",
      },
      {
        id: 3,
        icon: "/images/svg/twopersons.svg",
        text: "Students",
        number: data.totalStudents,
        bgColor: "bg-custom-teal/20",
      },
      {
        id: 4,
        icon: "/images/svg/outlinestar.svg",
        text: "Rating",
        rating: data.overallRating,
        bgColor: "bg-custom-yellow/10",
      },
    ],
  };
}

export function mapMySchoolAboutInfo(data: MySchoolData): InfoCard[] {
  return [
    {
      id: 1,
      label: "School type",
      icon: "/images/svg/yellowcap.svg",
      value: capitalizeSchoolType(data.type),
      bgColor: "bg-custom-yellow/40",
    },
    {
      id: 2,
      label: "Established",
      icon: "/images/svg/puplecalander.svg",
      value: data.foundedYear,
      bgColor: "bg-custom-purple/20",
    },
    {
      id: 3,
      label: "Website",
      icon: "/images/svg/school.svg",
      value: data.websiteUrl?.trim() || "—",
      bgColor: "bg-custom-blue/10",
    },
  ];
}

export type LeadershipRow = {
  id: string;
  name: string;
  title: string;
  img: string;
  icon: string;
};

export function mapManagementTeam(data: MySchoolData): LeadershipRow[] {
  return data.managementTeam.map((m) => ({
    id: m._id,
    name: m.fullName,
    title: m.role,
    img: m.image,
    icon: LEADER_ICON,
  }));
}

/** Shape for edit page team list (matches AddTeamMembers `TeamMember`). */
export type EditTeamMemberSeed = {
  id: string;
  name: string;
  title: string;
  img: string;
};

function toIdString(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (typeof value === "object" && value !== null && "$oid" in value) {
    return String((value as { $oid: string }).$oid);
  }
  return String(value).trim();
}

/** Normalize API rows (`_id` vs `id`, Mongo extended JSON) for PATCH responses and GET payloads. */
export function mapManagementTeamToEditMembers(
  members: Array<
    MySchoolManagementMember & { id?: string; full_name?: string }
  >
): EditTeamMemberSeed[] {
  const out: EditTeamMemberSeed[] = [];
  for (const m of members) {
    const id = toIdString(m._id ?? m.id);
    if (!id || id === "[object Object]") continue;
    out.push({
      id,
      name: m.fullName ?? m.full_name ?? "",
      title: m.role ?? "",
      img: m.image ?? "",
    });
  }
  return out;
}

export function mapMySchoolToTeamMembers(data: MySchoolData): EditTeamMemberSeed[] {
  return mapManagementTeamToEditMembers(data.managementTeam);
}

/** PATCH /school-admin/my-school response `data` (may omit rating/admin flags — merged with prior GET). */
export type MySchoolUpdateResponseData = {
  id?: string;
  profileImage?: string | null;
  name: string;
  type: string;
  location?: string;
  country?: string;
  state?: string;
  city?: string;
  foundedYear: number;
  principalName: string;
  bio: string;
  totalStudents?: number;
  gallery?: string[];
  managementTeam?: MySchoolManagementMember[];
  websiteUrl?: string;
};

type UpdateMySchoolApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: MySchoolUpdateResponseData;
};

export type UpdateMySchoolPayload = {
  name: string;
  type: string;
  country: string;
  state: string;
  city: string;
  foundedYear: number;
  principalName: string;
  bio: string;
  websiteUrl: string;
  /** Full management team list to persist on save. */
  managementTeam?: Array<{
    _id?: string;
    fullName: string;
    role: string;
    image: string;
  }>;
  /** New profile image only (omit if still a remote URL). */
  profileImage?: Blob | File | null;
};

function mapUpdateResponseToMySchoolData(
  raw: MySchoolUpdateResponseData,
  fallback: MySchoolData
): MySchoolData {
  const city = (raw.city ?? fallback.city).trim();
  const state = (raw.state ?? fallback.state).trim();
  const country = (raw.country ?? fallback.country).trim();
  const mergedLocation = [city, state, country].filter(Boolean).join(", ");

  return {
    profileImage: raw.profileImage ?? fallback.profileImage,
    name: raw.name,
    foundedYear: raw.foundedYear,
    principalName: raw.principalName,
    totalStudents: raw.totalStudents ?? fallback.totalStudents,
    overallRating: fallback.overallRating,
    type: raw.type,
    bio: raw.bio,
    location: raw.location ?? mergedLocation,
    country,
    state,
    city,
    gallery: Array.isArray(raw.gallery) ? raw.gallery : [...fallback.gallery],
    managementTeam: Array.isArray(raw.managementTeam)
      ? raw.managementTeam
      : [...fallback.managementTeam],
    websiteUrl: raw.websiteUrl ?? fallback.websiteUrl,
    receiveReviewSubmissionActivity: fallback.receiveReviewSubmissionActivity,
    receiveFollowActivity: fallback.receiveFollowActivity,
  };
}

function dataUrlToBlob(dataUrl: string): Blob | null {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  const mime = match[1];
  const b64 = match[2];
  try {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  } catch {
    return null;
  }
}

/** If the logo value is a data URL from a new upload, return a Blob for multipart `profileImage`. */
export function logoStringToProfileUpload(logo: string): Blob | null {
  if (!logo.startsWith("data:")) return null;
  return dataUrlToBlob(logo);
}

/**
 * GET /school-admin/my-school — school profile overview for the current admin.
 */
export async function getMySchoolApi(): Promise<MySchoolData> {
  const response = await apiClient.get<MySchoolResponse>("/school-admin/my-school");

  if (!response.data?.success || !response.data.data) {
    throw new Error(response.data?.message ?? "Failed to load school");
  }

  return normalizeMySchoolData(response.data.data);
}

/**
 * PATCH /school-admin/my-school — update school profile (multipart: text fields + optional `profileImage` file).
 */
export async function updateMySchoolApi(
  payload: UpdateMySchoolPayload,
  previous: MySchoolData
): Promise<MySchoolData> {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("type", payload.type.trim().toLowerCase());
  formData.append("country", payload.country.trim());
  formData.append("state", payload.state.trim());
  formData.append("city", payload.city.trim());
  formData.append(
    "location",
    [payload.city.trim(), payload.state.trim(), payload.country.trim()].filter(Boolean).join(", ")
  );
  formData.append("foundedYear", String(payload.foundedYear));
  formData.append("principalName", payload.principalName);
  formData.append("bio", payload.bio);
  if (Array.isArray(payload.managementTeam)) {
    formData.append("managementTeam", JSON.stringify(payload.managementTeam));
  }
  const web = payload.websiteUrl.trim();
  if (web) formData.append("websiteUrl", web);

  if (payload.profileImage) {
    const file =
      payload.profileImage instanceof File
        ? payload.profileImage
        : new File([payload.profileImage], "profile.jpg", {
            type: payload.profileImage.type || "image/jpeg",
          });
    formData.append("profileImage", file);
  }

  try {
    const { data } = await apiClient.patch<UpdateMySchoolApiResponse>(
      "/school-admin/my-school",
      formData,
      { skipErrorToast: true }
    );

    if (!data?.success || !data.data) {
      throw new Error(data?.message ?? "Failed to update school");
    }

    return mapUpdateResponseToMySchoolData(data.data, previous);
  } catch (e) {
    throw mapGalleryAxiosError(e, "Failed to update school.");
  }
}

type ReceiveReviewActivitySettingsResponse = {
  statusCode?: number;
  success: boolean;
  message?: string;
  data?: { receiveReviewSubmissionActivity?: boolean };
};

type ReceiveFollowActivitySettingsResponse = {
  statusCode?: number;
  success: boolean;
  message?: string;
  data?: { receiveFollowActivity?: boolean };
};

const jsonPatchConfig = {
  headers: { "Content-Type": "application/json" } as const,
  skipErrorToast: true as const,
};

export type UpdateReceiveReviewActivityResult = {
  message: string;
  receiveReviewSubmissionActivity: boolean;
};

export type UpdateReceiveFollowActivityResult = {
  message: string;
  receiveFollowActivity: boolean;
};

/**
 * PATCH /school-admin/my-school/settings/receive-review-activity
 */
export async function updateReceiveReviewActivitySettingsApi(
  receiveReviewSubmissionActivity: boolean
): Promise<UpdateReceiveReviewActivityResult> {
  try {
    const { data } = await apiClient.patch<ReceiveReviewActivitySettingsResponse>(
      "/school-admin/my-school/settings/receive-review-activity",
      { receiveReviewSubmissionActivity },
      jsonPatchConfig
    );

    if (!data?.success) {
      throw new Error(data?.message ?? "Failed to update review notification settings.");
    }

    const resolved =
      data.data?.receiveReviewSubmissionActivity ?? receiveReviewSubmissionActivity;

    return {
      message: data.message ?? "Review notification setting updated.",
      receiveReviewSubmissionActivity: resolved,
    };
  } catch (e) {
    throw mapGalleryAxiosError(e, "Failed to update review notification settings.");
  }
}

/**
 * PATCH /school-admin/my-school/settings/receive-follow-activity
 */
export async function updateReceiveFollowActivitySettingsApi(
  receiveFollowActivity: boolean
): Promise<UpdateReceiveFollowActivityResult> {
  try {
    const { data } = await apiClient.patch<ReceiveFollowActivitySettingsResponse>(
      "/school-admin/my-school/settings/receive-follow-activity",
      { receiveFollowActivity },
      jsonPatchConfig
    );

    if (!data?.success) {
      throw new Error(data?.message ?? "Failed to update follow notification settings.");
    }

    const resolved = data.data?.receiveFollowActivity ?? receiveFollowActivity;

    return {
      message: data.message ?? "Follow notification setting updated.",
      receiveFollowActivity: resolved,
    };
  } catch (e) {
    throw mapGalleryAxiosError(e, "Failed to update follow notification settings.");
  }
}

import axios from "axios";
import apiClient from "./axios";

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  profileImage: string | null;
  updatedAt: string;
}

type UserProfileResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: UserProfileData;
};

export type UpdateUserProfilePayload = {
  name: string;
  email: string;
  phone: string;
  location: string;
  profileImage?: File | null;
};

function mapUserProfileAxiosError(error: unknown, fallback: string): Error {
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

/** GET /user/me */
export async function getUserProfileApi(): Promise<UserProfileData> {
  try {
    const { data } = await apiClient.get<UserProfileResponse>("/user/me", {
      params: { _t: Date.now() },
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      skipErrorToast: true,
    });
    if (!data?.success || !data.data) {
      throw new Error(data?.message ?? "Failed to load user profile.");
    }
    return data.data;
  } catch (e) {
    throw mapUserProfileAxiosError(e, "Failed to load user profile.");
  }
}

/** PATCH /user/me */
export async function updateUserProfileApi(
  payload: UpdateUserProfilePayload
): Promise<UserProfileData> {
  const hasFile = payload.profileImage instanceof File;
  try {
    if (hasFile) {
      const formData = new FormData();
      formData.append("name", payload.name.trim());
      formData.append("email", payload.email.trim());
      formData.append("phone", payload.phone.trim());
      formData.append("location", payload.location.trim());
      formData.append("profileImage", payload.profileImage as File);

      const { data } = await apiClient.patch<UserProfileResponse>("/user/me", formData, {
        skipErrorToast: true,
      });
      if (!data?.success || !data.data) {
        throw new Error(data?.message ?? "Failed to update user profile.");
      }
      return data.data;
    }

    const { data } = await apiClient.patch<UserProfileResponse>(
      "/user/me",
      {
        name: payload.name.trim(),
        email: payload.email.trim(),
        phone: payload.phone.trim(),
        location: payload.location.trim(),
      },
      {
        headers: { "Content-Type": "application/json" },
        skipErrorToast: true,
      }
    );

    if (!data?.success || !data.data) {
      throw new Error(data?.message ?? "Failed to update user profile.");
    }
    return data.data;
  } catch (e) {
    throw mapUserProfileAxiosError(e, "Failed to update user profile.");
  }
}

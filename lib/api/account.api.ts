import axios from "axios";
import apiClient from "./axios";

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  statusCode: number;
  success: boolean;
  message: string;
}

/**
 * Change password for the authenticated user.
 * PATCH /user/me/password
 */
export const changePasswordApi = async (
  payload: ChangePasswordPayload
): Promise<void> => {
  try {
    const response = await apiClient.patch<ChangePasswordResponse>(
      "/user/me/password",
      {
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
      },
      {
        headers: { "Content-Type": "application/json" },
        skipErrorToast: true,
      }
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ?? "Failed to change password."
      );
    }
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.data && typeof err.response.data === "object") {
      const msg = (err.response.data as { message?: unknown }).message;
      if (typeof msg === "string" && msg.trim()) {
        throw new Error(msg);
      }
    }
    if (err instanceof Error) throw err;
    throw new Error("Failed to change password.");
  }
};

// --- Current user subscription – GET /user/me/subscription ---

export interface UserMeSubscriptionRecord {
  id: string;
  plan: string;
  status: string;
  billingCycle: string;
  startDate: string;
  endDate: string;
  isRefunded: boolean;
  refundedAt: string | null;
  isCurrentlyActive: boolean;
}

export interface UserMeSubscriptionData {
  isSubscriber: boolean;
  subscriptionStatus: string;
  subscription: UserMeSubscriptionRecord | null;
}

export interface UserMeSubscriptionResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: UserMeSubscriptionData;
}

/**
 * Fetch the authenticated user’s subscription.
 * GET /user/me/subscription
 */
export const getUserMeSubscriptionApi =
  async (): Promise<UserMeSubscriptionData> => {
    try {
      const response = await apiClient.get<UserMeSubscriptionResponse>(
        "/user/me/subscription",
        { skipErrorToast: true }
      );

      if (!response.data?.success || response.data.data == null) {
        throw new Error(
          response.data?.message ?? "Failed to load subscription."
        );
      }

      return response.data.data;
    } catch (err: unknown) {
      if (
        axios.isAxiosError(err) &&
        err.response?.data &&
        typeof err.response.data === "object"
      ) {
        const msg = (err.response.data as { message?: unknown }).message;
        if (typeof msg === "string" && msg.trim()) {
          throw new Error(msg);
        }
      }
      if (err instanceof Error) throw err;
      throw new Error("Failed to load subscription.");
    }
  };

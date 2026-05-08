import apiClient from "./axios";
import type { User, PlatformRole, SchoolRole, SchoolDetails } from "@/redux/slices/auth.slice";

/** Request data for registration */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  profileImage?: File; // optional, frontend file
}

/** Backend response for registration */
export interface RegisterResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    platformRole: string;
    isSubscriber: boolean;
    school: string | null;
    schoolRole: string;
    profileImage: string | null; // backend returns URL after upload
    lastLogin: string | null;
  };
}

/** Frontend processed result for registerApi */
export interface RegisterApiResult {
  user: User;
  message: string;
}

/**
 * Register API function
 * @param data - Registration data (name, email, password, optional image)
 * @returns Promise with user data
 */
export const registerApi = async (
  data: RegisterRequest
): Promise<RegisterApiResult> => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("password", data.password);

  if (data.profileImage) {
    formData.append("profileImage", data.profileImage);
  }

  // Axios instance automatically handles headers & errors
  const response = await apiClient.post<RegisterResponse>("/auth/register", formData);
    

  // Backend validation: success + data
  if (!response.data?.success || !response.data?.data) {
    // Error will also be handled by interceptor, but we throw here for safety
    throw new Error(response.data?.message || "Registration failed");
  }

  const userData = response.data.data;

  const user: User = {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    platformRole: userData.platformRole as PlatformRole,
    isSubscriber: userData.isSubscriber,
    school: userData.school ?? null,
    schoolRole: userData.schoolRole as SchoolRole,
    profileImage: userData.profileImage ?? null,
    lastLogin: userData.lastLogin ?? null,
    schoolDetails: null,
  };

  return {
    user,
    message: response.data.message || "Registration successful",
  };
};



export interface LoginRequest {
  email: string;
  password: string;
}

/** Backend login response – data includes user + optional schoolDetails */
export interface LoginResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    platformRole: PlatformRole;
    isSubscriber: boolean;
    school: string | null;
    schoolRole: SchoolRole;
    profileImage: string | null;
    lastLogin: string | null;
    /** Optional: JWT or session token when backend sends it in body */
    token?: string;
    accessToken?: string;
    /** School info when user has a school; gallery[0] used as school profile image */
    schoolDetails?: {
      name: string;
      gallery: string[];
      location: string;
    } | null;
  };
}

export interface LoginApiResult {
  user: User;
  message: string;
  /** Present when backend returns token in response (used for auth cookie/header) */
  token?: string | null;
}

/**
 * Login API function
 * @param credentials - Login credentials (email and password)
 * @returns Promise with user data
 */







export const loginApi = async (credentials: LoginRequest): Promise<LoginApiResult> => {
  const response = await apiClient.post<LoginResponse>(
    "/auth/login",
    {
      email: credentials.email.trim(),
      password: credentials.password,
    },
    { skipErrorToast: true }
  );

  if (!response.data?.success || !response.data?.data) {
    throw new Error(response.data?.message || "Login failed");
  }

  const d = response.data.data;

  const rawSchool = d.schoolDetails ?? null;
  const schoolDetails: SchoolDetails | null = rawSchool
    ? {
        name: rawSchool.name,
        gallery: Array.isArray(rawSchool.gallery) ? rawSchool.gallery : [],
        location: rawSchool.location ?? "",
        profileImage: Array.isArray(rawSchool.gallery) && rawSchool.gallery.length > 0
          ? rawSchool.gallery[0]
          : null,
      }
    : null;

  const user: User = {
    id: d.id,
    name: d.name,
    email: d.email,
    platformRole: d.platformRole as PlatformRole,
    isSubscriber: d.isSubscriber,
    school: d.school ?? null,
    schoolRole: d.schoolRole as SchoolRole,
    profileImage: d.profileImage ?? null,
    lastLogin: d.lastLogin ?? null,
    schoolDetails,
  };

  const token = d.token ?? d.accessToken ?? null;

  return {
    user,
    message: response.data?.message || "Login successful",
    token: token ?? undefined,
  };
};

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  statusCode: number;
  success: boolean;
  message: string;
}

/**
 * Verify Forgot Password Token – GET /auth/verify-forgot-password/:token
 * Validates the reset token from the email link.
 * @param token - Reset token from email link
 * @returns Promise with { success, message }
 * @throws Error if token is invalid or expired
 */
export interface VerifyForgotPasswordResponse {
  statusCode: number;
  success: boolean;
  message: string;
}

export const verifyForgotPasswordApi = async (
  token: string
): Promise<VerifyForgotPasswordResponse> => {
  const response = await apiClient.get<VerifyForgotPasswordResponse>(
    `/auth/verify-forgot-password/${token}`,
    { skipErrorToast: true }
  );

  if (!response.data?.success) {
    throw new Error(
      response.data?.message ?? "Invalid or expired reset link. Please request a new one."
    );
  }

  return response.data;
};

/**
 * Reset Password – POST /auth/reset-password
 * @param token - Reset token from email link
 * @param newPassword - New password
 * @returns Promise with success message
 */
export const resetPasswordApi = async (
  token: string,
  newPassword: string
): Promise<ResetPasswordResponse> => {
  const response = await apiClient.post<ResetPasswordResponse>(
    "/auth/reset-password",
    { token, newPassword },
    { skipErrorToast: true }
  );

  if (!response.data?.success) {
    throw new Error(
      response.data?.message ?? "Failed to reset password"
    );
  }

  return response.data;
};

export interface LogoutResponse {
  statusCode: number;
  success: boolean;
  message: string;
}

/**
 * Logout API function
 * @returns Promise with success message
 */
export const logoutApi = async (): Promise<LogoutResponse> => {
  const response = await apiClient.post<LogoutResponse>("/auth/logout");

  if (!response.data?.success) {
    throw new Error(response.data?.message || "Failed to logout");
  }

  return response.data;
};

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  statusCode: number;
  success: boolean;
  message: string;
}

/**
 * Forgot Password API – POST /auth/forgot-password
 * Sends a password reset link to the given email.
 * @param email - User email address
 * @returns Promise with { statusCode, success, message }
 * @throws Error if request fails or success is false
 */
export const forgotPasswordApi = async (
  email: string
): Promise<ForgotPasswordResponse> => {
  const response = await apiClient.post<ForgotPasswordResponse>(
    "/auth/forgot-password",
    { email: email.trim() },
    { skipErrorToast: true }
  );

  if (!response.data?.success) {
    throw new Error(
      response.data?.message ?? "Failed to send reset link"
    );
  }

  return response.data;
};

export interface GetUserProfileResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    platformRole: string;
    isSubscriber: boolean;
    school: string | null;
    schoolRole: string;
    profileImage: string | null;
    lastLogin: string | null;
  };
}

/**
 * Get current user profile API function
 * @returns Promise with user data
 */



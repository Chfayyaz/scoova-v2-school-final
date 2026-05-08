

import axios, { type InternalAxiosRequestConfig } from "axios";
import { toast } from "react-hot-toast";
import { store } from "@/redux";
import { logout } from "@/redux/slices/auth.slice";

// Extend AxiosRequestConfig to include custom properties
declare module "axios" {
  export interface AxiosRequestConfig {
    skipErrorToast?: boolean;
    _retry?: boolean;
    _isRefreshRequest?: boolean;
  }
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

/** Serialize refresh + retries so parallel 401s (e.g. job list + surveys) don't race. */
let isRefreshingToken = false;
type QueueEntry = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: InternalAxiosRequestConfig;
};

let failedAuthQueue: QueueEntry[] = [];

function showErrorToast(message: string) {
  const normalized = message.trim().toLowerCase().replace(/\s+/g, "-");
  if (
    typeof window !== "undefined" &&
    message.toLowerCase().includes("school access is currently restricted")
  ) {
    window.dispatchEvent(
      new CustomEvent("access-restricted-popup", {
        detail: { message },
      })
    );
    return;
  }
  toast.error(message, { id: `http-error-${normalized}` });
}

function flushAuthQueue(error: unknown | null) {
  failedAuthQueue.forEach((entry) => {
    if (error) {
      entry.reject(error);
    } else {
      apiClient.request(entry.config).then(entry.resolve).catch(entry.reject);
    }
  });
  failedAuthQueue = [];
}

/** Tiny delay so Set-Cookie from refresh is visible to the next same-origin requests. */
function cookieSettleDelay(): Promise<void> {
  return new Promise((r) => setTimeout(r, 75));
}

function isAuthRoute(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
  return (
    path.includes("/login") ||
    path.includes("/forgot-password") ||
    path.includes("/otp") ||
    path.includes("/update-password")
  );
}

function isRefreshRequest(config: InternalAxiosRequestConfig): boolean {
  return (config as any)._isRefreshRequest === true;
}

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Check if error toast should be skipped (handled by component)
    const skipToast = originalRequest?.skipErrorToast === true;

    if (error.response) {
      const { status } = error.response;
      const getErrorMessage = (errorData: unknown): string => {
        if (typeof errorData === "string") {
          return errorData;
        }
        if (errorData && typeof errorData === "object") {
          if ("message" in errorData) {
            const message = errorData.message;
            if (typeof message === "string") {
              return message;
            }
            if (typeof message === "object" && message !== null) {
              const entries = Object.entries(message);
              if (entries.length > 0) {
                return entries
                  .map(([key, value]) => {
                    if (Array.isArray(value)) {
                      return `${key}: ${value.join(", ")}`;
                    }
                    return `${key}: ${String(value)}`;
                  })
                  .join("; ");
              }
            }
          }
          if ("errors" in errorData && typeof errorData.errors === "object" && errorData.errors !== null) {
            const errors = errorData.errors;
            const entries = Object.entries(errors);
            if (entries.length > 0) {
              return entries
                .map(([key, value]) => {
                  if (Array.isArray(value)) {
                    return `${key}: ${value.join(", ")}`;
                  }
                  return `${key}: ${String(value)}`;
                })
                .join("; ");
            }
          }
        }
        return "An error occurred. Please try again.";
      };

      switch (status) {
        case 401: {
          if (!originalRequest) {
            break;
          }

          if (isAuthRoute()) {
            if (!skipToast) {
              showErrorToast(getErrorMessage(error.response?.data));
            }
            break;
          }

          // If this was the refresh request itself, token refresh failed -> logout and redirect
          if (isRefreshRequest(originalRequest)) {
            flushAuthQueue(error);
            isRefreshingToken = false;
            store.dispatch(logout());
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
            if (!skipToast) {
              showErrorToast("Session expired. Please log in again.");
            }
            break;
          }

          // Only one full retry after refresh — avoids infinite loops
          if (originalRequest._retry) {
            flushAuthQueue(error);
            isRefreshingToken = false;
            store.dispatch(logout());
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
            if (!skipToast) {
              showErrorToast("Session expired. Please log in again.");
            }
            break;
          }

          originalRequest._retry = true;

          // Another request is already refreshing — queue this one and retry when flush runs
          if (isRefreshingToken) {
            return new Promise((resolve, reject) => {
              failedAuthQueue.push({ resolve, reject, config: originalRequest });
            });
          }

          isRefreshingToken = true;
          try {
            await apiClient.post(
              "/auth/refresh",
              {},
              { _isRefreshRequest: true } as InternalAxiosRequestConfig
            );
            await cookieSettleDelay();
            flushAuthQueue(null);
            return await apiClient.request(originalRequest);
          } catch (refreshErr) {
            flushAuthQueue(refreshErr);
            store.dispatch(logout());
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
            if (!skipToast) {
              showErrorToast("Session expired. Please log in again.");
            }
            return Promise.reject(refreshErr);
          } finally {
            isRefreshingToken = false;
          }
        }
        case 403:
          if (!skipToast) {
            showErrorToast(getErrorMessage(error.response?.data));
          }
          break;
        case 404:
          if (!skipToast) {
            showErrorToast(getErrorMessage(error.response?.data));
          }
          break;
        case 500:
          if (!skipToast) {
            showErrorToast("Internal server error. Please try again later.");
          }
          break;
        default:
          if (!skipToast) {
            showErrorToast(getErrorMessage(error.response?.data));
          }
          break;
      }
    } else {
      if (!skipToast) {
        toast.error("Network error. Please check your connection.", {
          id: "global-network-error",
        });
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;


// ========================= old code =========================



// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { store } from "@/redux";
// import { logout } from "@/redux/slices/auth.slice";

// const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BASE_URL,
//   withCredentials: true,
// });

// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error instanceof Error ? error : new Error(error));
//   }
// );
// apiClient.interceptors.response.use(
//   (response) => {
    
//     return response;
//   },
//   (error) => {
//     if (error.response) {
//       const { status } = error.response;
//       const getErrorMessage = (errorData: unknown): string => {
//         if (typeof errorData === "string") {
//           return errorData;
//         }
//         if (errorData && typeof errorData === "object") {
//           // Handle validation errors object like { thumbnail: ["error"] }
//           if ("message" in errorData) {
//             const message = errorData.message;
//             if (typeof message === "string") {
//               return message;
//             }
//             if (typeof message === "object" && message !== null) {
//               // Convert object to readable string
//               const entries = Object.entries(message);
//               if (entries.length > 0) {
//                 return entries
//                   .map(([key, value]) => {
//                     if (Array.isArray(value)) {
//                       return `${key}: ${value.join(", ")}`;
//                     }
//                     return `${key}: ${String(value)}`;
//                   })
//                   .join("; ");
//               }
//             }
//           }
//           // Handle errors object like { errors: { thumbnail: ["error"] } }
//           if ("errors" in errorData && typeof errorData.errors === "object" && errorData.errors !== null) {
//             const errors = errorData.errors;
//             const entries = Object.entries(errors);
//             if (entries.length > 0) {
//               return entries
//                 .map(([key, value]) => {
//                   if (Array.isArray(value)) {
//                     return `${key}: ${value.join(", ")}`;
//                   }
//                   return `${key}: ${String(value)}`;
//                 })
//                 .join("; ");
//             }
//           }
//         }
//         return "An error occurred. Please try again.";
//       };

//       switch (status) {
//         case 401:
//           window.location.href = "/login";
//           store.dispatch(logout());
//           localStorage.clear();
//           toast.error("Session expired. Please log in again.");
//           break;
//         case 403:
//           toast.error(getErrorMessage(error.response?.data));
//           break;
//         case 404:
//           toast.error(getErrorMessage(error.response?.data));
//           break;
//         case 500:
//           toast.error("Internal server error. Please try again later.");
//           break;
//         default:
//           toast.error(getErrorMessage(error.response?.data));
//           break;
//       }
//     } else {
//       toast.error("Network error. Please check your connection.");
//     }

//     return Promise.reject(error);
//   }
// );

// export default apiClient;
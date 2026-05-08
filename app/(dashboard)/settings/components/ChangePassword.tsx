"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import PasswordChangeSuccessModal from "./PasswordChangeSuccessModal";

type PasswordChangeData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ChangePasswordProps = {
  onSave: (data: PasswordChangeData) => Promise<void>;
};

export default function ChangePassword({ onSave }: ChangePasswordProps) {
  const [data, setData] = useState<PasswordChangeData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<PasswordChangeData>>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<PasswordChangeData> = {};

    if (!data.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!data.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (data.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!data.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (data.newPassword !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(data);
      // Reset form on success
      setData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to change password.";
      toast.error(message, { id: "change-password-error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-custom-white rounded-lg border border-custom-gray/10 shadow-sm p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h2 className="text-base md:text-lg font-semibold text-custom-gray/95 mb-1">
          Change Password
        </h2>
        <p className="text-xs md:text-sm text-custom-gray/80">Change Your Password</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Current Password */}
        <div>
          <label
            htmlFor="current-password"
            className="block text-xs md:text-sm font-medium text-custom-gray/95 mb-2"
          >
            Current Password
          </label>
          <div className="relative">
            <input
              id="current-password"
              type={showCurrentPassword ? "text" : "password"}
              value={data.currentPassword}
              onChange={(e) => {
                setData((prev) => ({ ...prev, currentPassword: e.target.value }));
                if (errors.currentPassword) {
                  setErrors((prev) => ({ ...prev, currentPassword: undefined }));
                }
              }}
              placeholder="Enter current password"
              className={`w-full px-3 md:px-4 py-2 md:py-2.5 pr-9 md:pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal text-sm text-custom-gray/95 ${
                errors.currentPassword
                  ? "border-red-500"
                  : "border-custom-gray/20"
              }`}
            />
            <Button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              variant="ghosted"
              textColor="text-custom-gray/60"
              hoverTextColor="hover:text-custom-gray/80"
              className="absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 p-0 w-auto h-auto"
              aria-label={showCurrentPassword ? "Hide password" : "Show password"}
            >
              {showCurrentPassword ? (
                <Eye className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </Button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.currentPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label
            htmlFor="new-password"
            className="block text-xs md:text-sm font-medium text-custom-gray/95 mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showNewPassword ? "text" : "password"}
              value={data.newPassword}
              onChange={(e) => {
                setData((prev) => ({ ...prev, newPassword: e.target.value }));
                if (errors.newPassword) {
                  setErrors((prev) => ({ ...prev, newPassword: undefined }));
                }
              }}
              placeholder="Enter new password"
              className={`w-full px-3 md:px-4 py-2 md:py-2.5 pr-9 md:pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal text-sm text-custom-gray/95 ${
                errors.newPassword
                  ? "border-red-500"
                  : "border-custom-gray/20"
              }`}
            />
            <Button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              variant="ghosted"
              textColor="text-custom-gray/60"
              hoverTextColor="hover:text-custom-gray/80"
              className="absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 p-0 w-auto h-auto"
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? (
                <Eye className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </Button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirm-password"
            className="block text-xs md:text-sm font-medium text-custom-gray/95 mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={data.confirmPassword}
              onChange={(e) => {
                setData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }));
                if (errors.confirmPassword) {
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: undefined,
                  }));
                }
              }}
              placeholder="Confirm new password"
              className={`w-full px-3 md:px-4 py-2 md:py-2.5 pr-9 md:pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal text-sm text-custom-gray/95 ${
                errors.confirmPassword
                  ? "border-red-500"
                  : "border-custom-gray/20"
              }`}
            />
            <Button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              variant="ghosted"
              textColor="text-custom-gray/60"
              hoverTextColor="hover:text-custom-gray/80"
              className="absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 p-0 w-auto h-auto"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <Eye className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </Button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Save Password Button */}
        <div className="flex justify-end pt-2 md:pt-4">
          <Button
            type="submit"
            variant="filled"
            rounded="full"
            disabled={isLoading}
            className="px-5 md:px-6 py-2 md:py-2.5 text-sm w-full sm:w-auto"
          >
            {isLoading ? "Saving..." : "Save Password"}
          </Button>
        </div>
      </form>

      {/* Success Modal */}
      <PasswordChangeSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}

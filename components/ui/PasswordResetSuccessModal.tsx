"use client";

import { X } from "lucide-react";

type PasswordResetSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PasswordResetSuccessModal({
  isOpen,
  onClose,
}: PasswordResetSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-custom-white rounded-xl shadow-xl max-w-sm w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-custom-gray/60 hover:text-custom-gray/95 transition-colors"
          aria-label="Close"
        >
          <X size={20} strokeWidth={2} />
        </button>

        <div className="flex flex-col items-center text-center pt-4">
          <div className="w-16 h-16 rounded-full bg-custom-green flex items-center justify-center mb-6">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-base font-medium text-custom-gray/80 leading-relaxed">
            Password reset link has been sent
            <br />
            to your email
          </p>
        </div>
      </div>
    </div>
  );
}

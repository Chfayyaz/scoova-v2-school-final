"use client";

import { X, Check } from "lucide-react";
import Button from "@/components/ui/Button";

type PasswordChangeSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PasswordChangeSuccessModal({
  isOpen,
  onClose,
}: PasswordChangeSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-custom-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="ghosted"
          rounded="full"
          textColor="text-custom-gray/60"
          hoverTextColor="hover:text-custom-gray/80"
          className="absolute top-4 right-4 p-2 w-auto h-auto"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Content */}
        <div className="flex flex-col items-center justify-center py-6">
          {/* Success Icon */}
          <div className="w-16 h-16 rounded-full bg-custom-green flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-custom-white" strokeWidth={3} />
          </div>

          {/* Message */}
          <p className="text-base font-semibold text-custom-gray/95 text-center">
            Your Password has been changed
          </p>
        </div>
      </div>
    </div>
  );
}


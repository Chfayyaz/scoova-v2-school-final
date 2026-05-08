"use client";

import Button from "@/components/ui/Button";

type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
};

export default function SuccessModal({
  isOpen,
  onClose,
  title = "Survey Sent Successfully!",
  message = "Your survey has been delivered to all selected recipients.",
  buttonText = "Close",
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      aria-modal="true"
      role="dialog"
      aria-labelledby="success-modal-title"
    >
      <div className="bg-custom-white rounded-xl shadow-xl max-w-sm w-full p-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-custom-teal flex items-center justify-center mb-6">
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
        <h2
          id="success-modal-title"
          className="text-xl font-bold text-custom-gray/95 mb-2"
        >
          {title}
        </h2>
        <p className="text-sm text-custom-gray/60 mb-8">{message}</p>
        <Button
          variant="filled"
          rounded="full"
          bgColor="bg-custom-teal"
          hoverBgColor="hover:bg-custom-teal/90"
          textColor="text-custom-white"
          onClick={onClose}
          className="px-8 py-3 font-medium"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

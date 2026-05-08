"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

type ActionButtonsProps = {
  onSave?: () => void;
  onCancel?: () => void;
  hasChanges?: boolean;
  isSaving?: boolean;
};

export default function ActionButtons({
  onSave,
  onCancel,
  hasChanges = false,
  isSaving = false,
}: ActionButtonsProps) {
  const router = useRouter();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4  sm:mt-8 pt-4 sm:pt-6 border-t border-custom-gray/20 pb-4 sm:pb-6">
      <Button
        onClick={handleCancel}
        variant="outlined"
        rounded="full"
        textColor="text-custom-gray/70"
        borderColor="border-custom-gray/20 hover:border-custom-teal"
        hoverBgColor="hover:bg-custom-teal"
        className={`w-full sm:w-auto px-6 py-2.5 text-sm sm:text-base ${
          !hasChanges || isSaving ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!hasChanges || isSaving}
      >
        
        Cancel Changes
      </Button>
      <Button
        onClick={handleSave}
        disabled={isSaving}
        rounded="full"
        bgColor="bg-custom-teal"
        hoverBgColor="hover:bg-custom-teal/90"
        className="w-full sm:w-auto px-6 py-2.5 text-sm sm:text-base disabled:opacity-60"
      >
        {isSaving ? "Saving…" : "Save Updates"}
      </Button>
    </div>
  );
}


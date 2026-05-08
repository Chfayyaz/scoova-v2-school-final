"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import SurveyPreviewCard from "./SurveyPreviewCard";
import { ReviewSurveyData } from "../data";
import { publishSurveyApi } from "@/lib/api/survey.api";



export const InboxIcon=()=>(
  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.78125 0C2.8625 0 2.0625 0.625 1.84063 1.51562L0.059375 8.6375C0.01875 8.79688 0 8.95937 0 9.12187V12C0 13.1031 0.896875 14 2 14H14C15.1031 14 16 13.1031 16 12V9.12187C16 8.95937 15.9812 8.79688 15.9406 8.6375L14.1594 1.51562C13.9375 0.625 13.1375 0 12.2188 0H3.78125ZM3.78125 2H12.2188L13.7188 8H12.1187C11.7406 8 11.3938 8.2125 11.225 8.55313L10.7781 9.44687C10.6094 9.78437 10.2625 10 9.88437 10H6.11875C5.74062 10 5.39375 9.7875 5.225 9.44687L4.77812 8.55313C4.60938 8.21563 4.2625 8 3.88438 8H2.28125L3.78125 2Z" fill="#9CA3AF"/>
</svg>

)
export const EmailIcon=()=>(
  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1.5 0C0.671875 0 0 0.671875 0 1.5C0 1.97187 0.221875 2.41562 0.6 2.7L7.4 7.8C7.75625 8.06563 8.24375 8.06563 8.6 7.8L15.4 2.7C15.7781 2.41562 16 1.97187 16 1.5C16 0.671875 15.3281 0 14.5 0H1.5ZM0 3.5V10C0 11.1031 0.896875 12 2 12H14C15.1031 12 16 11.1031 16 10V3.5L9.2 8.6C8.4875 9.13438 7.5125 9.13438 6.8 8.6L0 3.5Z" fill="#9CA3AF"/>
  </svg>
  

)
type SendSurveyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  reviewData: ReviewSurveyData;
  onSend: (selectedRecipients: string[], message: string, deliveryMethod: { email: boolean; scoovaInbox: boolean }) => void;
};

type RecipientGroup = {
  id: string;
  label: string;
  count: number;
};

export default function SendSurveyModal({
  isOpen,
  onClose,
  reviewData,
  onSend,
}: SendSurveyModalProps) {
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([
    "parents",
  ]);
  const [optionalMessage, setOptionalMessage] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState({
    email: reviewData.deliveryMethod.email,
    scoovaInbox: reviewData.deliveryMethod.scoovaInbox,
  });

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedRecipients(["parents"]);
      setOptionalMessage("");
      setDeliveryMethod({
        email: reviewData.deliveryMethod.email,
        scoovaInbox: reviewData.deliveryMethod.scoovaInbox,
      });
    }
  }, [isOpen, reviewData.deliveryMethod]);

  // Mock recipient groups - in real app, this would come from props or API
  const recipientGroups: RecipientGroup[] = [
    { id: "parents", label: "Parents", count: reviewData.totalRecipients },
    { id: "students", label: "Students", count: 820 },
    { id: "staff", label: "Staff", count: 58 },
    { id: "non-teaching", label: "Non-Teaching Staff", count: 23 },
  ];

  const allSchoolCommunityCount = recipientGroups.reduce(
    (sum, group) => sum + group.count,
    0
  );

  const handleRecipientToggle = (id: string) => {
    if (id === "all") {
      if (selectedRecipients.length === recipientGroups.length + 1) {
        setSelectedRecipients([]);
      } else {
        setSelectedRecipients([
          ...recipientGroups.map((g) => g.id),
          "all",
        ]);
      }
    } else {
      setSelectedRecipients((prev) => {
        if (prev.includes(id)) {
          const newSelection = prev.filter((r) => r !== id && r !== "all");
          return newSelection;
        } else {
          const newSelection = [...prev, id];
          // If all individual groups are selected, also select "all"
          if (
            newSelection.length === recipientGroups.length &&
            !newSelection.includes("all")
          ) {
            return [...newSelection, "all"];
          }
          return newSelection;
        }
      });
    }
  };

  const handleDeliveryToggle = (method: "email" | "scoovaInbox") => {
    setDeliveryMethod((prev) => ({
      ...prev,
      [method]: !prev[method],
    }));
  };

  const handleSend = async () => {
    if (selectedRecipients.length === 0) {
      toast.error("Please select at least one recipient group.");
      return;
    }
    if (!deliveryMethod.email && !deliveryMethod.scoovaInbox) {
      toast.error("Please select at least one delivery method.");
      return;
    }

    const surveyId = String(reviewData.survey.id);
    setIsPublishing(true);
    try {
      await publishSurveyApi(surveyId);
      onSend(selectedRecipients, optionalMessage, deliveryMethod);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to publish survey.";
      const isActiveSurveyError = message.toLowerCase().includes("already has an active survey");
      const displayMessage = isActiveSurveyError
        ? `${message} Go to Pulse Survey to manage or end the active survey.`
        : message;
      toast.error(displayMessage, {
        id: "publish-survey-error",
        duration: isActiveSurveyError ? 8000 : 4000,
      });
    } finally {
      setIsPublishing(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-custom-gray/50 backdrop-blur-sm">
      <div className="rounded-lg bg-custom-white shadow-lg w-[768px] max-w-[calc(100vw-2rem)] max-h-[90vh] mx-4 overflow-y-auto hide-scrollbar flex flex-col">
        {/* Header */} 
        <div className="flex items-center justify-between p-6 border-b border-custom-gray/10">
          <h2 className="text-2xl font-bold text-custom-gray/95">Send Survey</h2>
          <Button
            variant="ghosted"
            rounded="full"
            onClick={onClose}
            textColor="text-custom-gray/80"
            className="!p-2 !min-w-0 !w-8 !h-8"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Survey Information Card */}
          <SurveyPreviewCard
            title={reviewData.survey.title}
            category={reviewData.survey.category}
            totalRecipients={reviewData.totalRecipients}
            status={reviewData.survey.status}
          />

          {/* Choose Recipients Section - commented out
          <div>
            <h3 className="text-lg font-bold text-custom-gray/95 mb-4">
              Choose Recipients
            </h3>
            <div className="grid grid-cols-1  lg:grid-cols-2 gap-3 mb-3">
              {recipientGroups.map((group) => (
                <label
                  key={group.id}
                  className="flex items-center gap-3 p-3 border border-custom-gray/20 rounded-lg bg-transparent cursor-pointer hover:bg-custom-gray/5 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedRecipients.includes(group.id)}
                    onChange={() => handleRecipientToggle(group.id)}
                    className="send-survey-modal-checkbox-all-school w-4 h-4 rounded focus:ring-2 focus:ring-custom-teal/20 focus:ring-offset-0"
                  />
                  <span className="text-sm text-custom-gray/95">
                    {group.label} ({group.count})
                  </span>
                </label>
              ))}
            </div>
            <label className="flex items-center  gap-3 p-3 rounded-lg cursor-pointer transition-colors border border-[#BCE5FF] bg-[#EFF9FF] hover:opacity-95">
              <input
                type="checkbox"
                checked={selectedRecipients.includes("all")}
                onChange={() => handleRecipientToggle("all")}
                className="send-survey-modal-checkbox-all-school w-4 h-4 rounded focus:ring-2 focus:ring-custom-teal/20 focus:ring-offset-0"
              />
              <span className="text-sm  font-medium text-[#0F5296]">
                All School Community ({allSchoolCommunityCount})
              </span>
            </label>
          </div>
          */}

          {/* Add Optional Message Section */}
          <div>
            <h3 className="text-lg font-semibold text-custom-gray/95 mb-3">
              Add an optional message
            </h3>
            <textarea
              value={optionalMessage}
              onChange={(e) => setOptionalMessage(e.target.value)}
              rows={4}
              placeholder="Write a personalized message to accompany the survey link... (optional)"
              className="w-full px-4 py-3 border border-custom-gray/20 rounded-lg text-[16px] text-custom-gray/95 bg-transparent placeholder:text-custom-gray/50 focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal resize-none"
            />
          </div>

          {/* Delivery Method and Preview Message - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Method Section */}
            <div>
              <h3 className="text-lg font-bold text-custom-gray/95 mb-4">
                Delivery Method
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-transparent border border-custom-gray/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <EmailIcon/>
                    <span className="text-sm text-custom-gray/95">Email</span>
                  </div>
                  <Button
                    variant="ghosted"
                    rounded="full"
                    onClick={() => handleDeliveryToggle("email")}
                    textColor="text-transparent"
                    className={`!relative !inline-flex !h-6 !w-11 !items-center !p-0 !m-0 !border-0 !min-w-0 !max-w-none !px-0 !py-0 !font-normal !justify-start ${
                      deliveryMethod.email
                        ? "!bg-custom-teal hover:!bg-custom-teal/90"
                        : "!bg-custom-gray/30 hover:!bg-custom-gray/40"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 flex-shrink-0 transform rounded-full bg-custom-white transition-transform ${
                        deliveryMethod.email ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-transparent border border-custom-gray/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <InboxIcon/>
                    <span className="text-sm text-custom-gray/95">
                      Scoova Inbox
                    </span>
                  </div>
                  <Button
                    variant="ghosted"
                    rounded="full"
                    onClick={() => handleDeliveryToggle("scoovaInbox")}
                    textColor="text-transparent"
                    className={`!relative !inline-flex !h-6 !w-11 !items-center !p-0 !m-0 !border-0 !min-w-0 !max-w-none !px-0 !py-0 !font-normal !justify-start ${
                      deliveryMethod.scoovaInbox
                        ? "!bg-custom-teal hover:!bg-custom-teal/90"
                        : "!bg-custom-gray/30 hover:!bg-custom-gray/40"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 flex-shrink-0 transform rounded-full bg-custom-white transition-transform ${
                        deliveryMethod.scoovaInbox
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </div>

            {/* Preview Message Section */}
            <div>
              <h3 className="text-[18px] font-bold text-custom-gray/95 mb-4">
                Preview Message
              </h3>
              <div className="bg-[#F9FAFB] border border-custom-gray/10 rounded-2xl p-5">
                <h4 className="font-bold text-sm text-custom-gray/95 mb-3">
                  {reviewData.survey.title}
                </h4>
                <p className="text-sm text-custom-gray/80 leading-relaxed mb-5">
                  {optionalMessage ||
                    reviewData.survey.description ||
                    "Your feedback is important to us. Please take a few moments to complete this short survey to help us improve our school community."}
                </p>
                <Button
                  type="button"
                  variant="filled"
                  rounded="full"
                  bgColor="bg-custom-gray/10"
                  hoverBgColor="hover:bg-custom-gray/20"
                  textColor="text-custom-gray/78"
                  className="w-full py-2.5 text-sm border-0 font-semibold"
                  onClick={onClose}
                >
                  Review Survey
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-custom-gray/10 bg-custom-white">
          <Button
            variant="outlined"
            rounded="full"
            borderColor="border-custom-gray/20"
            textColor="text-custom-gray/95"
            hoverBgColor="hover:bg-custom-gray/10"
            hoverTextColor="hover:text-custom-gray/95"
            onClick={onClose}
            className="px-6 py-2 text-sm font-semibold bg-custom-white"
          >
            Cancel
          </Button>
          <Button
            variant="filled"
            rounded="full"
            bgColor="bg-custom-teal"
            hoverBgColor="hover:bg-custom-teal/90"
            textColor="text-custom-white"
            onClick={handleSend}
            disabled={isPublishing}
            className="px-6 py-2 font-normal text-sm"
          >
            {isPublishing ? "Sending..." : "Send Survey"}
          </Button>
        </div>
      </div>
    </div>
  );
}

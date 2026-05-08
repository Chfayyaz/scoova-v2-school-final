"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import SuccessModal from "@/components/ui/SuccessModal";
import SurveyPreviewCard from "./components/SurveyPreviewCard";
import SurveyInformation from "../components/SurveyInformation";
import QuestionBuilder from "../components/QuestionBuilder";
import QuestionFormModal from "../components/QuestionFormModal";
import DeliveryMethodSection from "./components/DeliveryMethodSection";
import SendSurveyModal from "./components/SendSurveyModal";
import {
  SurveyDetails,
  ReviewSurveyData,
  DeliveryMethod,
  Recipient,
  getDefaultReviewData,
} from "./data";
import type { Question } from "../data";
import { addRecipientsApi, uploadRecipientsCsvApi, type RecipientType } from "@/lib/api/survey.api";

type ReviewFormErrors = {
  surveyTitle?: string;
  recipients?: string;
  deliveryMethod?: string;
  questions?: string;
};

const REVIEW_SURVEY_ID_KEY = "surveyId";
const REVIEW_SURVEY_DATA_KEY = "surveyData";

export default function ReviewSurveyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const surveyIdFromUrl = searchParams.get("surveyId");
  const surveyIdFromSession =
    typeof window !== "undefined"
      ? sessionStorage.getItem(REVIEW_SURVEY_ID_KEY)
      : null;
  const activeSurveyId = surveyIdFromUrl?.trim() || surveyIdFromSession?.trim() || "";

  const [reviewData, setReviewData] = useState<ReviewSurveyData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | undefined>(undefined);
  const [errors, setErrors] = useState<ReviewFormErrors>({});
  const [isAddingRecipient, setIsAddingRecipient] = useState(false);
  const [isUploadingCSV, setIsUploadingCSV] = useState(false);

  useEffect(() => {
    if (!activeSurveyId) {
      toast.error("Survey ID is missing. Redirecting to survey setup.");
      router.replace("/pulse-survey/generate");
      return;
    }
    sessionStorage.setItem(REVIEW_SURVEY_ID_KEY, activeSurveyId);

    const surveyDataStr = sessionStorage.getItem(REVIEW_SURVEY_DATA_KEY);
    const totalRecipientsStr = sessionStorage.getItem("surveyTotalRecipients");
    const recipientsStr = sessionStorage.getItem("surveyRecipients");
    let recipients: Recipient[] = [];
    let totalRecipients = 0;
    if (recipientsStr) {
      try {
        const raw = JSON.parse(recipientsStr) as Array<{ fullName: string; email: string; recipientType: string }>;
        recipients = raw.map((r, i) => ({ id: `r${i}`, name: r.fullName, email: r.email }));
      } catch (_) {}
    }
    if (totalRecipientsStr) {
      const n = Number(totalRecipientsStr);
      if (!Number.isNaN(n)) totalRecipients = n;
    }
    if (totalRecipients === 0 && recipients.length > 0) totalRecipients = recipients.length;

    if (surveyDataStr) {
      try {
        const survey: SurveyDetails = JSON.parse(surveyDataStr);
        survey.id = activeSurveyId;
        setReviewData({
          survey,
          deliveryMethod: {
            email: true,
            scoovaInbox: false,
          },
          recipients: recipients.length > 0 ? recipients : [],
          totalRecipients,
        });
      } catch (error) {
        console.error("Error parsing survey data:", error);
        toast.error("Could not load survey data. Redirecting to edit.");
        router.replace(`/pulse-survey/generate?surveyId=${activeSurveyId}`);
      }
    } else {
      toast("Survey data not found. You can still set delivery options, or go back to edit.", { icon: "ℹ️" });
      const defaultData = getDefaultReviewData();
      defaultData.survey.id = activeSurveyId;
      defaultData.recipients = recipients;
      defaultData.totalRecipients = totalRecipients;
      setReviewData(defaultData);
    }
  }, [activeSurveyId, router]);

  const handleUpdateSurvey = (updatedData: Partial<SurveyDetails>) => {
    if (reviewData) {
      setReviewData({
        ...reviewData,
        survey: { ...reviewData.survey, ...updatedData },
      });
      if (errors.surveyTitle && updatedData.title?.trim()) setErrors((e) => ({ ...e, surveyTitle: undefined }));
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestion(undefined);
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = (questionData: Omit<Question, "id" | "order">) => {
    if (!reviewData) return;
    if (errors.questions) setErrors((e) => ({ ...e, questions: undefined }));
    if (editingQuestion) {
      const updatedQuestions = reviewData.survey.questions.map((q) =>
        q.id === editingQuestion.id ? { ...q, ...questionData } : q
      );
      setReviewData({
        ...reviewData,
        survey: { ...reviewData.survey, questions: updatedQuestions },
      });
    } else {
      const newQuestion: Question = {
        ...questionData,
        id: `q${Date.now()}`,
        order: reviewData.survey.questions.length + 1,
      };
      setReviewData({
        ...reviewData,
        survey: {
          ...reviewData.survey,
          questions: [...reviewData.survey.questions, newQuestion],
        },
      });
    }
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!reviewData) return;
    if (errors.questions) setErrors((e) => ({ ...e, questions: undefined }));
    const updatedQuestions = reviewData.survey.questions.filter((q) => q.id !== questionId);
    const reorderedQuestions = updatedQuestions.map((q, index) => ({ ...q, order: index + 1 }));
    setReviewData({
      ...reviewData,
      survey: { ...reviewData.survey, questions: reorderedQuestions },
    });
  };

  const handleUpdateQuestion = (questionId: string, updatedData: Partial<Question>) => {
    if (!reviewData) return;
    const updatedQuestions = reviewData.survey.questions.map((q) =>
      q.id === questionId ? { ...q, ...updatedData } : q
    );
    setReviewData({
      ...reviewData,
      survey: { ...reviewData.survey, questions: updatedQuestions },
    });
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsQuestionModalOpen(true);
  };

  const handleDeliveryMethodChange = (method: Partial<DeliveryMethod>) => {
    if (reviewData) {
      setReviewData({
        ...reviewData,
        deliveryMethod: { ...reviewData.deliveryMethod, ...method },
      });
      const next = { ...reviewData.deliveryMethod, ...method };
      if (errors.deliveryMethod && (next.email || next.scoovaInbox)) setErrors((e) => ({ ...e, deliveryMethod: undefined }));
    }
  };

  /** Map UI role (Parent, Staff, Alumni, Student, Teacher) to API recipientType */
  function mapRoleToRecipientType(role?: string): RecipientType {
    if (role === "Staff" || role === "Alumni") return role;
    return "Parent";
  }

  /** Add recipient via addRecipientsApi. Survey was created on Continue to Survey, so surveyIdFromUrl is server id. */
  const handleAddRecipient = async (payload: { name: string; email: string; role?: string }) => {
    if (!activeSurveyId || !reviewData || isAddingRecipient) return;
    const recipientType = mapRoleToRecipientType(payload.role);
    const recipientItem = { fullName: payload.name.trim(), email: payload.email.trim(), recipientType };
    setIsAddingRecipient(true);
    try {
      const result = await addRecipientsApi(activeSurveyId, [recipientItem]);
      const newRecipient: Recipient = {
        id: `r${Date.now()}`,
        name: payload.name.trim(),
        email: payload.email.trim(),
        recipientType,
      };
      setReviewData((prev) =>
        prev
          ? {
              ...prev,
              recipients: [...prev.recipients, newRecipient],
              totalRecipients: result.totalRecipients,
            }
          : prev
      );
      if (errors.recipients) setErrors((e) => ({ ...e, recipients: undefined }));
      toast.success(
        `${result.added} recipient(s) added. Total: ${result.totalRecipients}.${result.duplicatesSkipped ? ` Duplicates skipped: ${result.duplicatesSkipped}` : ""}`
      );
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } }; message?: string };
      const message =
        ax?.response?.data?.message ||
        (err instanceof Error ? err.message : "Failed to add recipients.");
      toast.error(message, { id: "add-recipient-error" });
    } finally {
      setIsAddingRecipient(false);
    }
  };

  const handleUploadCSV = async (file: File) => {
    if (!activeSurveyId || !reviewData || isUploadingCSV) return;
    const isCsvFile = file.name.toLowerCase().endsWith(".csv") || file.type === "text/csv";
    if (!isCsvFile) {
      toast.error("Please upload a valid CSV file.");
      return;
    }
    setIsUploadingCSV(true);
    try {
      const result = await uploadRecipientsCsvApi(activeSurveyId, file);
      setReviewData((prev) =>
        prev
          ? {
              ...prev,
              totalRecipients: result.totalRecipients,
            }
            : prev
      );
      if (errors.recipients) setErrors((e) => ({ ...e, recipients: undefined }));
      toast.success(
        `${result.added} recipient(s) added from CSV. Total: ${result.totalRecipients}.${result.duplicatesSkipped ? ` Duplicates skipped: ${result.duplicatesSkipped}` : ""}`
      );
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } }; message?: string };
      const message =
        ax?.response?.data?.message ||
        (err instanceof Error ? err.message : "Failed to upload CSV.");
      toast.error(message, { id: "upload-csv-error" });
    } finally {
      setIsUploadingCSV(false);
    }
  };

  const handleSendSurvey = () => {
    if (!reviewData) return;

    const newErrors: ReviewFormErrors = {};
    if (!reviewData.survey.title.trim()) {
      newErrors.surveyTitle = "Survey title is required.";
    }
    if (reviewData.survey.questions.length === 0) {
      newErrors.questions = "Please add at least one question.";
    }
    if (reviewData.totalRecipients === 0) {
      newErrors.recipients = "Please add at least one recipient.";
    }
    if (!reviewData.deliveryMethod.email && !reviewData.deliveryMethod.scoovaInbox) {
      newErrors.deliveryMethod = "Please select at least one delivery method.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsModalOpen(true);
  };

  const handleFinalSend = (selectedRecipients: string[], message: string, deliveryMethod: DeliveryMethod) => {
    if (!reviewData) return;

    // Update delivery method in review data
    setReviewData({
      ...reviewData,
      deliveryMethod,
    });

    // In real app, this would send the survey with selected recipients and message
    console.log("Sending survey:", {
      ...reviewData,
      selectedRecipients,
      message,
      deliveryMethod,
    });

    setIsModalOpen(false);
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.push("/pulse-survey");
  };

  if (!reviewData) {
    return (
      <div className="min-h-screen bg-custom-white flex items-center justify-center p-4">
        <p className="text-custom-gray/80 text-sm sm:text-base">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen overflow-x-hidden    md:p-5 lg:p-6">
        <div className="max-w-7xl mx-auto w-full min-w-0">
          {/* Page Title and Back link (surveyId in URL keeps flow robust on refresh) */}
          <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-2xl lg:text-2xl font-bold text-custom-gray/95 mb-1.5 sm:mb-2 lg:mb-2 break-words">
            Review & Launch Survey
          </h1>
          <p className="text-sm sm:text-base md:text-base lg:text-base text-custom-gray/80 break-words">
            Review your survey details and launch options before sending to participants.
          </p>
          </div>

          {/* Survey Preview Card */}
          <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-6">
          <SurveyPreviewCard
            title={reviewData.survey.title}
            category={reviewData.survey.category}
            totalRecipients={reviewData.totalRecipients}
            status={reviewData.survey.status}
          />
          </div>

          {/* Survey Information Card */}
          <div className="md:border md:border-custom-gray/10 rounded-lg  sm:p-5 md:p-6 lg:p-6 overflow-hidden">
            <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-6">
            <SurveyInformation
              survey={reviewData.survey}
              onUpdate={handleUpdateSurvey}
            />
            </div>

            {/* Question Builder - same component as generate page */}
            <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-6">
              <QuestionBuilder
                questions={reviewData.survey.questions}
                onAddQuestion={handleAddQuestion}
                onDeleteQuestion={handleDeleteQuestion}
                onUpdateQuestion={handleUpdateQuestion}
                onEditQuestion={handleEditQuestion}
                onContinueToReview={() => {}}
                showContinueButton={false}
              />
            </div>

            {/* Delivery Method Section (includes Add Manually + API) */}
            <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-6">
              <DeliveryMethodSection
                deliveryMethod={reviewData.deliveryMethod}
                recipients={reviewData.recipients}
                onDeliveryMethodChange={handleDeliveryMethodChange}
                onAddRecipient={handleAddRecipient}
                onUploadCSV={handleUploadCSV}
                isUploadingCSV={isUploadingCSV}
                deliveryMethodError={errors.deliveryMethod}
                recipientsError={errors.recipients}
                showRecipientRole={false}
                isAddingRecipient={isAddingRecipient}
                disableAddRecipient={false}
              />
            </div>

            {/* Validation errors */}
            {Object.keys(errors).length > 0 && (
              <div className="mt-4 rounded-lg border border-red-500/40 bg-red-50/50 p-3 sm:p-4">
                <ul className="text-sm text-red-500 list-disc list-inside space-y-1">
                  {errors.surveyTitle && <li>{errors.surveyTitle}</li>}
                  {errors.questions && <li>{errors.questions}</li>}
                  {errors.recipients && <li>{errors.recipients}</li>}
                  {errors.deliveryMethod && <li>{errors.deliveryMethod}</li>}
                </ul>
              </div>
            )}

            {/* Send Survey */}
            <div className="flex flex-wrap justify-end gap-3 mt-6 sm:mt-7 md:mt-8 lg:mt-8">
              <Button
                variant="filled"
                rounded="full"
                bgColor="bg-custom-teal"
                hoverBgColor="hover:bg-custom-teal/90"
                textColor="text-custom-white"
                onClick={handleSendSurvey}
                className="w-full sm:w-auto lg:w-auto px-5 md:px-6 lg:px-10 py-3 text-sm font-normal transition-all duration-300 min-h-11 sm:min-h-0"
              >
                Send Survey
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Send Survey Modal */}
      {reviewData && (
        <SendSurveyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          reviewData={reviewData}
          onSend={handleFinalSend}
        />
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
      />

      {reviewData && (
        <QuestionFormModal
          isOpen={isQuestionModalOpen}
          onClose={() => {
            setIsQuestionModalOpen(false);
            setEditingQuestion(undefined);
          }}
          onSave={handleSaveQuestion}
          question={editingQuestion}
        />
      )}
    </>
  );
}

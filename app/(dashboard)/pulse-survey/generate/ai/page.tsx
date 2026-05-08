"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AIPromptSection from "./components/AIPromptSection";
import AIGeneratedSurveySection from "./components/AIGeneratedSurveySection";
import SurveySettingsSection from "./components/SurveySettingsSection";
import AddRecipientsSection, { type AddRecipientPayload } from "../components/AddRecipientsSection";
import Button from "@/components/ui/Button";
import SuccessModal from "@/components/ui/SuccessModal";
import {
  defaultSurveySettings,
  Question,
  QuestionType,
  SurveySettings,
  Recipient,
} from "./data";
import {
  addRecipientsApi,
  aiGenerateSurveyQuestionsApi,
  createSurveyApi,
  publishSurveyApi,
  uploadRecipientsCsvApi,
  type AddRecipientItem,
  type AiGenerateSurveyQuestionsData,
  type AiGenerateSurveyQuestionsQuestion,
  type CreateSurveyQuestion,
  type RecipientType,
} from "@/lib/api/survey.api";

function mapAiQuestionTypeToUi(type: string): QuestionType {
  const t = type?.toLowerCase()?.trim();
  if (t === "numeric_rating" || t === "rating") return "rating";
  if (t === "yes_no" || t === "yesno" || t === "boolean") return "yesno";
  if (t === "multiple_choice" || t === "likert_scale" || t === "multiple") return "multiple";
  return "text";
}

function normalizeAiQuestions(data: AiGenerateSurveyQuestionsData): Question[] {
  const source =
    (data.questions?.length
      ? data.questions
      : data.generatedQuestions?.length
        ? data.generatedQuestions
        : data.survey?.questions) ?? [];
  return source.map((q: AiGenerateSurveyQuestionsQuestion, index: number) => ({
    id: `q-${Date.now()}-${index + 1}`,
    order: q.order ?? index + 1,
    text: (q.questionText ?? q.text ?? "").trim(),
    type: mapAiQuestionTypeToUi(q.questionType ?? q.type ?? "text"),
  })).filter((q) => q.text.length > 0);
}

function mapUiQuestionsToCreatePayload(questions: Question[]): CreateSurveyQuestion[] {
  return questions.map((q, index) => {
    const base = {
      questionText: q.text.trim(),
      required: true,
      order: q.order ?? index + 1,
      minValue: null as number | null,
      maxValue: null as number | null,
      minLabel: null as string | null,
      maxLabel: null as string | null,
    };

    if (q.type === "rating") {
      return {
        ...base,
        questionType: "numeric_rating",
        minValue: 1,
        maxValue: 10,
        minLabel: "Very Poor",
        maxLabel: "Excellent",
      };
    }

    if (q.type === "yesno") {
      return {
        ...base,
        questionType: "multiple_choice",
        options: ["Yes", "No"],
      };
    }

    if (q.type === "multiple") {
      return {
        ...base,
        questionType: "multiple_choice",
        options: ["Option 1", "Option 2", "Option 3"],
      };
    }

    return {
      ...base,
      questionType: "open_ended",
    };
  });
}

function mapRoleToRecipientType(role?: string): RecipientType {
  if (role === "Staff" || role === "Alumni") return role;
  return "Parent";
}

export default function AIGenerateSurveyPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [settings, setSettings] = useState<SurveySettings>(
    defaultSurveySettings
  );
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [surveyId, setSurveyId] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddingRecipient, setIsAddingRecipient] = useState(false);
  const [isUploadingCSV, setIsUploadingCSV] = useState(false);
  const [isPublishingSurvey, setIsPublishingSurvey] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate survey questions.");
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await aiGenerateSurveyQuestionsApi({ prompt: prompt.trim() });
      const nextQuestions = normalizeAiQuestions(generated);
      if (nextQuestions.length === 0) {
        throw new Error("AI did not return any usable questions.");
      }

      setQuestions(nextQuestions);
      setSettings((prev) => ({
        ...prev,
        surveyName:
          generated.title?.trim() ||
          generated.surveyTitle?.trim() ||
          prev.surveyName,
      }));

      const generatedSurveyId =
        generated.surveyId?.trim() ||
        generated.id?.trim() ||
        generated.survey?.surveyId?.trim() ||
        generated.survey?.id?.trim() ||
        "";
      if (generatedSurveyId) {
        setSurveyId(generatedSurveyId);
      } else {
        const created = await createSurveyApi({
          title:
            generated.title?.trim() ||
            generated.surveyTitle?.trim() ||
            generated.survey?.title?.trim() ||
            settings.surveyName.trim() ||
            "AI Generated Survey",
          category: settings.targetAudience,
          description: generated.description?.trim() || prompt.trim(),
          estimatedTime: generated.estimatedTime ?? 10,
          questions: mapUiQuestionsToCreatePayload(nextQuestions),
        });
        setSurveyId(created.id);
      }

      setIsEditMode(false);
      toast.success("Survey generated successfully.");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to generate survey.",
        {
          id: "ai-generate-survey-error",
        }
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    await handleGenerate();
  };

  const handleEditManually = () => {
    setIsEditMode(true);
  };

  const handleUpdateQuestion = (questionId: string, updates: { text?: string; type?: Question["type"] }) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, ...updates } : q))
    );
  };

  const handleUpdateSettings = (updatedSettings: Partial<SurveySettings>) => {
    setSettings({ ...settings, ...updatedSettings });
  };

  const handleAddRecipient = async (recipient: Omit<Recipient, "id">) => {
    if (!surveyId) {
      toast.error("Generate survey first, then add recipients.");
      return;
    }
    if (isAddingRecipient) return;

    const recipientType = mapRoleToRecipientType(recipient.role);
    const payload: AddRecipientItem = {
      fullName: recipient.name.trim(),
      email: recipient.email.trim(),
      recipientType,
    };

    setIsAddingRecipient(true);
    try {
      const result = await addRecipientsApi(surveyId, [payload]);
      const newRecipient: Recipient = {
        id: `r${Date.now()}`,
        name: recipient.name.trim(),
        email: recipient.email.trim(),
        role: recipient.role,
      };
      setRecipients((prev) => [...prev, newRecipient]);
      toast.success(
        `${result.added} recipient(s) added.${result.duplicatesSkipped ? ` Duplicates skipped: ${result.duplicatesSkipped}.` : ""}`
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add recipient.", {
        id: "ai-add-recipient-error",
      });
    } finally {
      setIsAddingRecipient(false);
    }
  };

  const handleUploadCSV = async (file: File) => {
    if (!surveyId) {
      toast.error("Generate survey first, then upload recipients.");
      return;
    }
    if (isUploadingCSV) return;

    const isCsvFile = file.name.toLowerCase().endsWith(".csv") || file.type === "text/csv";
    if (!isCsvFile) {
      toast.error("Please upload a valid CSV file.");
      return;
    }

    setIsUploadingCSV(true);
    try {
      const result = await uploadRecipientsCsvApi(surveyId, file);
      toast.success(
        `${result.added} recipient(s) added from CSV.${result.duplicatesSkipped ? ` Duplicates skipped: ${result.duplicatesSkipped}.` : ""}`
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload CSV.", {
        id: "ai-upload-csv-error",
      });
    } finally {
      setIsUploadingCSV(false);
    }
  };

  const handleSendSurvey = async () => {
    if (!settings.surveyName.trim()) {
      toast.error("Please enter a survey name.");
      return;
    }
    if (questions.length === 0) {
      toast.error("Please generate survey questions first.");
      return;
    }
    if (!surveyId) {
      toast.error("Generate survey first, then send it.");
      return;
    }
    if (isPublishingSurvey) return;

    setIsPublishingSurvey(true);
    try {
      await publishSurveyApi(surveyId);
      console.log("Sending survey:", { prompt, questions, settings, recipients, surveyId });
      toast.success("Survey published successfully.");
      setShowSuccessModal(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to publish survey.", {
        id: "ai-publish-survey-error",
      });
    } finally {
      setIsPublishingSurvey(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.push("/pulse-survey");
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-5 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="mb-4 sm:mb-5 md:mb-5 lg:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-custom-gray/95 mb-1.5 sm:mb-2 lg:mb-2">
            AI-Powered Survey Creator
          </h1>
          <p className="text-sm sm:text-base text-custom-gray/80">
            Let AI help you create surveys in seconds.
          </p>
        </div>

        {/* AI Prompt Section */}
        <div className="border border-custom-gray/10 rounded-lg p-4 sm:p-5 md:p-5 lg:p-6">
        <div className="mb-4 sm:mb-5 md:mb-5 lg:mb-6">
          <AIPromptSection
            prompt={prompt}
            onPromptChange={setPrompt}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>

        {/* AI Generated Survey Section - shows after questions are generated */}
        {questions.length > 0 && (
          <div className="mb-4 sm:mb-5 md:mb-5 lg:mb-6">
            <AIGeneratedSurveySection
              questions={questions}
              onRegenerate={handleRegenerate}
              onEditManually={handleEditManually}
              onDoneEditing={() => setIsEditMode(false)}
              onUpdateQuestion={handleUpdateQuestion}
              isEditMode={isEditMode}
              isRegenerating={isGenerating}
            />
          </div>
        )}

        {/* Survey Settings Section - always visible */}
        <div className="mb-4 sm:mb-5 md:mb-5 lg:mb-6">
          <SurveySettingsSection
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            />
        </div>

        {/* Add Recipients Section - always visible */}
        <div className="mb-4 sm:mb-5 md:mb-5 lg:mb-6">
          <AddRecipientsSection
            title="Add Recipients to Survey"
            description="Upload or add email addresses of your internal community to send this survey."
            showRoleField={true}
            onAddRecipient={(payload: AddRecipientPayload) =>
              handleAddRecipient({
                name: payload.name,
                email: payload.email,
                role: payload.role ?? "Parent",
              })
            }
            onUploadCSV={handleUploadCSV}
            addButtonDisabled={isAddingRecipient}
            uploadButtonDisabled={isUploadingCSV}
            roleOptions={[
              { value: "Parent", label: "Parent" },
              { value: "Staff", label: "Staff" },
              { value: "Alumni", label: "Alumni" },
            ]}
            />
        </div>

        {/* Send Survey Button - in document flow */}
        {questions.length > 0 && (
            <div className="flex justify-end mt-4 sm:mt-5 md:mt-5 lg:mt-6">
            <Button
              variant="filled"
              rounded="full"
              bgColor="bg-custom-teal"
              hoverBgColor="hover:bg-custom-teal/90"
              textColor="text-custom-white"
              onClick={handleSendSurvey}
              disabled={isPublishingSurvey}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-sm"
              >
              {isPublishingSurvey ? "Publishing..." : "Send Survey"}
            </Button>
          </div>
        )}
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
      />
    </div>
  );
}

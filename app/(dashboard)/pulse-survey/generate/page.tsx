"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  createSurveyApi,
  getSurveyByIdApi,
  updateSurveyApi,
  type CreateSurveyData,
  type CreateSurveyQuestion,
} from "@/lib/api/survey.api";
import GenerateSurveyWithAI from "./components/GenerateSurveyWithAI";
import SurveyInformation from "./components/SurveyInformation";
import QuestionBuilder from "./components/QuestionBuilder";
import QuestionFormModal from "./components/QuestionFormModal";
import { SurveyDetails, Question, mockSurveysData } from "./data";

function mapApiQuestionType(
  questionType: string
): "likert" | "rating" | "text" {
  switch (questionType) {
    case "likert_scale":
      return "likert";
    case "numeric_rating":
      return "rating";
    case "multiple_choice":
      return "likert";
    case "open_ended":
      return "text";
    default:
      return "text";
  }
}

function apiSurveyToSurveyDetails(data: CreateSurveyData): SurveyDetails {
  return {
    id: data.id,
    title: data.title,
    category: data.category,
    description: data.description ?? "",
    estimatedTime: data.estimatedTime ?? 10,
    status: (data.status as SurveyDetails["status"]) ?? "draft",
    questions: (data.questions ?? []).map((q, i) => ({
      id: `q-${data.id}-${i}-${q.order ?? i + 1}`,
      order: q.order ?? i + 1,
      text: q.questionText ?? "",
      type: mapApiQuestionType(q.questionType ?? "open_ended"),
    })),
  };
}

/** Map UI questions to API CreateSurveyQuestion format (likert_scale, numeric_rating, open_ended) */
function mapQuestionsToApi(questions: Question[]): CreateSurveyQuestion[] {
  const defaultLikertOptions = [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
  ];
  return questions.map((q) => {
    const base = {
      questionText: q.text?.trim() || "",
      required: true,
      order: q.order,
      minValue: null as number | null,
      maxValue: null as number | null,
      minLabel: null as string | null,
      maxLabel: null as string | null,
    };
    if (q.type === "likert") {
      return {
        ...base,
        questionType: "likert_scale",
        options: defaultLikertOptions,
      };
    }
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
    return {
      ...base,
      questionType: "open_ended",
    };
  });
}

export default function GenerateSurveyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const surveyIdFromUrl = searchParams.get("surveyId");

  // When surveyId is in URL we'll prefill from backend (createdSurvey); start with no questions so backend questions render
  const defaultSurvey = mockSurveysData[0];
  const [survey, setSurvey] = useState<SurveyDetails>(() => {
    const base = {
      id: surveyIdFromUrl ?? Date.now(),
      title: defaultSurvey.title,
      category: defaultSurvey.category,
      description: defaultSurvey.description,
      estimatedTime: defaultSurvey.estimatedTime,
      status: "draft" as const,
    };
    if (surveyIdFromUrl) {
      return { ...base, questions: [] };
    }
    return { ...base, questions: [] };
  });

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isPrefillLoading, setIsPrefillLoading] = useState(Boolean(surveyIdFromUrl));
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | undefined>(
    undefined
  );
  const [isContinuingToReview, setIsContinuingToReview] = useState(false);
  // AI-edit prefill from sessionStorage (skip when we have surveyId – backend/prefill handles that)
  useEffect(() => {
    if (surveyIdFromUrl) return;
    const aiEdit = sessionStorage.getItem("aiSurveyToEdit");
    if (aiEdit) {
      try {
        const parsed = JSON.parse(aiEdit);
        const title = parsed?.title ?? "";
        const aiQuestions = parsed?.questions ?? [];
        const mapType = (t: string): "likert" | "rating" | "text" => {
          if (t === "rating" || t === "text") return t;
          if (t === "yesno") return "likert";
          return "rating";
        };
        const questions: Question[] = aiQuestions.map(
          (q: { id?: string; order?: number; text: string; type: string }, i: number) => ({
            id: q.id ?? `q${Date.now()}-${i}`,
            order: q.order ?? i + 1,
            text: q.text ?? "",
            type: mapType(q.type ?? "text"),
          })
        );
        if (questions.length > 0) {
          setSurvey((prev) => ({
            ...prev,
            title: title || prev.title,
            questions,
          }));
        }
      } catch (_) {
        // keep default survey on parse error
      }
      sessionStorage.removeItem("aiSurveyToEdit");
    }
  }, []);

  useEffect(() => {
    if (!surveyIdFromUrl) {
      setIsPrefillLoading(false);
      return;
    }

    let cancelled = false;
    setIsPrefillLoading(true);

    getSurveyByIdApi(surveyIdFromUrl)
      .then((data) => {
        if (cancelled) return;
        if (data.status !== "draft") {
          toast.error("Only draft surveys can be edited.");
          router.replace("/pulse-survey");
          return;
        }
        setSurvey(apiSurveyToSurveyDetails(data));
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error(err instanceof Error ? err.message : "Failed to load survey.");
      })
      .finally(() => {
        if (!cancelled) setIsPrefillLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [surveyIdFromUrl]);

  const handleGenerateWithAI = async () => {
    setIsGeneratingAI(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // In real app, this would call your AI API
    // For now, populate with sample data from mock data
    setSurvey({
      id: Date.now(),
      title: "AI Generated Survey",
      category: "Students",
      description: "This survey was generated using AI to help you get started quickly.",
      estimatedTime: 5,
      questions: [
        {
          id: "q1",
          order: 1,
          text: "How satisfied are you with the current learning environment?",
          type: "likert",
        },
        {
          id: "q2",
          order: 2,
          text: "Rate your overall experience.",
          type: "rating",
        },
      ],
      status: "draft",
    });
    setIsGeneratingAI(false);
  };

  const handleUpdateSurvey = (updatedData: Partial<SurveyDetails>) => {
    if (survey) {
      setSurvey({ ...survey, ...updatedData });
      // In real app, this would call: await updateSurvey(surveyId, updatedData);
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestion(undefined);
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = (questionData: Omit<Question, "id" | "order">) => {
    if (!survey) return;

    if (editingQuestion) {
      // Update existing question
      const updatedQuestions = survey.questions.map((q) =>
        q.id === editingQuestion.id
          ? { ...q, ...questionData }
          : q
      );
      setSurvey({ ...survey, questions: updatedQuestions });
    } else {
      // Add new question
      const newQuestion: Question = {
        ...questionData,
        id: `q${Date.now()}`,
        order: survey.questions.length + 1,
      };
      setSurvey({
        ...survey,
        questions: [...survey.questions, newQuestion],
      });
    }
    // In real app, this would call: await saveQuestion(surveyId, questionData);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!survey) return;
    const updatedQuestions = survey.questions.filter(
      (q) => q.id !== questionId
    );
    // Reorder questions
    const reorderedQuestions = updatedQuestions.map((q, index) => ({
      ...q,
      order: index + 1,
    }));
    setSurvey({ ...survey, questions: reorderedQuestions });
    // In real app, this would call: await deleteQuestion(surveyId, questionId);
  };

  const handleUpdateQuestion = (
    questionId: string,
    updatedData: Partial<Question>
  ) => {
    if (!survey) return;
    const updatedQuestions = survey.questions.map((q) =>
      q.id === questionId ? { ...q, ...updatedData } : q
    );
    setSurvey({ ...survey, questions: updatedQuestions });
    // In real app, this would call: await updateQuestion(surveyId, questionId, updatedData);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsQuestionModalOpen(true);
  };

  const handleContinueToReview = async () => {
    if (!survey.title.trim()) {
      toast.error("Please enter a survey title before continuing.");
      return;
    }
    const titleWordCount = survey.title.trim().split(/\s+/).filter(Boolean).length;
    if (titleWordCount < 3) {
      toast.error("Survey title must be at least 3 words.");
      return;
    }
    const descriptionWordCount = (survey.description?.trim() ?? "").split(/\s+/).filter(Boolean).length;
    if (descriptionWordCount < 10) {
      toast.error("Survey description must be at least 10 words.");
      return;
    }
    if (survey.questions.length === 0) {
      toast.error("Please add at least one question before continuing.");
      return;
    }
    const invalidQuestion = survey.questions.find((q) => !q.text?.trim());
    if (invalidQuestion) {
      toast.error("Every question must have text. Please edit or remove empty questions.");
      return;
    }
    if (isContinuingToReview) return;
    setIsContinuingToReview(true);
    try {
      if (surveyIdFromUrl && survey.status !== "draft") {
        toast.error("Only draft surveys can be edited.");
        return;
      }
      const payload = {
        title: survey.title.trim(),
        category: survey.category || "Students",
        description: survey.description?.trim() || "",
        estimatedTime: Math.min(120, Math.max(1, Number(survey.estimatedTime) || 10)),
        questions: mapQuestionsToApi(survey.questions),
      };
      const savedSurvey = surveyIdFromUrl
        ? await updateSurveyApi(surveyIdFromUrl, payload)
        : await createSurveyApi(payload);
      const serverSurveyId = savedSurvey?.id ?? surveyIdFromUrl;
      if (!serverSurveyId) {
        toast.error("Survey was saved but no id was returned.");
        return;
      }
      const surveyForReview = apiSurveyToSurveyDetails(savedSurvey);
      sessionStorage.setItem("surveyData", JSON.stringify(surveyForReview));
      sessionStorage.setItem("surveyId", serverSurveyId);
      sessionStorage.setItem("surveyTotalRecipients", "0");
      sessionStorage.setItem("surveyRecipients", "[]");
      router.push(`/pulse-survey/generate/review?surveyId=${serverSurveyId}`);
      toast.success(
        surveyIdFromUrl
          ? "Survey updated. You can now review and send."
          : "Survey created. You can now add recipients and send."
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : surveyIdFromUrl
          ? "Failed to update survey."
          : "Failed to create survey.",
        {
        id: "create-survey-error",
      }
      );
    } finally {
      setIsContinuingToReview(false);
    }
  };

  return (
    <div className="min-h-screen  md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Title and Generate AI Button */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-custom-gray/95 mb-2">
              Pulse Survey
            </h1>
            <p className="text-base text-custom-gray/80">
              Monitor and manage all school-wide surveys from here.
            </p>
          </div>
          <div className="flex-shrink-0">
            <GenerateSurveyWithAI />
          </div>
        </div>

        {/* Survey Information */}
        <div className="md:border md:border-custom-gray/10 rounded-lg md:p-6">

        <div className="mb-6">
          <SurveyInformation
            survey={survey}
            onUpdate={handleUpdateSurvey}
          />
        </div>

        {/* Question Builder */}
        <div className="mb-6">
          <QuestionBuilder
            questions={survey.questions}
            onAddQuestion={handleAddQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onUpdateQuestion={handleUpdateQuestion}
            onEditQuestion={handleEditQuestion}
            onContinueToReview={handleContinueToReview}
            isContinuingToReview={isContinuingToReview || isPrefillLoading}
          />
        </div>

        {/* Question Form Modal */}
        <QuestionFormModal
          isOpen={isQuestionModalOpen}
          onClose={() => {
            setIsQuestionModalOpen(false);
            setEditingQuestion(undefined);
          }}
          onSave={handleSaveQuestion}
          question={editingQuestion}
        />
      </div>
    </div>
          </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, ArrowRight, GripVertical } from "lucide-react";
import { Question, QuestionType } from "../data";
import Button from "@/components/ui/Button";

type QuestionBuilderProps = {
  questions: Question[];
  onAddQuestion: () => void;
  onDeleteQuestion: (questionId: string) => void;
  onUpdateQuestion: (questionId: string, updatedData: Partial<Question>) => void;
  onEditQuestion: (question: Question) => void;
  onContinueToReview: () => void;
  showContinueButton?: boolean;
  isContinuingToReview?: boolean;
};

const getQuestionTypeLabel = (type: QuestionType): string => {
  switch (type) {
    case "likert":
      return "Likert Scale";
    case "rating":
      return "1-10 Rating Scale";
    case "text":
      return "Text Input";
    default:
      return type;
  }
};

type QuestionPreviewProps = {
  question: Question;
  selectedValue: number | null;
  textValue: string;
  onValueChange: (value: number) => void;
  onTextChange: (value: string) => void;
};

const QuestionPreview = ({ question, selectedValue, textValue, onValueChange, onTextChange }: QuestionPreviewProps) => {
  switch (question.type) {
    case "likert":
      return (
        <div className="mt-3">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-0 text-custom-gray/60 mb-0 lg:mb-2">
            <div className="flex justify-between text-xs text-[#475569] lg:contents">
              <span className="text-xs lg:text-sm">Strongly Disagree</span>
              <span className="text-xs lg:hidden">Strongly Agree</span>
            </div>
            <div className="flex gap-1.5 justify-center lg:gap-2 flex-shrink-0">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onValueChange(num)}
                  className={`w-4 h-4 lg:w-5 lg:h-5 rounded-full border-2 transition-all cursor-pointer ${
                    selectedValue === num
                      ? "border-custom-teal bg-custom-teal"
                      : "border-custom-gray/30 hover:border-custom-teal/50"
                  }`}
                  aria-label={`Select ${num}`}
                />
              ))}
            </div>
            <span className="hidden lg:inline text-sm text-[#475569]">Strongly Agree</span>
          </div>
        </div>
      );
    case "rating":
      return (
        <div className="mt-3">
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <Button
                key={num}
                type="button"
                variant={selectedValue === num ? "filled" : "outlined"}
                rounded="md"
                borderColor={selectedValue === num ? "border-custom-teal" : "border-custom-gray/20"}
                bgColor={selectedValue === num ? "bg-custom-teal" : undefined}
                textColor={selectedValue === num ? "text-custom-white" : "text-custom-gray/60"}
                hoverTextColor="hover:text-custom-teal"
                hoverBgColor={selectedValue === num ? "hover:bg-custom-teal/90" : "hover:border-custom-teal"}
                onClick={() => onValueChange(num)}
                className="w-8 h-8 p-0 text-sm"
              >
                {num}
              </Button>
            ))}
          </div>
        </div>
      );
    case "text":
      return (
        <div className="mt-3">
          <textarea
            value={textValue}
            onChange={(e) => onTextChange(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-custom-gray/20 rounded-lg text-sm text-custom-gray/95 bg-transparent focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal resize-none"
            placeholder="Type your answer here..."
          />
        </div>
      );
    default:
      return null;
  }
};

export default function QuestionBuilder({
  questions,
  onAddQuestion,
  onDeleteQuestion,
  onUpdateQuestion,
  onEditQuestion,
  onContinueToReview,
  showContinueButton = true,
  isContinuingToReview = false,
}: QuestionBuilderProps) {
  // Track selected values for each question
  const [selectedValues, setSelectedValues] = useState<Record<string, number | null>>({});
  // Track text values for text-type questions
  const [textValues, setTextValues] = useState<Record<string, string>>({});

  const handleValueChange = (questionId: string, value: number) => {
    setSelectedValues((prev) => ({
      ...prev,
      [questionId]: prev[questionId] === value ? null : value,
    }));
  };

  const handleTextChange = (questionId: string, value: string) => {
    setTextValues((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  return (
    <div className="bg-transparent rounded-lg border border-custom-gray/10 shadow-sm p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-custom-gray/95 mb-1">
          Question Builder
        </h2>
        <p className="text-sm text-custom-gray/60">
          Drag and drop questions to reorder them.
        </p>
      </div>

      {/* Questions List */}
      <div className="space-y-4 mb-6">
        {questions.length === 0 ? (
          <div className="text-center py-8 text-custom-gray/60">
            <p className="text-sm">No questions yet. Add your first question!</p>
          </div>
        ) : (
          questions
            .sort((a, b) => a.order - b.order)
            .map((question) => (
              <div
                key={question.id}
                className="bg-transparent border border-custom-gray/10 rounded-lg p-4 hover:border-custom-teal/30 transition-colors"
              >
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <GripVertical
                        size={16}
                        className="text-custom-gray/40 cursor-move"
                      />
                      <span className="text-sm font-semibold text-[#4A4A4A]">
                        {question.order}.
                      </span>
                      <span className="text-sm font-semibold text-[#4A4A4A]">
                        {question.text}
                      </span>
                    </div>
                    <QuestionPreview
                      question={question}
                      selectedValue={selectedValues[question.id] || null}
                      textValue={textValues[question.id] || ""}
                      onValueChange={(value) => handleValueChange(question.id, value)}
                      onTextChange={(value) => handleTextChange(question.id, value)}
                    />
                    <p className="text-xs text-[#94A3B8] mt-2">
                      Type: {getQuestionTypeLabel(question.type)}
                    </p>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Footer Actions: stacked full width on mobile, side by side on md+ */}
      <div className="flex flex-col gap-3 pt-4 border-t border-custom-gray/10 md:flex-row md:items-center md:justify-between md:gap-0">
        <div className="w-full md:w-auto">
          <Button
            variant="outlined"
            rounded="full"
            onClick={onAddQuestion}
            textColor="text-custom-gray/80"
            borderColor="border-custom-gray/20"
            className="flex items-center justify-center gap-2 border-dashed bg-transparent hover:bg-custom-gray/5 text-sm w-full md:w-auto"
          >
            <Plus size={18} />
            Add Question
          </Button>
        </div>
        {showContinueButton && (
          <div className="w-full md:w-auto">
            <Button
              variant="filled"
              rounded="full"
              onClick={onContinueToReview}
              disabled={isContinuingToReview}
              className="flex items-center justify-center gap-2 text-sm w-full md:w-auto"
            >
              {isContinuingToReview ? "Creating…" : "Continue to Survey"}
              <ArrowRight size={18} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}


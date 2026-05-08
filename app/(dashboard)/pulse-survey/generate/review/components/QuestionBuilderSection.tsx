"use client";

import { useState } from "react";
import { Question } from "../data";

type QuestionBuilderSectionProps = {
  questions: Question[];
};

const getQuestionTypeLabel = (type: string): string => {
  switch (type) {
    case "likert":
      return "Likert Scale";
    case "rating":
      return "1-10 Rating Scale";
    case "text":
      return "Text Area";
    default:
      return type;
  }
};

type QuestionPreviewProps = {
  question: Question;
  selectedValue: number | null;
  onValueChange: (value: number) => void;
};

const QuestionPreview = ({ question, selectedValue, onValueChange }: QuestionPreviewProps) => {
  switch (question.type) {
    case "likert":
      return (
        <div className="mt-2 sm:mt-3 lg:mt-3">
          <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row items-start sm:items-center md:items-center lg:items-center justify-between gap-2 sm:gap-0 md:gap-0 lg:gap-0 text-xs text-custom-gray/60 mb-2">
            <span className="text-xs sm:text-xs md:text-xs lg:text-xs">Strongly Disagree</span>
            <div className="flex gap-1.5 sm:gap-2 md:gap-2 lg:gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onValueChange(num)}
                  className={`w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-5 lg:h-5 rounded-full border-2 transition-all cursor-pointer ${
                    selectedValue === num
                      ? "border-custom-teal bg-custom-teal"
                      : "border-custom-gray/30 hover:border-custom-teal/50"
                  }`}
                  aria-label={`Select ${num}`}
                />
              ))}
            </div>
            <span className="text-xs sm:text-xs md:text-xs lg:text-xs">Strongly Agree</span>
          </div>
        </div>
      );
    case "rating":
      return (
        <div className="mt-2 sm:mt-3 lg:mt-3">
          <div className="flex gap-1.5 sm:gap-2 md:gap-2 lg:gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onValueChange(num)}
                className={`w-7 h-7 sm:w-8 sm:h-8 md:w-8 md:h-8 lg:w-8 lg:h-8 border rounded-md flex items-center justify-center text-xs sm:text-sm md:text-sm lg:text-sm transition-all cursor-pointer ${
                  selectedValue === num
                    ? "border-custom-teal bg-custom-teal text-custom-white"
                    : "border-custom-gray/20 text-custom-gray/60 bg-transparent hover:border-custom-teal/50"
                }`}
                aria-label={`Select ${num}`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      );
    case "text":
      return (
        <div className="mt-2 sm:mt-3 lg:mt-3">
          <textarea
            rows={3}
            disabled
            className="w-full px-3 py-2 border border-custom-gray/20 rounded-lg text-xs sm:text-sm md:text-sm lg:text-sm text-custom-gray/60 bg-transparent resize-none"
            placeholder="Type your answer here..."
          />
        </div>
      );
    default:
      return null;
  }
};

export default function QuestionBuilderSection({
  questions,
}: QuestionBuilderSectionProps) {
  // Track selected values for each question
  const [selectedValues, setSelectedValues] = useState<Record<string, number | null>>({});

  const handleValueChange = (questionId: string, value: number) => {
    setSelectedValues((prev) => ({
      ...prev,
      [questionId]: prev[questionId] === value ? null : value,
    }));
  };

  return (
    <div className="bg-transparent rounded-lg border border-custom-gray/10 shadow-sm p-4 sm:p-5 md:p-6 lg:p-6 overflow-hidden">
      <h2 className="text-base sm:text-lg md:text-lg lg:text-lg font-bold text-custom-gray/95 mb-1">
        Question Builder
      </h2>
      <p className="text-xs sm:text-sm md:text-sm lg:text-sm text-custom-gray/60 mb-4 sm:mb-5 md:mb-6 lg:mb-6">
        Drag and drop questions to reorder them.
      </p>

      <div className="space-y-3 sm:space-y-4 md:space-y-4 lg:space-y-4">
        {questions.length === 0 ? (
          <div className="text-center py-6 sm:py-8 md:py-8 lg:py-8 text-custom-gray/60">
            <p className="text-xs sm:text-sm md:text-sm lg:text-sm">No questions added yet.</p>
          </div>
        ) : (
          questions
            .sort((a, b) => a.order - b.order)
            .map((question) => (
              <div
                key={question.id}
                className="bg-custom-gray/5 border border-custom-gray/10 rounded-lg p-3 sm:p-4 md:p-4 lg:p-4"
              >
                <div className="flex items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2 lg:gap-2 mb-1.5 sm:mb-2 lg:mb-2">
                      <span className="text-xs sm:text-sm md:text-sm lg:text-sm font-semibold text-custom-gray/60">
                        {question.order}.
                      </span>
                      <span className="text-xs sm:text-sm md:text-sm lg:text-sm font-semibold text-custom-gray/95 break-words">
                        {question.text}
                      </span>
                    </div>
                    <QuestionPreview
                      question={question}
                      selectedValue={selectedValues[question.id] || null}
                      onValueChange={(value) => handleValueChange(question.id, value)}
                    />
                    <p className="text-xs text-custom-gray/60 mt-1.5 sm:mt-2 lg:mt-2">
                      Type: {getQuestionTypeLabel(question.type)}
                    </p>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

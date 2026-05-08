"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronDown } from "lucide-react";
import { Question, QuestionType } from "../data";
import Button from "@/components/ui/Button";

type QuestionFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (questionData: Omit<Question, "id" | "order">) => void;
  question?: Question;
};

const questionTypes: { value: QuestionType; label: string }[] = [
  { value: "likert", label: "Likert Scale" },
  { value: "rating", label: "1-10 Rating Scale" },
  { value: "text", label: "Text Input" },
];

export default function QuestionFormModal({
  isOpen,
  onClose,
  onSave,
  question,
}: QuestionFormModalProps) {
  const [formData, setFormData] = useState({
    text: "",
    type: "likert" as QuestionType,
  });
  const [questionTypeOpen, setQuestionTypeOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const questionTypeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        questionTypeRef.current &&
        !questionTypeRef.current.contains(event.target as Node)
      ) {
        setQuestionTypeOpen(false);
      }
    };
    if (questionTypeOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [questionTypeOpen]);

  useEffect(() => {
    setValidationError(null);
    if (question) {
      setFormData({
        text: question.text,
        type: question.type,
      });
    } else {
      setFormData({
        text: "",
        type: "likert",
      });
    }
  }, [question, isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (!formData.text.trim()) {
      setValidationError("Question text is required.");
      return;
    }
    const wordCount = formData.text.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 10) {
      setValidationError("Question must contain a minimum of 10 words.");
      return;
    }
    onSave(formData);
    setFormData({ text: "", type: "likert" });
    onClose();
  };

  const handleClose = () => {
    setValidationError(null);
    setFormData({ text: "", type: "likert" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
      <div className="bg-custom-white rounded-lg shadow-lg w-full max-w-2xl mx-4 my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-custom-gray/10">
          <h2 className="text-xl font-bold text-custom-gray/95">
            {question ? "Edit Question" : "Add New Question"}
          </h2>
          <Button
            onClick={handleClose}
            variant="ghosted"
            rounded="md"
            hoverBgColor="hover:bg-custom-gray/10"
            className="p-1.5 w-auto h-auto"
            aria-label="Close modal"
          >
            <X size={20} className="text-custom-gray/60" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Question Text */}
          <div>
            <label className="block text-sm font-semibold text-custom-gray/95 mb-2">
              Question Text
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => {
                setFormData({ ...formData, text: e.target.value });
                if (validationError) setValidationError(null);
              }}
              rows={3}
              className="w-full px-4 py-2.5 border border-custom-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal text-sm text-custom-gray/95 resize-none"
              placeholder="Enter your question here..."
              required
            />
            {validationError && (
              <p className="mt-1.5 text-sm text-red-500" role="alert">
                {validationError}
              </p>
            )}
          </div>

          {/* Question Type */}
          <div>
            <label className="block text-sm font-semibold text-custom-gray/95 mb-2">
              Question Type
            </label>
            <div className="relative" ref={questionTypeRef}>
              <button
                type="button"
                onClick={() => setQuestionTypeOpen((prev) => !prev)}
                className="w-full flex items-center justify-between gap-2 pl-4 pr-3 py-2.5 border border-custom-gray/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal text-sm text-custom-gray/95 bg-transparent hover:border-custom-gray/30 transition-colors text-left"
                aria-haspopup="listbox"
                aria-expanded={questionTypeOpen}
                aria-label="Question type"
              >
                <span>
                  {questionTypes.find((t) => t.value === formData.type)?.label ??
                    "Select type"}
                </span>
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-custom-gray/60 transition-transform ${
                    questionTypeOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />
              </button>
              {questionTypeOpen && (
                <ul
                  role="listbox"
                  className="absolute z-50 w-full mt-1 py-1 border border-custom-gray/20 rounded-lg shadow-lg bg-custom-white max-h-60 overflow-auto"
                >
                  {questionTypes.map((type) => (
                    <li key={type.value} role="option" aria-selected={formData.type === type.value}>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, type: type.value }));
                          setQuestionTypeOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          formData.type === type.value
                            ? "bg-custom-teal/10 text-custom-teal font-medium"
                            : "text-custom-gray/95 hover:bg-custom-gray/5"
                        }`}
                      >
                        {type.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="border border-custom-gray/10 rounded-lg p-4 bg-custom-gray/5">
            <p className="text-xs font-semibold text-custom-gray/60 mb-3">
              Preview
            </p>
            <p className="text-sm font-semibold text-custom-gray/95 mb-3">
              {formData.text || "Your question will appear here..."}
            </p>
            {formData.text && (
              <div>
                {formData.type === "likert" && (
                  <div className="flex items-center justify-between text-xs text-custom-gray/60">
                    <span>Strongly Disagree</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div
                          key={num}
                          className="w-5 h-5 rounded-full border-2 border-custom-gray/30"
                        />
                      ))}
                    </div>
                    <span>Strongly Agree</span>
                  </div>
                )}
                {formData.type === "rating" && (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <Button
                        key={num}
                        type="button"
                        variant="outlined"
                        rounded="md"
                        borderColor="border-custom-gray/20"
                        textColor="text-custom-gray/60"
                        className="w-8 h-8 p-0 text-sm"
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                )}
                {formData.type === "text" && (
                  <textarea
                    disabled
                    rows={3}
                    className="w-full px-3 py-2 border border-custom-gray/20 rounded-lg text-sm text-custom-gray/60 bg-transparent resize-none"
                    placeholder="Type your answer here..."
                  />
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-custom-gray/10">
            <Button variant="ghosted" rounded="full" type="button" onClick={handleClose} className="text-sm">
              Cancel
            </Button>
            <Button variant="filled" rounded="full" type="submit" className="text-sm">
              {question ? "Update Question" : "Add Question"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


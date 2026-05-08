"use client";

import { useState } from "react";
import { RefreshCw, Pencil } from "lucide-react";
import Button from "@/components/ui/Button";
import { Question, QuestionType, getQuestionTypeInfo } from "../data";

type YesNoToggleProps = {
  value: boolean;
  onChange: (value: boolean) => void;
};

function YesNoToggle({ value, onChange }: YesNoToggleProps) {
  return (
    <div className="flex items-center bg-custom-orange/20 rounded-full py-1 px-3  inline-flex gap-3">
      <Button
        type="button"
        role="switch"
        aria-checked={value}
        variant="filled"
        rounded="full"
        bgColor={value ? "bg-custom-orange" : "bg-custom-gray/10"}
        hoverBgColor="hover:brightness-95"
        textColor="text-transparent"
        onClick={() => onChange(!value)}
        className="relative h-5 w-10 shrink-0 !p-0 min-w-0 border-0 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-custom-orange focus-visible:ring-offset-2"
      >
        <span
          className={`pointer-events-none absolute left-0.5 top-1/2 h-3.5 w-3.5 rounded-full  transition-all duration-200 ease-in-out ${
            value ? "bg-transparent" : "bg-custom-orange"
          }`}
          style={{
            transform: value ? "translate(22px, -50%)" : "translate(0, -50%)",
          }}
        />
      </Button>
      <span className="text-sm font-medium text-custom-orange">
        {value ? "Yes" : "No"}
      </span>
    </div>
  );
}

type AIGeneratedSurveySectionProps = {
  questions: Question[];
  onRegenerate: () => void;
  onEditManually: () => void;
  onDoneEditing: () => void;
  onUpdateQuestion: (questionId: string, updates: { text?: string; type?: QuestionType }) => void;
  isEditMode: boolean;
  isRegenerating: boolean;
};


export const  ChoiceIcon=()=>(
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.49992 9.99996C7.49992 10.221 7.41212 10.4329 7.25584 10.5892C7.09956 10.7455 6.8876 10.8333 6.66659 10.8333C6.44557 10.8333 6.23361 10.7455 6.07733 10.5892C5.92105 10.4329 5.83325 10.221 5.83325 9.99996C5.83325 9.77895 5.92105 9.56698 6.07733 9.4107C6.23361 9.25442 6.44557 9.16663 6.66659 9.16663C6.8876 9.16663 7.09956 9.25442 7.25584 9.4107C7.41212 9.56698 7.49992 9.77895 7.49992 9.99996ZM10.8333 9.99996C10.8333 10.221 10.7455 10.4329 10.5892 10.5892C10.4329 10.7455 10.2209 10.8333 9.99992 10.8333C9.7789 10.8333 9.56694 10.7455 9.41066 10.5892C9.25438 10.4329 9.16658 10.221 9.16658 9.99996C9.16658 9.77895 9.25438 9.56698 9.41066 9.4107C9.56694 9.25442 9.7789 9.16663 9.99992 9.16663C10.2209 9.16663 10.4329 9.25442 10.5892 9.4107C10.7455 9.56698 10.8333 9.77895 10.8333 9.99996ZM14.1666 9.99996C14.1666 10.221 14.0788 10.4329 13.9225 10.5892C13.7662 10.7455 13.5543 10.8333 13.3333 10.8333C13.1122 10.8333 12.9003 10.7455 12.744 10.5892C12.5877 10.4329 12.4999 10.221 12.4999 9.99996C12.4999 9.77895 12.5877 9.56698 12.744 9.4107C12.9003 9.25442 13.1122 9.16663 13.3333 9.16663C13.5543 9.16663 13.7662 9.25442 13.9225 9.4107C14.0788 9.56698 14.1666 9.77895 14.1666 9.99996Z" fill="#6B21A8"/>
  <path d="M18.3333 9.99996C18.3333 13.9283 18.3333 15.8925 17.1125 17.1125C15.8933 18.3333 13.9283 18.3333 9.99996 18.3333C6.07163 18.3333 4.10746 18.3333 2.88663 17.1125C1.66663 15.8933 1.66663 13.9283 1.66663 9.99996C1.66663 6.07163 1.66663 4.10746 2.88663 2.88663C4.10829 1.66663 6.07163 1.66663 9.99996 1.66663C13.9283 1.66663 15.8925 1.66663 17.1125 2.88663C17.9241 3.69829 18.1958 4.83913 18.2875 6.66663" stroke="#6B21A8" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
  

)
export const  TextIcon=()=>(
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.76587 13.5417L6.36587 9.87167M6.36587 9.87167H12.1242M6.36587 9.87167L8.81587 4.24917C8.84978 4.1631 8.90881 4.08923 8.98528 4.03718C9.06175 3.98512 9.15211 3.95728 9.24462 3.95728C9.33713 3.95728 9.42749 3.98512 9.50396 4.03718C9.58043 4.08923 9.63946 4.1631 9.67337 4.24917L12.1242 9.87167M12.1242 9.87167L12.405 10.5167" stroke="#00C0E8" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.9884 17.4465C13.3732 17.3596 13.7255 17.1651 14.0042 16.8857L18.5492 12.344C18.7516 12.1503 18.9132 11.918 19.0246 11.6609C19.1361 11.4039 19.195 11.1271 19.1981 10.847C19.2012 10.5668 19.1483 10.2888 19.0426 10.0293C18.9369 9.76987 18.7804 9.53412 18.5823 9.33592C18.3843 9.13771 18.1487 8.98103 17.8893 8.87507C17.6299 8.76912 17.352 8.71601 17.0718 8.71886C16.7917 8.72171 16.5149 8.78047 16.2577 8.89169C16.0005 9.00291 15.7682 9.16435 15.5742 9.36655L11.03 13.9099C10.7509 14.1899 10.5559 14.5432 10.4684 14.9282L10.0217 16.8899C9.99006 17.0283 9.99408 17.1725 10.0334 17.309C10.0727 17.4455 10.146 17.5698 10.2464 17.6702C10.3468 17.7706 10.4711 17.8439 10.6076 17.8832C10.744 17.9225 10.8882 17.9265 11.0267 17.8949L12.9884 17.4465Z" fill="#00C0E8"/>
<path d="M3.125 16.4059L3.59833 16.6009C4.13 16.8201 4.735 16.7468 5.22833 16.4509C5.80333 16.1084 6.6025 15.6884 7.2975 15.5343C7.78333 15.4259 8.33333 15.7001 8.20667 16.1809C8.065 16.7159 7.63167 17.3443 8.04667 17.6351C8.67167 18.0726 12.2392 16.9534 12.2392 16.9534" stroke="#00C0E8" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
</svg>



)

export const OrangeStarIcon=()=>(
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.96541 1.16694C8.89453 1.04048 8.79124 0.935193 8.66615 0.861911C8.54107 0.788629 8.39872 0.75 8.25375 0.75C8.10878 0.75 7.96643 0.788629 7.84134 0.861911C7.71626 0.935193 7.61296 1.04048 7.54208 1.16694C7.37541 1.47027 7.21514 1.7775 7.06125 2.08861C6.57641 3.07274 6.1642 4.09101 5.82791 5.13527C5.71208 5.49444 5.36875 5.74361 4.97541 5.75444C3.7831 5.78579 2.59466 5.90416 1.41958 6.10861C0.774581 6.22194 0.532081 6.95694 0.990414 7.40527C1.09486 7.50805 1.20041 7.60944 1.30708 7.70944C2.10463 8.46265 2.9479 9.16593 3.83208 9.81527C4.13791 10.0394 4.26375 10.4236 4.14708 10.7753C3.70266 12.1111 3.3846 13.4858 3.19708 14.8811C3.11375 15.5103 3.78708 15.9544 4.37208 15.6544C5.53211 15.0596 6.64139 14.3707 7.68875 13.5944C7.8528 13.4747 8.05065 13.4102 8.25375 13.4102C8.45685 13.4102 8.6547 13.4747 8.81875 13.5944C9.86589 14.371 10.9752 15.06 12.1354 15.6544C12.7196 15.9544 13.3937 15.5103 13.3104 14.8811C13.2782 14.645 13.2429 14.4103 13.2046 14.1769C13.0121 13.0228 12.7298 11.8855 12.3604 10.7753C12.2437 10.4236 12.3687 10.0394 12.6754 9.81527C13.6785 9.08027 14.6281 8.2749 15.5171 7.40527C15.9754 6.95694 15.7337 6.22194 15.0879 6.10861C13.913 5.90296 12.7245 5.78458 11.5321 5.75444C11.3436 5.75144 11.1605 5.69038 11.008 5.57958C10.8554 5.46878 10.7407 5.31363 10.6796 5.13527C10.2368 3.76083 9.66279 2.43137 8.96541 1.16694Z" stroke="#F3703F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

)





const getQuestionIcon = (iconName: string) => {
  switch (iconName) {
    case "Star":
      return <OrangeStarIcon />;
    case "List":
      return <ChoiceIcon />;
    case "Type":
      return <TextIcon />;
    default:
      return null;
  }
};

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: "rating", label: "Rating Scale" },
  { value: "yesno", label: "Yes/No" },
  { value: "multiple", label: "Multiple Choice" },
  { value: "text", label: "Short Text" },
];

export default function AIGeneratedSurveySection({
  questions,
  onRegenerate,
  onEditManually,
  onDoneEditing,
  onUpdateQuestion,
  isEditMode,
  isRegenerating,
}: AIGeneratedSurveySectionProps) {
  const [yesNoValues, setYesNoValues] = useState<Record<number, boolean>>({});

  const handleYesNoChange = (questionIndex: number, value: boolean) => {
    setYesNoValues((prev) => ({ ...prev, [questionIndex]: value }));
  };

  return (
    <div className="">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4 sm:mb-5 md:mb-5 lg:mb-6">
        <h2 className="text-base sm:text-lg font-bold text-custom-gray/95 shrink-0">
          AI Generated Survey
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="filled"
            rounded="full"
            bgColor="bg-custom-gray/60"
            hoverBgColor="hover:bg-custom-gray/20"
            textColor="text-custom-white"
            borderColor="border-custom-gray/20"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="px-3 py-2.5 sm:px-4 sm:py-3 flex font-semibold items-center gap-2 border border-custom-gray/20 text-xs sm:text-sm"
          >
            <RefreshCw size={16} className="shrink-0 text-custom-white" />
            <span>Regenerate</span>
          </Button>
          {!isEditMode ? (
            <Button
              variant="filled"
              rounded="full"
              bgColor="bg-custom-gray/60"
              hoverBgColor="hover:bg-custom-gray/20"
              textColor="text-white"
              borderColor="border-custom-gray/20"
              onClick={onEditManually}
              className="px-3 py-2.5 sm:px-4 sm:py-3 flex items-center font-semibold gap-2 border border-custom-gray/20 text-xs sm:text-sm"
            >
              <Pencil size={16} className="shrink-0 text-custom-white" />
              <span>Edit Manually</span>
            </Button>
          ) : (
            <Button
              variant="filled"
              rounded="full"
              bgColor="bg-custom-teal"
              hoverBgColor="hover:bg-custom-teal/90"
              textColor="text-custom-white"
              onClick={onDoneEditing}
              className="px-3 py-2.5 sm:px-4 sm:py-3 flex items-center font-semibold gap-2 text-xs sm:text-sm"
            >
              <span>Done</span>
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4 lg:space-y-5">
        {questions.map((question, index) => {
          const typeInfo = getQuestionTypeInfo(question.type);
          const isYesNo = question.type === "yesno";
          const yesNoValue = yesNoValues[index] ?? false;
          return (
            <div
              key={question.id}
              className="bg-transparent border-2 border-custom-gray/20 rounded-sm p-3 sm:p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {isEditMode ? (
                    <>
                      <div className="mb-2">
                        <label className="block text-xs font-medium text-custom-gray/70 mb-1">
                          Question {question.order}
                        </label>
                        <input
                          type="text"
                          value={question.text}
                          onChange={(e) =>
                            onUpdateQuestion(question.id, { text: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-custom-gray/20 rounded-lg text-xs sm:text-sm text-custom-gray/95 bg-transparent focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal"
                          placeholder="Enter question text"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-custom-gray/70 mb-1">
                          Type
                        </label>
                        <select
                          value={question.type}
                          onChange={(e) =>
                            onUpdateQuestion(question.id, {
                              type: e.target.value as QuestionType,
                            })
                          }
                          className="w-full max-w-[200px] px-3 py-2 border border-custom-gray/20 rounded-lg text-xs sm:text-sm text-custom-gray/95 bg-transparent focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal"
                        >
                          {QUESTION_TYPES.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-xs sm:text-sm text-custom-gray/95 mb-2 break-words">
                        <span className="font-bold">{question.order}.</span>{" "}
                        {question.text}
                      </p>
                      {isYesNo ? (
                        <YesNoToggle
                          value={yesNoValue}
                          onChange={(value) => handleYesNoChange(index, value)}
                        />
                      ) : (
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 ${typeInfo.bgColor} ${typeInfo.color} rounded-full text-[10px] sm:text-xs font-medium`}
                        >
                          {getQuestionIcon(typeInfo.icon)}
                          <span>{typeInfo.label}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

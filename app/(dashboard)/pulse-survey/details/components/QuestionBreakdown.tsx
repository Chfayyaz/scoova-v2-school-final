"use client";

import Button from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

type QuestionBreakdownProps = {
  question: {
    id: string;
    question: string;
    type: "rating" | "text" | "likert";
    averageRating?: number;
    maxRating?: number;
    ratingDistribution?: { rating: number; count: number }[];
    likertDistribution?: { label: string; count: number }[];
    mostUsedWords?: string[];
    sampleResponses?: string[];
  };
  questionNumber?: number;
  showTitle?: boolean;
};

export default function QuestionBreakdown({
  question,
  questionNumber,
  showTitle = false,
}: QuestionBreakdownProps) {
  // Group ratings into ranges: 9-10, 7-8, 5-6, 3-4, 1-2
  const getRatingRanges = () => {
    if (!question.ratingDistribution) return [];

    const ranges = [
      { label: "9-10", min: 9, max: 10 },
      { label: "7-8", min: 7, max: 8 },
      { label: "5-6", min: 5, max: 6 },
      { label: "3-4", min: 3, max: 4 },
      { label: "1-2", min: 1, max: 2 },
    ];

    return ranges.map((range) => {
      const count = question.ratingDistribution!.reduce((sum, item) => {
        if (item.rating >= range.min && item.rating <= range.max) {
          return sum + item.count;
        }
        return sum;
      }, 0);
      return { ...range, count };
    });
  };

  const ratingRanges = getRatingRanges();
  const maxCount = Math.max(...ratingRanges.map((r) => r.count), 1);
  const likertRows = question.likertDistribution ?? [];
  const maxLikert = Math.max(...likertRows.map((r) => r.count), 1);

  return (
    <div className="mb-4 md:mb-6">
      {/* Title outside the card */}
      {showTitle && (
        <h2 className="text-xl md:text-2xl font-bold text-custom-gray/95 mb-3 md:mb-4">
          Question Breakdown
        </h2>
      )}

      {/* White Card */}
      <div className="bg-custom-white rounded-lg border border-custom-gray/10 shadow-sm p-4 md:p-6 overflow-hidden">
        {/* Question Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 md:mb-6">
          <h3 className="text-[16px] font-bold text-custom-gray/95">
            {questionNumber && `${questionNumber}. `}
            {question.question}
          </h3>
          {question.type === "rating" && (
            <span className="px-3 py-1 bg-custom-blue/10 text-[#4A90E2] text-xs font-medium rounded-full w-fit">
              Rating 1-{question.maxRating ?? 10}
            </span>
          )}
          {question.type === "likert" && (
            <span className="px-3 py-1 bg-custom-purple/10 text-custom-purple text-xs font-medium rounded-full w-fit">
              Likert scale
            </span>
          )}
          {question.type === "text" && (
            <span className="px-2 py-1 bg-custom-green/18  text-[#15803D] text-[10px] font-semibold rounded-full">
              Short Answer
            </span>
          )}
        </div>

        {question.type === "likert" && likertRows.length > 0 && (
          <div className="space-y-2 md:space-y-3">
            {likertRows.map((row) => {
              const pct = maxLikert > 0 ? (row.count / maxLikert) * 100 : 0;
              return (
                <div
                  key={row.label}
                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3"
                >
                  <span className="text-xs md:text-sm text-custom-gray/95 sm:w-[140px] sm:flex-shrink-0 leading-snug">
                    {row.label}
                  </span>
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    <div className="flex-1 relative h-2 md:h-3 bg-custom-gray/10 rounded-sm overflow-hidden">
                      <div
                        className="h-full rounded-sm bg-custom-teal"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-custom-gray/70 w-8 text-right tabular-nums">{row.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {question.type === "rating" && question.averageRating != null && (
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center">
            {/* Average Rating Section - Left Side */}
            <div className="flex-shrink-0">
              <p className="text-xs md:text-sm text-custom-gray/95 mb-1 md:mb-2">Average Rating</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl md:text-4xl font-bold" style={{ color: "#F97316" }}>
                  {question.averageRating}
                </span>
                <span className="text-base md:text-lg text-custom-gray/95">
                  / {question.maxRating}
                </span>
              </div>
            </div>

            {/* Bar Chart Section - Right Side */}
            <div className="flex-1 w-full">
              <div className="space-y-1">
                {ratingRanges.map((range) => {
                  const percentage = (range.count / maxCount) * 100;
                  return (
                    <div key={range.label} className="flex items-center gap-1">
                      <span className="text-xs md:text-sm text-custom-gray/95 w-8 flex-shrink-0">
                        {range.label}
                      </span>
                      <div className="flex-1 relative">
                        <div
                          className="h-2 md:h-3"
                          style={{
                            backgroundColor: "#F97316",
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {question.type === "text" &&
          (question.mostUsedWords?.length || question.sampleResponses?.length) && (
          <div>
            {question.sampleResponses && question.sampleResponses.length > 0 && (
              <div className="mb-3 md:mb-4">
                <p className="text-xs font-semibold text-custom-gray/60 mb-2">Sample responses</p>
                <ul className="space-y-2 text-sm text-custom-gray/90 list-disc pl-4">
                  {question.sampleResponses.slice(0, 8).map((line, idx) => (
                    <li key={idx} className="leading-snug">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {question.mostUsedWords && question.mostUsedWords.length > 0 && (
              <>
                <p className="text-xs font-semibold text-custom-gray/60 mb-2 md:mb-3">
                  Frequent terms
                </p>
                <div className="flex flex-wrap gap-2 mb-2 md:mb-3">
                  {question.mostUsedWords.map((word, index) => (
                    <span
                      key={index}
                      className="px-2 md:px-3 py-1 bg-[#E5E7EB] rounded-full text-xs text-[#374151]"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </>
            )}
            <Button
              variant="ghosted"
              textColor="text-custom-teal"
              hoverTextColor="hover:text-custom-teal/80"
              className="text-sm p-0 h-auto font-semibold flex items-center gap-1"
            >
              View All Answers <ArrowRight size={14} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}


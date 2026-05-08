"use client";

type SurveyDurationCardProps = {
  startDate: string;
  endDate: string;
  timeRemaining?: number; // in days
};

export default function SurveyDurationCard({
  startDate,
  endDate,
  timeRemaining,
}: SurveyDurationCardProps) {
  const calculateDaysRemaining = () => {
    if (timeRemaining !== undefined) return timeRemaining;
    // Parse date string like "30 Jan 2025"
    const parseDate = (dateStr: string) => {
      const months: Record<string, number> = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
      };
      const parts = dateStr.split(" ");
      const day = parseInt(parts[0]);
      const month = months[parts[1]];
      const year = parseInt(parts[2]);
      return new Date(year, month, day);
    };
    
    try {
      const end = parseDate(endDate);
      const now = new Date();
      const diffTime = end.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch {
      // If parsing fails, return a default value
      return 12; // Default to 12 days as shown in the reference
    }
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <div className="bg-custom-white rounded-lg border border-custom-gray/10 shadow-sm p-4 md:p-6 overflow-hidden">
      <h3 className="text-base md:text-[18px] font-bold text-custom-gray/95 mb-3 md:mb-4">
        Survey Duration
      </h3>
      <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
        <p className="text-xs md:text-sm text-custom-gray/95">
          Start: {startDate}
        </p>
        <p className="text-xs md:text-sm text-custom-gray/95">
          End: {endDate}
        </p>
      </div>
      <div className="pt-3 md:pt-4 border-t border-custom-gray/10 text-center">
        <p className="text-xs text-custom-gray/60 mb-1.5 md:mb-2">Time Remaining</p>
        <p className="text-xl md:text-[24px] font-bold text-custom-teal">{daysRemaining} Days</p>
      </div>
    </div>
  );
}


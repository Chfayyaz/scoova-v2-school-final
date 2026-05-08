"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";


export const RefreshIcon=()=>(
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1101_1176)">
<path d="M2.87383 5.53979C3.08437 4.9437 3.42617 4.38315 3.90742 3.90464C5.61641 2.19565 8.38633 2.19565 10.0953 3.90464L10.5629 4.37495H9.1875C8.70352 4.37495 8.3125 4.76597 8.3125 5.24995C8.3125 5.73394 8.70352 6.12495 9.1875 6.12495H12.6738H12.6848C13.1687 6.12495 13.5598 5.73394 13.5598 5.24995V1.74995C13.5598 1.26597 13.1687 0.874951 12.6848 0.874951C12.2008 0.874951 11.8098 1.26597 11.8098 1.74995V3.14995L11.3313 2.6687C8.93867 0.276123 5.06133 0.276123 2.66875 2.6687C2.00156 3.33589 1.52031 4.12065 1.225 4.96011C1.06367 5.41675 1.3043 5.9144 1.7582 6.07573C2.21211 6.23706 2.7125 5.99644 2.87383 5.54253V5.53979ZM1.06641 7.9105C0.929688 7.95151 0.798437 8.02534 0.691797 8.13472C0.582422 8.24409 0.508594 8.37534 0.470313 8.51753C0.462109 8.55034 0.453906 8.58589 0.448437 8.62144C0.440234 8.66792 0.4375 8.7144 0.4375 8.76089V12.25C0.4375 12.7339 0.828516 13.125 1.3125 13.125C1.79648 13.125 2.1875 12.7339 2.1875 12.25V10.8527L2.66875 11.3312C5.06133 13.721 8.93867 13.721 11.3285 11.3312C11.9957 10.664 12.4797 9.87925 12.775 9.04253C12.9363 8.58589 12.6957 8.08823 12.2418 7.9269C11.7879 7.76558 11.2875 8.0062 11.1262 8.46011C10.9156 9.0562 10.5738 9.61675 10.0926 10.0953C8.38359 11.8042 5.61367 11.8042 3.90469 10.0953L3.90195 10.0925L3.43438 9.62495H4.8125C5.29648 9.62495 5.6875 9.23394 5.6875 8.74995C5.6875 8.26597 5.29648 7.87495 4.8125 7.87495H1.32344C1.27969 7.87495 1.23594 7.87769 1.19219 7.88315C1.14844 7.88862 1.10742 7.89683 1.06641 7.9105Z" fill="#4F46E5"/>
</g>
<defs>
<clipPath id="clip0_1101_1176">
<path d="M0 0H14V14H0V0Z" fill="white"/>
</clipPath>
</defs>
</svg>

)

type AISummaryProps = {
  summary: string;
  keyFindings: {
    label: string;
    value: string;
    color: string;
  }[];
  /** First load: show placeholders until API returns */
  loading?: boolean;
  /** Refetch in progress (keeps current copy visible) */
  regenerating?: boolean;
  onRegenerate?: () => void | Promise<void>;
};

const getChipStyle = (label: string) => {
  switch (label) {
    case "Overall Satisfaction":
      return {
        bg: "bg-custom-green/20",
        text: "text-custom-green",
        icon: <Image src="/images/svg/face.svg" alt="Overall Satisfaction" width={14} height={14} className="shrink-0 md:w-4 md:h-4" />,
      };
    case "Common Concern":
      return {
        bg: "bg-custom-yellow/30",
        text: "text-custom-gray/95",
        icon: <Image src="/images/svg/speaker.svg" alt="Common Concern" width={14} height={14} className="shrink-0 md:w-4 md:h-4" />,
      };
    case "Strong Area":
      return {
        bg: "bg-custom-blue/25",
        text: "text-custom-blue",
        icon: <Image src="/images/svg/screen.svg" alt="Strong Area" width={14} height={14} className="shrink-0 md:w-4 md:h-4" />,
      };
    case "Sentiment":
      return {
        bg: "bg-custom-blue/15",
        text: "text-custom-blue",
        icon: <Image src="/images/svg/bluechart.svg" alt="Sentiment" width={14} height={14} className="shrink-0 md:w-4 md:h-4" />,
      };
    default:
      return {
        bg: "bg-custom-gray/10",
        text: "text-custom-gray/95",
        icon: null,
      };
  }
};

export default function AISummary({
  summary,
  keyFindings,
  loading = false,
  regenerating = false,
  onRegenerate,
}: AISummaryProps) {
  const busy = loading || regenerating;

  return (
    <div className="bg-custom-white rounded-lg border border-custom-gray/10 p-4 md:p-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-3 md:mb-4">
        <div className="flex items-center gap-2 md:gap-3">
          <Image
            src="/images/svg/AIicon.svg"
            alt="AI"
            width={20}
            height={20}
            className="shrink-0"
            priority
          />
          <h3 className="text-base md:text-lg font-bold text-custom-gray/95">AI Summary</h3>
        </div>
        <Button
          variant="filled"
          rounded="full"
          bgColor="bg-custom-blue/10"
          hoverBgColor="hover:bg-custom-blue/20"
          textColor="text-custom-blue"
          onClick={() => void onRegenerate?.()}
          disabled={busy || !onRegenerate}
          className="text-xs md:text-sm flex font-medium   items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 w-fit h-auto disabled:opacity-50 disabled:pointer-events-none"
        >
          <RefreshIcon/>
          {regenerating ? "Refreshing…" : "Regenerate"}
        </Button>
      </div>
      {loading ? (
        <div className="space-y-3 mb-4 md:mb-5" aria-busy="true" aria-label="Loading AI summary">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-full max-w-2xl rounded-md" />
          <div className="flex flex-wrap gap-2 pt-2">
            <Skeleton className="h-8 w-36 rounded-full" />
            <Skeleton className="h-8 w-40 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm md:text-base text-custom-gray/80 mb-4 md:mb-5 leading-relaxed">
            {summary}
          </p>
          <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-3">
            {keyFindings.map((finding, index) => {
              const style = getChipStyle(finding.label);
              return (
                <div
                  key={index}
                  className={`flex items-center justify-center md:inline-flex gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 rounded-full w-full md:w-auto ${style.bg}`}
                >
                  {style.icon}
                  <span
                    className={`text-[10px] md:text-xs font-semibold ${style.text} md:whitespace-nowrap text-center md:text-left`}
                  >
                    {finding.label}: {finding.value}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}


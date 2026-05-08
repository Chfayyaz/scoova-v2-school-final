import type { PlanFeature } from "./types";

interface PlanOverviewCardProps {
  planName: string;
  planLabel?: string;
  secondaryPrice?: string;
  priceLabel: string;
  priceSuffix?: string;
  priceAccent?: boolean;
  sectionTitle?: string;
  featureTitle?: string;
  popularBadgeLabel?: string;
  showPopularBadge?: boolean;
  ctaLabel?: string;
  onCtaClick?: () => void;
  features: PlanFeature[];
  className?: string;
}

export default function PlanOverviewCard({
  planName,
  planLabel,
  secondaryPrice,
  priceLabel,
  priceSuffix,
  priceAccent = false,
  featureTitle,
  popularBadgeLabel = "Most Popular",
  showPopularBadge = false,
  ctaLabel = "Subscribe",
  onCtaClick,
  features,
  className = "",
}: PlanOverviewCardProps) {
  return (
    <section
      className={[
        "w-full rounded-2xl border border-slate-300 bg-slate-50 p-6 sm:p-8",
        className,
      ].join(" ")}
    >
      <header className="flex flex-col justify-between gap-4 border-b border-slate-300 pb-5 sm:flex-row sm:items-start">
        <div className="flex flex-col gap-3">
          {showPopularBadge && (
            <span className="inline-flex w-fit items-center rounded-full bg-custom-teal px-4 py-1 text-xs font-medium text-custom-white">
              {popularBadgeLabel}
            </span>
          )}
          <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
            {planName}
          </h2>
        </div>
        <div className="text-left sm:text-right">
          {secondaryPrice && (
            <p className="text-xs italic text-gray-500 sm:text-sm">{secondaryPrice}</p>
          )}
          {planLabel && !secondaryPrice && (
            <p className="text-xs italic text-gray-500 sm:text-sm">{planLabel}</p>
          )}
          <p
            className={[
              "text-2xl font-bold sm:text-3xl",
              priceAccent ? "text-custom-teal" : "text-gray-900",
            ].join(" ")}
          >
            {priceLabel}
            {priceSuffix && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                {priceSuffix}
              </span>
            )}
          </p>
        </div>
      </header>

      <div className="pt-5">
        {featureTitle && (
          <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
            {featureTitle}
          </h3>
        )}

        <ul className="mt-3 space-y-2 sm:space-y-2.5">
          {features.map((feature) => (
            <li
              key={feature.id}
              className="flex items-start gap-3 text-sm text-gray-700 sm:text-base"
            >
              <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-gray-700" />
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={onCtaClick}
        className="mt-6 w-full rounded-full bg-custom-teal py-3 text-sm font-semibold text-custom-white transition hover:brightness-95 sm:text-base"
      >
        {ctaLabel}
      </button>
    </section>
  );
}

import { Check, Info, MailCheck, MoveRight } from "lucide-react";

interface SummaryItem {
  id: string;
  label: string;
  value: string;
}

interface SubscriptionConfirmationPanelProps {
  heading?: string;
  subheading?: string;
  welcomeTitle: string;
  welcomePoints: string[];
  supportLabel?: string;
  supportHref?: string;
  summaryTitle?: string;
  summaryItems: SummaryItem[];
  dashboardLabel?: string;
  onDashboardClick?: () => void;
  className?: string;
}

export default function SubscriptionConfirmationPanel({
  heading = "Subscription Activated",
  subheading = "Your subscription has been successfully activated",
  welcomeTitle,
  welcomePoints,
  supportLabel = "Go to Scoova Support",
  supportHref = "#",
  summaryTitle = "Subscription Summary",
  summaryItems,
  dashboardLabel = "Go to Dashboard",
  onDashboardClick,
  className = "",
}: SubscriptionConfirmationPanelProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      <section className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <Check className="h-6 w-6 text-custom-teal" strokeWidth={2.5} />
        </span>
        <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
          {heading}
          <span className="ml-2">🎉</span>
        </h2>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">{subheading}</p>
      </section>

      <section className="grid gap-0 overflow-hidden rounded-2xl bg-custom-white shadow-lg sm:grid-cols-2">
        <div className="space-y-4 p-6 sm:border-r sm:border-slate-200 sm:p-8">
          <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 sm:text-lg">
            <MailCheck className="h-5 w-5 text-custom-teal" />
            {welcomeTitle}
          </h3>
          <ul className="space-y-2">
            {welcomePoints.map((point, index) => (
              <li
                key={`${point}-${index}`}
                className="flex gap-2 text-sm text-gray-700"
              >
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-custom-teal" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <p className="text-sm text-gray-600">Didn't receive the email?</p>
            <a
              href={supportHref}
              className="mt-1 inline-block text-sm font-medium text-custom-teal underline"
            >
              {supportLabel}
            </a>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <h3 className="text-base font-bold text-gray-900 sm:text-lg">{summaryTitle}</h3>
          <div className="mt-4">
            {summaryItems.map((item, index) => (
              <div
                key={item.id}
                className={[
                  "grid grid-cols-2 items-center py-3",
                  index < summaryItems.length - 1 ? "border-b border-slate-200" : "",
                ].join(" ")}
              >
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className="text-right text-sm font-semibold text-gray-900">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex justify-center sm:justify-end">
        <button
          type="button"
          onClick={onDashboardClick}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-custom-teal px-8 text-sm font-semibold text-custom-white transition hover:brightness-95"
        >
          {dashboardLabel}
          <MoveRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

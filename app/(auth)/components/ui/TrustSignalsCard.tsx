import { CircleDollarSign, Shield, Timer } from "lucide-react";
import type { TrustSignal } from "./types";

interface TrustSignalsCardProps {
  title?: string;
  subtitle?: string;
  signals: TrustSignal[];
  className?: string;
}

const fallbackIcons = [Shield, Timer, CircleDollarSign];

export default function TrustSignalsCard({
  title = "Trusted by Educational Leaders",
  subtitle = "Join thousands of schools already using Scoova to build trust and improve their reputation.",
  signals,
  className = "",
}: TrustSignalsCardProps) {
  return (
    <section
      className={[
        "w-full rounded-2xl border border-slate-300 bg-slate-50 p-6 text-center sm:p-8",
        className,
      ].join(" ")}
    >
      <h3 className="text-lg font-bold text-gray-900 sm:text-xl">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-xs italic leading-relaxed text-gray-500 sm:text-sm">
        {subtitle}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:mt-5 sm:gap-x-10">
        {signals.map((signal, index) => {
          const Icon = signal.icon ?? fallbackIcons[index % fallbackIcons.length];
          return (
            <div
              key={signal.id}
              className="inline-flex items-center gap-2 text-gray-600"
            >
              <Icon className="h-4 w-4 text-custom-teal" />
              <span className="text-xs font-medium sm:text-sm">{signal.text}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

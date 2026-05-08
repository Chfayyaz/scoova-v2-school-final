import type { PlanOption } from "./types";

interface PlanToggleProps {
  options: PlanOption[];
  selectedId: string;
  onChange: (id: string) => void;
  className?: string;
}

export default function PlanToggle({
  options,
  selectedId,
  onChange,
  className = "",
}: PlanToggleProps) {
  return (
    <div
      className={[
        "mx-auto inline-flex items-center gap-1 rounded-full bg-custom-teal p-1.5",
        className,
      ].join(" ")}
    >
      {options.map((option) => {
        const isActive = selectedId === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={[
              "min-w-32 rounded-full px-6 py-2 text-sm font-medium transition-all sm:text-base",
              isActive
                ? "bg-custom-white text-gray-900 shadow-sm"
                : "bg-transparent text-custom-white hover:bg-white/10",
            ].join(" ")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

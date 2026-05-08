import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import type { StepItem } from "./types";

interface AuthStepperProps {
  steps: StepItem[];
  currentStep: number;
  className?: string;
}

export default function AuthStepper({
  steps,
  currentStep,
  className = "",
}: AuthStepperProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex w-full items-center py-2">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isEnabled = isActive || isCompleted;

          return (
            <Fragment key={step.id}>
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <span
                  className={[
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold sm:h-8 sm:w-8 sm:text-sm",
                    isEnabled
                      ? "bg-custom-teal text-custom-white"
                      : "bg-gray-300 text-gray-500",
                  ].join(" ")}
                >
                  {index + 1}
                </span>
                <span
                  className={[
                    "text-sm font-medium",
                    isActive
                      ? "text-custom-teal"
                      : isCompleted
                      ? "text-gray-700"
                      : "text-gray-400",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={[
                    "mx-3 flex min-w-6 flex-1 items-center sm:mx-4",
                    isCompleted ? "text-custom-teal" : "text-gray-300",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "block h-px w-full -mr-1",
                      isCompleted ? "bg-custom-teal" : "bg-gray-300",
                    ].join(" ")}
                  />
                  <ArrowRight className="h-3 w-3 shrink-0" strokeWidth={1.75} />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

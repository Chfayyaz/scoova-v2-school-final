import type { LucideIcon } from "lucide-react";

export type AuthRole = "school" | "individual" | "education-business";

export interface StepItem {
  id: string;
  label: string;
}

export type PlanType = "basic" | "grow" | "plus";

export interface PlanOption {
  id: PlanType | string;
  label: string;
}

export interface PlanFeature {
  id: string;
  text: string;
}

export interface TrustSignal {
  id: string;
  text: string;
  icon?: LucideIcon;
}

export interface FormField {
  id: string;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "url" | "password";
  width?: "full" | "half" | "third";
}

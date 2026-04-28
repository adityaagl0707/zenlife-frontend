import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SEVERITY_CONFIG = {
  critical: { label: "Critical", color: "bg-red-500", text: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  major: { label: "Major", color: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  minor: { label: "Minor", color: "bg-yellow-500", text: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
  normal: { label: "Normal", color: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
} as const;

export type Severity = keyof typeof SEVERITY_CONFIG;

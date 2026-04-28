import { cn } from "@/lib/utils";

type Severity = "critical" | "major" | "minor" | "normal";

const CONFIG: Record<Severity, string> = {
  critical: "badge badge-critical",
  major: "badge badge-major",
  minor: "badge badge-minor",
  normal: "badge badge-normal",
};

export default function SeverityBadge({ severity, className }: { severity: string; className?: string }) {
  const s = (severity?.toLowerCase() ?? "normal") as Severity;
  return (
    <span className={cn(CONFIG[s] ?? CONFIG.normal, className)}>
      {s}
    </span>
  );
}

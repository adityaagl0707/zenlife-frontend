"use client";

export default function ZenScoreRing({ score, severity }: { score: number; severity: string }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(score, 0), 100);
  const offset = circ * (1 - pct / 100);

  const COLORS: Record<string, string> = {
    critical: "#ef4444",
    major: "#f59e0b",
    minor: "#eab308",
    normal: "#10b981",
  };

  const color = COLORS[severity?.toLowerCase()] ?? COLORS.normal;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
      <svg width={140} height={140} className="-rotate-90">
        <circle cx={70} cy={70} r={r} fill="none" stroke="#f0fdf9" strokeWidth={12} />
        <circle
          cx={70}
          cy={70}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-extrabold text-gray-900">{pct}</p>
        <p className="text-xs font-semibold text-gray-400">ZenScore</p>
      </div>
    </div>
  );
}

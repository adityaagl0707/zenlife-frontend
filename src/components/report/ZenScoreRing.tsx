"use client";

const SEV_COLORS: Record<string, { stroke: string; glow: string; label: string }> = {
  critical: { stroke: "#ef4444", glow: "rgba(239,68,68,0.15)", label: "Needs Attention" },
  major:    { stroke: "#f59e0b", glow: "rgba(245,158,11,0.15)", label: "Monitor Closely" },
  minor:    { stroke: "#eab308", glow: "rgba(234,179,8,0.15)",  label: "Low Concern" },
  normal:   { stroke: "#10b981", glow: "rgba(16,185,129,0.15)", label: "Excellent" },
};

export default function ZenScoreRing({ score, severity }: { score: number; severity: string }) {
  const r = 68;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(score, 0), 100);
  const offset = circ * (1 - pct / 100);
  const sev = severity?.toLowerCase() ?? "normal";
  const { stroke, glow, label } = SEV_COLORS[sev] ?? SEV_COLORS.normal;

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative" style={{ width: 168, height: 168 }}>
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: glow, filter: "blur(16px)", transform: "scale(0.9)" }}
        />
        <svg width={168} height={168} className="-rotate-90" style={{ position: "relative" }}>
          {/* Track */}
          <circle cx={84} cy={84} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={14} />
          {/* Fill */}
          <circle
            cx={84} cy={84} r={r} fill="none"
            stroke={stroke} strokeWidth={14}
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
          />
          {/* Tick marks at 25, 50, 75 */}
          {[25, 50, 75].map((tick) => {
            const angle = (tick / 100) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const x1 = 84 + (r - 8) * Math.cos(rad);
            const y1 = 84 + (r - 8) * Math.sin(rad);
            const x2 = 84 + (r + 2) * Math.cos(rad);
            const y2 = 84 + (r + 2) * Math.sin(rad);
            return (
              <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(255,255,255,0.2)" strokeWidth={2} strokeLinecap="round" />
            );
          })}
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-4xl font-black text-white leading-none">{pct}</p>
          <p className="text-[10px] font-bold tracking-widest text-white/50 uppercase mt-0.5">ZenScore</p>
        </div>
      </div>
      <p className="mt-1 text-xs font-semibold" style={{ color: stroke }}>{label}</p>
    </div>
  );
}

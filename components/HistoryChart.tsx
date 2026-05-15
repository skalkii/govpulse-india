export interface HistoryBar {
  label: string;
  value: number;
  color?: string;
}

interface Props {
  bars: HistoryBar[];
  unit?: string;
  baseline?: number;          // optional reference line (e.g. mean)
  baselineLabel?: string;
  height?: number;
}

/**
 * Pure-SVG bar chart. No client JS needed — renders server-side.
 * Each bar shows its value above; baseline draws a dashed horizontal reference.
 */
export function HistoryChart({
  bars,
  unit = "mm",
  baseline,
  baselineLabel = "Mean",
  height = 220,
}: Props) {
  if (bars.length === 0) return null;
  const padTop = 28;
  const padBottom = 36;
  const padLeft = 8;
  const padRight = 8;
  const innerH = height - padTop - padBottom;
  const max = Math.max(...bars.map((b) => b.value), baseline ?? 0) * 1.1 || 1;
  const barW = 100 / bars.length;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        className="h-auto w-full"
        role="img"
        aria-label="Yearly rainfall bar chart"
      >
        {baseline !== undefined && (
          <>
            <line
              x1={padLeft}
              x2={100 - padRight}
              y1={padTop + innerH - (baseline / max) * innerH}
              y2={padTop + innerH - (baseline / max) * innerH}
              stroke="currentColor"
              strokeOpacity="0.35"
              strokeDasharray="1.5 1.5"
              strokeWidth="0.4"
            />
            <text
              x={100 - padRight}
              y={padTop + innerH - (baseline / max) * innerH - 1.5}
              textAnchor="end"
              fontSize="3"
              fill="currentColor"
              opacity="0.55"
            >
              {baselineLabel} {Math.round(baseline)}
            </text>
          </>
        )}
        {bars.map((b, i) => {
          const h = (b.value / max) * innerH;
          const x = padLeft + i * ((100 - padLeft - padRight) / bars.length) + 0.6;
          const y = padTop + innerH - h;
          const w = (100 - padLeft - padRight) / bars.length - 1.2;
          return (
            <g key={b.label}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx="0.6"
                fill={b.color ?? "var(--color-primary)"}
              />
              <text
                x={x + w / 2}
                y={y - 1.5}
                textAnchor="middle"
                fontSize="2.6"
                fill="currentColor"
                opacity="0.75"
              >
                {b.value}
              </text>
              <text
                x={x + w / 2}
                y={padTop + innerH + 5}
                textAnchor="middle"
                fontSize="3"
                fill="currentColor"
                opacity="0.6"
              >
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-1 text-[11px] text-muted-foreground">Values in {unit}</p>
    </div>
  );
}

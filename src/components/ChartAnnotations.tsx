import type { Mode } from "../lib/types";
import type { Band, SystemBand } from "../hooks/useStreamBands";
import type { Column } from "../hooks/useColumnGeometry";

interface ChartAnnotationsProps {
  mode: Mode;
  cols: Column[];
  visualBands: Band[];
  systemBands: SystemBand[];
  padTop: number;
}

export function ChartAnnotations({ mode, cols, visualBands, systemBands, padTop }: ChartAnnotationsProps) {
  const fallback = padTop + 4;
  const gangsterY = visualBands.find(b => b.key === "criminal_gangster")?.ptsT[4]?.y ?? fallback;
  const terroristY = visualBands.find(b => b.key === "terrorist")?.ptsT[9]?.y ?? fallback;
  const crossoverY = systemBands.find(b => b.key === "sys_pct")?.ptsB[9]?.y ?? fallback;
  const foreignY = visualBands.find(b => b.key === "foreign_threat")?.ptsT[9]?.y ?? fallback;

  return (
    <g className="pointer-events-none">
      {mode === "all" && (
        <>
          <line x1={cols[4].cx} y1={padTop - 6} x2={cols[4].cx} y2={gangsterY} stroke="#ef4444" strokeWidth="1" strokeOpacity="0.7" />
          <text x={cols[4].cx} y={padTop - 12} fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
            GANGSTER PEAK (44%)
          </text>

          <line x1={cols[9].cx} y1={padTop - 6} x2={cols[9].cx} y2={terroristY} stroke="#f97316" strokeWidth="1" strokeOpacity="0.7" />
          <text x={cols[9].cx} y={padTop - 12} fill="#f97316" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
            TERRORIST PEAK (22.5%)
          </text>
        </>
      )}
      {mode === "system" && (
        <>
          <line x1={cols[9].cx} y1={padTop - 6} x2={cols[9].cx} y2={crossoverY} stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.7" />
          <text x={cols[9].cx} y={padTop - 12} fill="#60a5fa" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="1">
            CROSSOVER POINT (55%)
          </text>
        </>
      )}
      {mode === "power" && (
        <>
          <line x1={cols[9].cx} y1={padTop - 6} x2={cols[9].cx} y2={foreignY} stroke="#c084fc" strokeWidth="1" strokeOpacity="0.7" />
          <text x={cols[9].cx} y={padTop - 12} fill="#c084fc" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
            STATE / FOREIGN DOMINATES
          </text>
        </>
      )}
    </g>
  );
}

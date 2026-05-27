import { Check, Filter } from "lucide-react";

interface LegendProps {
  keys: string[];
  activeArch: string | null;
  categoryLabels: Record<string, string>;
  categoryColors: Record<string, string>;
  onToggle: (key: string) => void;
}

export function Legend({ keys, activeArch, categoryLabels, categoryColors, onToggle }: LegendProps) {
  return (
    <div id="leg-card" className="mt-2" onClick={(e) => e.stopPropagation()}>
      <h3 className="text-[12px] font-bold tracking-widest text-zinc-500 uppercase mb-1.5 flex items-center gap-1">
        <Filter className="w-3.5 h-3.5 text-amber-500" /> Color Map Legend • Tap to isolate trend
      </h3>

      <div id="leg" className="flex flex-wrap gap-1">
        {keys.map(k => {
          const color = categoryColors[k] || "#52525b";
          const isIsolated = activeArch === k;
          const isAnyIsolated = activeArch !== null;

          return (
            <button
              key={k}
              onClick={() => onToggle(k)}
              className={`li flex items-center gap-1 px-2 py-0.5 text-[11.5px] font-semibold rounded border cursor-pointer transition-all duration-150 ${
                isIsolated
                  ? "bg-amber-500 text-zinc-950 border-amber-500 shadow-sm font-bold"
                  : isAnyIsolated
                    ? "bg-zinc-900/40 text-zinc-600 border-zinc-950/40 hover:border-zinc-800"
                    : "bg-zinc-900 text-zinc-300 border-zinc-850 hover:bg-zinc-800 hover:text-white"
              }`}
              aria-label={`Isolate trend for ${categoryLabels[k] || k}`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: color,
                  boxShadow: isIsolated ? "none" : `0 0 5px ${color}60`
                }}
              />
              <span>{categoryLabels[k] || k}</span>
              {isIsolated && <Check className="w-2.5 h-2.5 ml-0.5 text-zinc-950 stroke-[3]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

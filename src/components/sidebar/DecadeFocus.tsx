import { RAW } from "../../data";
import type { Mode } from "../../lib/types";
import { getDominantCategory, getSortedCategories } from "../../lib/dataHelpers";

interface DecadeFocusProps {
  activeDecadeData: typeof RAW[number];
  mode: Mode;
  categoryLabels: Record<string, string>;
  categoryColors: Record<string, string>;
}

export function DecadeFocus({
  activeDecadeData,
  mode,
  categoryLabels,
  categoryColors
}: DecadeFocusProps) {
  return (
    <div>
      <span className="text-[12px] font-bold tracking-[2px] uppercase text-amber-500 block mb-0.5" id="p-era">
        Era Analysis
      </span>

      <h2 className="font-bebas text-4xl sm:text-5xl tracking-wide text-white leading-none mb-2 border-b border-zinc-900 pb-1 flex items-baseline justify-between" id="p-dec">
        <span>{activeDecadeData.decade}</span>
        <span className="text-[12px] font-sans font-medium text-zinc-500 block text-right tracking-normal uppercase">
          n = {activeDecadeData.sample} Classified
        </span>
      </h2>

      <div className="mb-2.5 flex items-center justify-between gap-2 border-b border-zinc-900 pb-1.5">
        <span className="text-[11px] uppercase font-bold tracking-[1.5px] text-zinc-500">
          Dominant Paradigm
        </span>
        <h3 className="font-bebas text-[15px] tracking-[0.5px] uppercase truncate" id="p-archname">
          {mode === "system" ? (
            activeDecadeData.per_pct > activeDecadeData.sys_pct ? (
              <span className="text-red-400">Personal Enmity</span>
            ) : (
              <span className="text-blue-400">Systemic Oppression</span>
            )
          ) : (
            getDominantCategory(activeDecadeData, mode)
          )}
        </h3>
      </div>

      <div id="p-rows" className="space-y-2">
        <span className="text-[11px] uppercase font-bold tracking-[1.5px] text-zinc-500 block mb-1">
          Archetype Share
        </span>

        {mode === "system" ? (
          <div className="space-y-1.5">
            <div className="bg-zinc-900/25 border border-zinc-950/60 p-1.5 rounded-lg">
              <div className="flex justify-between items-center text-[13px] mb-1">
                <span className="font-semibold text-red-400">Personal Villains</span>
                <span className="font-bold text-red-500">{activeDecadeData.per_pct}%</span>
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full transition-all duration-350"
                  style={{ width: `${activeDecadeData.per_pct}%` }}
                />
              </div>
            </div>

            <div className="bg-zinc-900/25 border border-zinc-950/60 p-1.5 rounded-lg">
              <div className="flex justify-between items-center text-[13px] mb-1">
                <span className="font-semibold text-blue-400 font-sans">Systemic Villains</span>
                <span className="font-bold text-blue-500">{activeDecadeData.sys_pct}%</span>
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-350"
                  style={{ width: `${activeDecadeData.sys_pct}%` }}
                />
              </div>
            </div>

            <div className="bg-zinc-900/25 border border-zinc-950/60 p-1.5 rounded-lg">
              <div className="flex justify-between items-center text-[13px] mb-1">
                <span className="font-semibold text-zinc-400">Alternative Themes</span>
                <span className="font-bold text-zinc-400">{100 - activeDecadeData.vrate}%</span>
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-zinc-600 h-full rounded-full transition-all duration-350"
                  style={{ width: `${100 - activeDecadeData.vrate}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-1.5">
            {getSortedCategories(activeDecadeData, mode).slice(0, 4).map(([key, value]) => {
              const color = categoryColors[key] || "#52525b";
              const label = categoryLabels[key] || key;

              return (
                <div key={key} className="p-1.5 bg-zinc-900/20 border border-zinc-950/40 rounded-lg space-y-1">
                  <div className="flex justify-between items-baseline gap-1.5">
                    <span className="text-[12.5px] font-semibold text-zinc-300 uppercase truncate">
                      {label}
                    </span>
                    <span className="text-[12.5px] font-bold font-mono" style={{ color }}>
                      {Math.round(value)}%
                    </span>
                  </div>

                  <div className="w-full bg-zinc-950 rounded-full h-1 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-355"
                      style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div id="p-meta" className="mt-3 pt-2.5 border-t border-zinc-900 text-[13px] text-zinc-400 space-y-1 bg-zinc-950/15 p-2 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-zinc-500 uppercase text-[11px]">Est. Production:</span>
          <strong className="text-white">~{activeDecadeData.real.toLocaleString()} films</strong>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-zinc-500 uppercase text-[11px]">Sample Volume:</span>
          <strong className="text-amber-500">{activeDecadeData.sample} analyzed</strong>
        </div>
      </div>
    </div>
  );
}

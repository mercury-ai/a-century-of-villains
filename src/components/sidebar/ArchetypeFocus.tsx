import { RAW } from "../../data";
import type { Mode } from "../../lib/types";
import type { CategoryStats } from "../../lib/dataHelpers";

interface ArchetypeFocusProps {
  activeArch: string;
  mode: Mode;
  categoryLabels: Record<string, string>;
  categoryColors: Record<string, string>;
  categoryStats: CategoryStats | null;
  selectedDecade: number | null;
  onSelectDecade: (i: number) => void;
}

export function ArchetypeFocus({
  activeArch,
  mode,
  categoryLabels,
  categoryColors,
  categoryStats,
  selectedDecade,
  onSelectDecade
}: ArchetypeFocusProps) {
  return (
    <div>
      <span className="text-[10px] font-bold tracking-[2px] uppercase text-amber-500 block mb-0.5" id="p-era">
        Category Focused
      </span>

      <h2 className="font-bebas text-3xl sm:text-4xl tracking-wide text-white leading-none mb-1 pb-1" id="p-dec">
        {categoryLabels[activeArch] || activeArch}
      </h2>

      <div className="h-[1px] bg-zinc-900 my-2" />

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <span className="text-[9px] uppercase font-bold tracking-wider text-amber-500 block mb-0.5">
            Peaked In
          </span>
          <div className="font-bebas text-2xl text-white leading-none">
            {categoryStats?.peakDecade}
          </div>
          <span className="text-[10px] text-zinc-400 font-medium whitespace-nowrap">
            {categoryStats ? Math.round(categoryStats.peakVal) : 0}% Share
          </span>
        </div>
        <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
          <span className="text-[9px] uppercase font-bold tracking-wider text-red-500 block mb-0.5">
            Dropped In
          </span>
          <div className="font-bebas text-2xl text-white leading-none">
            {categoryStats?.lowDecade}
          </div>
          <span className="text-[10px] text-zinc-400 font-medium whitespace-nowrap">
            {categoryStats ? Math.round(categoryStats.lowVal) : 0}% Share
          </span>
        </div>
      </div>

      <div id="p-rows" className="space-y-1">
        <span className="text-[9px] uppercase font-bold tracking-[1.5px] text-zinc-500 block mb-1">
          Historical Share Trend
        </span>
        <div className="space-y-1 max-h-[190px] overflow-y-auto pr-1">
          {RAW.map((d, index) => {
            const val = mode === "system"
              ? (d[activeArch as keyof typeof d] as number) || 0
              : d[mode === "power" ? "pp" : "ap"]?.[activeArch] || 0;
            const isPeak = d.decade === categoryStats?.peakDecade;
            const isLow = d.decade === categoryStats?.lowDecade;
            const color = categoryColors[activeArch] || "#f59e0b";
            const isSelectedDecade = selectedDecade === index;
            return (
              <div
                key={d.decade}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDecade(index);
                }}
                className={`p-1 px-2 rounded-lg border text-[11px] flex justify-between items-center transition-all cursor-pointer ${
                  isSelectedDecade
                    ? "bg-amber-500/20 border-amber-500 hover:bg-amber-500/25"
                    : isPeak
                      ? "bg-amber-500/10 border-amber-500/25 hover:bg-amber-500/15"
                      : isLow
                        ? "bg-red-500/5 border-red-550/10 hover:bg-red-550/10 opacity-70"
                        : "bg-zinc-900/10 border-zinc-950/30 hover:bg-zinc-900/30 text-zinc-300 hover:text-white"
                }`}
              >
                <span className="font-semibold flex items-center gap-1">
                  {d.decade}
                  {isPeak && <span className="text-[8px] text-amber-500 font-bold uppercase select-none">Peak</span>}
                  {isLow && <span className="text-[8px] text-red-400 font-bold uppercase select-none">Low</span>}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-12 bg-zinc-950 rounded-full h-1 overflow-hidden hidden sm:block">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(val, 100)}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className="font-mono font-bold" style={{ color: isPeak ? "#fbbf24" : isLow ? "#f87171" : "#d4d4d8" }}>
                    {Math.round(val)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

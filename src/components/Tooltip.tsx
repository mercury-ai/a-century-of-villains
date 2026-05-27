import type { Mode } from "../lib/types";

interface TooltipProps {
  hoveredBandKey: string;
  pos: { x: number; y: number };
  mode: Mode;
  categoryLabels: Record<string, string>;
  categoryColors: Record<string, string>;
}

export function Tooltip({ hoveredBandKey, pos, mode, categoryLabels, categoryColors }: TooltipProps) {
  return (
    <div
      className="fixed pointer-events-none z-50 bg-zinc-950/95 border border-zinc-900 text-white rounded-lg px-2.5 py-1.5 shadow-xl text-sm flex items-center gap-2.5 backdrop-blur-md animate-[fadeIn_0.08s_ease]"
      style={{
        left: `${pos.x + 14}px`,
        top: `${pos.y + 14}px`,
        maxWidth: "240px"
      }}
    >
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm shadow-black"
        style={{ backgroundColor: categoryColors[hoveredBandKey] || "#52525b" }}
      />
      <div className="flex flex-col">
        <span className="font-semibold text-[13px] tracking-wide text-zinc-100 uppercase">
          {categoryLabels[hoveredBandKey] || hoveredBandKey}
        </span>
        <span className="text-[11px] font-medium text-zinc-400">
          {mode === "system"
            ? "Classification Category"
            : mode === "power"
            ? "Power Structure Category"
            : "Archetype Classification"}
        </span>
      </div>
    </div>
  );
}

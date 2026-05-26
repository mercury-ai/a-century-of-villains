import { RAW } from "../../data";
import type { Mode } from "../../lib/types";
import type { CategoryStats } from "../../lib/dataHelpers";
import { ArchetypeFocus } from "./ArchetypeFocus";
import { DecadeFocus } from "./DecadeFocus";

interface SidebarProps {
  activeArch: string | null;
  activeDecadeData: typeof RAW[number];
  mode: Mode;
  categoryLabels: Record<string, string>;
  categoryColors: Record<string, string>;
  categoryStats: CategoryStats | null;
  selectedDecade: number | null;
  visible: boolean;
  onSelectDecade: (i: number) => void;
}

export function Sidebar({
  activeArch,
  activeDecadeData,
  mode,
  categoryLabels,
  categoryColors,
  categoryStats,
  selectedDecade,
  onSelectDecade
}: SidebarProps) {
  return (
    <div className="h-full" id="panel" onClick={(e) => e.stopPropagation()}>
      <div
        className="bg-[#0b0e14]/55 border border-zinc-900 rounded-xl p-3 sm:p-4 shadow-xl h-full flex flex-col justify-between relative overflow-hidden backdrop-blur-sm"
        id="pi"
      >
        {activeArch !== null ? (
          <ArchetypeFocus
            activeArch={activeArch}
            mode={mode}
            categoryLabels={categoryLabels}
            categoryColors={categoryColors}
            categoryStats={categoryStats}
            selectedDecade={selectedDecade}
            onSelectDecade={onSelectDecade}
          />
        ) : (
          <DecadeFocus
            activeDecadeData={activeDecadeData}
            mode={mode}
            categoryLabels={categoryLabels}
            categoryColors={categoryColors}
          />
        )}
      </div>
    </div>
  );
}

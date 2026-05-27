import { LineChart, Table } from "lucide-react";
import type { Mode } from "../lib/types";

interface HeaderProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  showAccessibleTable: boolean;
  onToggleTable: () => void;
}

export function Header({ mode, onModeChange, showAccessibleTable, onToggleTable }: HeaderProps) {
  const modeBtnClass = (active: boolean) =>
    `px-2.5 py-1.5 text-[12px] font-semibold tracking-wide uppercase rounded-md transition-all duration-200 cursor-pointer ${
      active
        ? "bg-amber-500 text-zinc-950 shadow-md transform scale-102"
        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
    }`;

  return (
    <header
      className="sticky top-0 z-40 w-full bg-[#07090e]/95 backdrop-blur-md pt-2.5 pb-2 mb-2 shadow-lg"
      id="top"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="max-w-[96%] mx-auto px-2">
        <div
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 pb-2 border-b border-zinc-900/40"
          id="title-block"
        >
          <div>
            <h1
              className="font-bebas text-2xl sm:text-3xl tracking-[3px] text-white leading-none mb-0.5"
              id="bigtitle"
            >
              A CENTURY OF VILLAINS
            </h1>
            <p className="text-zinc-400 text-[13px] max-w-2xl mt-1 leading-snug" id="tagline">
              Historical trends in villain archetypes. Column widths reflect decadal production; stream flow shows relative archetype density. Tap eras or categories to isolate trends.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2" id="btnrow">
            <div className="bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg flex">
              <button
                id="btn-all"
                onClick={() => onModeChange("all")}
                className={modeBtnClass(mode === "all")}
                style={{ minHeight: "32px" }}
              >
                Archetypes
              </button>
              <button
                id="btn-sys"
                onClick={() => onModeChange("system")}
                className={modeBtnClass(mode === "system")}
                style={{ minHeight: "32px" }}
              >
                Personal vs Systemic
              </button>
              <button
                id="btn-pow"
                onClick={() => onModeChange("power")}
                className={modeBtnClass(mode === "power")}
                style={{ minHeight: "32px" }}
              >
                Power Structures
              </button>
            </div>

            <button
              onClick={onToggleTable}
              className={`px-2.5 py-1.5 rounded-lg border transition-all inline-flex items-center gap-1.5 text-[12px] font-semibold cursor-pointer ${
                showAccessibleTable
                  ? "bg-zinc-100 text-zinc-950 border-white shadow-md"
                  : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:text-white"
              }`}
              style={{ minHeight: "32px" }}
              aria-label={showAccessibleTable ? "Switch to Interactive Graph view" : "Switch to Accessible Table View"}
            >
              {showAccessibleTable ? <LineChart className="w-3.5 h-3.5" /> : <Table className="w-3.5 h-3.5" />}
              <span>{showAccessibleTable ? "Show Graph" : "Accessibility Table"}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

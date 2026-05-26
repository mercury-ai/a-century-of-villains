import { Table } from "lucide-react";
import { RAW } from "../data";
import type { Mode } from "../lib/types";

interface AccessibleTableProps {
  mode: Mode;
  currentKeys: string[];
  categoryLabels: Record<string, string>;
  selectedDecade: number | null;
  onSelectDecade: (index: number) => void;
}

export function AccessibleTable({
  mode,
  currentKeys,
  categoryLabels,
  selectedDecade,
  onSelectDecade
}: AccessibleTableProps) {
  return (
    <div
      className="bg-[#0b0e14]/40 border border-zinc-900 rounded-xl p-4 shadow-xl backdrop-blur-sm mb-4 animate-[fadeIn_0.3s_ease]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2" id="table-heading">
            <Table className="w-5 h-5 text-amber-500" /> Complete Historical Dataset Table
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            High contrast row details mapping Indian villain proportions by decade indices
          </p>
        </div>
        <span className="text-[11px] bg-zinc-800 text-zinc-300 px-2 py-1 rounded">
          WCAG Compliant Table View
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-200 border-collapse" aria-labelledby="table-heading">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Decade</th>
              <th className="py-3 px-4 font-semibold text-right">Sample Size (n)</th>
              <th className="py-3 px-4 font-semibold text-right">Est. Real Production</th>
              {mode === "system" ? (
                <>
                  <th className="py-3 px-4 font-semibold text-right">Personal Villain %</th>
                  <th className="py-3 px-4 font-semibold text-right">Systemic Villain %</th>
                  <th className="py-3 px-4 font-semibold text-right">None / Healthy Rate %</th>
                </>
              ) : (
                currentKeys.map(k => (
                  <th key={k} className="py-3 px-4 font-semibold text-right whitespace-nowrap">
                    {categoryLabels[k] || k} %
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {RAW.map((d, index) => (
              <tr
                key={d.decade}
                className={`hover:bg-zinc-900/50 transition-colors ${
                  selectedDecade === index ? "bg-amber-500/10 text-white font-medium" : ""
                }`}
              >
                <td className="py-3.5 px-4 font-bold">
                  <button
                    onClick={() => onSelectDecade(index)}
                    className="text-left focus:underline text-amber-400 hover:text-amber-300 cursor-pointer font-sans"
                  >
                    {d.decade}
                  </button>
                </td>
                <td className="py-3.5 px-4 text-right tabular-nums text-zinc-300">{d.sample}</td>
                <td className="py-3.5 px-4 text-right tabular-nums text-zinc-300">{d.real.toLocaleString()}</td>
                {mode === "system" ? (
                  <>
                    <td className="py-3.5 px-4 text-right text-red-400 font-medium">{d.per_pct}%</td>
                    <td className="py-3.5 px-4 text-right text-blue-400 font-medium">{d.sys_pct}%</td>
                    <td className="py-3.5 px-4 text-right text-zinc-500">{100 - d.vrate}%</td>
                  </>
                ) : (
                  currentKeys.map(k => {
                    const val = d[mode === "power" ? "pp" : "ap"][k] || 0;
                    return (
                      <td
                        key={k}
                        className={`py-3.5 px-4 text-right tabular-nums ${
                          val > 0 ? "text-white" : "text-zinc-700"
                        }`}
                      >
                        {val > 0 ? `${val}%` : "—"}
                      </td>
                    );
                  })
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

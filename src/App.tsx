import { useState, useMemo } from "react";
import { Info } from "lucide-react";
import { RAW, ARCHS, POWS } from "./data";
import type { Mode } from "./lib/types";
import { getCategoryLabels, getCategoryColors } from "./lib/categoryMaps";
import { getCategoryStats } from "./lib/dataHelpers";
import { useContainerWidth } from "./hooks/useContainerWidth";
import { useEntryAnimation } from "./hooks/useEntryAnimation";
import { useColumnGeometry } from "./hooks/useColumnGeometry";
import { useVisualBands, useSystemBands } from "./hooks/useStreamBands";
import { useAppHandlers } from "./hooks/useAppHandlers";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Tooltip } from "./components/Tooltip";
import { Legend } from "./components/Legend";
import { AccessibleTable } from "./components/AccessibleTable";
import { PAD_T, PAD_B } from "./lib/constants";
import { Streamgraph } from "./components/Streamgraph";
import { Sidebar } from "./components/sidebar/Sidebar";

export default function App() {
  // Mode + isolation state
  const [mode, setMode] = useState<Mode>("all");
  const [activeArch, setActiveArch] = useState<string | null>(null);

  // Hover / selection state
  const [hoveredDecade, setHoveredDecade] = useState<number | null>(null);
  const [selectedDecade, setSelectedDecade] = useState<number | null>(null);
  const [hoveredBandKey, setHoveredBandKey] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // View toggles
  const [showAccessibleTable, setShowAccessibleTable] = useState<boolean>(false);

  // Geometry + animation
  const [containerRef, width] = useContainerWidth();
  const animProgress = useEntryAnimation();
  const height = useMemo(() => Math.max(Math.round(width * 0.55), 460), [width]);
  const innerH = height - PAD_T - PAD_B;
  const baseLine = PAD_T + innerH;

  const cols = useColumnGeometry(width);
  const visualBands = useVisualBands(mode, cols, height, animProgress);
  const systemBands = useSystemBands(mode, cols, height, animProgress);

  // Sidebar visibility — only show when a decade is hovered/selected or an archetype is isolated
  const showSidebar = hoveredDecade !== null || selectedDecade !== null || activeArch !== null;

  // Active decade resolution (defaults to 9 only as a safe fallback for when sidebar IS shown)
  const activeDecadeIndex = hoveredDecade !== null ? hoveredDecade : (selectedDecade !== null ? selectedDecade : 9);
  const activeDecadeData = RAW[activeDecadeIndex];

  // Category mapping for the active mode
  const categoryLabels = useMemo(() => getCategoryLabels(mode), [mode]);
  const categoryColors = useMemo(() => getCategoryColors(mode), [mode]);

  // Category stats — peak/low for the isolated archetype
  const categoryStats = useMemo(() => getCategoryStats(activeArch, mode), [activeArch, mode]);

  // Table column keys
  const currentKeys = mode === "power" ? POWS : mode === "system" ? ["per_pct", "sys_pct"] : ARCHS;
  const hasSelection = selectedDecade !== null || activeArch !== null;

  const {
    handleModeChange,
    handleLegendClick,
    handleSelectDecade,
    handleClearSelection,
    handleSvgClick,
  } = useAppHandlers({
    width,
    height,
    baseLine,
    cols,
    mode,
    visualBands,
    systemBands,
    setMode,
    setActiveArch,
    setSelectedDecade,
  });

  return (
    <div
      id="app"
      onClick={handleClearSelection}
      className="min-h-screen bg-[#07090e] text-[#f1f5f9] font-sans antialiased selection:bg-amber-500/30 selection:text-white pb-12 cursor-default relative"
    >
      {/* Atmospheric backdrop lights */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

      <Header
        mode={mode}
        onModeChange={handleModeChange}
        showAccessibleTable={showAccessibleTable}
        onToggleTable={() => setShowAccessibleTable(!showAccessibleTable)}
      />

      <div className="sr-only">
        Active statistics display representing a Century of Indian Cinema Villains. Switch views using the Interactive Controls Row. For screen-reader users, activate the "Accessibility Table" button to obtain comprehensive contrast-vibrant table readouts of all percentages.
      </div>

      <main className="max-w-[96%] mx-auto px-2 mt-2" id="main">
        <div className="flex items-stretch">
          <div className="flex-1 min-w-0 flex flex-col justify-between" id="chart-area">
            {showAccessibleTable ? (
              <AccessibleTable
                mode={mode}
                currentKeys={currentKeys}
                categoryLabels={categoryLabels}
                selectedDecade={selectedDecade}
                onSelectDecade={handleSelectDecade}
              />
            ) : (
              <div className="relative mb-4 flex flex-col justify-between">
                {activeArch && (
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-1.5 border-b border-zinc-850 pb-1.5 animate-[fadeIn_0.2s_ease]">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold tracking-wider text-amber-400 uppercase flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        Filtered: {categoryLabels[activeArch] || activeArch}
                      </span>
                    </div>
                  </div>
                )}

                <Streamgraph
                  containerRef={containerRef}
                  width={width}
                  height={height}
                  cols={cols}
                  visualBands={visualBands}
                  systemBands={systemBands}
                  mode={mode}
                  activeArch={activeArch}
                  selectedDecade={selectedDecade}
                  hoveredDecade={hoveredDecade}
                  hoveredBandKey={hoveredBandKey}
                  hasSelection={hasSelection}
                  categoryColors={categoryColors}
                  onSvgClick={handleSvgClick}
                  onHoverDecade={setHoveredDecade}
                  onSelectDecade={handleSelectDecade}
                  onHoverBand={setHoveredBandKey}
                  onTooltipMove={setTooltipPos}
                />

                <div id="foot" className="mt-1.5 pt-1 border-t border-zinc-900 text-[11px] text-zinc-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="flex items-center gap-1 font-medium">
                    <Info className="w-3 h-3 text-amber-500 flex-shrink-0" />
                    Horizontal column widths vary proportionally to historic cinema production output scale.
                  </span>
                  <span className="text-[10.5px] text-zinc-650 whitespace-nowrap">
                    Average sample captures 4%–20% of era catalogs.
                  </span>
                </div>
              </div>
            )}

            <Legend
              keys={currentKeys}
              activeArch={activeArch}
              categoryLabels={categoryLabels}
              categoryColors={categoryColors}
              onToggle={handleLegendClick}
            />
          </div>

          {/* Sidebar wrapper — always in DOM; width collapses to 0 when hidden */}
          <div
            className="flex-shrink-0 overflow-hidden"
            style={{
              width: showSidebar ? "25%" : "0",
              opacity: showSidebar ? 1 : 0,
              pointerEvents: showSidebar ? "auto" : "none",
              transition: "width 0.22s ease, opacity 0.18s ease",
            }}
          >
            {/* Inner div keeps a stable width so content doesn't squish during the transition */}
            <div className="pl-4 h-full" style={{ width: "clamp(200px, 25vw, 360px)" }}>
              <Sidebar
                activeArch={activeArch}
                activeDecadeData={activeDecadeData}
                mode={mode}
                categoryLabels={categoryLabels}
                categoryColors={categoryColors}
                categoryStats={categoryStats}
                selectedDecade={selectedDecade}
                visible={showSidebar}
                onSelectDecade={handleSelectDecade}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {!hasSelection && hoveredBandKey && tooltipPos && (
        <Tooltip
          hoveredBandKey={hoveredBandKey}
          pos={tooltipPos}
          mode={mode}
          categoryLabels={categoryLabels}
          categoryColors={categoryColors}
        />
      )}
    </div>
  );
}

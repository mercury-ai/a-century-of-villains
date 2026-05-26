import { MouseEvent } from "react";
import type { Mode } from "../lib/types";
import type { Column } from "./useColumnGeometry";
import type { Band, SystemBand } from "./useStreamBands";

interface UseAppHandlersArgs {
  width: number;
  height: number;
  baseLine: number;
  cols: Column[];
  mode: Mode;
  visualBands: Band[];
  systemBands: SystemBand[];
  setMode: (m: Mode) => void;
  setActiveArch: (fn: (prev: string | null) => string | null) => void;
  setSelectedDecade: (fn: (prev: number | null) => number | null) => void;
}

export function useAppHandlers({
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
}: UseAppHandlersArgs) {
  const handleModeChange = (m: Mode) => {
    setMode(m);
    setActiveArch(() => null);
  };

  const handleLegendClick = (key: string) => {
    setActiveArch(prev => (prev === key ? null : key));
  };

  const handleSelectDecade = (i: number) => {
    setSelectedDecade(() => i);
    setActiveArch(() => null);
  };

  const handleClearSelection = () => {
    setSelectedDecade(() => null);
    setActiveArch(() => null);
  };

  const handleSvgClick = (e: MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    const svgEl = e.currentTarget;
    const rect = svgEl.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * width;
    const clickY = ((e.clientY - rect.top) / rect.height) * height;

    const colIndex = cols.findIndex(col => clickX >= col.x && clickX <= col.x + col.w);
    if (colIndex === -1) return;

    // Click in X-axis label area → select decade
    if (clickY >= baseLine) {
      setSelectedDecade(() => colIndex);
      setActiveArch(() => null);
      return;
    }

    // Hit-test bands — find closest by midpoint distance
    const bands = mode === "system" ? systemBands : visualBands;
    let hitKey: string | null = null;
    let closestDist = Infinity;
    for (const band of bands) {
      const pt = band.ptsT[colIndex];
      const pb = band.ptsB[colIndex];
      if (!pt || !pb) continue;
      const top = Math.min(pt.y, pb.y);
      const bot = Math.max(pt.y, pb.y);
      if (clickY >= top - 4 && clickY <= bot + 4) {
        const dist = Math.abs(clickY - (top + bot) / 2);
        if (dist < closestDist) {
          closestDist = dist;
          hitKey = band.key;
        }
      }
    }

    if (hitKey) {
      setActiveArch(prev => (prev === hitKey ? null : hitKey));
      setSelectedDecade(() => null);
    } else {
      setSelectedDecade(() => colIndex);
      setActiveArch(() => null);
    }
  };

  return {
    handleModeChange,
    handleLegendClick,
    handleSelectDecade,
    handleClearSelection,
    handleSvgClick,
  };
}

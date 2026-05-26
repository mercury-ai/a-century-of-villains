import { useMemo } from "react";
import { stack, stackOffsetWiggle, stackOrderInsideOut } from "d3-shape";
import { RAW, ARCHS, POWS } from "../data";
import { makeStreamPath, makeBandPath } from "../lib/streamPaths";
import { PAD_T, PAD_B } from "../lib/constants";
import type { Mode } from "../lib/types";
import type { Column } from "./useColumnGeometry";

export interface Band {
  key: string;
  ptsT: { x: number; y: number }[];
  ptsB: { x: number; y: number }[];
  pathData: string;
}

export interface SystemBand extends Band {
  color: string;
  label: string;
}

export function useVisualBands(
  mode: Mode,
  cols: Column[],
  height: number,
  animProgress: number
): Band[] {
  return useMemo(() => {
    if (mode === "system") return [];

    const keys = mode === "power" ? POWS : ARCHS;
    const dataKey = mode === "power" ? "pp" : "ap";

    const data = RAW.map(d => {
      const row: Record<string, number> = {};
      keys.forEach(k => { row[k] = d[dataKey][k] || 0; });
      return row;
    });

    const stackGen = stack<Record<string, number>>()
      .keys(keys)
      .offset(stackOffsetWiggle)
      .order(stackOrderInsideOut);

    const series = stackGen(data);

    let maxExt = 0;
    series.forEach(s => s.forEach(([y0, y1]) => {
      maxExt = Math.max(maxExt, Math.abs(y0), Math.abs(y1));
    }));

    // centreY is anchored to the chart area centre so bands sit properly
    // between PAD_T and baseLine. yscale uses the full height so band size
    // matches the original design; the ~11px bottom overflow is hidden by
    // the botfade gradient overlay.
    const innerH = height - PAD_T - PAD_B;
    const centreY = PAD_T + innerH * 0.5;
    const yscale = maxExt > 0 ? (height * 0.44 * animProgress) / maxExt : 1;

    const xs = cols.map(c => c.cx);

    return series.map(s => {
      const top0 = s.map(d => d[1]);
      const bot0 = s.map(d => d[0]);
      const ptsT = xs.map((x, i) => ({ x, y: centreY + top0[i] * yscale }));
      const ptsB = xs.map((x, i) => ({ x, y: centreY + bot0[i] * yscale }));
      return {
        key: s.key,
        ptsT,
        ptsB,
        pathData: makeStreamPath(top0, bot0, xs, centreY, yscale)
      };
    });
  }, [mode, cols, height, animProgress]);
}

export function useSystemBands(
  mode: Mode,
  cols: Column[],
  height: number,
  animProgress: number
): SystemBand[] {
  return useMemo(() => {
    if (mode !== "system") return [];

    const innerH = height - PAD_T - PAD_B;
    const centreY = PAD_T + innerH * 0.5;

    return ["per_pct", "sys_pct"].map((key, ti) => {
      const ptsT: { x: number; y: number }[] = [];
      const ptsB: { x: number; y: number }[] = [];

      RAW.forEach((d, i) => {
        const { cx } = cols[i];
        const val = d[key as "per_pct" | "sys_pct"] * animProgress;
        const bandHeight = (val / 100) * height * 0.22;
        if (ti === 0) {
          ptsT.push({ x: cx, y: centreY - bandHeight });
          ptsB.push({ x: cx, y: centreY });
        } else {
          ptsT.push({ x: cx, y: centreY });
          ptsB.push({ x: cx, y: centreY + bandHeight });
        }
      });

      return {
        key,
        color: ti === 0 ? "#f43f5e" : "#38bdf8",
        label: ti === 0 ? "Personal Villain" : "Systemic/Structural Oppressor",
        ptsT,
        ptsB,
        pathData: makeBandPath(ptsT, ptsB)
      };
    });
  }, [mode, cols, height, animProgress]);
}

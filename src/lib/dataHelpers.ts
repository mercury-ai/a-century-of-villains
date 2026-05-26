import { RAW, AL, PL } from "../data";
import type { Mode } from "./types";

type DecadeRow = typeof RAW[number];

export function getDominantCategory(d: DecadeRow, mode: Mode): string {
  const dataKey = mode === "power" ? "pp" : "ap";
  const lMap = mode === "power" ? PL : AL;
  const sorted = Object.entries(d[dataKey])
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return "Diverse Paradigms";
  return lMap[sorted[0][0]] || sorted[0][0];
}

export function getSortedCategories(d: DecadeRow, mode: Mode): [string, number][] {
  const dataKey = mode === "power" ? "pp" : "ap";
  return Object.entries(d[dataKey])
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);
}

export interface CategoryStats {
  peakDecade: string;
  peakVal: number;
  lowDecade: string;
  lowVal: number;
}

export function getCategoryStats(activeArch: string | null, mode: Mode): CategoryStats | null {
  if (!activeArch) return null;

  let peakDecade = "";
  let peakVal = -1;
  let lowDecade = "";
  let lowVal = 999;

  RAW.forEach(d => {
    let val = 0;
    if (mode === "system") {
      val = (d[activeArch as keyof typeof d] as number) || 0;
    } else {
      const dataKey = mode === "power" ? "pp" : "ap";
      val = d[dataKey]?.[activeArch] || 0;
    }
    if (val > peakVal) {
      peakVal = val;
      peakDecade = d.decade;
    }
    if (val < lowVal) {
      lowVal = val;
      lowDecade = d.decade;
    }
  });

  return { peakDecade, peakVal, lowDecade, lowVal };
}

import { useMemo } from "react";
import { RAW } from "../data";

export interface Column {
  x: number;
  w: number;
  cx: number;
}

export function useColumnGeometry(width: number): Column[] {
  return useMemo(() => {
    const PAD = 4;
    const avail = width - PAD * 2;
    const numCols = RAW.length;

    const MIN_COL_W = 85;
    const totalMinW = MIN_COL_W * numCols;

    if (avail <= totalMinW) {
      const colW = avail / numCols;
      let currentX = PAD;
      return RAW.map(() => {
        const res = { x: currentX, w: colW, cx: currentX + colW / 2 };
        currentX += colW;
        return res;
      });
    }

    const remainingSpace = avail - totalMinW;
    const tot = RAW.reduce((sum, d) => sum + d.real, 0);
    let currentX = PAD;
    return RAW.map(d => {
      const colW = MIN_COL_W + (d.real / tot) * remainingSpace;
      const res = { x: currentX, w: colW, cx: currentX + colW / 2 };
      currentX += colW;
      return res;
    });
  }, [width]);
}

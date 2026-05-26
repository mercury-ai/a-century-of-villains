import { area, curveCatmullRom } from "d3-shape";

export function makeStreamPath(
  top0: number[],
  bot0: number[],
  xs: number[],
  centreY: number,
  yscale: number
): string {
  const n = xs.length;
  if (n === 0) return "";
  const topPts = xs.map((x, i) => ({ x, y: centreY + top0[i] * yscale }));
  const botPts = xs.map((x, i) => ({ x, y: centreY + bot0[i] * yscale }));
  const areaGen = area<{ x: number; y: number }>()
    .x(d => d.x)
    .y0((_, i) => botPts[i].y)
    .y1(d => d.y)
    .curve(curveCatmullRom.alpha(0.5));
  return areaGen(topPts) || "";
}

export function makeBandPath(
  ptsT: { x: number; y: number }[],
  ptsB: { x: number; y: number }[]
): string {
  if (ptsT.length === 0) return "";
  const areaGen = area<{ x: number; y: number }>()
    .x(d => d.x)
    .y0((_, i) => ptsB[i].y)
    .y1(d => d.y)
    .curve(curveCatmullRom.alpha(0.5));
  return areaGen(ptsT) || "";
}

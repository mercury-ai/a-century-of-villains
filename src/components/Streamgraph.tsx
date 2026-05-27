import { MouseEvent, RefObject } from "react";
import { RAW } from "../data";
import type { Mode } from "../lib/types";
import type { Column } from "../hooks/useColumnGeometry";
import type { Band, SystemBand } from "../hooks/useStreamBands";
import { PAD_T, PAD_B } from "../lib/constants";
import { ChartAnnotations } from "./ChartAnnotations";

interface StreamgraphProps {
  containerRef: RefObject<HTMLDivElement | null>;
  width: number;
  height: number;
  cols: Column[];
  visualBands: Band[];
  systemBands: SystemBand[];
  mode: Mode;
  activeArch: string | null;
  selectedDecade: number | null;
  hoveredDecade: number | null;
  hoveredBandKey: string | null;
  hasSelection: boolean;
  categoryColors: Record<string, string>;
  onSvgClick: (e: MouseEvent<SVGSVGElement>) => void;
  onHoverDecade: (i: number | null) => void;
  onSelectDecade: (i: number) => void;
  onHoverBand: (key: string | null) => void;
  onTooltipMove: (pos: { x: number; y: number } | null) => void;
}



export function Streamgraph({
  containerRef,
  width,
  height,
  cols,
  visualBands,
  systemBands,
  mode,
  activeArch,
  selectedDecade,
  hoveredDecade,
  hoveredBandKey,
  hasSelection,
  categoryColors,
  onSvgClick,
  onHoverDecade,
  onSelectDecade,
  onHoverBand,
  onTooltipMove
}: StreamgraphProps) {
  const innerH = height - PAD_T - PAD_B;
  const baseLine = PAD_T + innerH;

  function isHoveredDecadeArea(key: string): boolean {
    if (hoveredDecade === null) return false;
    const d = RAW[hoveredDecade];
    const dataKey = mode === "power" ? "pp" : "ap";
    return (d[dataKey][key] || 0) > 0;
  }

  return (
    <div id="svg-wrap" className="w-full">
      <div className="w-full" ref={containerRef}>
        <svg
          id="viz-svg"
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          className="block select-none overflow-hidden cursor-pointer"
          onClick={onSvgClick}
          aria-label="Proportional topographic curve depicting historical Indian villain metrics"
          role="img"
        >
          <defs>
            <radialGradient id="vig" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="100%" stopColor="rgba(5,5,8,0.45)" />
            </radialGradient>
            <linearGradient id="topfade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(5,5,8,0.6)" />
              <stop offset="18%" stopColor="rgba(5,5,8,0)" />
            </linearGradient>
            <linearGradient id="botfade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(5,5,8,0)" />
              <stop offset="100%" stopColor="rgba(5,5,8,1)" />
            </linearGradient>
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
              <feBlend in="SourceGraphic" mode="overlay" result="blend" />
              <feComposite in="blend" in2="SourceGraphic" operator="in" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[25, 50, 75, 100].map(v => {
            const y = PAD_T + innerH - (v / 100) * innerH;
            return (
              <g key={v} className="opacity-80">
                <line
                  x1={6}
                  y1={y}
                  x2={width - 6}
                  y2={y}
                  stroke="#1e2433"
                  strokeWidth="0.5"
                  strokeDasharray="4,4"
                />
              </g>
            );
          })}

          {/* Decade column guide lines */}
          {cols.map((col, index) => {
            const d = RAW[index];
            return (
              <g key={d.decade}>
                <line
                  x1={col.x}
                  y1={PAD_T - 10}
                  x2={col.x}
                  y2={baseLine}
                  stroke="#161b26"
                  strokeWidth="0.5"
                />
              </g>
            );
          })}

          {/* Band paths */}
          {mode === "system"
            ? systemBands.map((band) => {
                let fillOpacity = activeArch ? (activeArch === band.key ? 0.82 : 0.05) : 0.58;
                if (!activeArch && !hasSelection && hoveredBandKey) {
                  fillOpacity = hoveredBandKey === band.key ? 0.85 : 0.35;
                }
                const isThisBandSelected = activeArch === band.key;
                return (
                  <path
                    key={band.key}
                    d={band.pathData}
                    fill={band.color}
                    fillOpacity={fillOpacity}
                    stroke={isThisBandSelected ? "none" : band.color}
                    strokeWidth={isThisBandSelected ? undefined : "2.5"}
                    className="cursor-help"
                    style={{ transition: "fill-opacity 0.3s" }}
                    onMouseEnter={() => { if (!hasSelection) onHoverBand(band.key); }}
                    onMouseLeave={() => onHoverBand(null)}
                    onMouseMove={(e) => {
                      if (!hasSelection) onTooltipMove({ x: e.clientX, y: e.clientY });
                    }}
                  />
                );
              })
            : visualBands.map((band) => {
                const isActive = !activeArch || activeArch === band.key;
                const color = categoryColors[band.key] || "#52525b";

                let fillOpacity = activeArch ? (isActive ? 0.9 : 0.04) : 0.78;
                if (!activeArch && !hasSelection && hoveredBandKey) {
                  fillOpacity = hoveredBandKey === band.key ? 0.95 : 0.45;
                } else if (!activeArch && !hasSelection && isHoveredDecadeArea(band.key)) {
                  fillOpacity = 0.9;
                }

                const isThisBandSelected = activeArch === band.key;

                return (
                  <path
                    key={band.key}
                    d={band.pathData}
                    fill={color}
                    fillOpacity={fillOpacity}
                    stroke={isThisBandSelected ? "none" : color}
                    strokeWidth={isThisBandSelected ? undefined : "0.3"}
                    strokeOpacity={isThisBandSelected ? undefined : 0.15}
                    className="cursor-help"
                    style={{ transition: "fill-opacity 0.25s" }}
                    onMouseEnter={() => { if (!hasSelection) onHoverBand(band.key); }}
                    onMouseLeave={() => onHoverBand(null)}
                    onMouseMove={(e) => {
                      if (!hasSelection) onTooltipMove({ x: e.clientX, y: e.clientY });
                    }}
                  />
                );
              })}

          {/* Dim overlay for unselected decades */}
          {selectedDecade !== null && (
            <g className="pointer-events-none transition-all duration-300">
              {cols[selectedDecade].x > 0 && (
                <rect
                  x={0}
                  y={0}
                  width={cols[selectedDecade].x}
                  height={height}
                  fill="#07090e"
                  fillOpacity="0.91"
                />
              )}
              {cols[selectedDecade].x + cols[selectedDecade].w < width && (
                <rect
                  x={cols[selectedDecade].x + cols[selectedDecade].w}
                  y={0}
                  width={width - (cols[selectedDecade].x + cols[selectedDecade].w)}
                  height={height}
                  fill="#07090e"
                  fillOpacity="0.91"
                />
              )}
              {mode === "system"
                ? systemBands.map((band) => (
                    <path
                      key={`overlay-stroke-${band.key}`}
                      d={band.pathData}
                      fill={band.color}
                      fillOpacity={0.05}
                      stroke={band.color}
                      strokeWidth="2.5"
                      strokeOpacity="0.6"
                      className="transition-all duration-300"
                    />
                  ))
                : visualBands.map((band) => {
                    const color = categoryColors[band.key] || "#52525b";
                    return (
                      <path
                        key={`overlay-stroke-${band.key}`}
                        d={band.pathData}
                        fill={color}
                        fillOpacity={0.04}
                        stroke={color}
                        strokeWidth="0.5"
                        strokeOpacity="0.5"
                        className="transition-all duration-250"
                      />
                    );
                  })}
            </g>
          )}

          {/* Atmospheric overlays */}
          <rect x={0} y={0} width={width} height={height} fill="url(#vig)" pointerEvents="none" />
          <rect x={0} y={0} width={width} height={height} fill="url(#topfade)" pointerEvents="none" />
          <rect x={0} y={baseLine - 60} width={width} height={60 + PAD_B} fill="url(#botfade)" pointerEvents="none" />
          <rect x={0} y={0} width={width} height={height} filter="url(#grain)" opacity={0.06} style={{ mixBlendMode: "overlay" }} pointerEvents="none" />

          {/* Hover hot zones */}
          {cols.map((col, index) => (
            <g key={`guide-${index}`}>
              <rect
                x={col.x}
                y={PAD_T - 15}
                width={col.w}
                height={innerH + 45}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => onHoverDecade(index)}
              />
            </g>
          ))}

          {/* Annotations */}
          {!activeArch && selectedDecade === null && (
            <ChartAnnotations
              mode={mode}
              cols={cols}
              visualBands={visualBands}
              systemBands={systemBands}
              padTop={PAD_T}
            />
          )}

          {/* X-axis decade labels */}
          {cols.map((col, index) => {
            const d = RAW[index];
            const isSelected = selectedDecade === index;
            const isHovered = hoveredDecade === index;

            return (
              <g
                key={`axis-${index}`}
                className="cursor-pointer"
                onMouseEnter={() => onHoverDecade(index)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDecade(index);
                }}
              >
                <rect
                  x={col.cx - 32}
                  y={baseLine + 9}
                  width={64}
                  height={20}
                  rx={6}
                  fill={isSelected ? "rgba(245, 158, 11, 0.2)" : isHovered ? "rgba(245, 158, 11, 0.08)" : "rgba(255, 255, 255, 0.02)"}
                  stroke={isSelected ? "#fbbf24" : isHovered ? "#fbbf24" : "rgba(63, 63, 70, 0.6)"}
                  strokeWidth={isSelected ? "2" : "1"}
                  className="transition-all duration-150"
                />
                <text
                  x={col.cx}
                  y={baseLine + 22}
                  textAnchor="middle"
                  fill={isSelected ? "#fbbf24" : isHovered ? "#fbbf24" : "#cbd5e1"}
                  fontSize="12.5"
                  fontWeight="bold"
                  className="transition-all duration-150 select-none font-sans cursor-pointer"
                  style={{ textDecoration: "none" }}
                >
                  {d.decade}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export { PAD_T, PAD_B };

## 1. Dependencies

- [x] 1.1 Add `"d3-shape": "^3.2.0"` to `dependencies` in `package.json`
- [x] 1.2 Add `"@types/d3-shape": "^3.1.6"` to `devDependencies` in `package.json`
- [x] 1.3 Run `npm install` and verify `d3-shape` resolves cleanly without peer warnings

## 2. Geometry helpers — replace Hermite spline with d3-shape

- [x] 2.1 In `src/App.tsx`, add imports: `import { stack, stackOffsetWiggle, stackOrderInsideOut, area, curveCatmullRom } from "d3-shape";`
- [x] 2.2 Add a module-level helper `makeStreamPath(top0: number[], bot0: number[], xs: number[], centreY: number, yscale: number): string` that builds a centred-stream area path using `area().curve(curveCatmullRom.alpha(0.5))` (port from villain2's `App.tsx`)
- [x] 2.3 Add a module-level helper `makeBandPath(ptsT: {x:number;y:number}[], ptsB: {x:number;y:number}[]): string` that uses `area().curve(curveCatmullRom.alpha(0.5))` (port from villain2's `App.tsx`)
- [x] 2.4 Delete the existing `interp`, `toPath`, and the current in-component `makeBandPath` helpers from `App.tsx` — they are dead code once the new helpers are wired in

## 3. Entry animation state

- [x] 3.1 Add `const [animProgress, setAnimProgress] = useState(0);` near the existing state hooks in `App`
- [x] 3.2 Add a `useEffect` that runs once on mount, captures `performance.now()` as start, and `requestAnimationFrame`s a loop computing `t = Math.min((now - start) / 1600, 1)` and `ease = 1 - Math.pow(1 - t, 3)`, calling `setAnimProgress(ease)` each frame; stop when `t === 1`
- [x] 3.3 Confirm the loop is a no-op after completion (no continuous repaints)

## 4. Graph height bump

- [x] 4.1 Change the `height` `useMemo` body from `Math.max(Math.round(width * 0.38), 320)` to `Math.max(Math.round(width * 0.48), 420)`

## 5. Streamgraph band geometry (Archetype + Power modes)

- [x] 5.1 Replace the body of the `visualBands` `useMemo` with d3-stack logic: build flat `data` rows where each row is `{ [key]: d[dk][key] || 0 }` for the active keys (`POWS` if mode === "power", else `ARCHS`)
- [x] 5.2 Configure the stack generator: `stack().keys(keys).offset(stackOffsetWiggle).order(stackOrderInsideOut)`
- [x] 5.3 Compute `maxExt = max(|y0|, |y1|)` across all stacked stops, then `yscale = maxExt > 0 ? (height * 0.44 * animProgress) / maxExt : 1`
- [x] 5.4 Set `centreY = height * 0.5` and `xs = cols.map(c => c.cx)`
- [x] 5.5 For each series, compute `top0 = s.map(d => d[1])` and `bot0 = s.map(d => d[0])`, build `ptsT[i] = { x: xs[i], y: centreY + top0[i] * yscale }` and `ptsB[i] = { x: xs[i], y: centreY + bot0[i] * yscale }`, and produce the path via `makeStreamPath(top0, bot0, xs, centreY, yscale)`
- [x] 5.6 Return `{ key: s.key, ptsT, ptsB, pathData }` shape (same keys as today; downstream JSX does not change)
- [x] 5.7 Update the `useMemo` deps to `[mode, cols, height, animProgress]`

## 6. System-mode band geometry (Personal up, Systemic down)

- [x] 6.1 Replace the `systemBands` `useMemo` body: for `["per_pct", "sys_pct"]` build rectangles
- [x] 6.2 Personal (ti===0): `ptsT[i] = { x: cols[i].cx, y: centreY - (per_pct/100) * height * 0.22 * animProgress }`, `ptsB[i] = { x: cols[i].cx, y: centreY }`
- [x] 6.3 Systemic (ti===1): `ptsT[i] = { x: cols[i].cx, y: centreY }`, `ptsB[i] = { x: cols[i].cx, y: centreY + (sys_pct/100) * height * 0.22 * animProgress }`
- [x] 6.4 Generate `pathData` via `makeBandPath(ptsT, ptsB)`
- [x] 6.5 Keep the existing return shape `{ key, color, label, ptsT, ptsB, pathData }` so the JSX render path is unchanged
- [x] 6.6 Update the `useMemo` deps to `[mode, cols, height, animProgress]`

## 7. Click hit-testing — preserve current UX with new geometry

- [x] 7.1 In `handleSvgClick`, keep the existing decade-column detection (find `colIndex` via `cols.findIndex(...)`)
- [x] 7.2 Keep the existing "click at or below `baseLine` → select decade, clear arch" branch
- [x] 7.3 In the inside-chart branch, write a new `findBandAtY(di, clickY)` callback that iterates `visualBands` (or `systemBands` in system mode), checks `clickY >= min(ptsT[di].y, ptsB[di].y) - 4 && clickY <= max(...) + 4`, and returns the closest-by-midpoint band's key or `null`
- [x] 7.4 If `findBandAtY` returns a key, toggle `activeArch` (set if different, clear if same) and clear `selectedDecade`
- [x] 7.5 If `findBandAtY` returns `null`, select that decade (`setSelectedDecade(colIndex); setActiveArch(null)`)
- [x] 7.6 For system mode, route through the same `findBandAtY` helper applied to `systemBands` — do NOT use a simple above/below centreline test
- [x] 7.7 Remove the now-dead "visual floor expansion match" cumulative-threshold loop that exists in the current `handleSvgClick`

## 8. SVG atmospheric overlays

- [x] 8.1 Inside `<svg id="viz-svg">`, add a `<defs>` block with `radialGradient#vig` (transparent center → `rgba(5,5,8,0.45)` edge), `linearGradient#topfade` (top dark to transparent over 18%), `linearGradient#botfade` (transparent to `rgba(5,5,8,0.75)` bottom), and `filter#grain` with `feTurbulence` + `feColorMatrix saturate=0` + `feBlend mode=overlay` + `feComposite operator=in`
- [x] 8.2 Render four full-width `<rect>` overlays after the band paths and before the X-axis decade-pill labels: `url(#vig)` over full SVG, `url(#topfade)` over full SVG, `url(#botfade)` over `y=baseLine - 40` height `40 + PAD_B`, and `filter=url(#grain)` over full SVG at opacity 0.06 with `mixBlendMode="overlay"`
- [x] 8.3 Ensure all four overlays have `pointerEvents="none"`

## 9. Band styling

- [x] 9.1 Update Archetype/Power `<path>` rendering: `fillOpacity` = `activeArch ? (isActive ? 0.9 : 0.04) : 0.78`
- [x] 9.2 Add thin colored stroke: `stroke={color} strokeWidth="0.3" strokeOpacity={0.15}` to each band path (replace the current `strokeWidth="0.5" strokeOpacity="0.5"` pattern)
- [x] 9.3 Update System-mode `<path>` rendering: `fillOpacity` = `activeArch ? (activeArch === band.key ? 0.82 : 0.05) : 0.58`
- [x] 9.4 Keep the `transition: "fill-opacity 0.25s"` (Archetype/Power) and `0.3s` (System) inline styles for smooth dim/highlight

## 10. Annotation leader lines

- [x] 10.1 For each top annotation (`GANGSTER PEAK`, `TERRORIST PEAK`, `CROSSOVER POINT`, `STATE / FOREIGN DOMINATES`), compute `peakY = visualBands.find(b => b.key === <annotation-band-key>)?.ptsT[<colIdx>]?.y ?? (PAD_T + 4)`
- [x] 10.2 Update each `<line>` so `y2 = peakY` instead of the fixed `PAD_T + 2` / `PAD_T + 4` / `PAD_T + 12`
- [x] 10.3 Add a one-line comment above each annotation naming which band key it targets (e.g., `// targets criminal_gangster`) so future renames surface the dependency

## 11. Dark-column overlay (preserve existing behavior)

- [x] 11.1 Keep the existing "dim unselected decade columns" `<g>` block but adapt the contour-outline strokes to use `visualBands`/`systemBands` from the new geometry — same fill/stroke opacities as today (0.04/0.05 fill, 0.5/0.6 stroke), but using the new `pathData`

## 12. Clean up dead code

- [x] 12.1 Verify no references remain to `interp`, the old `toPath`, or the cumulative-threshold click logic
- [x] 12.2 Run `npm run lint` (which is `tsc --noEmit`) — must pass with zero TS errors
- [x] 12.3 Confirm `src/data.ts`, `src/index.css`, `src/main.tsx`, and `package.json` outside the `dependencies`/`devDependencies` additions are unchanged

## 13. Smoke verification

- [x] 13.1 Run `npm run dev` and open in browser; confirm the streamgraph renders centred, with the 1.6s entry growth animation playing once
- [x] 13.2 Switch to "Personal vs Systemic" — confirm Personal fans up, Systemic fans down, no overlap
- [x] 13.3 Switch to "Power Structures" — confirm wiggle stream renders with PC colors
- [x] 13.4 Click inside a colored band — sidebar opens in Category Focused mode for that key
- [x] 13.5 Click outside any band but inside the chart area — sidebar opens in Era Analysis mode for that decade
- [x] 13.6 Click the same band again — sidebar closes
- [x] 13.7 Hover a band with nothing selected — mini floating tooltip appears with chip + label
- [x] 13.8 Press ESC and arrow keys — selection clears / navigates decades as before
- [x] 13.9 Toggle "Accessibility Table" — table view unchanged
- [x] 13.10 Verify top annotation leader lines visibly connect their label text to the actual band peak (not floating in empty space)
- [x] 13.11 Verify in Safari that grain `feTurbulence` does not cause visible perf issues at 1440px viewport width

## 14. UX refinements (post-feedback)

User feedback after first smoke run: "navbar looks very huge and the graph looks small; move the era analysis from bottom and make it a sidebar, next to the graph."

- [x] 14.1 Compact the sticky header: title `text-4xl sm:text-5xl tracking-[4px]` → `text-2xl sm:text-3xl tracking-[3px]`; tagline `text-xs max-w-3xl mt-2 leading-relaxed` → `text-[11px] max-w-2xl mt-1 leading-snug`; header padding `pt-4 pb-3` → `pt-2.5 pb-2`; title-block border-bottom padding `pb-3` → `pb-2`
- [x] 14.2 Compact the mode buttons: `px-4 py-2.5 text-xs ... rounded-lg ... minHeight: 44px` → `px-3 py-1.5 text-[11px] ... rounded-md ... minHeight: 32px`; wrapping container `p-1 rounded-xl gap-3` → `p-0.5 rounded-lg gap-2`
- [x] 14.3 Compact the accessibility-table toggle: `p-2.5 rounded-xl ... text-xs ... gap-2 ... minHeight: 44px` → `px-2.5 py-1.5 rounded-lg ... text-[11px] ... gap-1.5 ... minHeight: 32px`; icon `w-4 h-4` → `w-3.5 h-3.5`
- [x] 14.4 Always render the right sidebar: remove `{hasSelection && (...)}` wrapper; remove the chart-area col-span toggle (`hasSelection ? "lg:col-span-9" : "lg:col-span-12"` → fixed `lg:col-span-9`); drop the no-longer-needed `transition-all duration-300` from the chart-area div
- [x] 14.5 Bump chart height ratio to compensate for the now-permanent narrower chart: `Math.max(Math.round(width * 0.48), 420)` → `Math.max(Math.round(width * 0.55), 460)`
- [x] 14.6 Update the spec (`specs/villain-timeline-graph/spec.md`) — replace "Graph height scales with width" scenarios with the new 0.55/460 numbers and add a new "Sidebar is always visible" requirement covering idle/hover/select state transitions
- [x] 14.7 Re-run `npm run lint` and `npm run build` — both pass

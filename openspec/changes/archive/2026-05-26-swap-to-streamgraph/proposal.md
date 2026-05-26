## Why

The current visualization renders archetype data as a stacked area chart anchored to a fixed baseline. A reference build at `/Users/harigovindv/Documents/villain2` uses a d3 streamgraph (wiggle offset, inside-out order) centred on a horizontal midline, which reads as more editorial and gives the personal-vs-systemic view a striking opposite-facing-fans layout. The data is identical between the two builds; only the graph treatment differs. Adopting the reference geometry — while keeping this repo's fonts, theme, sidebar, legend, header, and all existing interactions — gives the chart the look the reference established without losing the accessibility, layout, or motion polish already in place.

## What Changes

- **BREAKING (visual only)**: Replace the stacked-area SVG geometry inside `<svg id="viz-svg">` with a d3 streamgraph (`stackOffsetWiggle` + `stackOrderInsideOut`) centred on a horizontal midline.
- Replace the custom Hermite spline interpolation with d3-shape's `area().curve(curveCatmullRom.alpha(0.5))`.
- In "Personal vs Systemic" mode, render Personal as a fan radiating up from the centreline and Systemic as a fan radiating down from the centreline (opposite-facing) instead of the current two overlapping ribs from the baseline.
- Add atmospheric SVG `<defs>` overlays — radial vignette, top/bottom dark fade gradients, and an `feTurbulence` grain filter at opacity 0.06 — matching the reference graph's finish.
- Add thin colored stroke outlines on each band (strokeOpacity ~0.15) and tune fill opacities (0.78 base / 0.9 active / 0.04 dimmed-when-isolated).
- Add a one-time entry growth animation (1.6s `requestAnimationFrame` ease-out) that scales the streams in from zero.
- Bump graph height from `Math.max(width * 0.38, 320)` to `Math.max(width * 0.48, 420)` so the streamgraph has vertical room for 13 archetypes to read.
- Rewrite SVG click hit-testing to use the actual rendered band `ptsT`/`ptsB` rectangles per column, preserving the existing "click anywhere in a colored region isolates that category; click outside any band selects the decade" UX.
- Reposition the existing top annotation labels ("GANGSTER PEAK", "TERRORIST PEAK", "CROSSOVER POINT", "STATE / FOREIGN DOMINATES"): keep the label anchored at the top edge but extend the leader line down to the actual band peak `y` so the call-out connects to the band instead of pointing into empty space.
- Add `d3-shape` as a runtime dependency.

**Out of scope — explicitly unchanged**:
- Fonts (Bebas Neue + DM Sans).
- All Tailwind theme tokens, dark `#07090e` background, amber `#f59e0b` accents, ambient blurred light blobs.
- Header (title, mode buttons, accessibility-table toggle), legend pill row, right sidebar panel (Era Analysis, peak/low stats, progress bars, archetype share), footer credits.
- Floating mini-tooltip on band hover (chip + label) — no narrative `insight`/`anno`/`era_voice` tooltip is being introduced.
- Floating particle words — explicitly skipped (no narrative text fields are being added to `data.ts`).
- Top annotation copy (labels stay verbatim; only their leader line endpoint moves).
- Amber decade pills on X-axis, dark-overlay-on-unselected-columns behavior, ESC-to-clear, arrow-key decade navigation, legend-click-to-isolate.
- All `motion`-library animations and accessibility table view.

## Capabilities

### New Capabilities

- `villain-timeline-graph`: The interactive SVG visualization surface that renders per-decade archetype/power/system data, handles user interaction (band isolation, decade selection, hover tooltip), and composes the surrounding chrome (annotation labels, X-axis decade pills, atmospheric overlays). This capability covers the graph itself and its hit-testing semantics, not the surrounding header / sidebar / legend / footer.

### Modified Capabilities

<!-- None — no existing specs to modify. -->

## Impact

- **Code**: `src/App.tsx` — the `<svg id="viz-svg">` subtree and the supporting `useMemo` blocks for band geometry (`visualBands`, `systemBands`), the `handleSvgClick` hit-test logic, the `height` computation, the `interp` / `toPath` / `makeBandPath` helpers (custom Hermite → d3 catmull-rom), and the unused `hoveredBandKey`/`tooltipPos` paths stay (still drive the mini-tooltip). One new `useEffect` + state for the 1.6s entry `animProgress`.
- **Dependencies**: Add `d3-shape@^3.2.0` to `package.json`. No removals. No `motion` change. No new fonts.
- **Data**: `src/data.ts` — no schema changes, no new fields. The graph reads the same `RAW`, `ARCHS`, `POWS`, `AC`, `PC`, `AL`, `PL` exports it does today.
- **Styling**: `src/index.css` — no changes. The vignette/grain/fade overlays live inside the SVG via `<defs>`.
- **Theme / fonts / accessibility table / sidebar / legend / footer**: untouched.
- **Visual diff**: Significant — band shapes, fills, atmosphere, and graph height all change. Decade pills, sidebar, header, and legend look identical. The accessibility table view is unaffected.

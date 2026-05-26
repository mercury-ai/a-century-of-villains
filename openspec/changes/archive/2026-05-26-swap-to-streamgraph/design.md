## Context

The visualization in `src/App.tsx` is a single ~1250-line React component. Roughly 300 lines of it are SVG geometry: a custom Hermite spline interpolator (`interp`), two `useMemo` blocks that build stacked-from-baseline band paths (`visualBands`, `systemBands`), a `handleSvgClick` that walks cumulative percentage thresholds, and the JSX that renders the bands, dark column overlays, top annotations, and X-axis decade pills.

A reference build at `/Users/harigovindv/Documents/villain2` solves the same problem with d3-shape's stack generator (`stackOffsetWiggle` + `stackOrderInsideOut`), centred around a horizontal midline, with `curveCatmullRom` smoothing. The reference also layers vignette / grain / fade SVG `<defs>` for an editorial finish and runs a 1.6s entry growth animation via `requestAnimationFrame`. Both apps consume the same `RAW`, `ARCHS`, `AC`, `POWS`, `PC` shape from `data.ts`.

The user has decided:
- Adopt the reference graph's geometry, atmosphere, and entry animation.
- Keep every non-graph piece of this repo untouched: Bebas Neue + DM Sans, Tailwind dark theme, header + mode buttons + accessibility-table toggle, right sidebar with Era Analysis, legend pill row, footer, ambient blurred light blobs, `motion`-library animations, ESC / arrow-key handling, mini floating tooltip on hover, amber decade pills.
- Skip the reference's narrative-text features (particle words from `decade.insight`, narrative hover tooltip with `anno`/`era_voice`, in-band Cormorant italic labels) — none of the underlying narrative fields exist in this repo's `data.ts` and the user does not want them added.
- Preserve current click semantics: clicking inside any colored band isolates that category; clicking outside any band selects the decade.

Constraints:
- No font additions. No `data.ts` field additions. No removal of `motion`.
- The graph must continue to render inside the current responsive container (`containerRef` + `ResizeObserver`) so it cooperates with the lg:col-span-9/3 sidebar layout.
- Hit-testing must remain stable across decade column widths that vary by film volume.

## Goals / Non-Goals

**Goals:**
- Match the reference streamgraph geometry exactly: wiggle offset, inside-out order, catmull-rom α=0.5, centred on `H * 0.5`, vertical extent scaled to `H * 0.44`.
- Match the reference's Personal-vs-Systemic mode: Personal fans upward from centreline, Systemic fans downward.
- Reproduce the reference atmosphere inside the SVG: radial vignette, top/bottom dark fade gradients, `feTurbulence` grain at 0.06 opacity, thin colored band strokes (strokeOpacity 0.15), tuned fill opacities (0.78 / 0.9 / 0.04).
- Reproduce the 1.6s ease-out entry growth animation that scales bands in from zero.
- Bump the graph's vertical room so 13 archetypes read at non-trivial thickness.
- Preserve click-anywhere-in-colored-region UX, including in System mode where the two fans no longer overlap.
- Reposition existing top annotations so their leader lines connect to actual band peaks instead of pointing into empty space.

**Non-Goals:**
- No font, theme, or `index.css` changes.
- No new in-graph text (no Cormorant italic peak labels, no floating insight words, no narrative tooltips). The existing mini-tooltip on hover stays exactly as it is.
- No changes to the sidebar, legend, header, footer, or accessibility table view.
- No changes to data, exports, or `motion` usage elsewhere.
- No removal of the `interp` / `toPath` / `makeBandPath` helpers without replacement — they're being replaced by d3-shape equivalents, not deleted ahead of time.
- No CodeGraph / `.codegraph/` work — none exists in this repo.

## Decisions

### 1. Use `d3-shape` for stack + area generation

**Choice:** Add `d3-shape@^3.2.0` and import `stack, stackOffsetWiggle, stackOrderInsideOut, area, curveCatmullRom`.

**Why:** Reimplementing the wiggle offset, inside-out ordering, and catmull-rom curve manually would be ~150 lines of math that d3 has battle-tested. The reference build uses these exact APIs, so adopting them is the most direct route to visual parity. `d3-shape` is ~4kb gzipped, has no peer-dep weight, and pulls in nothing beyond itself.

**Alternatives considered:**
- **Keep the custom Hermite spline and only rewire offsets manually.** Rejected — wiggle offset computation is non-trivial and our Hermite curve is not visually equivalent to catmull-rom at the same tension.
- **Pull in full `d3`.** Rejected — overkill; `d3-shape` alone covers what's needed.

### 2. Centre the streamgraph on `H * 0.5`, scale extent to `H * 0.44 * animProgress`

**Choice:** Mirror the reference's geometry. `centreY = H * 0.5`; vertical scale `yscale = (H * 0.44 * animProgress) / maxAbsExtent` where `maxAbsExtent = max(|y0|, |y1|)` across all series stops.

**Why:** Locks visual parity with the reference. Multiplying by `animProgress` gives a free entry growth without rewriting band geometry per frame — every band's `yscale` interpolates from 0 to its final value over 1.6s.

**Implications:** The graph no longer uses `PAD_T` / `PAD_B` / `innerH` to position the bands — those constants now only position the X-axis labels and the dark-column overlay rectangles. We keep them in scope for those uses.

### 3. System mode — Personal up, Systemic down (no overlap)

**Choice:** Adopt the reference layout. For each decade, draw Personal band as a rectangle whose top is `centreY - (per_pct/100) * H * 0.22` and bottom is `centreY`; draw Systemic band as a rectangle whose top is `centreY` and bottom is `centreY + (sys_pct/100) * H * 0.22`.

**Why:** This is the most visually distinct feature of the reference graph and the most legible representation of the personal/systemic axis — you read which side dominates at a glance. The two bands no longer overlap, which simplifies hit-testing.

**Click hit-test:** Compute the rendered top/bottom of each band at the clicked decade column; only register a band click if the click `y` is within `[top - 4, bot + 4]` of either band. If outside both, fall back to decade selection. This preserves the current "click in colored region → isolate; click outside → decade" rule, just against the new geometry.

### 4. Atmosphere via SVG `<defs>` (vignette / fades / grain)

**Choice:** Add the reference's four `<defs>` (`radialGradient#vig`, `linearGradient#topfade`, `linearGradient#botfade`, `filter#grain` with `feTurbulence`) and four full-width overlay `<rect>`s rendered above the bands but below the decade-axis labels.

**Why:** These are pure SVG, no CSS or font changes, no JS state. They give the reference's editorial finish without touching theming. Grain opacity is intentionally low (0.06) so it never fights the ambient blurred light blobs already in the layout.

**Trade-off:** `feTurbulence` is GPU-heavy on Safari at large viewports. We apply it once via a `<rect>` filter, not per-band — performance should be fine, but worth a manual smoke-test on a wide monitor.

### 5. Entry animation via `requestAnimationFrame`, not `motion`

**Choice:** Add `animProgress` state driven by a `useEffect` that runs `requestAnimationFrame` once on mount, easing `t` from 0 to 1 over 1600ms with `1 - (1-t)^3`. Band geometry multiplies all y-offsets by `animProgress`.

**Why:** The animation is geometry-level (every band's height scales together), not DOM-level. Motion's `animate` would require either driving a CSS var or wrapping each path in a `motion.path` with `initial`/`animate` — both heavier than a single `useState` + RAF loop. The reference uses the same RAF pattern; adopting it keeps the implementation footprint minimal and avoids `motion` peer constraints inside the SVG.

**Alternatives considered:**
- **`motion`'s `useAnimationFrame`.** Acceptable but adds an extra hook surface for no visual benefit.
- **CSS keyframes via `index.css`.** Rejected — we'd have to thread a CSS variable into every path's transform, and the user wants `index.css` untouched.

### 6. Graph height bumps to `Math.max(width * 0.48, 420)`

**Choice:** Replace the existing `Math.max(width * 0.38, 320)` with `Math.max(width * 0.48, 420)`.

**Why:** Streamgraphs with 13 series compress quickly. At 1000px wide and `0.38 * 1000 = 380px` tall, the streams' available extent (`2 * 0.44 * H = 334px`) divided by 13 bands gives ~25px average band thickness. Bumping to 480px gives ~36px average — still tight but legibly readable for thicker bands while keeping thin slivers visible. The reference does this implicitly by being fullscreen.

**Trade-off:** The chart consumes more vertical real estate, which pushes the legend and footer down. The header is sticky so this is recoverable. We don't go further (e.g., `width * 0.55`) because the sidebar layout starts to look unbalanced.

### 7. Keep top annotation labels; extend leader lines to band peaks

**Choice:** Keep `"GANGSTER PEAK (44%)"`, `"TERRORIST PEAK (22.5%)"`, `"CROSSOVER POINT (55%)"`, `"STATE / FOREIGN DOMINATES"` exactly as they read. Keep the text anchored at `PAD_T - 12`. Change the `<line>` so its `y2` is the actual top of the relevant band at that decade column — computed from `visualBands.find(b => b.key === keyForAnnotation)?.ptsT[colIdx].y` (or the Personal/Systemic band's top edge for the "CROSSOVER POINT" call-out).

**Why:** A line that points to an arbitrary `PAD_T + 4` makes no sense once the band's peak is anywhere in the middle of the graph. Extending the leader to the band keeps the annotation informative without renaming or moving labels (which would feel like a UX change). If the lookup ever returns undefined (e.g., a future mode adds a key), the line falls back to its current short length.

### 8. Preserve all interaction code paths, only rewire geometry

**Choice:** `hoveredDecade`, `selectedDecade`, `hoveredBandKey`, `tooltipPos`, `activeArch`, ESC handler, arrow-key handler, legend-click, accessibility-table toggle — all stay. The only logic that changes is `handleSvgClick`'s body and the two band-geometry `useMemo`s.

**Why:** Minimises blast radius and keeps the user's "do not change anything else" constraint honest. The sidebar's `categoryStats` and `currentCategoryColors` keep working unchanged because they read from `RAW` / `AC` / `PC`, not from band geometry.

## Risks / Trade-offs

- **Risk:** d3 stack with wiggle offset can produce a slightly different visual order than the current cumulative stack — the user might say "this band used to be at the bottom, now it's in the middle." → **Mitigation:** `stackOrderInsideOut` matches the reference exactly. If the visual order surprises, we can switch to `stackOrder` to recover the data-defined order from `ARCHS` / `POWS`. Flag this when verifying.

- **Risk:** Thin bands (e.g., `colonial_oppressor` post-1960s, `religious_extremist` in most decades) become 1–2px tall in the streamgraph and are visually hard to hit. The current implementation has a "visual floor" trick (`Math.max(v, 6.0)`) that the reference doesn't. → **Mitigation:** Accept this for parity — the reference has the same limitation, and the user wants the reference look. The 4px hit-test tolerance (`y >= top - 4 && y <= bot + 4`) gives a small margin. If it becomes a real complaint after the swap, we can add a similar floor on top of the d3 stack output — but it'd need to be applied to the row data before `stackGen(data)`, not after, to keep `stackOffsetWiggle` correct.

- **Risk:** The top annotation leader-line lookup depends on band-key matches (e.g., `"criminal_gangster"` for `GANGSTER PEAK`). If `ARCHS` / `POWS` is ever renamed, the leader line silently falls back to the short stub. → **Mitigation:** Keep the lookup defensive (`?.ptsT[colIdx]?.y ?? PAD_T + 4`) and add a one-line comment naming which band each annotation targets so a future rename surfaces the dependency.

- **Risk:** `feTurbulence` on Safari can spike GPU. → **Mitigation:** Only one `<rect>` uses the filter, at low opacity. Smoke-test in Safari before declaring done.

- **Risk:** Graph height bump from 0.38 → 0.48 ratio could push content below-the-fold on shorter laptop screens (14" MBP at 1440x900). → **Mitigation:** Header is sticky; scroll behavior is unchanged. The user has implicitly opted in by accepting the recommendation, and verification covers a screenshot pass.

- **Trade-off:** Removing the current "visual floor" expansion (`expanded = rowVals.map(v => v > 0 ? Math.max(v, 6.0) : 0)`) means archetypes with 1–2% share will be near-invisible in the streamgraph. This is a deliberate visual fidelity choice — the reference has the same property.

- **Trade-off:** The custom Hermite `interp` function becomes dead code. We will remove it (and `toPath`, and the current `makeBandPath`) rather than leave them as unused. Per repo guidance: avoid leaving `_var` placeholders or "// removed" comments.

## Open Questions

None at design time. The two height/annotation calls were resolved before this doc was written. If `stackOrderInsideOut` reorders bands surprisingly during verification, escalate that as a tweak rather than a re-design.

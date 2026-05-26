# Villain Timeline Graph

## Purpose

Render the streamgraph timeline visualizing villain archetypes, power structures, and personal-vs-systemic ratios across decades of Indian cinema.

## Requirements

### Requirement: Streamgraph geometry

The graph SHALL render archetype and power-structure data as a streamgraph centred on a horizontal midline, using d3-shape's stack generator with `stackOffsetWiggle` and `stackOrderInsideOut`, and `area().curve(curveCatmullRom.alpha(0.5))` for path smoothing.

#### Scenario: Archetype view renders centred streams

- **WHEN** the user selects "Archetypes" mode
- **THEN** each archetype's band is rendered as a smooth Catmull-Rom curve
- **AND** the cumulative stack is centred on `centreY = H * 0.5`
- **AND** the total vertical extent across all bands at any decade does not exceed `2 * H * 0.44 * animProgress`
- **AND** thin bands (≤ 1% share at all decades) MAY render at sub-pixel thickness without special handling

#### Scenario: Power-structure view uses same geometry

- **WHEN** the user selects "Power Structures" mode
- **THEN** power-structure bands are rendered with the same wiggle / inside-out / Catmull-Rom configuration as Archetype mode
- **AND** each band's color comes from `PC` in `src/data.ts`

### Requirement: System-mode opposite-facing fans

In "Personal vs Systemic" mode, the graph SHALL render Personal Villains as a band fanning UP from the horizontal centreline and Systemic Villains as a band fanning DOWN from the horizontal centreline. The two bands SHALL NOT overlap.

#### Scenario: Personal band radiates up from centreline

- **WHEN** the user selects "Personal vs Systemic" mode
- **AND** a decade has `per_pct = P`
- **THEN** the Personal band's top edge for that decade is at `y = centreY - (P/100) * H * 0.22 * animProgress`
- **AND** its bottom edge is at `y = centreY`
- **AND** its fill color is `#f43f5e`

#### Scenario: Systemic band radiates down from centreline

- **WHEN** the user selects "Personal vs Systemic" mode
- **AND** a decade has `sys_pct = S`
- **THEN** the Systemic band's top edge for that decade is at `y = centreY`
- **AND** its bottom edge is at `y = centreY + (S/100) * H * 0.22 * animProgress`
- **AND** its fill color is `#38bdf8`

### Requirement: Click-anywhere-in-colored-region preserves isolation

The graph SHALL isolate a category if and only if the user clicks within the rendered top/bottom y-bounds of that category's band at the clicked decade column (with a 4px tolerance on each side). Clicks that fall outside every rendered band but within a decade column SHALL select that decade. Clicks below the chart baseline (in the X-axis label area) SHALL select that decade.

#### Scenario: Click inside an archetype band isolates that archetype

- **WHEN** the user clicks at coordinates `(x, y)` such that `x` falls within decade column `i` and `y` falls within `[ptsT[i].y - 4, ptsB[i].y + 4]` of band `K`
- **AND** `K` is not currently isolated
- **THEN** `activeArch = K`
- **AND** `selectedDecade = null`
- **AND** the sidebar opens in Category Focused mode

#### Scenario: Click inside an already-isolated band clears isolation

- **WHEN** the user clicks inside band `K`
- **AND** `activeArch === K`
- **THEN** `activeArch = null`
- **AND** the sidebar closes

#### Scenario: Click outside any band selects the decade

- **WHEN** the user clicks at coordinates `(x, y)` such that `x` falls within decade column `i`
- **AND** `y` falls outside every band's `[ptsT[i].y - 4, ptsB[i].y + 4]` range at column `i`
- **AND** `y` is within the chart area (not below baseline)
- **THEN** `selectedDecade = i`
- **AND** `activeArch = null`

#### Scenario: System-mode click inside Personal band isolates Personal

- **WHEN** the user is in "Personal vs Systemic" mode
- **AND** the user clicks at `(x, y)` where `x` falls within decade column `i` and `y` is in `[centreY - (per_pct/100) * H * 0.22 - 4, centreY + 4]`
- **THEN** `activeArch = "per_pct"`

#### Scenario: System-mode click outside both bands selects the decade

- **WHEN** the user is in "Personal vs Systemic" mode
- **AND** the user clicks at `(x, y)` outside both the Personal and Systemic band rectangles for column `i`
- **THEN** `selectedDecade = i`
- **AND** `activeArch = null`

### Requirement: Entry growth animation

On mount, the graph SHALL animate `animProgress` from 0 to 1 over 1600ms using an ease-out curve (`1 - (1-t)^3`), driven by `requestAnimationFrame`. All band y-offsets SHALL be multiplied by `animProgress` so bands grow from the centreline outward.

#### Scenario: Bands grow from centreline on mount

- **WHEN** the component mounts
- **THEN** at `t = 0` all band top/bottom y-coordinates equal `centreY`
- **AND** at `t = 1600ms` all band coordinates reach their final positions
- **AND** between 0 and 1600ms, every band's vertical extent is monotonically non-decreasing

### Requirement: Atmospheric overlays

The SVG SHALL include four atmospheric overlays rendered above the bands but below the X-axis decade labels: a radial vignette, a top dark fade gradient, a bottom dark fade gradient, and a `feTurbulence`-based grain filter at opacity 0.06.

#### Scenario: Vignette and grain are present

- **WHEN** the graph renders in any mode
- **THEN** the SVG contains a `<defs>` block with `radialGradient#vig`, `linearGradient#topfade`, `linearGradient#botfade`, and `filter#grain`
- **AND** four full-width `<rect>` overlays apply these defs
- **AND** all four overlays have `pointer-events: none`

### Requirement: Annotation leader lines connect to band peaks

Top-anchored annotation labels ("GANGSTER PEAK", "TERRORIST PEAK", "CROSSOVER POINT", "STATE / FOREIGN DOMINATES") SHALL retain their existing text and top-edge anchor. Their leader `<line>` SHALL extend from the label down to the top edge (`ptsT[colIdx].y`) of the band the annotation refers to at that decade column.

#### Scenario: Gangster peak line points to the band

- **WHEN** the graph is in "Archetypes" mode
- **AND** the 1970s column index `i` is computed
- **THEN** the "GANGSTER PEAK (44%)" annotation renders text at `y = PAD_T - 12`
- **AND** its leader line ends at `y = visualBands.find(b => b.key === "criminal_gangster")?.ptsT[i]?.y` (falling back to `PAD_T + 4` if unavailable)

### Requirement: Graph height scales with width

The chart container height SHALL be computed as `Math.max(width * 0.55, 460)`. The ratio is tuned for the always-visible right sidebar (`lg:col-span-3`), which narrows the chart to roughly 75% of the page width — the bumped ratio keeps streams legible at that width.

#### Scenario: At 1000px width, height is 550px

- **WHEN** the chart container is 1000px wide
- **THEN** the SVG height is 550

#### Scenario: At 700px width, height clamps to 460

- **WHEN** the chart container is 700px wide
- **THEN** the SVG height is 460 (clamped minimum)

### Requirement: Sidebar is always visible

The right detail sidebar (`#panel`, `lg:col-span-3`) SHALL be rendered at all times on `lg` viewports, regardless of whether a decade or archetype is selected. The chart area SHALL always occupy `lg:col-span-9`. When no archetype is isolated and no decade is selected, the sidebar SHALL display the Era Analysis view for the latest decade (the 2020s, index 9), which is the same fallback `activeDecadeIndex` already resolves to.

#### Scenario: Idle state shows Era Analysis for 2020s

- **WHEN** the page is loaded
- **AND** no archetype is isolated and no decade is selected
- **THEN** the sidebar renders the Era Analysis branch with `activeDecadeData = RAW[9]`

#### Scenario: Hovering a decade updates the sidebar

- **WHEN** the sidebar is in Era Analysis mode and the user hovers a decade column
- **THEN** the sidebar reflects that decade's stats without any opening/closing transition

#### Scenario: Selecting an archetype switches to Category Focused view

- **WHEN** the user clicks an archetype band
- **THEN** the sidebar switches in-place from Era Analysis to Category Focused view (no panel mount/unmount)

### Requirement: Unchanged interaction surface

The graph SHALL preserve every interaction surface that exists in the current implementation: hover-to-highlight a decade column, hover-to-highlight a band with floating mini-tooltip, ESC to clear selection, arrow keys to navigate decades, legend-click to isolate, dark overlay on unselected decade columns when one is selected, amber decade-pill X-axis with hover and selected states.

#### Scenario: Mini-tooltip appears on band hover

- **WHEN** no decade or archetype is selected
- **AND** the user hovers over a band
- **THEN** a floating tooltip near the cursor shows the category color chip and label
- **AND** the tooltip uses the existing styling (no Cormorant Garamond, no narrative text)

#### Scenario: Dark overlay still dims unselected decades

- **WHEN** a decade is selected
- **THEN** decade columns other than the selected one are rendered behind a `#07090e` overlay at `fillOpacity` 0.91 (same as today)
- **AND** the streamgraph bands remain visible inside the selected column

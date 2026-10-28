# Original design-system restoration

Shared controls and assigned Deep Dive views now compose the recovered original components. Data and workflow behavior are preserved.

- **MetricCard:** Composes the original KPI CSS module and both exact assets; original gradient, 12px radius, 14px label and 24px semibold value. Parent controls the intended grid layout; original comparison Badge is reused.
  Original source: `src/modules/hindsight/components/overview/ProductPerformanceKpiCards.tsx`, `src/modules/hindsight/components/overview/ProductPerformanceKpiCards.module.css`, `src/assets/icons/hindsight/kpi-card-grid-bg.svg`, `src/assets/icons/hindsight/kpi-card-ellipse-bg.svg`.
- **WorkspaceCard / SectionHeading / Toolbar:** White surface, 8px radius, 12px 16px padding, no generic card shadow/border. Original 16px/600/24px section heading and 32px control rhythm; subtitle is compact with full string available as title.
  Original source: `src/modules/hindsight/components/attributes/SalesMixChartCard.module.css`, `src/modules/hindsight/components/items/ItemToolbar.module.css`.
- **DesignSelect / NativeDesignSelect:** Actual recovered Impact Select, controlled options/current selection, disabled options, portal/outside-close and vendor keyboard handling. NativeDesignSelect parses existing option children and adapts the existing event.target.value handlers. Adapter restores the supplied accessible name on the real vendor combobox.
  Original source: `src/modules/hindsight/components/attributes/SalesMixHeader.tsx`, `src/shared/components/primitives/Dropdown/Dropdown.tsx`, `src/shared/components/vendor/impact-ui.ts`, `vendor/impact-ui/dist/components/Select/index.js`.
- **DesignInput / DesignTextarea:** Actual recovered Impact Input at original large/32px size, native events and aria labels; numeric constraints preserved. Multiline uses the same Impact Input capability. No bespoke gray field chrome is used.
  Original source: `vendor/impact-ui/dist/components/Input/index.js`, `vendor/impact-ui/dist/components/Input/VanillaInput.js`, `src/modules/hindsight/components/watchlist/WatchlistEditPanel.tsx`.
- **DesignCheckbox:** Actual recovered Impact Checkbox, preserving vendor focus/Enter/click behavior and native checked events. Adapter repairs the recovered vendor inputProps overwrite by restoring aria-label on its actual input.
  Original source: `vendor/impact-ui/dist/components/Checkbox/index.js`, `vendor/impact-ui/dist/components/Checkbox/WithoutFormLabel.js`.
- **Pill / comparisons:** Actual small subtle Impact Badge. No className replaces the vendor styling classes; this was verified against actual rendered markup.
  Original source: `vendor/impact-ui/dist/components/Badge/index.js`, `vendor/impact-ui/dist/components/Badge/subtle/subtleOnlyLabelBadges/index.js`, `src/modules/hindsight/components/overview/ProductPerformanceKpiCards.tsx`.
- **Evidence menu / columns / typed filter popovers:** Actual recovered Impact Popover and Impact Buttons replace the handcrafted details/positioned-menu surfaces. Checkbox/input/select contents use actual vendor components. Popup allows portal dropdown focus while retaining normal close/focus return.
  Original source: `vendor/impact-ui/dist/components/Popover/index.js`, `src/modules/hindsight/components/items/ItemToolbar.tsx`.
- **Tabs / presentation switch:** Actual original ButtonGroup replaces the handcrafted tab strip for local view/presentation controls.
  Original source: `src/modules/hindsight/components/items/ItemToolbar.tsx`, `vendor/impact-ui/dist/components/ButtonGroup/index.js`.
- **DataTable / WorkspaceTable / evidence ledgers:** Actual recovered DataGrid throughout. Standard rows/header use original 46px/48px rhythm and 14px grid header text; exact controlled sorting/selection/paging/export semantics are retained.
  Original source: `src/shared/components/data/DataGrid/DataGrid.tsx`, `src/modules/hindsight/components/items/ByItemTable.tsx`, `src/modules/hindsight/components/attributes/SalesMixBreakdownTable.tsx`.
- **Item card:** Composes the original front surface class, original border/radius/shadow and 16px grid rhythm, retaining canonical illustrative flooring images and separate name/image actions.
  Original source: `src/modules/hindsight/components/items/ItemCardFront.module.css`, `src/modules/hindsight/components/items/ItemCardGrid.module.css`.
- **ScreenChart:** Original canonical actual/LY colors via seriesColour(0/1): iris #7A5CFF and sky #4BCFFF; original Manrope 12px axes, 13px legend, dashed neutral grid and white 8px tooltip/shadow treatment. No invented gray comparison series.
  Original source: `src/modules/hindsight/components/overview/RegularPromoTrendWidget.tsx`, `src/shared/components/charts/seriesColour.ts`, `src/design-system/tokens/charts.ts`, `vendor/impact-ui/dist/components/Chart/index.js`.

Actual recovered-component checks: six SSR markup groups and three mounted DOM groups. The canonical model regression remains separate. Source syntax/control-inventory checks are in `design-system-source-checks.json`.

Native screenshot and viewport comparison remains root’s acceptance step. These source/SSR/jsdom checks do not claim pixel parity.

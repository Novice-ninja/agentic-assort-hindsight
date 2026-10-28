# ✨ impact-ui

<p align="center">
  <strong>Impact Analytics UI Component Library</strong><br/>
  Modern, accessible React components — TypeScript, Vite, and the Impact design system.
</p>

<p align="center">
  <img alt="npm version" src="https://img.shields.io/npm/v/impact-ui?style=for-the-badge&color=4259ee" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-First-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="License MIT" src="https://img.shields.io/badge/License-MIT-3bb273?style=for-the-badge" />
  <img alt="WCAG AA" src="https://img.shields.io/badge/WCAG-2.1%20AA-e1bc29?style=for-the-badge" />
</p>

**v4.0.5** · [Migration from v3.x](./MIGRATION_GUIDE.md) · [Storybook](http://localhost:6006/) · [MCP server](../mcp-server/README.md)

---

## 🚀 Features

|     | KPI                           | What you get                                                    |
| --- | ----------------------------- | --------------------------------------------------------------- |
| 🎨  | **60+ production components** | Forms, tables, filters, overlays, navigation, chat              |
| 🔒  | **TypeScript first**          | Exported props types (`ButtonProps`, `TableV36` save-view APIs, …) |
| ♿  | **Accessibility**             | WCAG 2.1 Level AA — keyboard, ARIA, focus, screen readers       |
| ⚡  | **Fast**                      | Built with Vite for a small, modern bundle                      |
| 🎭  | **Storybook**                 | Interactive docs, variations, and play tests                    |
| 🧪  | **Well tested**               | Unit tests plus accessibility checks                            |
| 📦  | **Tree-shakeable**            | Import only what you need (`impact-ui/Button` or the barrel)    |
| 🤖  | **AI-ready**                  | `impact-ui-mcp-server` looks up real props — no guessed APIs    |

---

## 📥 Installation

```bash
npm install impact-ui
```

Peer stack: React 18+ with the MUI / AG Grid versions this library expects.

---

## 💻 Usage

### Basic example

```tsx
import { Button } from 'impact-ui';
import 'impact-ui/styles';

function App() {
  return (
    <Button variant="primary" size="large">
      Click Me
    </Button>
  );
}
```

### 🌳 Tree-shaking (recommended)

Subpath imports keep unused components out of the bundle:

```tsx
import { Button } from 'impact-ui/Button';
import { TableV36 } from 'impact-ui/TableV36';
```

The barrel still works when you need several pieces at once:

```tsx
import { Button, Input, Modal } from 'impact-ui';
```

### 🔒 TypeScript

```tsx
import { Button, type ButtonProps } from 'impact-ui';

const props: ButtonProps = {
  variant: 'primary',
  size: 'large',
  onClick: (e) => console.log('Clicked!'),
};
```

---

## 🧩 Component catalog

Live names from the **impact-ui MCP** `list_components` tool, plus source-only pieces (`Skeleton`, `TableChat`, `YearSelect`). For every prop, use Storybook or MCP `get_component_info`.

### 📝 Actions & forms

| Component          | Use for             | Details                                       |
| ------------------ | ------------------- | --------------------------------------------- |
| `Button`           | CTAs, submit, icons | `variant`, `size`, `icon`, loading / disabled |
| `ButtonGroup`      | Segmented actions   | Related `options`                             |
| `Input`            | Text & search       | `label`, `required`, helper / error, sizes    |
| `TextArea`         | Multi-line          | Same labeling pattern as Input                |
| `Select`           | Single / multi      | Search, keyboard navigation                   |
| `Checkbox`         | Booleans / lists    | Variants, optional dropdown items             |
| `RadioButtonGroup` | One-of-many         | `options` with labels & values                |
| `Switch`           | Settings            | Labeled on / off                              |
| `Slider`           | Numeric range       | Orientation, input position                   |
| `FileUpload`       | Files               | MIME map, size rules, item list               |
| `DatePicker`       | Single date         | Calendar + label                              |
| `DateRangePicker`  | Start–end           | Range selection                               |
| `MonthPicker`      | Month + year        | `YearOption`                                  |
| `MonthRangePicker` | Month range         | Same family as month picker                   |
| `HelperText`       | Hint / error        | Under fields                                  |
| `YearSelect`       | Year only           | `src/components/YearSelect`                   |

### 📊 Data display

| Component                       | Use for          | Details                                                                                                                                                                                                                        |
| ------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `TableV36`                      | AG Grid v36      | `columnDefs`, `rowData`, `gridId`, save views, comments, filters, bulk actions. **`isViewNameUniqueAcrossTypes`** controls whether saved-view names are unique across types or only within a type. AG Grid props pass through. |
| `Chart`                         | Visualizations   | Impact chart wrapper                                                                                                                                                                                                           |
| `Card`                          | Content blocks   | Size variants                                                                                                                                                                                                                  |
| `Badge`                         | Status           | Color, filled, icon + label                                                                                                                                                                                                    |
| `Tag` / `TagGroup`              | Labels           | Size & variant                                                                                                                                                                                                                 |
| `Chips`                         | Selectable chips | `ChipType`                                                                                                                                                                                                                     |
| `Avatar`                        | User             | Image or initials                                                                                                                                                                                                              |
| `EmptyState`                    | No data          | Message + optional action                                                                                                                                                                                                      |
| `ProgressBar`                   | Progress         | Status colors                                                                                                                                                                                                                  |
| `Skeleton`                      | Loading          | Variants + shimmer                                                                                                                                                                                                             |
| `Stepper`                       | Wizard progress  | `StepperStep[]`                                                                                                                                                                                                                |
| `Accordion` / `AccordionModern` | Collapsible      | Modern supports sortable items                                                                                                                                                                                                 |
| `DynamicLayout`                 | Layout slots     | Injected layout props                                                                                                                                                                                                          |
| `NewDynamicLayout`              | Layout slots     | Injected layout props                                                                                                                                                                                                          |
| `AGLocaleMap`                   | Grid locales     | From i18n exports                                                                                                                                                                                                              |

### 💬 Feedback & overlays

| Component                 | Use for          | Details                               |
| ------------------------- | ---------------- | ------------------------------------- |
| `Alert`                   | Inline message   | `severity`                            |
| `Toast`                   | Transient notice | `position`, `variant`                 |
| `Loader`                  | Spinner          | `size`                                |
| `Prompt`                  | Confirm          | `variant` (incl. destructive)         |
| `Tooltip`                 | Hover hint       | `variant`                             |
| `Modal`                   | Dialog           | `open`, title, footer buttons, `size` |
| `Panel`                   | Slide-over       | `anchor`, `size`                      |
| `BottomSheet`             | Mobile sheet     | Panel family                          |
| `Popover`                 | Anchored layer   | Trigger + content                     |
| `Portal`                  | Other DOM root   | `container`                           |
| `Menu` / `MenuHeaderInfo` | Action menus     | Nested `options`                      |

### 🗺️ Layout, navigation & patterns

| Component                                            | Use for            | Details                                     |
| ---------------------------------------------------- | ------------------ | ------------------------------------------- |
| `Header`                                             | App chrome         | User, notifications, menus                  |
| `Sidebar`                                            | Nav                | `routes` (`label`, `value`, `icon`, `link`) |
| `Tabs`                                               | Sections           | Items + panels                              |
| `Breadcrumbs`                                        | Hierarchy          | `BreadcrumbItem[]`                          |
| `HomePage`                                           | Landing            | Toolkit, Smart AI, config menus             |
| `FiltersStrip`                                       | Horizontal filters | Tags, saved, recent                         |
| `FilterDropDown` / `FilterSlider` / `AppliedFilters` | Filter pieces      | Used with FiltersStrip                      |
| `FilterPanel`                                        | Side filters       | Items, anchor, size                         |
| `FilterPanelHeader` / `PanelSidebar` / `PanelFooter` | Filter chrome      | Companion exports                           |
| `Notification`                                       | Inbox drawer       | List, tasks, tabs                           |
| `CreateItemFlow`                                     | Create wizard      | Multi-step                                  |
| `NewCreateItemFlow`                                  | Create wizard      | Multi-step                                  |
| `CommentsPanel`                                      | Threads            | `CommentsProvider`, `useComments`           |

### 🤖 Chat, i18n & shortcuts

| Component                                                                  | Use for            | Details                                                                                   |
| -------------------------------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------- |
| `ChatBotComponent`                                                         | Product chatbot    | Landing, modules, conversation                                                            |
| `TableChat`                                                                | Row / channel chat | `chatConfiguration` + WebSocket. MCP: `scaffold_table_chat` (`objectType`, `uniqueRowId`) |
| `I18nProvider` / `I18nContext`                                             | Translations       | `useTranslation`, locale registry                                                         |
| `ShortcutsProvider` / `ShortcutScope` / `ShortcutHint` / `ShortcutManager` | Hotkeys            | Config + display helpers                                                                  |
| `KeyboardShortcuts` / `ShortcutModal`                                      | Shortcut UI        | List & capture                                                                            |

**MCP names (components):** AGLocaleMap, Accordion, AccordionModern, Alert, AppliedFilters, Avatar, Badge, BottomSheet, Breadcrumbs, Button, ButtonGroup, Card, Chart, ChatBotComponent, Checkbox, Chips, CommentsContext, CommentsProvider, CreateItemFlow, NewCreateItemFlow, DatePicker, DateRangePicker, DynamicLayout, NewDynamicLayout, EmptyState, FileUpload, FilterDropDown, FilterPanel, FilterPanelHeader, FilterSlider, HelperText, I18nContext, I18nProvider, Input, KeyboardShortcuts, Loader, Menu, MenuHeaderInfo, Modal, MonthPicker, MonthRangePicker, Panel, PanelFooter, PanelSidebar, Popover, Portal, ProgressBar, Prompt, RadioButtonGroup, Select, ShortcutHint, ShortcutManager, ShortcutModal, ShortcutScope, ShortcutsConfigContext, ShortcutsProvider, Slider, Stepper, Switch, TableV36, Tabs, Tag, TagGroup, TextArea, Toast, Tooltip

**MCP names (patterns):** FiltersStrip, Header, HomePage, Notification, Sidebar

---

## 🧪 Quick recipes

<details>
<summary><strong>🪟 Form in a Modal</strong></summary>

```tsx
import { Modal, Input, Select } from 'impact-ui';

<Modal
  open={open}
  onClose={onClose}
  title="Create item"
  primaryButtonLabel="Save"
  secondaryButtonLabel="Cancel"
  onPrimaryButtonClick={handleSave}
>
  <Input label="Name" required />
  <Select label="Category" options={categories} />
</Modal>;
```

</details>

<details>
<summary><strong>📋 Table with Save View</strong></summary>

```tsx
import { TableV36 } from 'impact-ui';

<TableV36
  tableHeader="Items"
  gridId="items-grid"
  columnDefs={columnDefs}
  rowData={rowData}
  isSaveViewEnabled
  isViewNameUniqueAcrossTypes={false}
/>;
```

</details>

<details>
<summary><strong>🏠 App shell</strong></summary>

```tsx
import { Header, Sidebar, Card } from 'impact-ui';

<>
  <Header title="Product" userName="Alex" />
  <Sidebar routes={routes} isOpen={open} />
  <Card>{children}</Card>
</>;
```

</details>

---

## 📁 Project structure

```
frontend/
├── .storybook/                 # 🎭 Storybook config
├── src/
│   ├── components/             # 🧩 One folder per component
│   │   ├── common/             # HelperText and shared bits
│   │   └── index.ts            # Package barrel
│   ├── i18n/                   # 🌍 Locales, I18nProvider, AGLocaleMap
│   ├── styles/                 # 🎨 Tokens → impact-ui/styles
│   ├── types/                  # 🔒 Shared TypeScript types
│   ├── utils/                  # Helpers (incl. saved-view names)
│   ├── stories/                # 🎭 Stories
│   ├── assets/                 # Icons & images
│   └── test/                   # 🧪 Test setup
├── dist/                       # 📦 npm build output
├── bin/                        # impact-ui-migrate
├── eslint-plugin/
├── vite.config.ts
├── vitest.config.ts
└── README.md                   # This file (published to npm)
```

Typical component folder:

```
ComponentName/
├── index.tsx
├── ComponentName.types.ts
├── ComponentName.styles.scss
└── ComponentName.test.tsx
```

---

## 🛠️ Development

**Prerequisites:** Node.js 18+, npm or yarn.

```bash
npm install
npm run dev              # Vite playground
npm run storybook        # http://localhost:6006
npm run test
npm run test:ui
npm run build:lib
```

| Script                            | Purpose                           |
| --------------------------------- | --------------------------------- |
| `npm run dev`                     | ⚡ Vite dev server                |
| `npm run build` / `build:lib`     | 📦 Library + styles               |
| `npm run preview`                 | Preview production build          |
| `npm run storybook`               | 🎭 Storybook                      |
| `npm run build:storybook`         | Static Storybook                  |
| `npm run test`                    | 🧪 Vitest                         |
| `npm run test:ui`                 | Vitest UI                         |
| `npm run test:storybook`          | Story play tests (needs Chromium) |
| `npm run playwright:install`      | Install Chromium for story tests  |
| `npm run lint` / `lint:fix`       | ESLint                            |
| `npm run lint:a11y`               | ♿ Accessibility lint             |
| `npm run format` / `format:check` | Prettier                          |
| `npm run type-check`              | 🔒 `tsc --noEmit`                 |

**Storybook + Playwright:** run `npm run playwright:install` first. Corporate CA errors: set `NODE_EXTRA_CA_CERTS=/path/to/ca-bundle.pem` then install. Last resort only: `NODE_TLS_REJECT_UNAUTHORIZED=0` (insecure).

---

## 🤖 Cursor / MCP

Install **`impact-ui-mcp-server`**, then ask:

- “List Impact UI components”
- “What props does TableV36 accept?”
- “Build a list page with FiltersStrip and TableV36”

Tools: `list_components`, `get_component_info`, `build_ui`, `get_design_tokens`, `scaffold_table_chat`.

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. `npm run test` · `npm run lint` · `npm run format` · `npm run type-check`
4. Open a pull request

**Code quality gate:** TypeScript clean, ESLint (incl. a11y), Prettier, unit tests with accessibility checks.

---

## ♿ Accessibility

WCAG 2.1 Level AA: semantic HTML, ARIA where needed, keyboard navigation, screen readers, focus management.

```bash
npm run lint:a11y
```

---

## 🌐 Browser support

Chrome · Firefox · Safari · Edge (latest)

---

## 👥 Authors

Himansu · Narendra · Shravani Mishra · Abhishek

---

## 📄 License

MIT

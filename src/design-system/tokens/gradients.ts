import { palette } from './palette';

/**
 * Gradient & texture tokens. Nexus brand gradients plus the specific surface gradients/textures
 * used by the dashboard hero/cards/charts. Components consume these via CSS variables
 * (`var(--gradient-*)`) — never inline hex.
 */
export const gradients = {
  // Nexus brand gradients
  signature: `linear-gradient(135deg, ${palette.iris[400]}, ${palette.sky[400]})`,
  vivid: `linear-gradient(135deg, ${palette.iris[400]}, ${palette.coral[400]})`,
  acidWave: `linear-gradient(135deg, ${palette.acid[400]}, ${palette.sky[400]})`,
  ember: `linear-gradient(135deg, ${palette.coral[400]}, ${palette.acid[400]})`,

  // Dashboard hero (Agent's Focus panel) — dark graphite with a faint top iris wash
  focusPanel: `radial-gradient(ellipse 110% 65% at 35% -10%, ${palette.iris[900]}55 0%, transparent 58%), linear-gradient(180deg, ${palette.graphite[2]} 0%, ${palette.graphite[1]} 100%)`,

  // Agent focus inner cards — muted purple (top-left) → deep indigo (bottom-right)
  focusCardIris: `linear-gradient(148deg, ${palette.purple[4]} 0%, ${palette.purple[5]} 28%, ${palette.purple[6]} 72%, ${palette.purple[6]} 100%)`,
  // Top-right card — slightly lighter / more desaturated
  focusCardIrisAlt: `linear-gradient(148deg, ${palette.purple[4]} 0%, ${palette.purple[5]} 28%, ${palette.purple[6]} 72%, ${palette.purple[6]} 100%)`,
  // Bottom row — medium blue (top-left) → dark teal (bottom-right)
  focusCardSky: `linear-gradient(148deg, ${palette.purple[5]} 0%, ${palette.purple[5]} 28%, ${palette.purple[6]} 72%, ${palette.purple[6]} 100%)`,

  // Featured card — warm glow from bottom-left, purple on the right edge
  focusCardAccentBorder: `conic-gradient(from 225deg at 0% 100%, ${palette.amber[400]} 0deg, ${palette.coral[400]} 55deg, ${palette.rose[400]} 110deg, ${palette.iris[400]} 165deg, ${palette.sky[700]}44 240deg, ${palette.sky[800]}33 310deg, ${palette.amber[400]} 360deg)`,

  // Agent focus cards — rotating gradient border revealed on hover/focus. The sweep angle is
  // driven by the registered `--module_card_angle` @property (see AgentFocusPanel.module.css),
  // which is what makes the conic rotation animate smoothly.
  focusCardActiveBorder: `conic-gradient(from var(--module_card_angle), transparent 0deg, ${palette.iris[400]} 60deg, ${palette.coral[400]} 130deg, ${palette.amber[400]} 200deg, transparent 270deg, transparent 360deg)`,

  // Platform status-card tints (light surface with a soft right-edge wash)
  cardSky: `linear-gradient(120deg, ${palette.graphite[10]} 60%, ${palette.sky[100]} 100%)`,
  cardEmerald: `linear-gradient(120deg, ${palette.graphite[10]} 60%, ${palette.emerald[100]} 100%)`,
  cardAmber: `linear-gradient(120deg, ${palette.graphite[10]} 60%, ${palette.amber[100]} 100%)`,
  cardIris: `linear-gradient(120deg, ${palette.graphite[10]} 60%, ${palette.iris[100]} 100%)`,

  // Platform cards — soft top-right corner glow (reference dashboard screenshot, light theme)
  platformGlowSky: `radial-gradient(ellipse 96% 92% at 100% 0%, ${palette.sky[100]} 0%, ${palette.sky[50]}cc 34%, transparent 70%)`,
  platformGlowEmerald: `radial-gradient(ellipse 96% 92% at 100% 0%, ${palette.emerald[100]} 0%, ${palette.emerald[50]}cc 34%, transparent 70%)`,
  platformGlowAmber: `radial-gradient(ellipse 96% 92% at 100% 0%, ${palette.amber[100]} 0%, ${palette.coral[100]}aa 38%, transparent 70%)`,
  // Dark theme — same corner glow but saturated so the tint reads against the dark surface
  // (the pale 50/100 stops wash out to grey on #1C1C20).
  platformGlowSkyDark: `radial-gradient(ellipse 92% 88% at 100% 0%, ${palette.sky[400]}59 0%, ${palette.sky[500]}26 40%, transparent 72%)`,
  platformGlowEmeraldDark: `radial-gradient(ellipse 92% 88% at 100% 0%, ${palette.emerald[400]}59 0%, ${palette.emerald[500]}26 40%, transparent 72%)`,
  platformGlowAmberDark: `radial-gradient(ellipse 92% 88% at 100% 0%, ${palette.amber[400]}59 0%, ${palette.coral[400]}26 40%, transparent 72%)`,

  // Soft multi-stop divider under the platform cards row
  spectrum: `linear-gradient(90deg, ${palette.sky[200]}, ${palette.iris[200]}, ${palette.coral[200]}, ${palette.amber[200]})`,
  // Seamless sliding variant of `spectrum` — the 4-colour sequence is repeated twice so that,
  // at `background-size: 200%`, translating by one container width loops without a visible jump.
  spectrumFlow: `linear-gradient(90deg, ${palette.sky[200]}, ${palette.iris[200]}, ${palette.coral[200]}, ${palette.amber[200]}, ${palette.sky[200]}, ${palette.iris[200]}, ${palette.coral[200]}, ${palette.amber[200]})`,

  // Chart fills (area under line)
  chartIris: `linear-gradient(180deg, ${palette.iris[200]} 0%, rgba(122, 92, 255, 0) 90%)`,
  chartSky: `linear-gradient(180deg, ${palette.sky[200]} 0%, rgba(75, 207, 255, 0) 90%)`,

  // Subtle page canvas wash
  canvas: `linear-gradient(180deg, ${palette.graphite[10]} 0%, #F7F8FC 100%)`,

  // My Tasks panel — soft pastel wash (warm peach left, cool blue top-right, faint iris bottom)
  // layered over the white surface. Light theme only; dark uses a flat surface.
  taskPanel: `radial-gradient(95% 105% at -5% 5%, ${palette.coral[100]}b3 0%, ${palette.amber[100]}66 30%, transparent 60%), radial-gradient(95% 110% at 105% -5%, ${palette.sky[100]}99 0%, transparent 58%), radial-gradient(105% 95% at 55% 135%, ${palette.iris[100]}80 0%, transparent 58%)`,

  // Planning Admin — module stepper cards (reference impact design)
  // White card surface with a faint 45° hatch texture over a white → slate-25 wash.
  adminCardHatch: `repeating-linear-gradient(45deg, ${palette.slate[950]}0d, ${palette.slate[950]}0d 1px, transparent 0, transparent 8px), linear-gradient(180deg, ${palette.graphite[10]}, ${palette.slate[25]})`,
  // Rotating conic border revealed on hover / active tab (angle driven by --module_card_angle).
  adminCardActiveBorder: `conic-gradient(from var(--module_card_angle), transparent 0deg, ${palette.iris[400]} 60deg, ${palette.coral[400]} 130deg, ${palette.saffron[300]} 200deg, transparent 270deg, transparent 360deg)`,
  // Module icon tile — soft violet → peach wash
  adminIconTile: 'linear-gradient(135deg, #F5F3FF, #FFF1E6)',
  // Status-coloured blurred corner glows (top-right of each module card)
  adminGlowActive: `radial-gradient(circle, ${palette.cyan[400]}52 0%, transparent 70%)`,
  adminGlowDone: `radial-gradient(circle, ${palette.green[400]}52 0%, transparent 70%)`,
  adminGlowInProgress: `radial-gradient(circle, ${palette.saffron[400]}5c 0%, transparent 70%)`,
  // Status pill fills
  adminStatusActive: `linear-gradient(135deg, ${palette.cyan[50]}, ${palette.cyan[100]})`,
  adminStatusDone: `linear-gradient(135deg, ${palette.green[50]}, ${palette.green[100]})`,
  adminStatusInProgress: `linear-gradient(135deg, ${palette.saffron[50]}, ${palette.saffron[100]})`,
  // Decorative pulsing dotted concentric circles on the admin canvas
  adminPulseIris: `radial-gradient(circle, ${palette.iris[400]}e6 3px, transparent 0), radial-gradient(circle, transparent 22px, ${palette.iris[400]}8c 0, ${palette.iris[400]}8c 23.5px, transparent 0), radial-gradient(circle, transparent 50px, ${palette.iris[400]}6b 0, ${palette.iris[400]}6b 51.5px, transparent 0), radial-gradient(circle, transparent 82px, ${palette.iris[400]}52 0, ${palette.iris[400]}52 83.5px, transparent 0), radial-gradient(circle, transparent 116px, ${palette.iris[400]}3d 0, ${palette.iris[400]}3d 117.5px, transparent 0), radial-gradient(circle, transparent 152px, ${palette.iris[400]}2e 0, ${palette.iris[400]}2e 153.5px, transparent 0)`,
  adminPulseCoral: `radial-gradient(circle, ${palette.coral[400]}d9 3px, transparent 0), radial-gradient(circle, transparent 20px, ${palette.coral[400]}80 0, ${palette.coral[400]}80 21.5px, transparent 0), radial-gradient(circle, transparent 46px, ${palette.coral[400]}61 0, ${palette.coral[400]}61 47.5px, transparent 0), radial-gradient(circle, transparent 76px, ${palette.coral[400]}4d 0, ${palette.coral[400]}4d 77.5px, transparent 0), radial-gradient(circle, transparent 108px, ${palette.coral[400]}38 0, ${palette.coral[400]}38 109.5px, transparent 0)`,

  // Header Ask Iris CTA
  agentHub: `linear-gradient(90deg, ${palette.iris[500]}, ${palette.coral[400]})`,

  // Decorative store thumbnail placeholder (locations / exceptions cards)
  adminStoreThumb: `linear-gradient(145deg, ${palette.graphite[8]} 0%, ${palette.graphite[6]} 40%, ${palette.iris[200]} 100%)`,
} as const;

export type GradientToken = keyof typeof gradients;

const DIAGONAL_STRIDE_TILE = 10;

/** Build a seamless 135° hatch data-URI; stroke should be a theme semantic color (e.g. border). */
export function createDiagonalStrideTexture(stroke: string): string {
  const strokeEnc = encodeURIComponent(stroke);
  const edge = DIAGONAL_STRIDE_TILE + 1;
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${DIAGONAL_STRIDE_TILE}' height='${DIAGONAL_STRIDE_TILE}' viewBox='0 0 ${DIAGONAL_STRIDE_TILE} ${DIAGONAL_STRIDE_TILE}'%3E%3Cpath d='M-1 -1l2 2M0 0L${DIAGONAL_STRIDE_TILE} ${DIAGONAL_STRIDE_TILE}M${edge} ${edge}l2 2' stroke='${strokeEnc}' stroke-width='1' fill='none'/%3E%3C/svg%3E")`;
}

export const DIAGONAL_STRIDE_SIZE = `${DIAGONAL_STRIDE_TILE}px`;

/**
 * A faint dot-grid texture (data-URI SVG) for the page canvas. Decoration only (never behind dense
 * data), per Nexus §5. Exposed as a CSS variable for the app shell background.
 */
export const textures = {
  dotGrid:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23E6E8F0'/%3E%3C/svg%3E\")",
  /** Subtle grain overlay for dark dashboard panels (decoration only). */
  grain:
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.14'/%3E%3C/svg%3E\")",
} as const;

export type TextureToken = keyof typeof textures;

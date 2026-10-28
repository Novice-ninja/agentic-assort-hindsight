/**
 * Current Overview card floors (Figma / today's fixed heights).
 * Growth is additive via measured label-fit extra — never shrink below these.
 */
export const OVERVIEW_LAYOUT = {
  subCategoryContribution: {
    cardMin: 550,
    plotHeight: 340,
    marginBottom: 170,
  },
  regularPromo: {
    cardMin: 435,
    plotHeight: 315,
    marginBottom: 75,
  },
  styleColors: {
    cardMin: 425,
  },
  seasonSummary: {
    cardMin: 657,
  },
  /** Hard cap so a pathological label set cannot blow the page. */
  maxExtra: 120,
  hysteresis: 2,
  maxSteps: 8,
} as const;

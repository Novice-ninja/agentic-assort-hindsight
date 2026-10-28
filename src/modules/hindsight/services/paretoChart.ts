import type { ParetoChartPoint, ParetoChartSeries } from '../types';

export interface AlignedParetoSeries {
  versionId: string;
  labelKey: string;
  points: Array<ParetoChartPoint | null>;
}

/**
 * X-axis / tooltip label for a hierarchy department value such as `8800510-Asics`.
 * Keeps the full code-name so planners can tell siblings apart; values with no code are unchanged.
 */
export function departmentAxisLabel(department: string): string {
  return department;
}

/**
 * Categories follow the first series' order (already largest-contribution first). Later versions
 * such as `lly` are lined up on the same department, with a hole where that version has no row.
 */
export function alignParetoSeries(series: ParetoChartSeries[]): {
  departments: string[];
  aligned: AlignedParetoSeries[];
} {
  if (series.length === 0) return { departments: [], aligned: [] };

  const departments = series[0].points.map((point) => point.department);
  const extras = series.slice(1).flatMap((serie) => serie.points.map((point) => point.department));
  extras.forEach((department) => {
    if (!departments.includes(department)) departments.push(department);
  });

  const aligned = series.map((serie) => {
    const byDepartment = new Map(serie.points.map((point) => [point.department, point]));
    return {
      versionId: serie.versionId,
      labelKey: serie.labelKey,
      points: departments.map((department) => byDepartment.get(department) ?? null),
    };
  });

  return { departments, aligned };
}

export interface ParetoTooltipPointInput {
  y?: number | null;
  point?: {
    custom?: {
      metricValue?: number | null;
      pointKind?: 'contribution' | 'cumulative';
      versionIndex?: number;
      versionColor?: string;
      versionLabel?: string;
    };
  };
  series?: { name?: string };
}

export interface ParetoTooltipVersionGroup {
  versionIndex: number;
  color: string;
  versionLabel: string;
  contribution: number | null;
  cumulative: number | null;
  metricValue: number | null;
}

/**
 * Groups shared-tooltip points by version so each block is
 * metric → contribution → cumulative, all painted with the bar's solid colour.
 * Column series use Highcharts gradients, which are not valid CSS colours for bullets.
 */
export function groupParetoTooltipPoints(
  points: readonly ParetoTooltipPointInput[],
): ParetoTooltipVersionGroup[] {
  const groups = new Map<number, ParetoTooltipVersionGroup>();

  for (const item of points) {
    const custom = item.point?.custom ?? {};
    const versionIndex = custom?.versionIndex;
    if (versionIndex === undefined) continue;

    const existing = groups.get(versionIndex) ?? {
      versionIndex,
      color: custom.versionColor ?? 'var(--color-text-primary, #1f2b4d)',
      versionLabel: custom.versionLabel ?? item.series?.name ?? '',
      contribution: null,
      cumulative: null,
      metricValue: null,
    };

    if (custom.versionColor) existing.color = custom.versionColor;
    if (custom.versionLabel) existing.versionLabel = custom.versionLabel;

    if (custom.pointKind === 'cumulative') {
      existing.cumulative = item.y ?? null;
    } else if (custom.pointKind === 'contribution') {
      existing.contribution = item.y ?? null;
      existing.metricValue = custom.metricValue ?? null;
    }

    groups.set(versionIndex, existing);
  }

  return [...groups.values()].sort((a, b) => a.versionIndex - b.versionIndex);
}

export function formatParetoTooltipHtml(args: {
  categoryName: string;
  groups: readonly ParetoTooltipVersionGroup[];
  metricLabel: string;
  formatContribution: (value: number | null) => string;
  formatMetric: (value: number | null) => string;
  cumulativeLabel: (versionLabel: string) => string;
}): string {
  const rows = args.groups.flatMap((group) => {
    const bullet = (label: string, value: string) =>
      `<span style="color:${group.color}">●</span> ${label}: <b>${value}</b>`;

    const lines: string[] = [];
    if (group.metricValue !== null) {
      lines.push(
        bullet(
          `${group.versionLabel} ${args.metricLabel}`.trim(),
          args.formatMetric(group.metricValue),
        ),
      );
    }
    if (group.contribution !== null) {
      lines.push(bullet(group.versionLabel, args.formatContribution(group.contribution)));
    }
    if (group.cumulative !== null) {
      lines.push(
        bullet(
          args.cumulativeLabel(group.versionLabel),
          args.formatContribution(group.cumulative),
        ),
      );
    }
    return lines;
  });

  return `<b>${args.categoryName}</b><br/>${rows.join('<br/>')}`;
}

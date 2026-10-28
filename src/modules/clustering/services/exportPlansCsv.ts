import type { ClusterPlan } from '../types';
import { createdByLabel } from './createdByLabel';
import { formatClusterCount } from './metricCatalog';
import { planStepsBadge } from '../types/plan';

const HEADERS = ['Cluster Name', 'Plan Steps', 'Channel', 'Cluster Count', 'Created By', 'Created On'];

export function exportPlansCsv(
  plans: ClusterPlan[],
  labels: {
    badge: Record<string, string>;
    channel: (key: string) => string;
  },
): string {
  const rows = plans.map((plan) =>
    [
      csvCell(plan.name),
      csvCell(
        plan.statusDisplayName?.trim()
          ? plan.statusDisplayName
          : (labels.badge[planStepsBadge(plan)] ?? plan.status),
      ),
      csvCell(
        plan.channelDisplay ||
          (plan.channelLabelKey ? labels.channel(plan.channelLabelKey) : '-'),
      ),
      csvCell(formatClusterCount(plan.clusterCount)),
      csvCell(createdByLabel(plan.createdBy, 'Agent')),
      csvCell(plan.createdOn && plan.createdOn.trim() !== '' ? plan.createdOn : '-'),
    ].join(','),
  );
  return [HEADERS.join(','), ...rows].join('\n');
}

function csvCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

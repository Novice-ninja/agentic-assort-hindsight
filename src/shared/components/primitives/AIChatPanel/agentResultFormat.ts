import type { AgentValueFormat } from '@shared/services/agentWs';
import { decodeIaString } from '@shared/utils/format';

function trimScaled(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatScaledNumber(value: number): string {
  const absolute = Math.abs(value);
  if (absolute >= 1_000_000_000) return `${trimScaled(value / 1_000_000_000)}B`;
  if (absolute >= 1_000_000) return `${trimScaled(value / 1_000_000)}M`;
  if (absolute >= 1_000) return `${trimScaled(value / 1_000)}K`;
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

/**
 * Axis / cell label for an agent chart or table value.
 *
 * Percents may arrive as `0.78` or `78` — values whose absolute is above 1 are treated as
 * whole percents. Currency uses the same compact scale as number; the title carries the unit.
 */
export function formatAgentValue(
  value: number | null | undefined,
  format: AgentValueFormat = 'number',
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—';
  if (format === 'percent') {
    const percent = Math.abs(value) > 1 ? value : value * 100;
    return `${Math.round(percent)}%`;
  }
  return formatScaledNumber(value);
}

export function formatAgentCell(
  value: string | number | null | undefined,
  format?: AgentValueFormat,
): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string') return value.length === 0 ? '—' : decodeIaString(value);
  return formatAgentValue(value, format);
}

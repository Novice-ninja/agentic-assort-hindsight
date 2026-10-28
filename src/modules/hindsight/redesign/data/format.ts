import type { MetricState, MetricValue } from "./types";
export const metricStateLabels: Record<MetricState, string> = {
  ok: "Available",
  missing: "Missing data",
  restricted: "Restricted",
  "not-applicable": "Not applicable",
  "no-positive-base": "No positive base",
  "negative-base": "Negative comparison base",
  unknown: "Unknown history",
  stale: "Stale",
  reconcile: "Reconcile",
};
export function formatUnit(unit: string): string {
  return unit.replaceAll("SELLING_UNIT_TBC", "selling units (TBC)").replaceAll("SQFT", "sq ft").replace(/^EA$/, "each");
}
export function formatMetric(
  metric: MetricValue | undefined,
  options: { compact?: boolean; decimals?: number; includeUnit?: boolean } = {},
): string {
  if (metric?.state === "restricted") return "Restricted";
  if (!metric || metric.value === null || !Number.isFinite(metric.value))
    return metric ? metricStateLabels[metric.state] : "Missing data";
  const value = new Intl.NumberFormat("en-US", {
    ...(metric.unit === "USD" ? { style: "currency", currency: "USD" } : {}),
    notation: options.compact ? "compact" : "standard",
    minimumFractionDigits: metric.unit === "x" ? 2 : 0,
    maximumFractionDigits:
      options.decimals ??
      (metric.unit === "%" || metric.unit === "pp"
        ? 1
        : metric.unit.includes("week") || metric.unit === "x"
          ? 2
          : 0),
  }).format(metric.value);
  const unit = formatUnit(metric.unit);
  const formatted =
    metric.unit === "%"
      ? `${value}%`
      : metric.unit === "pp"
        ? `${value} pp`
        : metric.unit === "x"
          ? `${value}×`
          : options.includeUnit && !["USD", "count", ""].includes(unit)
            ? `${value} ${unit}`
            : value;
  return metric.state === "stale"
    ? `${formatted} · stale`
    : metric.state === "reconcile"
      ? `${formatted} · reconcile`
      : formatted;
}
export const fmt = formatMetric;

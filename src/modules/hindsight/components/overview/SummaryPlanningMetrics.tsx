import { usePlanContext } from '../../hooks/usePlanContext';
import { useFlooringScope } from '../../priority/flooringScope';
import { DEFINITION_STATUS, FLOORING_DEFINITIONS, getFlooringTotals } from '@mocks/flooringDemo';
import styles from './SummaryPlanningMetrics.module.css';

const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

/** Explicitly provisional planning measures share the same facts as every existing tab. */
export function SummaryPlanningMetrics() {
  const { planCode } = usePlanContext();
  const { scope } = useFlooringScope(planCode);
  const totals = getFlooringTotals({ hierarchyScope: scope });
  return (
    <div className={styles.wrapper} data-testid="summary-planning-metrics">
      <div className={styles.heading}><strong>Sales baseline comparison</strong><span>{DEFINITION_STATUS}</span></div>
      <div className={styles.tableScroll}>
        <table aria-label="Sales baseline comparison">
          <thead><tr><th>Actual season sales</th><th>LY sales</th><th>Plan</th><th>PLR baseline · definition TBC</th></tr></thead>
          <tbody><tr><td>{money(totals.sales)}</td><td>{money(totals.lyRevenue)}</td><td>{money(totals.planRevenue)}</td><td>{money(totals.plrBaseline)}</td></tr></tbody>
        </table>
      </div>
      <div className={styles.metrics}>
        {([
          ['R4 sales', totals.r4Sales, 'r4Sales'],
          ['R13 sales', totals.r13Sales, 'r13Sales'],
          ['R52 sales', totals.r52Sales, 'r52Sales'],
          ['Sales per sq ft', totals.salesPerSqFt, 'salesPerSqFt'],
        ] as const).map(([label, value, key]) => (
          <div className={styles.metric} key={key} title={FLOORING_DEFINITIONS[key]}>
            <span>{label}</span>
            <strong>{key === 'salesPerSqFt' ? totals.allocatedAreaSqFt > 0 ? `$${value.toFixed(2)}` : '—' : money(value)}</strong>
            <small>Synthetic · definition TBC</small>
          </div>
        ))}
      </div>
      <details className={styles.definitions}>
        <summary>Provisional metric definitions</summary>
        <p>{FLOORING_DEFINITIONS.scope}</p>
        <ul>{(['r4Sales', 'r13Sales', 'r52Sales', 'salesPerSqFt', 'plrBaseline', 'planRevenue'] as const).map(key => <li key={key}>{FLOORING_DEFINITIONS[key]}</li>)}</ul>
      </details>
    </div>
  );
}

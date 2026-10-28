import { useTranslation } from 'react-i18next';
import { WatchlistBanner } from './WatchlistBanner';
import { WatchlistTable } from './WatchlistTable';
import styles from '../panels/panels.module.css';

// TODO: replace with the watchlist API once it exists; the banner takes all of these as props.
const WATCHLIST_PLACEHOLDER = {
  attentionCount: 337,
  lastEditedOn: '2026-03-12',
  thresholds: [
    {
      key: 'velocity',
      title: 'Velocity',
      subtitle: 'Sales Rule at or below',
      value: '-20',
    },
    { key: 'gmFloor', title: 'GM Floor', subtitle: 'Gross Margin Below', value: '20%' },
    {
      key: 'gmTrend',
      title: 'GM trend',
      subtitle: 'Year-over-year gap at or below',
      value: '-2 pts',
    },
    {
      key: 'daysOfSupply',
      title: 'Days of supply',
      subtitle: 'On-hand coverage above',
      value: '180 days',
    },
    {
      key: 'returns',
      title: 'Returns',
      subtitle: 'Above selected balance by',
      value: '3 pts',
    },
    {
      key: 'minimumSales',
      title: 'Minimum sales',
      subtitle: 'Ignore items below',
      value: '$500',
    },
  ],
  metrics: [
    { key: 'critical', value: 139 },
    { key: 'high', value: 139 },
    { key: 'watch', value: 139 },
    { key: 'totalScanned', value: 139 },
  ],
};

/**
 * The Watchlist tab: the summary/thresholds banner above a table. The table is a placeholder with
 * static sample rows; the attribute selector is intentionally gone.
 */
export function WatchlistPanel() {
  const { t } = useTranslation('hindsight');

  return (
    <div
      className={[styles.stack, styles.attributeSurface].join(' ')}
      data-testid="hindsight-watchlist-panel"
    >
      <WatchlistBanner
        attentionCount={WATCHLIST_PLACEHOLDER.attentionCount}
        lastEditedOn={WATCHLIST_PLACEHOLDER.lastEditedOn}
        metrics={WATCHLIST_PLACEHOLDER.metrics.map(({ key, value }) => ({
          key,
          label: t(`watchlist.${key}`),
          value,
        }))}
        thresholds={WATCHLIST_PLACEHOLDER.thresholds}
      />

      <WatchlistTable />
    </div>
  );
}

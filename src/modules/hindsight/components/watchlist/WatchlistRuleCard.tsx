import styles from './WatchlistRuleCard.module.css';

export interface WatchlistThreshold {
  key: string;
  title: string;
  subtitle: string;
  value: number | string;
}

export type WatchlistRuleCardProps = Omit<WatchlistThreshold, 'key'>;

/** One threshold rule: title and subtitle on the left, the rule's value in a box on the right. */
export function WatchlistRuleCard({ title, subtitle, value }: WatchlistRuleCardProps) {
  return (
    <li className={styles.rule}>
      <div className={styles.titleSet}>
        <span className={styles.title} title={title}>
          {title}
        </span>
        <span className={styles.subtitle} title={subtitle}>
          {subtitle}
        </span>
      </div>
      <span className={styles.metric}>{value}</span>
    </li>
  );
}

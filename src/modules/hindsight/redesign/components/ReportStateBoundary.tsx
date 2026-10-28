import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { Button as VendorButton } from '@shared/components/vendor/impact-ui';
import type { ReportLifecycle } from '../context/ReportStateContext';
import originalSkeleton from '../../components/overview/SeasonSummaryWidget.module.css';
import styles from './reportState.module.css';

export function ReportStateBoundary({ state, title, onRetry, children }: { state: ReportLifecycle; title: string; onRetry: () => void; children: ReactNode }) {
  const hidden = state.phase === 'loading' || state.phase === 'failure';
  const content = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (hidden) content.current?.setAttribute('inert', '');
    else content.current?.removeAttribute('inert');
  }, [hidden]);
  const retry = <VendorButton htmlType="button" type="default" size="large" variant="tertiary" onClick={onRetry} aria-label={`Retry ${title}`}>Retry this report</VendorButton>;
  return <>
    {state.phase === 'retained-failure' && <div className={styles.retained} role="alert"><div><strong>Refresh failed · retained evidence</strong><span>Source refreshed {state.evidenceDate || 'date unavailable'}. Local rehearsal; applied filters and selections are unchanged.</span></div>{retry}</div>}
    <div className={styles.stage} data-report-phase={state.phase} aria-busy={state.phase === 'loading' || undefined}>
      <div ref={content} className={hidden ? styles.hiddenContent : undefined} aria-hidden={hidden || undefined}>{children}</div>
      {state.phase === 'loading' && <div className={styles.skeleton} role="status" aria-label={`Loading ${title}`}><span className={styles.srOnly}>Loading {title} · local rehearsal</span><div className={styles.skeletonSummary} aria-hidden="true">{[0, 1, 2].map(index => <span key={index} className={`${originalSkeleton.skeletonBone} ${styles.summaryBone}`}/>)}</div><span aria-hidden="true" className={`${originalSkeleton.skeletonBone} ${styles.chartBone}`}/><span aria-hidden="true" className={`${originalSkeleton.skeletonBone} ${styles.lineBone}`}/></div>}
      {state.phase === 'failure' && <div className={styles.failure} role="alert"><strong>This report could not load</strong><p>Local failure rehearsal. Your applied filters and selections are preserved; the other reports remain available.</p>{retry}</div>}
    </div>
  </>;
}

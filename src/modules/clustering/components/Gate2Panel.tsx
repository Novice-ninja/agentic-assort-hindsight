import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@shared/components/vendor/impact-ui';
import sections from '@shared/styles/wizardSections.module.css';
import { decodeIaString } from '@shared/utils/format';
import type { ClusterApprovalResponse } from '../api/approveClusterPlan';
import { RUN_VARIANT_CODE } from '../services/candidateVariantCode';
import { variantCardTitle } from '../services/reviewVariantDisplay';
import { AgentSectionStatus } from './AgentSectionStatus';
import agentFlow from './agentFlow.module.css';
import styles from './wizard.module.css';

export interface Gate2PanelProps {
  /** The `POST .../plans/{code}/approved` response; the panel is not rendered without it. */
  approval: ClusterApprovalResponse | null;
  approved: boolean;
  canApprove: boolean;
  onApprove: () => void;
  onReject: () => void;
  /** True while the Gate 2 state-transition request is in flight. */
  deciding?: boolean;
  /** True while Gate 3 Sign-Off & Save is in flight — Gate 2 must not fire again. */
  signingOff?: boolean;
  /** Describe Your Plan mirror: Reject / Approve stay visible but disabled (agent decides). */
  readOnly?: boolean;
  /** Agent is currently working on this gate (cyan stroke). */
  highlighted?: boolean;
}

interface GateMetric {
  key: string;
  label: string;
  value: string;
}

const isCount = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

/**
 * Evidence tiles are derived from the fields the approval response actually carries. A field
 * that is absent or not a number is omitted rather than rendered as a placeholder.
 */
function availableMetrics(approval: ClusterApprovalResponse, t: (key: string) => string): GateMetric[] {
  const metrics: GateMetric[] = [];
  if (isCount(approval.stores)) {
    metrics.push({ key: 'stores', label: t('gates.stores'), value: String(approval.stores) });
  }
  return metrics;
}

export function Gate2Panel({
  approval,
  approved,
  canApprove,
  onApprove,
  onReject,
  deciding = false,
  signingOff = false,
  readOnly = false,
  highlighted = false,
}: Gate2PanelProps) {
  const { t } = useTranslation('clustering');
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null);
  if (!approval) return null;

  const busy = approved || deciding || signingOff || readOnly;
  const showActions = canApprove || readOnly;

  const metrics = availableMetrics(approval, t);

  return (
    <section
      className={[
        sections.sectionWrapper,
        styles.gateSection,
        highlighted ? agentFlow.sectionGlow : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-testid="gate2-section"
      data-highlighted={highlighted ? 'true' : undefined}
    >
      {highlighted ? <AgentSectionStatus section="gate2" /> : null}
      <header className={styles.gateHeader}>
        <div className={styles.gateHeaderText}>
          <span className={[sections.sectionTitle, styles.gateTitle].join(' ')}>
            {t('gates.gate2Title', {
              name: variantCardTitle(decodeIaString(approval.approvedVariantName), {
                fallback: t('review.customVariant'),
                variantId: approval.variantId,
              }),
            })}
          </span>
          <p className={styles.gateBody}>{t('gates.gate2Body')}</p>
        </div>
        <span
          className={[
            styles.gateStatus,
            approved ? styles.gateStatusApproved : styles.gateStatusPending,
          ].join(' ')}
        >
          {approved ? t('gates.approved') : t('gates.awaitingApproval')}
        </span>
      </header>

      <div className={styles.gatePanel}>
        <div className={styles.gateMetricsRow}>
          {isCount(approval.chosenK) && (
            <span className={[styles.gateMetricTile, styles.gateMetricTileHighlight].join(' ')}>
              {t('finalize.kLine', { k: approval.chosenK, code: RUN_VARIANT_CODE })}
            </span>
          )}
          {metrics.map((metric, index) => (
            <Fragment key={metric.key}>
              {(index > 0 || isCount(approval.chosenK)) && (
                <span className={styles.gateMetricConnector} aria-hidden="true" />
              )}
              <span className={styles.gateMetricTile}>
                <span>{metric.label}</span>
                <span className={styles.gateMetricValue}>{metric.value}</span>
              </span>
            </Fragment>
          ))}
        </div>
        <div className={styles.gateActions}>
          {showActions && (
            <>
              <Button
                variant="tertiary"
                size="medium"
                htmlType="button"
                onClick={() => {
                  setPendingAction('reject');
                  onReject();
                }}
                disabled={busy}
                loading={deciding && pendingAction === 'reject'}
              >
                {t('gates.reject')}
              </Button>
              <Button
                variant={approved ? 'tertiary' : 'primary'}
                size="medium"
                htmlType="button"
                onClick={() => {
                  setPendingAction('approve');
                  onApprove();
                }}
                disabled={busy}
                loading={pendingAction === 'approve' && (deciding || signingOff)}
              >
                {approved ? t('gates.approved') : t('gates.approve')}
              </Button>
            </>
          )}
        </div>
        <span className={styles.yourPick}>{t('gates.yourPick')}</span>
      </div>
    </section>
  );
}

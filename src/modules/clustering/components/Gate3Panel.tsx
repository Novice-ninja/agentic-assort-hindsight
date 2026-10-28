import { useTranslation } from 'react-i18next';
import { Button, ImpactBadge, Skeleton } from '@shared/components/vendor/impact-ui';
import { formatDate } from '@shared/utils';
import sections from '@shared/styles/wizardSections.module.css';
import type { LoadStatus } from '@shared/types';
import type { AuthenticatedUser } from '../api/getAuthMe';
import type { ApprovalGate, SignOffContext } from '../types';
import { AgentSectionStatus } from './AgentSectionStatus';
import agentFlow from './agentFlow.module.css';
import styles from './wizard.module.css';

export interface Gate3PanelProps {
  gate3: ApprovalGate | undefined;
  /** Resume FINALIZED (or a live gate-3 audit row) treats Sign-Off as already complete. */
  signedOff?: boolean;
  context: SignOffContext | null;
  /** `GET /v1/auth/me` — the authenticated user is the approver on display. */
  approver: AuthenticatedUser | null;
  approverStatus: LoadStatus;
  onRetryApprover: () => void;
  /** Agent is currently working on this gate (cyan stroke). */
  highlighted?: boolean;
}

/** Approver card: skeleton while `/auth/me` loads, error + retry on failure, else name + email. */
function ApproverCard({
  approver,
  status,
  onRetry,
}: {
  approver: AuthenticatedUser | null;
  status: LoadStatus;
  onRetry: () => void;
}) {
  const { t } = useTranslation('clustering');

  if (status === 'failed') {
    return (
      <article className={styles.gateContextCard} role="alert">
        <div className={styles.gateContextCardTitleRow}>
          <span className={sections.optionMeta}>{t('errors.approverFailed')}</span>
          <Button variant="tertiary" size="small" onClick={onRetry}>
            {t('states.retry')}
          </Button>
        </div>
      </article>
    );
  }

  if (status !== 'succeeded' || !approver) {
    return (
      <article
        className={styles.gateContextCard}
        aria-busy="true"
        data-testid="approver-skeleton"
      >
        <div className={styles.gateContextCardTitleRow}>
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="pill" width={64} height={20} />
        </div>
        <Skeleton variant="text" width={160} height={16} />
      </article>
    );
  }

  return (
    <article className={styles.gateContextCard}>
      <div className={styles.gateContextCardTitleRow}>
        <span className={sections.optionName}>{approver.name}</span>
        <ImpactBadge
          label={t('gates.approver')}
          variant="subtle"
          color="info"
          size="small"
        />
      </div>
      {approver.email !== approver.name && (
        <span className={sections.optionMeta}>{approver.email}</span>
      )}
    </article>
  );
}

export function Gate3Panel({
  gate3,
  signedOff,
  approver,
  approverStatus,
  onRetryApprover,
  highlighted = false,
}: Gate3PanelProps) {
  const { t, i18n } = useTranslation('clustering');
  const signed = signedOff ?? gate3?.status === 'signedOff';

  return (
    <section
      className={[
        sections.sectionWrapper,
        styles.gateSection,
        highlighted ? agentFlow.sectionGlow : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-testid="gate3-section"
      data-highlighted={highlighted ? 'true' : undefined}
    >
      {highlighted ? <AgentSectionStatus section="gate3" /> : null}
      <header className={styles.gateHeader}>
        <div className={styles.gateHeaderText}>
          <span className={[sections.sectionTitle, styles.gateTitle].join(' ')}>
            {t('gates.gate3Title')}
          </span>
          <p className={styles.gateBody}>{t('gates.gate3Body')}</p>
        </div>
      </header>

      <div className={sections.cardGrid}>
        <ApproverCard
          approver={approver}
          status={approverStatus}
          onRetry={onRetryApprover}
        />
      </div>

      {signed && gate3?.actionedBy && gate3.actionedOn && (
        <p role="status" className={sections.optionMeta}>
          {t('gates.signedOff', {
            actor: gate3.actionedBy,
            when: formatDate(gate3.actionedOn, i18n.language),
          })}
        </p>
      )}
    </section>
  );
}

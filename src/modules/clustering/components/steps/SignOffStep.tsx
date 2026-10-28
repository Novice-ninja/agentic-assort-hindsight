import { useTranslation } from 'react-i18next';
import { Button } from '@shared/components/vendor/impact-ui';
import type { LoadStatus } from '@shared/types';
import type { ClusterApprovalResponse } from '../../api/approveClusterPlan';
import type { AuthenticatedUser } from '../../api/getAuthMe';
import type {
  ApprovalGate,
  ClusterPlanLandingSection,
  SignOffContext,
} from '../../types';
import { Gate2Panel } from '../Gate2Panel';
import { Gate3Panel } from '../Gate3Panel';
import { Gate2Skeleton } from '../ResumeSkeletons';
import sections from '@shared/styles/wizardSections.module.css';

export interface SignOffStepProps {
  /** GET selected-variant / selected "3 Best" card / `/approved` — drives Gate 2. */
  approval: ClusterApprovalResponse | null;
  gates: ApprovalGate[];
  signOff: SignOffContext | null;
  /** Resume landing: GATE_3 / FINALIZED already passed Gate 2 (and Gate 3 when complete). */
  landingSection?: ClusterPlanLandingSection;
  approvalLoading?: boolean;
  approvalFailed?: boolean;
  onRetryApproval?: () => void;
  /** `GET /v1/auth/me` — the authenticated user shown as the Gate 3 approver. */
  approver: AuthenticatedUser | null;
  approverStatus: LoadStatus;
  onRetryApprover: () => void;
  canApprove: boolean;
  onApprove: () => void;
  onReject: () => void;
  /** True while Gate 2 Approve / Reject waits on state-transition. */
  deciding?: boolean;
  /** Describe Your Plan mirror: gate buttons visible but disabled; the agent decides. */
  readOnly?: boolean;
  /** Gate the agent is currently working on (cyan stroke). */
  highlightedSection?: 'gate2' | 'gate3';
  /** True while a sign-off request is in flight; the footer itself does not start one. */
  signingOff?: boolean;
}

export function SignOffStep({
  approval,
  gates,
  signOff,
  landingSection,
  approvalLoading,
  approvalFailed,
  onRetryApproval,
  approver,
  approverStatus,
  onRetryApprover,
  canApprove,
  onApprove,
  onReject,
  deciding = false,
  signingOff = false,
  readOnly = false,
  highlightedSection,
}: SignOffStepProps) {
  const { t } = useTranslation(['clustering', 'common']);
  const gate2 = gates.find((g) => g.gate === 2);
  const gate3 = gates.find((g) => g.gate === 3);
  const gate2Approved =
    gate2?.status === 'approved' ||
    landingSection === 'gate3' ||
    landingSection === 'complete';
  const signedOff = gate3?.status === 'signedOff' || landingSection === 'complete';

  return (
    <div className={sections.step}>
      {approvalLoading ? <Gate2Skeleton /> : null}
      {approvalFailed && !approvalLoading ? (
        <div role="alert">
          <p className={sections.empty}>{t('clustering:errors.selectedVariantFailed')}</p>
          {onRetryApproval ? (
            <Button variant="secondary" onClick={onRetryApproval}>
              {t('common:actions.retry', 'Retry')}
            </Button>
          ) : null}
        </div>
      ) : null}
      {!approvalLoading && !approvalFailed ? (
        <Gate2Panel
          approval={approval}
          approved={gate2Approved}
          canApprove={canApprove}
          onApprove={onApprove}
          onReject={onReject}
          deciding={deciding}
          signingOff={signingOff}
          readOnly={readOnly}
          highlighted={highlightedSection === 'gate2'}
        />
      ) : null}
      <Gate3Panel
        gate3={gate3}
        signedOff={signedOff}
        context={signOff}
        approver={approver}
        approverStatus={approverStatus}
        onRetryApprover={onRetryApprover}
        highlighted={highlightedSection === 'gate3'}
      />
    </div>
  );
}

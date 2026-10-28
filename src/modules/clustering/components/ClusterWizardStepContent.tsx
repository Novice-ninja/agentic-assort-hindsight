import { useAppDispatch } from '@app/store/hooks';
import type { ClusterWizardApi } from '../hooks/useClusterWizard';
import { patchClusterPlanSuggestedName } from '../store/clusteringSlice';
import type { ClusterPlanLandingSection, WizardStep } from '../types';
import { FinalizeStep } from './steps/FinalizeStep';
import { ReviewRunStep } from './steps/ReviewRunStep';
import { SignOffStep } from './steps/SignOffStep';

/** User-driven actions the host wires for the Set It Up flow; no-ops on the agentic mirror. */
export interface ClusterWizardStepActions {
  onToggleAttribute: (id: string, selected: boolean) => void;
  onConfirm: () => void;
  onRemoveVariant: (id: string) => void;
  onRestoreVariant: (id: string) => void;
  onRemoveAll: () => void;
  onRestoreAll: () => void;
  onOpenCustomVariant: () => void;
  onSelectCandidate: (id: string) => void;
  onApprove: () => void;
  onReject: () => void;
}

export interface ClusterWizardStepContentProps {
  step: Exclude<WizardStep, 'scope'>;
  wizard: ClusterWizardApi;
  actions: ClusterWizardStepActions;
  /** Mirror mode: every control stays visible but disabled — the agent drives transitions. */
  readOnly?: boolean;
  /** Section currently being filled by the agent; draws the Figma stroke glow around it. */
  highlightedSection?: ClusterPlanLandingSection;
}

/**
 * Review & Run → Finalize → Sign-Off content, mapped from the wizard hook. Shared verbatim by
 * the Set It Up page and the agentic Describe page so both show the same data for a plan.
 */
export function ClusterWizardStepContent({
  step,
  wizard,
  actions,
  readOnly = false,
  highlightedSection,
}: ClusterWizardStepContentProps) {
  const dispatch = useAppDispatch();
  const draft = wizard.draft;
  if (!draft) return null;
  const landingSection = draft.landingSection;
  const retryResumeLoad = wizard.retryResumeLoad;

  if (step === 'reviewRun') {
    const holdsVariants =
      wizard.generatedVariants?.clusterPlanCode === draft.clusterPlanCode &&
      wizard.generatedVariantsStatus !== 'loading';
    const showAttributePicks =
      wizard.confirming ||
      ((landingSection === 'variants' || holdsVariants) && !wizard.attributeSelectionStale);
    return (
      <ReviewRunStep
        attributes={wizard.attributes.map((attr) => ({
          ...attr,
          userSelected: draft.attributeOverrides[attr.id] ?? attr.userSelected,
        }))}
        variants={wizard.variants}
        run={wizard.run}
        cutoff={wizard.config?.significanceCutoff ?? 0.4}
        kValueCount={wizard.config?.kValueCount ?? 5}
        startingPoints={wizard.config?.startingPoints ?? 3}
        inputNeededReason={
          wizard.plan?.status === 'inputNeeded'
            ? wizard.plan.inputNeededReasonKey
            : undefined
        }
        showAttributePicks={showAttributePicks}
        confirming={wizard.confirming}
        confirmDisabled={
          wizard.generatedVariantsStatus === 'succeeded' &&
          wizard.generatedVariants?.clusterPlanCode === draft.clusterPlanCode &&
          !wizard.attributeSelectionStale
        }
        attributesLoading={
          wizard.attributeScoreStatus === 'loading' ||
          (wizard.attributeScoreStatus !== 'succeeded' &&
            wizard.attributeScoreStatus !== 'failed' &&
            wizard.attributeScore?.clusterPlanCode !== draft.clusterPlanCode)
        }
        attributesFailed={
          (landingSection === 'attributes' || landingSection === 'variants') &&
          wizard.attributeScoreStatus === 'failed'
        }
        variantsLoading={
          wizard.generatedVariantsStatus === 'loading' ||
          (landingSection === 'variants' &&
            wizard.generatedVariants?.clusterPlanCode !== draft.clusterPlanCode &&
            wizard.generatedVariantsStatus !== 'failed')
        }
        variantsFailed={
          landingSection === 'variants' && wizard.generatedVariantsStatus === 'failed'
        }
        onRetryAttributes={retryResumeLoad}
        onRetryVariants={retryResumeLoad}
        onToggleAttribute={actions.onToggleAttribute}
        onConfirm={actions.onConfirm}
        onRemoveVariant={actions.onRemoveVariant}
        onRestoreVariant={actions.onRestoreVariant}
        onRemoveAll={actions.onRemoveAll}
        onRestoreAll={actions.onRestoreAll}
        onOpenCustomVariant={actions.onOpenCustomVariant}
        readOnly={readOnly}
        highlightedSection={
          highlightedSection === 'attributes' || highlightedSection === 'variants'
            ? highlightedSection
            : undefined
        }
      />
    );
  }

  if (step === 'finalize') {
    return (
      <FinalizeStep
        candidates={wizard.candidates}
        weeks={wizard.config?.newStoreExclusionWeeks ?? 8}
        locked={wizard.plan?.locked}
        onSelect={actions.onSelectCandidate}
        onRename={(clusterName, customName) => {
          const variantId = wizard.candidates.find(
            (candidate) => candidate.selected,
          )?.variantId;
          if (!variantId) return;
          dispatch(
            patchClusterPlanSuggestedName({
              variantId,
              clusterName,
              suggestedName: customName.trim(),
            }),
          );
        }}
        onTogglePin={wizard.togglePin}
        candidatesLoading={
          wizard.clusterRun?.clusterPlanCode !== draft.clusterPlanCode &&
          wizard.clusterRunStatus !== 'failed'
        }
        candidatesFailed={
          landingSection === 'candidates' && wizard.clusterRunStatus === 'failed'
        }
        onRetryCandidates={retryResumeLoad}
        storeAssignments={wizard.storeAssignments}
        onLoadStoreAssignments={wizard.loadStoreAssignments}
        onMoveStore={wizard.moveStoreAssignment}
        performanceInfo={wizard.performanceInfo}
        onLoadPerformanceInfo={wizard.loadPerformanceInfo}
        clusterPlans={wizard.clusterPlans}
        onLoadClusterPlans={wizard.loadClusterPlans}
        clusterPerformanceSummary={wizard.clusterPerformanceSummary}
        onLoadClusterPerformanceSummary={wizard.loadClusterPerformanceSummary}
        kpiBreakdown={wizard.kpiBreakdown}
        onLoadKpiBreakdown={wizard.loadKpiBreakdown}
        attributeProductList={wizard.attributeProductList}
        onLoadAttributeProductList={wizard.loadAttributeProductList}
        attributeInfo={wizard.attributeInfo}
        onLoadAttributeInfo={wizard.loadAttributeInfo}
        attributeGradesSummary={wizard.attributeGradesSummary}
        onLoadAttributeGradesSummary={wizard.loadAttributeGradesSummary}
        variantSummary={
          wizard.variantSummary?.clusterPlanCode === draft.clusterPlanCode
            ? wizard.variantSummary
            : undefined
        }
        onRetryVariantSummary={() => wizard.loadVariantSummary({ force: true })}
        readOnly={readOnly}
        highlighted={highlightedSection === 'candidates'}
      />
    );
  }

  return (
    <SignOffStep
      approval={wizard.approval}
      gates={wizard.gates}
      signOff={wizard.signOff}
      landingSection={landingSection}
      approvalLoading={!wizard.approval && wizard.selectedVariantStatus !== 'failed'}
      approvalFailed={!wizard.approval && wizard.selectedVariantStatus === 'failed'}
      onRetryApproval={retryResumeLoad}
      approver={wizard.approver}
      approverStatus={wizard.approverStatus}
      onRetryApprover={() => wizard.loadApprover({ force: true })}
      canApprove={wizard.canApprove}
      onApprove={actions.onApprove}
      onReject={actions.onReject}
      deciding={wizard.decidingGate2}
      signingOff={wizard.signingOff}
      readOnly={readOnly}
      highlightedSection={
        highlightedSection === 'gate2' || highlightedSection === 'gate3'
          ? highlightedSection
          : undefined
      }
    />
  );
}

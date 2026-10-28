import { useCallback, useEffect, useRef, useState } from 'react';
import { selectGlobalConfig } from '@modules/appConfig';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import {
  getSharedAgentWsClient,
  logAgentWsWarn,
  type AgentInboundFrame,
  type AgentPlanStatusMeta,
} from '@shared/services/agentWs';
import { resolveClusterPlanLanding } from '../services/resolveClusterPlanLanding';
import {
  openResumedPlan,
  patchDraft,
  selectRunCandidate,
} from '../store/clusteringSlice';
import type {
  ClusterPlan,
  ClusterPlanLanding,
  ClusterPlanLandingSection,
  ClusterPlanStatus,
  WizardStep,
} from '../types';
import { emptyDraft } from '../types';

export type LoadStepApis = (
  code: string,
  step: WizardStep,
  section: ClusterPlanLandingSection,
) => void;

export interface UseAgentPlanStatusOptions {
  /** Same loader the Set It Up resume uses for a step/section. */
  loadStepApis: LoadStepApis;
}

export interface AgentPlanStatusState {
  /**
   * True from Generate Plan (or an `accepted` frame) until the agent's `done`
   * frame — the page glow and footer toast are shown while this holds.
   */
  processing: boolean;
  /** Latest pipeline position reported on the socket. */
  status: string | null;
  substatus: string | null;
  /** Resolved wizard landing for `substatus` (null until the first known one). */
  landing: ClusterPlanLanding | null;
  /** Plan the agent is building — known once meta carries `clusterPlanCode`. */
  planCode: string | null;
  /**
   * True when a frame names a plan whose substatus cannot be opened.
   * The Describe page toasts and returns to the listing.
   */
  planLookupFailed: boolean;
  /** Call when the user presses Generate Plan so the working state starts immediately. */
  markGenerated: () => void;
  /** No-op — plan identity is socket-driven; kept for the existing hook surface. */
  retryPlanLookup: () => void;
}

function sameLanding(a: ClusterPlanLanding | null, b: ClusterPlanLanding): boolean {
  return a !== null && a.step === b.step && a.section === b.section;
}

const STATUS_MAP: Record<string, ClusterPlanStatus> = {
  DRAFT: 'draft',
  USER_INPUT_NEEDED: 'inputNeeded',
  INPUT_NEEDED: 'inputNeeded',
  AWAITING_APPROVAL: 'awaitingApproval',
  APPROVED: 'approved',
  FINALISED: 'approved',
  FINALIZED: 'approved',
};

function mapPlanStatus(raw: string): ClusterPlanStatus {
  const key = raw.trim().toUpperCase().replace(/[\s-]+/g, '_');
  return STATUS_MAP[key] ?? 'draft';
}

/** Minimal plan snapshot so the wizard can open before a listing hydrate exists. */
function stubPlanFromMeta(
  code: string,
  meta: AgentPlanStatusMeta,
  landing: ClusterPlanLanding,
): ClusterPlan {
  const status = mapPlanStatus(meta.status);
  return {
    id: code,
    name: '',
    productId: null,
    seasonId: null,
    channelId: null,
    countryIds: [],
    status,
    substatus: meta.substatus,
    currentStep: landing.step,
    clusterCount: null,
    channelLabelKey: null,
    createdBy: null,
    createdOn: null,
    locked: status === 'approved',
  };
}

/**
 * Describe Your Plan: follows the clustering agent through the wizard. Every socket
 * frame may carry `meta: { status, substatus, clusterPlanCode?, selectedGeneratedClusterVariantId? }`;
 * the substatus resolves to the same step/section the Set It Up resume uses, the plan
 * code and selected variant come from the frame, and that step's APIs are fetched so
 * the mirrored section renders.
 *
 * The chat panel is untouched — this only observes the shared socket.
 */
export function useAgentPlanStatus({
  loadStepApis,
}: UseAgentPlanStatusOptions): AgentPlanStatusState {
  const dispatch = useAppDispatch();
  const globalConfig = useAppSelector(selectGlobalConfig);

  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [substatus, setSubstatus] = useState<string | null>(null);
  const [landing, setLanding] = useState<ClusterPlanLanding | null>(null);
  const [planCode, setPlanCode] = useState<string | null>(null);
  const [planLookupFailed, setPlanLookupFailed] = useState(false);

  const planCodeRef = useRef<string | null>(null);
  const variantIdRef = useRef<string | null>(null);
  const landingRef = useRef<ClusterPlanLanding | null>(null);
  const globalConfigRef = useRef(globalConfig);
  const loadStepApisRef = useRef(loadStepApis);
  globalConfigRef.current = globalConfig;
  loadStepApisRef.current = loadStepApis;

  const applySelectedVariant = useCallback(
    (variantId: string | null | undefined) => {
      const id = variantId?.trim() || '';
      if (!id || id === variantIdRef.current) return;
      variantIdRef.current = id;
      dispatch(selectRunCandidate(id));
    },
    [dispatch],
  );

  const openAgentPlan = useCallback(
    (code: string, meta: AgentPlanStatusMeta, target: ClusterPlanLanding) => {
      const variantId = meta.selectedGeneratedClusterVariantId?.trim() || null;
      if (variantId) variantIdRef.current = variantId;
      planCodeRef.current = code;
      setPlanCode(code);
      dispatch(
        openResumedPlan({
          plan: stubPlanFromMeta(code, meta, target),
          draft: {
            ...emptyDraft(code),
            clusterPlanCode: code,
            planId: code,
            currentStep: target.step,
            landingSection: target.section,
            resumeSection: target.section,
            selectedCandidateId: variantId,
          },
        }),
      );
      loadStepApisRef.current(code, target.step, target.section);
    },
    [dispatch],
  );

  const applyMeta = useCallback(
    (meta: AgentPlanStatusMeta, isDone: boolean) => {
      setStatus(meta.status);
      setSubstatus(meta.substatus);
      const next = resolveClusterPlanLanding(globalConfigRef.current, meta.substatus);
      if (!next) {
        const reportedSubstatus = meta.substatus?.trim() ?? '';
        const reportedPlan = meta.clusterPlanCode?.trim() || planCodeRef.current;
        // A named plan whose substatus does not map to a step cannot be opened.
        // Frames that have not created a plan yet keep waiting for a later code.
        if (reportedSubstatus && reportedPlan) setPlanLookupFailed(true);
        logAgentWsWarn('Describe Your Plan: unknown substatus on frame', meta);
        return;
      }
      const changed = !sameLanding(landingRef.current, next);
      landingRef.current = next;
      if (changed) setLanding(next);

      const codeFromMeta = meta.clusterPlanCode?.trim() || '';
      const code = codeFromMeta || planCodeRef.current;
      // Plan not created yet — wait for a later frame that carries clusterPlanCode.
      if (!code) return;

      if (!planCodeRef.current) {
        openAgentPlan(code, meta, next);
        return;
      }

      applySelectedVariant(meta.selectedGeneratedClusterVariantId);

      if (changed) {
        dispatch(
          patchDraft({
            currentStep: next.step,
            landingSection: next.section,
            resumeSection: next.section,
            ...(variantIdRef.current
              ? { selectedCandidateId: variantIdRef.current }
              : {}),
          }),
        );
        loadStepApisRef.current(code, next.step, next.section);
        return;
      }
      // Same section after a completed turn — the agent may have changed its contents.
      if (isDone) loadStepApisRef.current(code, next.step, next.section);
    },
    [applySelectedVariant, dispatch, openAgentPlan],
  );

  useEffect(() => {
    const client = getSharedAgentWsClient();
    const unsubscribe = client.subscribeFrames((frame: AgentInboundFrame) => {
      if (frame.type === 'accepted' || frame.type === 'trace') setProcessing(true);
      if (frame.type === 'done') setProcessing(false);
      if (frame.meta) applyMeta(frame.meta, frame.type === 'done');
    });
    return unsubscribe;
  }, [applyMeta]);

  const markGenerated = useCallback(() => setProcessing(true), []);
  const retryPlanLookup = useCallback(() => undefined, []);

  return {
    processing,
    status,
    substatus,
    landing,
    planCode,
    planLookupFailed,
    markGenerated,
    retryPlanLookup,
  };
}

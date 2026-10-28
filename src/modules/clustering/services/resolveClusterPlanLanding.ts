import { getComponentConfig } from '@modules/appConfig';
import type { GlobalConfig } from '@modules/appConfig/types';
import {
  WIZARD_STEPS,
  type ClusterPlanLanding,
  type ClusterPlanLandingSection,
  type WizardStep,
} from '../types';

const SECTIONS: readonly ClusterPlanLandingSection[] = [
  'attributes',
  'variants',
  'candidates',
  'gate2',
  'gate3',
  'complete',
];

/** Fallback when tenant config omits `clustering.wizard.planResume`. */
export const CLUSTER_PLAN_STATUS_LANDING: Record<string, ClusterPlanLanding> = {
  ATTRIBUTE_SELECTION_PENDING: { step: 'reviewRun', section: 'attributes' },
  VARIANT_SELECTION_PENDING: { step: 'reviewRun', section: 'variants' },
  SELECT_FINAL_CLUSTER_VARIANT_PENDING: { step: 'finalize', section: 'candidates' },
  GATE_2_APPROVAL_PENDING: { step: 'signOff', section: 'gate2' },
  GATE_2_APPROVAL: { step: 'signOff', section: 'gate2' },
  GATE_3_APPROVAL_PENDING: { step: 'signOff', section: 'gate3' },
  GATE_3_APPROVAL: { step: 'signOff', section: 'gate3' },
  FINALIZED: { step: 'signOff', section: 'complete' },
};

/** `Variant Selection Pending` / `variant-selection-pending` → `VARIANT_SELECTION_PENDING`. */
export function normalizeClusterPlanStatusKey(value: string): string {
  return value.trim().toUpperCase().replace(/[\s-]+/g, '_');
}

function isWizardStep(value: string): value is WizardStep {
  return (WIZARD_STEPS as readonly string[]).includes(value);
}

function isLandingSection(value: string | undefined): value is ClusterPlanLandingSection {
  return value !== undefined && (SECTIONS as readonly string[]).includes(value);
}

function toLanding(entry: { step: string; section?: string } | undefined): ClusterPlanLanding | null {
  if (!entry || !isWizardStep(entry.step) || !isLandingSection(entry.section)) return null;
  return { step: entry.step, section: entry.section };
}

function authoredLanding(
  config: GlobalConfig | null | undefined,
  key: string,
): ClusterPlanLanding | null {
  const raw = config
    ? getComponentConfig(config, 'clustering', 'wizard', 'planResume')?.statusLanding
    : undefined;
  if (!raw) return null;
  const direct = toLanding(raw[key]);
  if (direct) return direct;
  for (const [name, entry] of Object.entries(raw)) {
    if (normalizeClusterPlanStatusKey(name) === key) return toLanding(entry);
  }
  return null;
}

/** True when `current` is at or past `target` in the resume pipeline. */
export function hasReachedSection(
  current: ClusterPlanLandingSection | undefined,
  target: ClusterPlanLandingSection,
): boolean {
  if (!current) return false;
  return SECTIONS.indexOf(current) >= SECTIONS.indexOf(target);
}

/**
 * Section to show (and GET) when visiting a wizard step. Later resume landings keep
 * Attribute Picks / Finalize cards available when the user goes Back.
 */
export function landingSectionForStep(
  step: WizardStep,
  resumeSection: ClusterPlanLandingSection | undefined,
  options?: { hasGeneratedVariants?: boolean },
): ClusterPlanLandingSection | undefined {
  if (step === 'scope') return undefined;
  if (step === 'reviewRun') {
    return hasReachedSection(resumeSection, 'variants') || options?.hasGeneratedVariants
      ? 'variants'
      : 'attributes';
  }
  if (step === 'finalize') return 'candidates';
  if (resumeSection === 'gate3' || resumeSection === 'complete') return resumeSection;
  return 'gate2';
}

/**
 * Maps backend `substatus` to the wizard step/section.
 * Known pipeline codes always use `CLUSTER_PLAN_STATUS_LANDING` (same table as fallback
 * `planResume.statusLanding`) so a live `/v1/global-config` overlay cannot send
 * `VARIANT_SELECTION_PENDING` to Finalize. Tenant `statusLanding` only adds unknown codes.
 * Unknown codes with no tenant match return `null` so the host can toast instead of guessing Scope.
 */
export function resolveClusterPlanLanding(
  config: GlobalConfig | null | undefined,
  substatus: string | null | undefined,
): ClusterPlanLanding | null {
  const key = normalizeClusterPlanStatusKey(substatus ?? '');
  if (!key) return null;
  return toLanding(CLUSTER_PLAN_STATUS_LANDING[key]) ?? authoredLanding(config, key);
}

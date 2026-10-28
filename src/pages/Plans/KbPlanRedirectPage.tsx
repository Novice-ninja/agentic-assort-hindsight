import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGlobalConfig } from '@modules/appConfig';
import { usePlanning } from '@modules/planning';
import {
  buildStoredFilterStrip,
  savePlanFilterStrip,
} from '@modules/hindsight/services/buildPlanFilterStrip';
import { ROUTES } from '@config/routes';
import { MOCK_KB_PLAN } from './mockKbPlan';

/** Name of the plan Agentic Assort opens straight into Hindsight (All Plans is bypassed). */
export const KB_PLAN_NAME = 'KB Plan';

const normalise = (value: string) => value.trim().toLowerCase();

/**
 * Replaces the All Plans landing page: loads the plans, finds the KB Plan by name and
 * replaces this history entry with Hindsight, so Back never returns to a blank redirect.
 */
export function KbPlanRedirectPage() {
  const { t } = useTranslation(['planning', 'common']);
  const navigate = useNavigate();
  const global = useGlobalConfig();
  const { plans, statuses } = usePlanning();

  // Prefer the KB Plan (exact name, then partial match); otherwise the best available plan (see below).
  const active = plans.filter((p) => !p.isDeleted);
  const found =
    active.find((p) => normalise(p.name) === normalise(KB_PLAN_NAME)) ??
    active.find((p) => normalise(p.name).includes(normalise(KB_PLAN_NAME))) ??
    // Hindsight requests need a reference season, and finished plans are the likeliest to have data.
    active.find(
      (p) =>
        p.referenceSeasonCode != null &&
        (p.status === 'approved' || p.status === 'review'),
    ) ??
    active.find((p) => p.referenceSeasonCode != null) ??
    active[0];

  // Plans failed to load or came back empty: fall back to a mock plan so Hindsight still opens.
  const plansUnavailable =
    statuses.plans === 'failed' || (statuses.plans === 'succeeded' && !found);
  const kbPlan = found ?? (plansUnavailable ? MOCK_KB_PLAN : undefined);

  useEffect(() => {
    if (!kbPlan) return;
    savePlanFilterStrip(
      buildStoredFilterStrip(kbPlan, global.hierarchy?.levelHierarchies),
    );
    navigate(ROUTES.hindsight, {
      replace: true,
      state: {
        planId: kbPlan.id,
        seasonCode: kbPlan.seasonCode,
        referenceSeasonCode: kbPlan.referenceSeasonCode,
        planName: kbPlan.name,
      },
    });
  }, [kbPlan, global.hierarchy?.levelHierarchies, navigate]);

  return (
    <div role="status" aria-live="polite" data-testid="kb-plan-redirect">
      {t('common:states.loading', { defaultValue: 'Loading…' })}
    </div>
  );
}

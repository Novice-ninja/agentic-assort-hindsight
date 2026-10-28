import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { useToast } from '@shared/components/primitives/Toast';
import {
  bucketForChoice,
  buildOverridePayload,
  type RecommendationChange,
} from '../services/recommendationOverridePayload';
import { saveItemRecommendation } from '../store/hindsightSlice';
import type { PendingRecommendation } from '../store/hindsightSlice';

export interface ItemRecommendationResult {
  /** Articles whose override is in flight, so a row or card can render its own pending state. */
  pendingArticles: Readonly<Record<string, PendingRecommendation>>;
  /** Applies one article's new recommendation. Safe to call from any view. */
  change: (article: string, choice: string) => void;
  /**
   * Applies the same recommendation to many articles in one request (`keep` / `drop` arrays).
   * Resolves when the write finishes so callers can clear selection on success.
   */
  changeMany: (articles: readonly string[], choice: string) => Promise<boolean>;
  /** Discards an article's override, returning it to the system's own recommendation. */
  revert: (article: string) => void;
}

/**
 * The one way a recommendation gets changed, used by the table view and by both faces of a card.
 *
 * Everything a change involves lives here so the two views cannot drift: the bucket the choice
 * belongs in, the request, and the toast the answer earns. What the store does with the answer —
 * optimistic apply, reconciliation against `effectiveReco`, rollback — belongs to the slice, so
 * this hook stays a translation from a click into an intent.
 */
export function useItemRecommendation(planCode?: string): ItemRecommendationResult {
  const { t } = useTranslation('hindsight');
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const pendingArticles = useAppSelector((s) => s.hindsight.pendingRecommendations);

  const save = useCallback(
    async (changes: readonly RecommendationChange[]): Promise<boolean> => {
      const payload = buildOverridePayload(planCode, changes);

      // No plan, no article, or nothing the endpoint has a bucket for: there is no request to make
      // and reporting a failure the planner cannot act on would be noise.
      if (payload === null) return false;

      try {
        const data = await dispatch(saveItemRecommendation({ payload, changes })).unwrap();
        showToast({
          message: data.message ?? t('items.recommendation.saved'),
          variant: 'success',
        });
        return true;
      } catch (error: unknown) {
        // Covers every way this can fail — non-2xx, `status: false`, a dropped connection, and
        // the client's own timeout all arrive here as a rejected thunk.
        showToast({
          message:
            error instanceof Error && error.message.length > 0
              ? error.message
              : t('items.recommendation.failed'),
          variant: 'error',
        });
        return false;
      }
    },
    [dispatch, planCode, showToast, t],
  );

  const change = useCallback(
    (article: string, choice: string) => {
      const bucket = bucketForChoice(choice);
      if (bucket === undefined) return;
      void save([{ article, bucket }]);
    },
    [save],
  );

  const changeMany = useCallback(
    (articles: readonly string[], choice: string): Promise<boolean> => {
      const bucket = bucketForChoice(choice);
      if (bucket === undefined) return Promise.resolve(false);

      const changes: RecommendationChange[] = [];
      const seen = new Set<string>();
      for (const article of articles) {
        if (article.length === 0 || seen.has(article)) continue;
        seen.add(article);
        changes.push({ article, bucket });
      }

      return save(changes);
    },
    [save],
  );

  const revert = useCallback(
    (article: string) => {
      void save([{ article, bucket: 'clear' }]);
    },
    [save],
  );

  return { pendingArticles, change, changeMany, revert };
}

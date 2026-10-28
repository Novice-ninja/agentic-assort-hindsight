import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import type { ControlFilter } from '@modules/appConfig';
import { useToast } from '@shared/components/primitives/Toast';
import {
  fetchAttributes,
  fetchHindsightAttribute,
  setActiveAttributeId,
} from '../../store/hindsightSlice';
import { useLabel } from '../../hooks';
import { SalesMixBreakdownTable } from '../attributes/SalesMixBreakdownTable';
// import { AttributeHeatmapWidget } from '../attributes/AttributeHeatmapWidget';
import { SalesMixChartCard } from '../attributes/SalesMixChartCard';
import { SalesMixHeader } from '../attributes/SalesMixHeader';
import type {
  AttributeBreakdownRow,
  AttributeDefinition,
  ColumnConfigEntry,
} from '../../types';
import type { LoadStatus } from '@shared/types';
import styles from './panels.module.css';

export interface ByAttributePanelProps {
  attributes: AttributeDefinition[];
  activeAttributeId: string | null;
  planCode?: string;
  seasonCode?: number | null;
  /** Rows for the breakdown table, as the table-data API sent them. */
  tableRows?: readonly AttributeBreakdownRow[];
  tableStatus?: LoadStatus;
  onRetryTable?: () => void;
  /** Column config entries from the column-config API. */
  columnConfigGroups?: readonly ColumnConfigEntry[];
  /** Controlled recommendation filter from the page, shared with the attribute API call. */
  recommendationFilter?: ControlFilter;
}

/**
 * The By Attribute tab.
 *
 * Fetches attributes from the dedicated API on mount; falls back to the tenant's static
 * catalogue if the API is unavailable. Selecting an attribute triggers its breakdown fetch,
 * and the first (or default) attribute is selected automatically so the tab is never bare.
 * The heatmap loads from the charts API independently so a chart failure never blanks the grid.
 */
export function ByAttributePanel({
  attributes,
  activeAttributeId,
  planCode,
  seasonCode,
}: ByAttributePanelProps) {
  const { t } = useTranslation('hindsight');
  const label = useLabel();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const toastShownRef = useRef(false);

  const apiAttributes = useAppSelector((s) => s.hindsight.apiAttributes);
  const attributesStatus = useAppSelector((s) => s.hindsight.statuses.attributes);

  useEffect(() => {
    if (planCode && seasonCode != null) {
      void dispatch(fetchAttributes({ planCode, seasonCode }));
    }
  }, [dispatch, planCode, seasonCode]);

  useEffect(() => {
    if (attributesStatus === 'failed' && !toastShownRef.current) {
      toastShownRef.current = true;
      showToast({
        message: t(
          'attributes.fetchFailed',
          'Attributes are currently unavailable. Showing defaults.',
        ),
        variant: 'error',
      });
    }
    if (attributesStatus === 'succeeded') {
      toastShownRef.current = false;
    }
  }, [attributesStatus, showToast, t]);

  const effectiveAttributes = apiAttributes ?? attributes;
  const canFetchAttributes = Boolean(planCode && seasonCode != null);
  const attributesLoading =
    canFetchAttributes && (attributesStatus === 'loading' || attributesStatus === 'idle');
  const attributesResolved =
    !canFetchAttributes ||
    attributesStatus === 'succeeded' ||
    attributesStatus === 'failed';

  const defaultAttribute = effectiveAttributes.find((a) => a.isDefault);
  const firstAttributeId = defaultAttribute?.id ?? effectiveAttributes[0]?.id ?? null;
  const effectiveId = activeAttributeId ?? firstAttributeId;

  // Once the attributes API resolves, select the default attribute (only once)
  useEffect(() => {
    if (!attributesResolved) return;
    if (activeAttributeId !== null) return;
    if (firstAttributeId === null) return;
    dispatch(setActiveAttributeId(firstAttributeId));
  }, [attributesResolved, firstAttributeId, activeAttributeId, dispatch]);

  // When API attributes arrive with a different default, update the selection
  useEffect(() => {
    if (apiAttributes === null) return;
    const apiDefault = apiAttributes.find((a) => a.isDefault);
    const targetId = apiDefault?.id ?? apiAttributes[0]?.id ?? null;
    if (targetId !== null && targetId !== activeAttributeId) {
      dispatch(setActiveAttributeId(targetId));
    }
  }, [apiAttributes, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!attributesResolved) return;
    if (effectiveId === null) return;
    void dispatch(fetchHindsightAttribute(effectiveId));
  }, [dispatch, effectiveId, attributesResolved]);

  function select(id: string) {
    dispatch(setActiveAttributeId(id));
  }

  const attributeLabel = label(
    effectiveAttributes.find((a) => a.id === effectiveId)?.labelKey ?? 'attributes.title',
  );

  return (
    <div
      className={[styles.stack, styles.attributeSurface].join(' ')}
      data-testid="hindsight-by-attribute-panel"
    >
      <SalesMixHeader
        attributes={effectiveAttributes}
        activeId={effectiveId}
        onSelect={select}
        loading={attributesLoading}
      />

      {/* <AttributeHeatmapWidget
        attributeId={attributesResolved ? effectiveId : null}
        attributeLabel={effectiveAttributes.find((a) => a.id === effectiveId)?.labelKey}
        planCode={planCode}
        seasonCode={seasonCode}
      /> */}

      <SalesMixChartCard attributeId={effectiveId} attributeLabel={attributeLabel} />

      <SalesMixBreakdownTable attributeId={effectiveId} attributeLabel={attributeLabel} />
    </div>
  );
}

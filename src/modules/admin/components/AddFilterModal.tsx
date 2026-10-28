import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { focusRingClass } from '@shared/a11y';
import { Button, Modal, Select } from '@shared/components';
import { getChildFacets } from '../services/filterCascade';
import type { AdminFilterContext, FilterFacetOption } from '../types';
import styles from './AddFilterModal.module.css';

type FilterTab = 'products' | 'channel' | 'calendar';

export interface AddFilterModalProps {
  open: boolean;
  draft: AdminFilterContext;
  facets: FilterFacetOption[];
  onApply: (ctx: AdminFilterContext) => void;
  onCancel: () => void;
  onClearTab: (tab: FilterTab) => void;
}

const TABS: FilterTab[] = ['products', 'channel', 'calendar'];

function TabIcon({ tab }: { tab: FilterTab }) {
  const icons: Record<FilterTab, JSX.Element> = {
    products: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M6 7h12l-1 13H7L6 7z" strokeLinejoin="round" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" strokeLinecap="round" />
      </svg>
    ),
    channel: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
      </svg>
    ),
    calendar: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M4 9h16M8 3v4M16 3v4" strokeLinecap="round" />
      </svg>
    ),
  };
  return icons[tab];
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
    </svg>
  );
}

export function AddFilterModal({
  open,
  draft: initialDraft,
  facets,
  onApply,
  onCancel,
  onClearTab,
}: AddFilterModalProps) {
  const { t } = useTranslation('admin');
  const [tab, setTab] = useState<FilterTab>('products');
  const [draft, setDraft] = useState<AdminFilterContext>(initialDraft);

  useEffect(() => {
    if (open) setDraft(initialDraft);
  }, [open, initialDraft]);

  const facetOptions = useCallback(
    (facet: string, parentId?: string) =>
      getChildFacets(facets, facet, parentId).map((f) => {
        const key = f.labelKey.startsWith('admin.')
          ? f.labelKey.slice('admin.'.length)
          : f.labelKey;
        return { value: f.id, label: t(key) };
      }),
    [facets, t],
  );

  const productsFields = useMemo(
    () => [
      { key: 'productGroupId' as const, facet: 'productGroup', parent: undefined },
      { key: 'subDepartmentId' as const, facet: 'subDepartment', parent: draft.productGroupId },
      { key: 'categoryId' as const, facet: 'category', parent: draft.subDepartmentId },
      { key: 'subCategoryId' as const, facet: 'subCategory', parent: draft.categoryId },
      { key: 'classId' as const, facet: 'class', parent: draft.subCategoryId },
      { key: 'subClassId' as const, facet: 'subClass', parent: draft.classId },
      { key: 'brandId' as const, facet: 'brand', parent: undefined },
    ],
    [draft],
  );

  const tabCounts = useMemo<Record<FilterTab, number>>(
    () => ({
      products: productsFields.filter((f) => Boolean(draft[f.key])).length,
      channel:
        (draft.channelRegionIds?.length ?? 0) +
        (draft.customerTypeIds?.length ?? 0) +
        (draft.fulfillmentScopeIds?.length ?? 0),
      calendar: (draft.calendarSeasonId ? 1 : 0) + (draft.periodIds?.length ?? 0),
    }),
    [draft, productsFields],
  );

  const setSingle = (key: keyof AdminFilterContext, value: string[]) => {
    setDraft((prev) => ({ ...prev, [key]: value[0] ?? undefined }));
  };

  const setMulti = (key: keyof AdminFilterContext, value: string[]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearTab = () => {
    onClearTab(tab);
    setDraft((prev) => {
      if (tab === 'products') {
        return {
          ...prev,
          productGroupId: undefined,
          subDepartmentId: undefined,
          categoryId: undefined,
          subCategoryId: undefined,
          classId: undefined,
          subClassId: undefined,
          brandId: undefined,
        };
      }
      if (tab === 'channel') {
        return {
          ...prev,
          channelRegionIds: undefined,
          customerTypeIds: undefined,
          fulfillmentScopeIds: undefined,
        };
      }
      return { ...prev, calendarSeasonId: undefined, periodIds: undefined };
    });
  };

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={t('filterModal.title')}
      overlayClassName={styles.drawerOverlay}
      dialogClassName={styles.drawer}
    >
      <button
        type="button"
        className={[styles.closeBtn, focusRingClass].join(' ')}
        aria-label={t('filterModal.cancel')}
        onClick={onCancel}
      >
        <CloseIcon />
      </button>

      <div className={styles.layout}>
        <nav className={styles.sidebar} aria-label={t('filterModal.tabsLabel')}>
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              className={[styles.tab, tab === item && styles.tabActive, focusRingClass]
                .filter(Boolean)
                .join(' ')}
              aria-current={tab === item ? 'page' : undefined}
              onClick={() => setTab(item)}
            >
              <span className={styles.tabContent}>
                <span className={styles.tabIcon}>
                  <TabIcon tab={item} />
                </span>
                <span className={styles.tabLabel}>{t(`filterModal.tabs.${item}`)}</span>
              </span>
              {tabCounts[item] > 0 && (
                <span className={styles.tabBadge}>{String(tabCounts[item]).padStart(2, '0')}</span>
              )}
            </button>
          ))}
        </nav>

        <div className={styles.content}>
          <div className={styles.body}>
            {tab === 'products' && (
              <div className={styles.fields}>
                {productsFields.map((field) => (
                  <Select
                    key={field.key}
                    label={t(`filterModal.fields.${field.key}`)}
                    options={facetOptions(field.facet, field.parent)}
                    value={draft[field.key] ? [draft[field.key] as string] : []}
                    onChange={(v) => setSingle(field.key, v)}
                  />
                ))}
              </div>
            )}

            {tab === 'channel' && (
              <div className={styles.fields}>
                <Select
                  label={t('filterModal.fields.channelRegionIds')}
                  options={facetOptions('channelRegion')}
                  value={draft.channelRegionIds ?? []}
                  onChange={(v) => setMulti('channelRegionIds', v)}
                  mode="multi"
                />
                <Select
                  label={t('filterModal.fields.customerTypeIds')}
                  options={facetOptions('customerType')}
                  value={draft.customerTypeIds ?? []}
                  onChange={(v) => setMulti('customerTypeIds', v)}
                  mode="multi"
                />
                <Select
                  label={t('filterModal.fields.fulfillmentScopeIds')}
                  options={facetOptions('fulfillmentScope')}
                  value={draft.fulfillmentScopeIds ?? []}
                  onChange={(v) => setMulti('fulfillmentScopeIds', v)}
                  mode="multi"
                />
              </div>
            )}

            {tab === 'calendar' && (
              <div className={styles.fields}>
                <Select
                  label={t('filterModal.fields.calendarSeasonId')}
                  options={facetOptions('calendarSeason')}
                  value={draft.calendarSeasonId ? [draft.calendarSeasonId] : []}
                  onChange={(v) => setSingle('calendarSeasonId', v)}
                />
                <Select
                  label={t('filterModal.fields.periodIds')}
                  options={facetOptions('period', draft.calendarSeasonId)}
                  value={draft.periodIds ?? []}
                  onChange={(v) => setMulti('periodIds', v)}
                  mode="multi"
                />
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <Button variant="ghost" className={styles.clearBtn} onClick={handleClearTab}>
              {t('filterModal.clearTab')}
            </Button>
            <div className={styles.actionsRight}>
              <Button variant="secondary" className={styles.tertiaryBtn} onClick={onCancel}>
                {t('filterModal.cancel')}
              </Button>
              <Button
                variant="primary"
                className={styles.primaryBtn}
                onClick={() => onApply(draft)}
              >
                {t('filterModal.apply')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

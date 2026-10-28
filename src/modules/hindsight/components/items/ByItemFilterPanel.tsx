import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductHierarchyLevel } from '@modules/planning/components/steps/ProductHierarchyLevel';
import type { HierarchyScopeEntry, ProductHierarchyNode } from '@modules/planning/types';
import { FilterPanel } from '@shared/components/vendor/impact-ui';
import { useByItemProductScope } from '../../hooks/useByItemProductScope';
import styles from './ByItemFilterPanel.module.css';

export interface ByItemFilterPanelProps {
  open: boolean;
  onClose: () => void;
  /** Applied scope — copied into the draft when the panel opens. */
  appliedScope: readonly HierarchyScopeEntry[];
  onApply: (scope: HierarchyScopeEntry[]) => void;
}

function toNode(
  value: { value: string; label: string; styleCount?: number; imageurl?: string },
  levelName: string,
): ProductHierarchyNode {
  return {
    id: value.value,
    level: levelName as ProductHierarchyNode['level'],
    label: value.label,
    styleCount: value.styleCount,
    imageUrl: value.imageurl,
  };
}

/**
 * Filter Settings drawer for By Item table view.
 *
 * Product hierarchy only (`l0_name` …), using the same filter config/values APIs and level UI as
 * Create Plan Product Scope. Apply commits the draft; Cancel discards it.
 */
export function ByItemFilterPanel({
  open,
  onClose,
  appliedScope,
  onApply,
}: ByItemFilterPanelProps) {
  const { t } = useTranslation(['hindsight', 'planning']);
  const productScope = useByItemProductScope(appliedScope, open);

  const hierarchyContent = useMemo(() => {
    if (productScope.levelsStatus === 'loading' || productScope.levelsStatus === 'idle') {
      return (
        <p className={styles.state} role="status">
          {t('hindsight:states.loading')}
        </p>
      );
    }
    if (productScope.levelsStatus === 'failed') {
      return (
        <p className={styles.state} role="alert">
          {t('hindsight:states.error')}
        </p>
      );
    }
    if (productScope.levels.length === 0) {
      return (
        <p className={styles.state}>
          {t('planning:scope.noHierarchy', 'No product hierarchy available')}
        </p>
      );
    }

    return (
      <div className={styles.hierarchy} data-testid="hindsight-by-item-filter-hierarchy">
        {productScope.levelViews.map((view) => {
          const hasNoData =
            view.status === 'idle' && view.values.length === 0 && view.levelIndex !== 0;
          return (
            <ProductHierarchyLevel
              key={view.level.levelNo}
              levelId={view.level.levelNo}
              title={view.level.levelName}
              mandatory={view.level.mandatory === true}
              nodes={hasNoData ? [] : view.values.map((value) => toNode(value, view.level.levelName))}
              selectedIds={view.selectedIds}
              closeOnSelect={view.level.levelNo === 'l0_name'}
              allSelected={view.allSelected}
              matchingNeedles={view.matchingNeedles}
              exceptMatchingNeedles={view.exceptMatchingNeedles}
              enabled={view.enabled}
              mode={view.level.isMultiSelection === false ? 'radio' : 'checkbox'}
              defaultExpanded={view.levelIndex === 0}
              forceCollapsed={!view.enabled || hasNoData}
              loading={view.status === 'loading'}
              error={view.status === 'failed'}
              disabledHint={
                !view.enabled && view.parentLabel
                  ? t('planning:scope.selectParentFirst', { parent: view.parentLabel })
                  : undefined
              }
              onExpand={() => productScope.onExpand(view.level, view.levelIndex)}
              onRetry={() => productScope.onRetry(view.level, view.levelIndex)}
              onToggle={(id) => productScope.onToggle(view.level, id)}
              onSelectAll={() => productScope.onSelectAll(view.level)}
              onClear={() => productScope.onClear(view.level)}
              onSearch={(query) => productScope.onSearch(view.level, view.levelIndex, query)}
              hasMore={view.hasMore}
              loadingMore={view.loadingMore}
              searching={view.searching}
              onShowMore={() => productScope.onShowMore(view.level, view.levelIndex)}
              showViewToggle
              showSortButton={false}
            />
          );
        })}
      </div>
    );
  }, [productScope, t]);

  return (
    <FilterPanel
      className={styles.panel}
      sx={{ '& .MuiDrawer-paper': { width: 'min(840px, 100vw)', maxWidth: '100vw' } }}
      isOpen={open}
      setIsOpen={(next) => {
        if (!next) onClose();
      }}
      handleClose={onClose}
      title={t('hindsight:items.filters.settingsTitle', 'Filter Settings')}
      anchor="right"
      size="large"
      filters={[
        {
          value: 'product-hierarchy',
          title: t('hindsight:items.filters.hierarchySection', 'Product Hierarchy'),
          children: hierarchyContent,
        },
      ]}
      active="product-hierarchy"
      setActive={() => { /* This drawer contains one product-hierarchy section. */ }}
      primaryButtonLabel={t('hindsight:items.filters.apply', 'Apply')}
      secondaryButtonLabel={t('hindsight:items.filters.cancel', 'Cancel')}
      onPrimaryButtonClick={() => {
        onApply(productScope.scope);
        onClose();
      }}
      onSecondaryButtonClick={onClose}
      alwaysRender
    />
  );
}

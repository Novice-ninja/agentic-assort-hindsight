import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductHierarchyLevel } from '@modules/planning/components/steps/ProductHierarchyLevel';
import type { ProductHierarchyNode, ProductValue } from '@modules/planning/types';
import sections from '@shared/styles/wizardSections.module.css';
import type { ClusterProductScopeResult } from '../hooks/useClusterProductScope';
import scope from './scope.module.css';

export interface ProductHierarchySectionProps {
  productScope: ClusterProductScopeResult;
}

function SkeletonAccordion() {
  return (
    <div className={scope.skeletonAccordion} aria-hidden="true">
      <div className={[scope.skeletonBone, scope.skeletonAccordionTitle].join(' ')} />
      <div className={[scope.skeletonBone, scope.skeletonAccordionPreview].join(' ')} />
      <div className={[scope.skeletonBone, scope.skeletonAccordionChevron].join(' ')} />
    </div>
  );
}

function toNode(value: ProductValue, level: string): ProductHierarchyNode {
  return {
    id: value.value,
    level: level as ProductHierarchyNode['level'],
    label: value.label,
    styleCount: value.styleCount,
    imageUrl: value.imageurl,
  };
}

/**
 * Cascaded product-hierarchy section for the Create Cluster Plan Scope step.
 * Levels and values come from `/filters/config?config_key=cluster_config` +
 * `/filters/values`, rendered with the same `ProductHierarchyLevel` accordion the
 * Create Plan flow uses so both experiences stay identical.
 */
export function ProductHierarchySection({ productScope }: ProductHierarchySectionProps) {
  const { t } = useTranslation(['clustering', 'planning']);
  const legend = t('clustering:scope.product');

  let body: ReactNode;
  if (productScope.levelsStatus === 'loading' || productScope.levelsStatus === 'idle') {
    body = (
      <div
        className={scope.hierarchy}
        data-testid="cluster-scope-hierarchy-loading"
        aria-busy="true"
      >
        <span className="sr-only" role="status">
          {t('clustering:states.loading')}
        </span>
        {Array.from({ length: 3 }, (_, i) => (
          <SkeletonAccordion key={i} />
        ))}
      </div>
    );
  } else if (productScope.levelsStatus === 'failed') {
    body = (
      <p className={scope.hierarchyState} role="alert">
        {t('clustering:states.error')}
      </p>
    );
  } else if (productScope.levels.length === 0) {
    body = (
      <p className={scope.hierarchyState}>
        {t('planning:scope.noHierarchy', 'No product hierarchy available')}
      </p>
    );
  } else {
    body = (
      <div className={scope.hierarchy} data-testid="cluster-scope-product-hierarchy">
        {productScope.levelViews.map((view) => {
          const hasNoData =
            view.status === 'idle' && view.values.length === 0 && view.levelIndex !== 0;
          return (
            <ProductHierarchyLevel
              key={view.level.levelNo}
              levelId={view.level.levelNo}
              title={view.level.levelName}
              mandatory={view.level.mandatory === true}
              nodes={
                hasNoData ? [] : view.values.map((value) => toNode(value, view.level.levelName))
              }
              selectedIds={view.selectedIds}
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
  }

  return (
    <div className={sections.sectionWrapper}>
      <span
        className={[sections.sectionTitle, scope.sectionHeading, sections.required].join(' ')}
      >
        {legend}
      </span>
      {body}
    </div>
  );
}

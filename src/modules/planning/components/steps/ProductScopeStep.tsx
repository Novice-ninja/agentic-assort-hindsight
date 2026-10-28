import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import type { LoadStatus } from '@shared/types';
import {
  appendSelectionOp,
  fetchProductHierarchy,
  fetchProductListValues,
  updateHierarchyScope,
} from '../../store/planningSlice';
import {
  applyClearSelection,
  applyDeselectAll,
  applySelectAllSearch,
  applySelectAllUniverse,
  applyToggleSelection,
  committedExceptSearchNeedles,
  committedSearchNeedles,
  hasMoreFilterValues,
  isHierarchyLevelSelected,
  isRowSelected,
  isUniverseSelectAll,
  lastPageSizeFromLoaded,
  visibleSelectedIds,
} from '../../services/filterHierarchy';
import type {
  HierarchyLevelDef,
  HierarchyScopeEntry,
  PlanDraft,
  ProductHierarchyNode,
  ProductValue,
} from '../../types';
import { ProductHierarchyLevel } from './ProductHierarchyLevel';
import styles from './wizardSteps.module.css';

export interface ProductScopeStepProps {
  draft: PlanDraft;
  update: (patch: Partial<PlanDraft>) => void;
}

function toNode(pv: ProductValue, level: string): ProductHierarchyNode {
  return {
    id: pv.value,
    level: level as ProductHierarchyNode['level'],
    label: pv.label,
    styleCount: pv.styleCount,
    imageUrl: pv.imageurl,
  };
}

function SkeletonAccordion() {
  return (
    <div className={styles.skeletonAccordion} aria-hidden="true">
      <div className={[styles.skeletonBone, styles.skeletonAccordionTitle].join(' ')} />
      <div className={[styles.skeletonBone, styles.skeletonAccordionPreview].join(' ')} />
      <div className={[styles.skeletonBone, styles.skeletonAccordionChevron].join(' ')} />
    </div>
  );
}

/**
 * Product Scope hierarchy — levels and options from `/filters/config` + `/filters/values`
 * (product dimension only). Store/channel fields are intentionally excluded.
 */
export function ProductScopeStep({ draft, update: _update }: ProductScopeStepProps) {
  const { t } = useTranslation('planning');
  const dispatch = useAppDispatch();

  const hierarchyLevels = useAppSelector((s) => s.planning.hierarchyLevels);
  const hierarchyStatus = useAppSelector((s) => s.planning.statuses.hierarchyLevels);
  const productLists = useAppSelector((s) => s.planning.productLists);
  const productListStatuses = useAppSelector((s) => s.planning.productListStatuses);
  const productListSearch = useAppSelector((s) => s.planning.productListSearch);
  const productListTotals = useAppSelector((s) => s.planning.productListTotals);
  const productListNextOffset = useAppSelector((s) => s.planning.productListNextOffset);
  const productListLoadingMore = useAppSelector((s) => s.planning.productListLoadingMore);
  const productListSearching = useAppSelector((s) => s.planning.productListSearching);

  useEffect(() => {
    void dispatch(fetchProductHierarchy());
  }, [dispatch]);

  const getScopeEntry = useCallback(
    (levelNo: string): HierarchyScopeEntry | undefined =>
      draft.hierarchyScope.find((e) => e.levelNo === levelNo),
    [draft.hierarchyScope],
  );

  const buildUpstreamScope = useCallback(
    (currentLevelIndex: number): HierarchyScopeEntry[] =>
      hierarchyLevels.slice(0, currentLevelIndex).map((level) => {
        const entry = getScopeEntry(level.levelNo);
        return {
          levelName: level.levelName,
          levelNo: level.levelNo,
          selectedValues: entry?.selectedValues ?? [],
          selectAll: entry?.selectAll,
          search: entry?.search,
          exceptSearch: entry?.exceptSearch,
          except: entry?.except,
          include: entry?.include,
        };
      }),
    [hierarchyLevels, getScopeEntry],
  );

  const isLevelEnabled = useCallback(
    (levelIndex: number): boolean => {
      if (levelIndex === 0) return true;
      const parentLevel = hierarchyLevels[levelIndex - 1];
      if (!parentLevel) return false;
      return isHierarchyLevelSelected(getScopeEntry(parentLevel.levelNo));
    },
    [hierarchyLevels, getScopeEntry],
  );

  useEffect(() => {
    if (hierarchyLevels.length === 0) return;
    const firstLevel = hierarchyLevels[0];
    const status = productListStatuses[firstLevel.levelNo];
    if (status !== undefined && status !== 'idle') return;
    void dispatch(
      fetchProductListValues({
        attribute: firstLevel,
        hierarchyScope: [],
      }),
    );
  }, [dispatch, hierarchyLevels, productListStatuses]);

  const handleToggle = useCallback(
    (level: HierarchyLevelDef, id: string) => {
      const current: HierarchyScopeEntry = getScopeEntry(level.levelNo) ?? {
        levelName: level.levelName,
        levelNo: level.levelNo,
        selectedValues: [],
      };
      const multiSelect = level.isMultiSelection !== false;
      const label =
        (productLists[level.levelNo] ?? []).find((value) => value.value === id)?.label ?? id;
      const next = applyToggleSelection(current, id, multiSelect, label);
      const isDeselect = isRowSelected(current, id, label);

      dispatch(
        appendSelectionOp({
          levelNo: level.levelNo,
          op: isDeselect ? { unCheckedOptions: [id] } : { checkedOptions: [id] },
        }),
      );
      dispatch(updateHierarchyScope(next));
    },
    [dispatch, getScopeEntry, productLists],
  );

  const handleSelectAll = useCallback(
    (level: HierarchyLevelDef) => {
      const activeSearch = (productListSearch[level.levelNo] ?? '').trim();
      const current: HierarchyScopeEntry = getScopeEntry(level.levelNo) ?? {
        levelName: level.levelName,
        levelNo: level.levelNo,
        selectedValues: [],
      };

      if (activeSearch) {
        dispatch(
          appendSelectionOp({
            levelNo: level.levelNo,
            op: {
              searchHierarchies: {
                [level.levelName]: {
                  type: 'contains',
                  filterType: 'text',
                  filter: activeSearch,
                },
              },
              checkAll: true,
            },
          }),
        );
        dispatch(
          updateHierarchyScope(
            applySelectAllSearch(current, activeSearch, productLists[level.levelNo] ?? []),
          ),
        );
        return;
      }

      dispatch(
        appendSelectionOp({
          levelNo: level.levelNo,
          op: { checkAll: true },
        }),
      );
      dispatch(updateHierarchyScope(applySelectAllUniverse(current)));
    },
    [dispatch, productListSearch, productLists, getScopeEntry],
  );

  const handleClear = useCallback(
    (level: HierarchyLevelDef) => {
      const activeSearch = (productListSearch[level.levelNo] ?? '').trim();
      const current: HierarchyScopeEntry = getScopeEntry(level.levelNo) ?? {
        levelName: level.levelName,
        levelNo: level.levelNo,
        selectedValues: [],
      };
      if (!activeSearch) {
        dispatch(updateHierarchyScope(applyClearSelection(current)));
        return;
      }
      dispatch(
        updateHierarchyScope(
          applyDeselectAll(current, activeSearch, productLists[level.levelNo] ?? []),
        ),
      );
    },
    [dispatch, getScopeEntry, productListSearch, productLists],
  );

  const handleExpand = useCallback(
    (level: HierarchyLevelDef, levelIndex: number) => {
      const status = productListStatuses[level.levelNo];
      if (status === 'succeeded' || status === 'loading') return;
      void dispatch(
        fetchProductListValues({
          attribute: level,
          hierarchyScope: buildUpstreamScope(levelIndex),
        }),
      );
    },
    [dispatch, buildUpstreamScope, productListStatuses],
  );

  const handleRetry = useCallback(
    (level: HierarchyLevelDef, levelIndex: number) => {
      void dispatch(
        fetchProductListValues({
          attribute: level,
          hierarchyScope: buildUpstreamScope(levelIndex),
        }),
      );
    },
    [dispatch, buildUpstreamScope],
  );

  const handleSearch = useCallback(
    (level: HierarchyLevelDef, levelIndex: number, query: string) => {
      if (query === (productListSearch[level.levelNo] ?? '')) return;
      void dispatch(
        fetchProductListValues({
          attribute: level,
          hierarchyScope: buildUpstreamScope(levelIndex),
          search: query || undefined,
          offset: 0,
          mode: 'replace',
        }),
      );
    },
    [dispatch, buildUpstreamScope, productListSearch],
  );

  const handleShowMore = useCallback(
    (level: HierarchyLevelDef, levelIndex: number) => {
      if (productListLoadingMore[level.levelNo]) return;
      const nextOffset = productListNextOffset[level.levelNo] ?? 0;
      void dispatch(
        fetchProductListValues({
          attribute: level,
          hierarchyScope: buildUpstreamScope(levelIndex),
          search: productListSearch[level.levelNo] || undefined,
          offset: nextOffset,
          mode: 'append',
        }),
      );
    },
    [
      dispatch,
      buildUpstreamScope,
      productListNextOffset,
      productListSearch,
      productListLoadingMore,
    ],
  );

  const isLoading = hierarchyStatus === 'loading' || hierarchyStatus === 'idle';

  if (isLoading) {
    return (
      <div className={styles.step} data-testid="create-plan-product-scope">
        <div className={styles.hierarchyWrapper} data-testid="create-plan-hierarchy-loading">
          <p className={styles.hierarchyTitle}>{t('scope.selectProductHierarchy')}</p>
          {Array.from({ length: 3 }, (_, i) => (
            <SkeletonAccordion key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (hierarchyLevels.length === 0) {
    return (
      <div className={styles.step} data-testid="create-plan-product-scope">
        <div className={styles.hierarchyWrapper} data-testid="create-plan-hierarchy-empty">
          <p className={styles.hierarchyTitle}>{t('scope.selectProductHierarchy')}</p>
          <p className={styles.emptyStateText}>
            {t('scope.noHierarchy', 'No product hierarchy available')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.step} data-testid="create-plan-product-scope">
      <div className={styles.hierarchyWrapper} data-testid="create-plan-hierarchy">
        <p className={styles.hierarchyTitle}>{t('scope.selectProductHierarchy')}</p>

        {hierarchyLevels.map((level, levelIndex) => {
          const enabled = isLevelEnabled(levelIndex);
          const scopeEntry = getScopeEntry(level.levelNo);
          const values = productLists[level.levelNo] ?? [];
          const selectedIds = visibleSelectedIds(scopeEntry, values);
          const allSelected =
            isUniverseSelectAll(scopeEntry) && (scopeEntry?.except?.length ?? 0) === 0;
          const matchingNeedles = allSelected ? [] : committedSearchNeedles(scopeEntry);
          const exceptMatchingNeedles = allSelected
            ? []
            : committedExceptSearchNeedles(scopeEntry);
          const levelStatus: LoadStatus =
            productListStatuses[level.levelNo] ?? 'idle';
          const nodes = values.map((v) => toNode(v, level.levelName));
          const multiSelect = level.isMultiSelection !== false;
          const levelLoading = levelStatus === 'loading';
          const levelFailed = levelStatus === 'failed';
          const hasNoData =
            levelStatus === 'idle' && values.length === 0 && levelIndex !== 0;
          const parentLabel =
            levelIndex > 0 ? hierarchyLevels[levelIndex - 1]?.levelName : undefined;

          const total = productListTotals[level.levelNo];
          const levelHasMore = hasMoreFilterValues(
            values.length,
            total,
            lastPageSizeFromLoaded(values.length),
          );
          const levelLoadingMore = productListLoadingMore[level.levelNo] ?? false;
          const levelSearching = productListSearching[level.levelNo] ?? false;

          return (
            <ProductHierarchyLevel
              key={level.levelNo}
              levelId={level.levelNo}
              title={level.levelName}
              mandatory={level.mandatory === true}
              nodes={hasNoData ? [] : nodes}
              selectedIds={selectedIds}
              allSelected={allSelected}
              matchingNeedles={matchingNeedles}
              exceptMatchingNeedles={exceptMatchingNeedles}
              enabled={enabled}
              mode={multiSelect ? 'checkbox' : 'radio'}
              defaultExpanded={levelIndex === 0}
              forceCollapsed={!enabled || hasNoData}
              loading={levelLoading}
              error={levelFailed}
              disabledHint={
                !enabled && parentLabel
                  ? t('scope.selectParentFirst', { parent: parentLabel })
                  : undefined
              }
              onExpand={() => handleExpand(level, levelIndex)}
              onRetry={() => handleRetry(level, levelIndex)}
              onToggle={(id) => handleToggle(level, id)}
              onSelectAll={() => handleSelectAll(level)}
              onClear={() => handleClear(level)}
              onSearch={(query) => handleSearch(level, levelIndex, query)}
              hasMore={levelHasMore}
              loadingMore={levelLoadingMore}
              searching={levelSearching}
              onShowMore={() => handleShowMore(level, levelIndex)}
              showViewToggle={true} //Showing for all levels
              showSortButton={false} // TODO: Enable this once the sort button is implemented
            />
          );
        })}
      </div>
    </div>
  );
}

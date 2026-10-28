import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSetBreadcrumbAction, useSetBreadcrumbs } from '@app/layouts';
import { RECOMMENDATION_FILTER_KEY, useControlFilter } from '@modules/appConfig';
import {
  ByAttributePanel,
  ByItemFilterPanel,
  ByItemPanel,
  EmptySelection,
  HindsightFilterStrip,
  OverviewPanel,
  hierarchyScopeFromFilterStrip,
  toRecommendationFilter,
  useAttributeColumnConfig,
  useAttributeTable,
  useByItemSummary,
  useByItemTable,
  useByItemVisualView,
  useHindsight,
  usePlanContext,
  usePlanFilterStrip,
  useProductContribution,
  useProductPerformanceKpis,
} from '@modules/hindsight';
import type { HindsightTab } from '@modules/hindsight/types';
import type { HierarchyScopeEntry } from '@modules/planning/types';
import { ImpactTabs as Tabs, Button } from '@shared/components/vendor/impact-ui';
import styles from './HindsightPage.module.css';
import { applyFlooringScope, useFlooringScope } from '@modules/hindsight/priority/flooringScope';
import { useAIChat } from '@shared/context';
import { selectFlooringItems } from '@mocks/flooringDemo';

const HINDSIGHT_TABS: HindsightTab[] = ['overview', 'byItem', 'byAttribute'];

/**
 * The Hindsight page.
 *
 * The filter bar and the tab strip stay mounted across tab changes, so switching views never
 * loses the planner's selection or refetches what is already loaded. Only the active panel's
 * data is requested — the item collection is not fetched until the By Item tab is opened.
 */
export function HindsightPage() {
  const { t } = useTranslation(['common', 'planning', 'hindsight']);
  const { planCode, referenceSeasonCode, planSeasonCode } = usePlanContext();

  useSetBreadcrumbs([
    {
      type: 'home',
      label: t('common:breadcrumb.home'),
      onClick: () => {
        window.location.href = window.location.origin + '/home';
      },
    },
    { type: 'plan', label: 'Hindsight' },
  ]);

  const tabNames = HINDSIGHT_TABS.map((tab) => ({
    label: t(`hindsight:tabs.${tab}`),
    value: tab,
  }));

  // Impact UI Tabs maps over `tabPanels`; the panels are rendered below, so these stay empty.
  const tabPanels = HINDSIGHT_TABS.map(() => null);

  const [allFiltersOpen, setAllFiltersOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const setBreadcrumbAction = useSetBreadcrumbAction();

  const hindsight = useHindsight();

  const {
    activeTab,
    tenant,
    preferences,
    overview,
    activeAttributeId,
    itemSearch,
    statuses,
    changeTab,
    search,
    retryOverview,
  } = hindsight;

  // The reference season now arrives in location.state from the plan card; no kpi-seasons
  // round trip is needed. Cast to the type the hooks expect (number | null).
  const seasonCode = referenceSeasonCode ?? null;
  const isAttributeView = activeTab === 'byAttribute';

  const productPerformance = useProductPerformanceKpis({
    planCode,
    seasonCode,
    enabled: activeTab === 'overview',
  });

  const recommendationFilter = useControlFilter(
    { module: 'hindsight', view: 'byItem', component: 'itemCardGrid' },
    RECOMMENDATION_FILTER_KEY,
  );
  const recommendation = toRecommendationFilter(recommendationFilter.selected);

  const attrRecommendationFilter = useControlFilter(
    { module: 'hindsight', view: 'byAttribute', component: 'attributeBreakdownTable' },
    RECOMMENDATION_FILTER_KEY,
  );
  const attrRecommendation = toRecommendationFilter(attrRecommendationFilter.selected);

  const filterStrip = usePlanFilterStrip(planCode);
  const filterCount = filterStrip.groups.length;

  // One applied hierarchy population drives Overview, By Item and Sales Mix together.
  const { scope: tableHierarchyScope } = useFlooringScope(planCode);
  const {registerOpenChatInterceptor} = useAIChat();
  const irisScopeKey=JSON.stringify({activeTab,planCode,season:filterStrip.planSeasonName,hierarchyScope:tableHierarchyScope});
  useEffect(()=>{
    registerOpenChatInterceptor(context=>{
      if(context?.source==='header'){
        const view={overview:'Overview',byItem:'By Item',byAttribute:'Sales Mix',watchlist:'Watchlist'}[activeTab];
        const scopedItems=selectFlooringItems({hierarchyScope:tableHierarchyScope});
        const categories=new Set(scopedItems.map(item=>item.l1_name)).size;
        const subcategories=new Set(scopedItems.map(item=>item.l2_name)).size;
        context.meta={...context.meta,hindsightScope:{view,planCode,season:filterStrip.planSeasonName,hierarchyScope:tableHierarchyScope},hindsightContextLabel:`${view} · ${filterStrip.planSeasonName??'SS26'} · Flooring · ${categories} categories · ${subcategories} subcategories`};
      }
      return false;
    });
    return()=>registerOpenChatInterceptor(null);
  },[irisScopeKey,registerOpenChatInterceptor]);
  const setTableHierarchyScope = (scope: HierarchyScopeEntry[]) => applyFlooringScope(scope,planCode);
  const tableFiltersReady = true;

  const byItemSummary = useByItemSummary({
    planCode,
    seasonCode,
    enabled: activeTab === 'byItem',
  });
  const byItemVisual = useByItemVisualView({
    planCode,
    seasonCode,
    planSeasonCode: planSeasonCode ?? null,
    recommendation,
    enabled: activeTab === 'byItem',
  });
  const byItemTable = useByItemTable({
    planCode,
    seasonCode,
    recommendation,
    planSeasonCode: planSeasonCode ?? null,
    hierarchyScope: tableHierarchyScope ?? [],
    enabled: activeTab === 'byItem' && tableFiltersReady,
  });

  const contribution = useProductContribution({
    planCode,
    seasonCode,
    enabled: activeTab === 'overview',
  });

  const attributeColumnConfig = useAttributeColumnConfig({
    planCode,
    seasonCode,
    enabled: isAttributeView,
  });

  const attributeId = activeAttributeId ?? tenant?.attributeCatalogue[0]?.id ?? null;
  const attributeTable = useAttributeTable({
    planCode,
    attributeId,
    seasonCode,
    recommendation: attrRecommendation,
    enabled: isAttributeView,
    columnConfigGroups: attributeColumnConfig.groups,
  });

  useEffect(() => {
    setBreadcrumbAction(
      <Button
        variant="tertiary"
        size="large"
        onClick={() => setFiltersVisible((prev) => !prev)}
        aria-pressed={filtersVisible}
        data-testid="hindsight-toggle-filters"
      >
        {filtersVisible
          ? `${t('common:actions.hideFilters')} (${filterCount})`
          : `${t('common:actions.showFilters')} (${filterCount})`}
      </Button>,
    );
    return () => setBreadcrumbAction(null);
  }, [filtersVisible, filterCount, setBreadcrumbAction, t]);

  return (
    <div className={styles.page} data-testid="hindsight-page">
      {filtersVisible && (
        <div
          className={styles.filtersStripWrapper}
          data-testid="hindsight-filters-wrapper"
        >
          <HindsightFilterStrip
            groups={filterStrip.groups}
            status={filterStrip.status}
            planSeasonName={filterStrip.planSeasonName}
            onAllFiltersClick={() => setAllFiltersOpen(true)}
          />
        </div>
      )}

      <ByItemFilterPanel
        open={allFiltersOpen}
        onClose={() => setAllFiltersOpen(false)}
        appliedScope={tableHierarchyScope ?? []}
        onApply={setTableHierarchyScope}
      />

      <nav
        className={styles.tabNavigation}
        aria-label="Tab navigation"
        data-testid="hindsight-tab-navigation"
      >
        <Tabs
          tabNames={tabNames}
          tabPanels={tabPanels}
          value={activeTab}
          isBlueBg={false}
          onChange={(_event, next) => changeTab(next as HindsightTab)}
          data-testid="hindsight-tabs"
        />
      </nav>

      <div
        className={styles.panel}
        id={`hindsight-panel-${activeTab}`}
        role="tabpanel"
        aria-label={t(`hindsight:tabs.${activeTab}`)}
        tabIndex={0}
        data-testid={`hindsight-panel-${activeTab}`}
      >
        {activeTab === 'overview' ? (
          <OverviewPanel
            overview={overview}
            status={statuses.overview}
            preferences={preferences}
            onRetry={retryOverview}
            productPerformanceKpis={productPerformance.kpis}
            productPerformanceStatus={productPerformance.status}
            onRetryKpis={productPerformance.retry}
            contributions={contribution.contributions}
            contributionTitles={contribution.titles}
            contributionStatus={contribution.status}
            onRetryContributions={contribution.retry}
            planCode={planCode}
            seasonCode={seasonCode}
          />
        ) : activeTab === 'byItem' ? (
          <ByItemPanel
            planCode={planCode}
            seasonCode={seasonCode}
            preferences={preferences}
            status={byItemVisual.status}
            search={itemSearch}
            onSearch={search}
            onRetry={byItemVisual.retry}
            summary={byItemSummary.summary}
            summaryStatus={byItemSummary.status}
            onRetrySummary={byItemSummary.retry}
            visualItems={byItemVisual.items}
            tableRows={byItemTable.rows}
            cachedTableRows={byItemTable.cachedRows}
            tableStatus={byItemTable.status}
            tablePageStatus={byItemTable.pageStatus}
            tableHasMore={byItemTable.hasMore}
            onLoadMoreTable={byItemTable.loadMore}
            onRetryTable={byItemTable.retry}
            recommendationFilter={recommendationFilter}
            visualHasMore={byItemVisual.hasMore}
            visualPageStatus={byItemVisual.pageStatus}
            onLoadMoreVisual={byItemVisual.loadMore}
            onRetryVisualPage={byItemVisual.retryPage}
            tableHierarchyScope={tableHierarchyScope ?? []}
            onTableHierarchyScopeChange={setTableHierarchyScope}
          />
        ) : activeTab === 'byAttribute' ? (
          <ByAttributePanel
            attributes={tenant?.attributeCatalogue ?? []}
            activeAttributeId={activeAttributeId}
            planCode={planCode}
            seasonCode={seasonCode}
            tableRows={attributeTable.rows}
            tableStatus={attributeTable.status}
            onRetryTable={attributeTable.retry}
            columnConfigGroups={attributeColumnConfig.groups}
            recommendationFilter={attrRecommendationFilter}
          />
        ) : (
          <EmptySelection />
        )}
      </div>
    </div>
  );
}

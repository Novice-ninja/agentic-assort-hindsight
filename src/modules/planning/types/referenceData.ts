export type FiscalYearTag = 'complete' | 'current' | 'future';

export type ClusteringTag = 'recommended' | 'alternative' | 'experimental';

export type HierarchyLevel = 'department' | 'class' | 'subClass' | 'sku';

export interface FiscalYear {
  id: string;
  label: string;
  tag: FiscalYearTag;
  seasons: string[];
}

export interface ProductHierarchyNode {
  id: string;
  level: HierarchyLevel;
  label: string;
  parentId?: string;
  /** Shown as “N Styles” only when the values API supplies it. */
  styleCount?: number;
  skuCode?: string;
  productType?: string;
  /** Product thumbnail URL. When undefined the UI renders a grey placeholder. */
  imageUrl?: string;
}

export interface ProductScopeSelection {
  departmentId: string | null;
  classIds: string[];
  subClassIds: string[];
  skuIds: string[];
}

export type SegmentBadgeColor = 'default' | 'success' | 'warning' | 'error';

export interface SegmentBadge {
  label: string;
  color?: SegmentBadgeColor;
}

export interface ClusteringScenario {
  id: string;
  name: string;
  confidencePct: number;
  tag: ClusteringTag;
  description: string;
  segmentBreakdown: string;
  /** Structured segment badges for the card UI. */
  segments?: SegmentBadge[];
  /** Icon image URL (local import path). */
  iconUrl?: string;
  /** Background color for the icon container. */
  iconBg?: string;
  /** Text color for the confidence percentage label. */
  confidenceColor?: string;
}

export interface PipelineStagePreview {
  order: number;
  label: string;
  scenarioName: string;
  confidencePct: number;
}

export interface PlanningReferenceData {
  fiscalYears: FiscalYear[];
  taxonomy: ProductHierarchyNode[];
  clusteringScenarios: ClusteringScenario[];
}

/** A single trading season returned by the `/plans/seasons` API. */
export interface SeasonInfo {
  seasonCode: number;
  name: string;
  seasonType: string;
  seasonStatus: boolean;
  seasonStartDate: string;
  seasonEndDate: string;
  seasonDisplayName: string;
}

/** One fiscal year with its nested trading seasons. */
export interface SeasonYear {
  year: number;
  seasons: SeasonInfo[];
}

export const EMPTY_SCOPE: ProductScopeSelection = {
  departmentId: null,
  classIds: [],
  subClassIds: [],
  skuIds: [],
};

/** A hierarchy level definition from filter config (product dimension). */
export interface HierarchyLevelDef {
  levelName: string;
  levelNo: string;
  /** Rendering order; lower values appear first. */
  order?: number;
  /** When false the level is single-select (radio); defaults to true (checkbox). */
  isMultiSelection?: boolean;
  /** When true, Product Scope Next is blocked until this level has a selection. */
  mandatory?: boolean;
}

/** A single selectable product value within a hierarchy level. */
export interface ProductValue {
  label: string;
  value: string;
  /** Optional — cards omit the Styles subtitle when absent. */
  styleCount?: number;
  imageurl?: string;
  /** Internal lineage (`____`-delimited). Not shown in the UI. */
  path?: string;
}

/** Response shape from the get-product-list API. */
export interface ProductListResponse {
  levelName: string;
  levelNo: string;
  values: ProductValue[];
}

/** Request body for fetching product values at a specific hierarchy level. */
export interface ProductListRequest {
  attribute: HierarchyLevelDef;
  hierarchyScope: HierarchyScopeEntry[];
}

/** Text-match filter descriptor for a single hierarchy attribute. */
export interface SearchFilter {
  type: 'contains';
  filterType: 'text';
  filter: string;
}

/**
 * A single operation in the selection journal.
 * The backend replays the ordered array to reconstruct user intent.
 */
export type SelectionOperation =
  | { checkAll: true }
  | { searchHierarchies: Record<string, SearchFilter>; checkAll: true }
  | { checkedOptions: string[] }
  | { unCheckedOptions: string[] };

/** One entry in the wizard draft hierarchyScope (may include Select All flags). */
export interface HierarchyScopeEntry {
  levelName: string;
  levelNo: string;
  selectedValues: string[];
  /**
   * True when the user chose Select All for this level under the current parent.
   * Empty `search` = whole parent universe (minus `exceptSearch`); non-empty = bulk-select needles (OR).
   */
  selectAll?: boolean;
  /** Committed Select All search needles (OR contains). Only with `selectAll`. */
  search?: string[];
  /**
   * Bulk-unselect needles (OR contains). Matches are removed from the Select All set.
   * Mutually exclusive with `search` — a term is never in both. Only with `selectAll`.
   */
  exceptSearch?: string[];
  /** Unchecked ids from the Select All matching set. */
  except?: string[];
  /** Extra ids outside the Select All matching set, or re-admitted after `exceptSearch`. */
  include?: string[];
  /** Ordered operation journal for backend replay (Check Configuration payload). */
  selectionConfig?: SelectionOperation[];
}

/** Create-plan wire: explicit ids vs Select All. Mutually exclusive, same as `/filters/values`. */
export interface CreatePlanExplicitScopeEntry {
  levelName: string;
  levelNo: string;
  selectedValues: string[];
}

export interface CreatePlanSelectAllScopeEntry {
  levelName: string;
  levelNo: string;
  select_all: true;
  search?: string[];
  except_search?: string[];
  except?: string[];
  include?: string[];
}

export type CreatePlanScopeEntry =
  | CreatePlanExplicitScopeEntry
  | CreatePlanSelectAllScopeEntry;

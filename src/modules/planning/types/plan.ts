import type { HierarchyScopeEntry } from './referenceData';

export type PlanStatus = 'draft' | 'inProgress' | 'review' | 'approved';

/** Tab keys for the All Plans listing (status tabs + the "all" aggregate). */
export type PlanTabKey = 'all' | PlanStatus;

export type PlanViewMode = 'grid' | 'table';

export type StartingPoint = 'startFresh' | 'carryForwardLY';

export type RunMode = 'gated' | 'autonomous';

/** A single metric entry as returned by the API. */
export interface PlanMetric {
  key: string;
  value: number;
}

export interface PlanTags {
  /** Decoded `planSeasonName` from the list API. */
  season: string;
  /** Category values from hierarchyScope (`l0_name` for now). */
  categories: string[];
  /** Cluster grouping label; absent from the list API — table shows "—" until it arrives. */
  cluster?: string;
}

/** The fixed 10 pipeline stages. Index is 0-based. */
export const PIPELINE_STEPS = [
  'Location Clustering',
  'Hindsight Analysis',
  'Demand Forecast',
  'Strategy & Scenarios',
  'Placeholder Creation',
  'Shopping List',
  'Line Planning',
  'Buy Planning',
  'MFP Reconciliation',
  'Final Approval',
] as const;

export const PIPELINE_TOTAL_STEPS = PIPELINE_STEPS.length;

export interface Plan {
  id: string;
  name: string;
  status: PlanStatus;
  /** Soft-deleted plans returned when the list is fetched with `is_deleted=true`. */
  isDeleted: boolean;
  fiscalYearId: string;
  season: string;
  /** Numeric season code from the backend, used to key downstream analytics requests. */
  seasonCode?: number;
  /** Analytics season the Hindsight APIs key on (distinct from `seasonCode`, the plan's own planning season sent as `palaSeasonCode`). */
  referenceSeasonCode?: number;
  startingPoint: StartingPoint;
  scope: {
    departmentId: string | null;
    classIds: string[];
    subClassIds: string[];
    skuIds: string[];
  };
  /**
   * The plan's product-hierarchy selections exactly as the backend stores them, one entry per
   * level. `scope` above is a lossy projection of this that keeps only department and category,
   * so anything needing the full scope — the Hindsight filter strip — must read this instead.
   */
  hierarchyScope: HierarchyScopeEntry[];
  clusteringScenarioId: string | null;
  runMode: RunMode;
  confidenceThreshold: number;
  pipelineMode: string;
  /**
   * 1-based index of the current active step (1–10).
   * Will come from API `currentStatus` in the future; defaults to 1.
   */
  currentStep: number;
  /** Dynamic metrics array from API: each entry has a `key` label and numeric `value`. */
  metrics: PlanMetric[];
  tags: PlanTags;
  /** Email / id of the user who created the plan (from list API `createdBy`). */
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const PLAN_STATUS_ORDER: PlanStatus[] = ['draft', 'inProgress', 'review', 'approved'];

export type ModuleKey = 'products' | 'locations' | 'calendar' | 'exceptions';

export type ModuleStatus = 'active' | 'done' | 'inProgress';

export type ViewMode = 'table' | 'globe';

export interface AdminFilterContext {
  departments: string[];
  seasons: string[];
  regions: string[];
  productGroupId?: string;
  subDepartmentId?: string;
  categoryId?: string;
  subCategoryId?: string;
  classId?: string;
  subClassId?: string;
  brandId?: string;
  channelRegionIds?: string[];
  customerTypeIds?: string[];
  fulfillmentScopeIds?: string[];
  calendarSeasonId?: string;
  periodIds?: string[];
}

export interface ModuleStatusSummary {
  module: ModuleKey;
  status: ModuleStatus;
}

export interface FilterFacetOption {
  id: string;
  labelKey: string;
  facet: string;
  parentId?: string;
}

export interface GlobeMarker {
  id: string;
  lat: number;
  lon: number;
  label: string;
  category?: string;
  selected?: boolean;
}

export const EMPTY_FILTER_CONTEXT: AdminFilterContext = {
  departments: [],
  seasons: [],
  regions: [],
};

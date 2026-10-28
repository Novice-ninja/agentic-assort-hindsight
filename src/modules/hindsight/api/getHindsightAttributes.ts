import { apiClient } from '@shared/services';
import { selectionQuery } from './selectionQuery';
import type { AttributeView, Cluster, GlobalSelection } from '../types';

export interface HindsightAttributeResponse extends AttributeView {
  clusters: Cluster[];
}

export interface AttributeParams {
  selection: GlobalSelection;
  attributeId: string;
  metricId: string;
  thresholdPercent?: number;
}

export function getHindsightAttribute({
  selection,
  attributeId,
  metricId,
  thresholdPercent,
}: AttributeParams): Promise<HindsightAttributeResponse> {
  return apiClient.get<HindsightAttributeResponse>(
    `/hindsight/attributes/${attributeId}`,
    selectionQuery(selection, {
      metricId,
      ...(thresholdPercent === undefined ? {} : { thresholdPercent: String(thresholdPercent) }),
    }),
  );
}

import { mapMetricConfigs } from '../services/metricConfigMappers';
import { FALLBACK_METRIC_CONFIG_DTOS } from './metricConfig';

export { FALLBACK_GLOBAL_CONFIG } from './globalConfig';
export { FALLBACK_METRIC_CONFIG_DTOS } from './metricConfig';

/** The fallback catalogue indexed for lookup, mapped once at load rather than per read. */
export const FALLBACK_METRIC_CONFIGS = mapMetricConfigs(FALLBACK_METRIC_CONFIG_DTOS);

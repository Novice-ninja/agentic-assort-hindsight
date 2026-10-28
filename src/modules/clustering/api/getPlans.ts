import { env } from '@config/env';
import { apiClient } from '@shared/services';
import { clusteringClient } from './mockClient';
import type { ClusterPlan, ClusterPlanAttribute, ClusterPlanStatus, ClusterPlanTabKey } from '../types';
import { resolveClusterPlanLanding } from '../services/resolveClusterPlanLanding';

/** One named attribute on a cluster plan. `attributeValue` shape depends on the name. */
export interface ClusterPlanAttributeDto {
  attributeName: string;
  attributeValue: unknown;
}

/** Identity fields for one list row, including cluster count. */
export interface ClusterPlanObjectDto {
  clusterPlanCode: string;
  clusterPlanName: string;
  description?: string;
  isDeleted?: boolean;
  status?: string;
  statusDisplayName?: string | null;
  createdBy?: string | number | null;
  createdAt?: string | null;
  substatus?: string | null;
  clusterCount?: number | string | null;
}

/** One row from GET /v1/clustering/plans. */
export interface ClusterPlanListItemDto {
  attributes: ClusterPlanAttributeDto[] | null;
  clusterPlan: ClusterPlanObjectDto;
}

export interface PlansResponse {
  plans: ClusterPlan[];
  counts: Record<ClusterPlanTabKey, number>;
}

export interface NameCheckResponse {
  taken: boolean;
  plans: ClusterPlan[];
}

/** Real backend endpoint for listing cluster plans. */
export const CLUSTER_PLANS_ENDPOINT = `${env.goApiBaseUrl}/v1/clustering/plans`;

const STATUS_MAP: Record<string, ClusterPlanStatus> = {
  DRAFT: 'draft',
  USER_INPUT_NEEDED: 'inputNeeded',
  INPUT_NEEDED: 'inputNeeded',
  AWAITING_APPROVAL: 'awaitingApproval',
  APPROVED: 'approved',
  FINALISED: 'approved',
  FINALIZED: 'approved',
};

function mapStatus(raw: string | undefined): ClusterPlanStatus {
  const key = (raw ?? '').trim().toUpperCase().replace(/[\s-]+/g, '_');
  return STATUS_MAP[key] ?? 'draft';
}

function optionalString(value: unknown): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** `2026-09-30 13:57:06` is not a reliable `Date` input until the space is a `T`. */
function optionalDate(value: unknown): string | null {
  const text = optionalString(value);
  if (text === null) return null;
  const normalized = text.includes('T') ? text : text.replace(' ', 'T');
  return Number.isNaN(new Date(normalized).getTime()) ? null : normalized;
}

function optionalCount(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

const CHANNEL_CODE_ATTRIBUTE = 'channel_code';

function attributeByName(
  attributes: ClusterPlanAttributeDto[] | null | undefined,
  name: string,
): ClusterPlanAttributeDto | undefined {
  if (!Array.isArray(attributes)) return undefined;
  return attributes.find((item) => item?.attributeName === name);
}

/** One code stays as-is. Several codes are joined with a comma and a space. */
function channelFromAttributes(
  attributes: ClusterPlanAttributeDto[] | null | undefined,
): string | null {
  const match = attributeByName(attributes, CHANNEL_CODE_ATTRIBUTE);
  if (match === undefined) return null;
  const raw = Array.isArray(match.attributeValue) ? match.attributeValue : [match.attributeValue];
  const codes = raw
    .map((value) => optionalString(value))
    .filter((value): value is string => value !== null);
  return codes.length > 0 ? codes.join(', ') : null;
}

/** Map a backend list item onto the UI model. Exported for testing. */
export function mapClusterPlan(dto: ClusterPlanListItemDto): ClusterPlan {
  const plan = dto.clusterPlan;
  const status = mapStatus(plan?.status);
  const substatus = optionalString(plan?.substatus);
  const attributes: ClusterPlanAttribute[] | null = Array.isArray(dto.attributes)
    ? dto.attributes
    : null;
  const landing = resolveClusterPlanLanding(null, substatus);
  return {
    id: plan?.clusterPlanCode ?? '',
    name: plan?.clusterPlanName ?? '',
    productId: null,
    seasonId: null,
    channelId: null,
    countryIds: [],
    status,
    statusDisplayName: optionalString(plan?.statusDisplayName),
    substatus,
    attributes,
    currentStep: landing?.step ?? 'reviewRun',
    clusterCount: optionalCount(plan?.clusterCount),
    channelDisplay: channelFromAttributes(dto.attributes),
    channelLabelKey: null,
    createdBy: optionalString(plan?.createdBy),
    createdOn: optionalDate(plan?.createdAt),
    locked: status === 'approved',
  };
}

export function computeCounts(plans: ClusterPlan[]): Record<ClusterPlanTabKey, number> {
  return {
    all: plans.length,
    awaitingApproval: plans.filter((plan) => plan.status === 'awaitingApproval').length,
    inputNeeded: plans.filter((plan) => plan.status === 'inputNeeded').length,
    approved: plans.filter((plan) => plan.status === 'approved').length,
  };
}

export async function getPlans(): Promise<PlansResponse> {
  const response = await apiClient.get<ClusterPlanListItemDto[]>(CLUSTER_PLANS_ENDPOINT);
  if (!Array.isArray(response)) {
    throw new Error('Unexpected clustering plans response');
  }
  const plans = response
    .filter((row) => row.clusterPlan?.isDeleted !== true)
    .map(mapClusterPlan);
  return { plans, counts: computeCounts(plans) };
}

export function checkPlanName(name: string, excludePlanId?: string): Promise<NameCheckResponse> {
  return clusteringClient.get<NameCheckResponse>('/clustering/plans', {
    name,
    ...(excludePlanId ? { excludeId: excludePlanId } : {}),
  });
}

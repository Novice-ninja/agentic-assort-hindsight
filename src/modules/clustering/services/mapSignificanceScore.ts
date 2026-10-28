import type {
  AttributeSignificanceScore,
  SignificanceScoreBucket,
  SignificanceScoreRow,
} from '../api/significanceScore';
import type { AttributeCategory, ClusteringAttribute } from '../types';

function pickName(row: SignificanceScoreRow): string | null {
  const name = row.attributeName ?? row.attribute_name;
  if (typeof name !== 'string') return null;
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function pickScore(row: SignificanceScoreRow): number | null {
  return typeof row.score === 'number' && Number.isFinite(row.score) ? row.score : null;
}

function toCamel(name: string): string {
  return name.replace(/_([a-z0-9])/gi, (_, char: string) => char.toUpperCase());
}

export function humanizeAttributeName(name: string): string {
  return name
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function mapRow(
  row: SignificanceScoreRow,
  category: AttributeCategory,
  selected: boolean,
): ClusteringAttribute | null {
  const name = pickName(row);
  if (!name) return null;
  const reason =
    !selected && typeof row.exclusionReason === 'string' && row.exclusionReason.trim().length > 0
      ? row.exclusionReason.trim()
      : undefined;
  return {
    id: name,
    category,
    labelKey: `attributes.${toCamel(name)}`,
    label: humanizeAttributeName(name),
    significance: pickScore(row),
    autoSelected: selected,
    noData: false,
    userSelected: selected,
    exclusionReason: reason,
  };
}

function mapBucket(
  bucket: SignificanceScoreBucket,
  category: AttributeCategory,
): ClusteringAttribute[] {
  const recommended = (bucket.recommended ?? [])
    .map((row) => mapRow(row, category, true))
    .filter((row): row is ClusteringAttribute => row !== null);
  const excluded = (bucket.excluded ?? [])
    .map((row) => mapRow(row, category, false))
    .filter((row): row is ClusteringAttribute => row !== null);
  return [...recommended, ...excluded];
}

/** Flattens the POST body into the Review checkbox rows. Recommended first, then excluded. */
export function mapSignificanceScore(data: AttributeSignificanceScore): ClusteringAttribute[] {
  const buckets: Array<[AttributeCategory, SignificanceScoreBucket]> = [
    ['performance', data.performanceAttributes],
    ['product', data.productAttributes],
    ['store', data.storeAttributes],
  ];
  return buckets.flatMap(([category, bucket]) => mapBucket(bucket, category));
}

import type { CellValue, ColumnAggregator, ColumnDataType } from '../MatrixGrid.types';

/**
 * Aggregation over descendant leaves. Pure, vendor-free, and unit-tested beside this file.
 *
 * The return value carries a `count` as well as a `value` on purpose. At the second level of a
 * tree the inputs are the first level's results, so averaging them directly would be an average of
 * averages; feeding the child count back in as a weight is what keeps a deep tree's mean correct.
 *
 * `null` is a real answer, not a failure: it means "no defensible number", which the grid renders
 * as an em dash. A zero would be a claim about the data (constitution IX).
 */

export interface AggregateInput {
  value: CellValue;
  dataType: ColumnDataType;
  /** Explicit weight, or the child count when the input is itself an aggregate. */
  weight?: number;
}

export interface AggregateResult {
  value: number;
  count: number;
}

interface NumericInput {
  value: number;
  weight: number;
}

function toNumeric(inputs: AggregateInput[]): NumericInput[] | null {
  const numeric: NumericInput[] = [];
  let dataType: ColumnDataType | null = null;

  for (const input of inputs) {
    if (input.value === null || input.value === undefined || input.value === '') continue;
    // Mixed types cannot be summed or averaged into anything meaningful.
    if (dataType !== null && input.dataType !== dataType) return null;
    dataType = input.dataType;

    const value = typeof input.value === 'number' ? input.value : Number(input.value);
    if (!Number.isFinite(value)) continue;
    numeric.push({ value, weight: input.weight ?? 1 });
  }

  return numeric;
}

export function aggregate(
  kind: ColumnAggregator,
  inputs: AggregateInput[],
): AggregateResult | null {
  if (kind === 'none') return null;

  const numeric = toNumeric(inputs);
  if (numeric === null || numeric.length === 0) return null;

  const count = numeric.reduce((total, input) => total + input.weight, 0);

  switch (kind) {
    case 'sum':
      return { value: numeric.reduce((total, input) => total + input.value, 0), count };

    case 'count':
      return { value: count, count };

    case 'min':
      return { value: Math.min(...numeric.map((input) => input.value)), count };

    case 'max':
      return { value: Math.max(...numeric.map((input) => input.value)), count };

    case 'average':
    case 'weightedAverage': {
      const totalWeight = numeric.reduce((total, input) => total + input.weight, 0);
      if (totalWeight === 0) return null;
      const weighted = numeric.reduce((total, input) => total + input.value * input.weight, 0);
      return { value: weighted / totalWeight, count: totalWeight };
    }

    default:
      return null;
  }
}

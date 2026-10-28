import {
  isColumnGroup,
  type ColumnAggregator,
  type ColumnAlign,
  type ColumnBadge,
  type ColumnDataType,
  type ColumnFormat,
  type ColumnPair,
  type ColumnSchemaNode,
  type ColumnValidator,
  type ColumnVariant,
  type LeafColumnDef,
  type MatrixGridLabels,
  type PivotConfig,
} from '../MatrixGrid.types';

/**
 * Schema-to-column transformation. Pure and vendor-free: it returns our own `BuiltColumns` shape
 * and the adapter is what turns that into AG Grid `ColDef`s. Keeping the transformation on this
 * side of the boundary is what makes column behaviour testable without a grid (constitution,
 * Shared Generic Data Grid).
 */

export type PivotRole = 'rowDimension' | 'columnDimension' | 'measure';

export interface BuiltLeafColumn {
  kind: 'leaf';
  id: string;
  field: string;
  headerName: string;
  dataType: ColumnDataType;
  editable: boolean;
  align: ColumnAlign;
  aggregator: ColumnAggregator;
  width?: number;
  flex?: number;
  minWidth?: number;
  pinned?: 'left' | 'right' | null;
  weightField?: string;
  variant?: ColumnVariant;
  pairId?: string;
  badge?: ColumnBadge;
  validate?: ColumnValidator;
  headerTooltip?: string;
  formatMask?: ColumnFormat;
  pivotRole?: PivotRole;
}

export interface BuiltColumnGroup {
  kind: 'group';
  id: string;
  headerName: string;
  pinned?: 'left' | 'right' | null;
  children: BuiltColumn[];
}

export type BuiltColumn = BuiltColumnGroup | BuiltLeafColumn;

export interface BuiltColumns {
  columns: BuiltColumn[];
  /** Every addressable column, in visual order. */
  leaves: BuiltLeafColumn[];
  /** Resolved read-only/editable pairs, keyed by `pairId`. */
  pairs: ColumnPair[];
  /** Header depth, so the adapter can let header height recalculate when it changes. */
  depth: number;
}

export type SchemaErrorCode =
  | 'duplicateId'
  | 'variantWithoutPair'
  | 'incompletePair'
  | 'editableBaseline'
  | 'missingWeightField'
  | 'emptyGroup'
  | 'unknownPivotColumn';

export interface SchemaError {
  code: SchemaErrorCode;
  message: string;
  nodeId?: string;
}

export class SchemaValidationError extends Error {
  readonly errors: SchemaError[];

  constructor(errors: SchemaError[]) {
    super(`MatrixGrid column schema is invalid:\n- ${errors.map((e) => e.message).join('\n- ')}`);
    this.name = 'SchemaValidationError';
    this.errors = errors;
  }
}

export interface BuildColumnsContext {
  locale: string;
  labels: MatrixGridLabels;
  pivotConfig?: PivotConfig;
}

const QUANTITATIVE: ColumnDataType[] = ['number', 'percent', 'currency'];

function defaultAlign(dataType: ColumnDataType): ColumnAlign {
  return QUANTITATIVE.includes(dataType) ? 'end' : 'start';
}

function collectLeaves(nodes: ColumnSchemaNode[], into: LeafColumnDef[] = []): LeafColumnDef[] {
  nodes.forEach((node) => {
    if (isColumnGroup(node)) collectLeaves(node.children, into);
    else into.push(node);
  });
  return into;
}

/**
 * A schema error is a developer error, so it is reported in full rather than partially applied.
 * An empty schema is NOT an error — it renders the empty state (brief edge case).
 */
export function validateSchema(schema: ColumnSchemaNode[]): SchemaError[] {
  const errors: SchemaError[] = [];
  const seen = new Set<string>();

  const walk = (nodes: ColumnSchemaNode[]) => {
    nodes.forEach((node) => {
      if (seen.has(node.id)) {
        errors.push({
          code: 'duplicateId',
          nodeId: node.id,
          message: `Duplicate column id "${node.id}".`,
        });
      }
      seen.add(node.id);

      if (isColumnGroup(node)) {
        if (node.children.length === 0) {
          errors.push({
            code: 'emptyGroup',
            nodeId: node.id,
            message: `Column group "${node.id}" has no children.`,
          });
        }
        walk(node.children);
        return;
      }

      if (node.variant !== undefined && (node.pairId === undefined || node.pairId === '')) {
        errors.push({
          code: 'variantWithoutPair',
          nodeId: node.id,
          message: `Column "${node.id}" sets variant "${node.variant}" without a pairId.`,
        });
      }

      if (node.variant === 'baseline' && node.editable === true) {
        errors.push({
          code: 'editableBaseline',
          nodeId: node.id,
          message: `Column "${node.id}" is a baseline variant, so it cannot be editable.`,
        });
      }

      if (node.aggregator === 'weightedAverage' && !node.weightField) {
        errors.push({
          code: 'missingWeightField',
          nodeId: node.id,
          message: `Column "${node.id}" aggregates by weightedAverage but names no weightField.`,
        });
      }
    });
  };

  walk(schema);

  const leaves = collectLeaves(schema);
  const byPair = new Map<string, LeafColumnDef[]>();
  leaves.forEach((column) => {
    if (column.pairId === undefined || column.pairId === '') return;
    byPair.set(column.pairId, [...(byPair.get(column.pairId) ?? []), column]);
  });

  byPair.forEach((columns, pairId) => {
    const baselines = columns.filter((column) => column.variant === 'baseline');
    const editables = columns.filter((column) => column.variant === 'editable');
    if (baselines.length !== 1 || editables.length !== 1) {
      errors.push({
        code: 'incompletePair',
        nodeId: pairId,
        message:
          `pairId "${pairId}" must resolve to exactly one baseline and one editable column; ` +
          `found ${baselines.length} baseline and ${editables.length} editable.`,
      });
    }
  });

  return errors;
}

function validatePivot(schema: ColumnSchemaNode[], pivotConfig: PivotConfig): SchemaError[] {
  const ids = new Set(collectLeaves(schema).map((column) => column.id));
  const referenced = [
    ...pivotConfig.rowDimensions,
    ...pivotConfig.columnDimensions,
    ...pivotConfig.measures.map((measure) => measure.columnId),
  ];
  return referenced
    .filter((id) => !ids.has(id))
    .map((id) => ({
      code: 'unknownPivotColumn' as const,
      nodeId: id,
      message: `Pivot configuration references column "${id}", which is not in the schema.`,
    }));
}

function pivotRoleFor(id: string, pivotConfig: PivotConfig | undefined): PivotRole | undefined {
  if (!pivotConfig) return undefined;
  if (pivotConfig.rowDimensions.includes(id)) return 'rowDimension';
  if (pivotConfig.columnDimensions.includes(id)) return 'columnDimension';
  if (pivotConfig.measures.some((measure) => measure.columnId === id)) return 'measure';
  return undefined;
}

function buildLeaf(column: LeafColumnDef, pivotConfig: PivotConfig | undefined): BuiltLeafColumn {
  const measure = pivotConfig?.measures.find((entry) => entry.columnId === column.id);
  const built: BuiltLeafColumn = {
    kind: 'leaf',
    id: column.id,
    field: column.field,
    headerName: column.headerName,
    dataType: column.dataType,
    editable: column.editable === true,
    align: column.align ?? defaultAlign(column.dataType),
    aggregator: measure?.aggregator ?? column.aggregator ?? 'none',
    pinned: column.pinned,
    weightField: column.weightField,
    variant: column.variant,
    pairId: column.pairId,
    badge: column.badge,
    validate: column.validate,
    headerTooltip: column.headerTooltip,
    formatMask: column.formatMask,
    pivotRole: pivotRoleFor(column.id, pivotConfig),
    minWidth: column.minWidth,
  };

  // Mutually exclusive: a column with both a width and a flex would grow past its stated width.
  if (column.width !== undefined) built.width = column.width;
  else if (column.flex !== undefined) built.flex = column.flex;

  return built;
}

/**
 * Throws `SchemaValidationError` when the schema is invalid. The adapter surfaces that as its error
 * panel outside development, so a bad schema is loud in development and contained in production —
 * never silently half-rendered.
 */
export function buildColumnDefs(
  schema: ColumnSchemaNode[],
  ctx: BuildColumnsContext,
): BuiltColumns {
  const errors = [
    ...validateSchema(schema),
    ...(ctx.pivotConfig ? validatePivot(schema, ctx.pivotConfig) : []),
  ];
  if (errors.length > 0) throw new SchemaValidationError(errors);

  const leaves: BuiltLeafColumn[] = [];
  let depth = 0;

  const walk = (nodes: ColumnSchemaNode[], level: number): BuiltColumn[] => {
    depth = Math.max(depth, level);
    return nodes.map((node) => {
      if (isColumnGroup(node)) {
        return {
          kind: 'group',
          id: node.id,
          headerName: node.headerName,
          pinned: node.pinned,
          children: walk(node.children, level + 1),
        } satisfies BuiltColumnGroup;
      }
      const built = buildLeaf(node, ctx.pivotConfig);
      leaves.push(built);
      return built;
    });
  };

  const columns = walk(schema, 1);

  const pairs: ColumnPair[] = [];
  const byPair = new Map<string, BuiltLeafColumn[]>();
  leaves.forEach((column) => {
    if (!column.pairId) return;
    byPair.set(column.pairId, [...(byPair.get(column.pairId) ?? []), column]);
  });
  byPair.forEach((columns_, pairId) => {
    const baseline = columns_.find((column) => column.variant === 'baseline');
    const editable = columns_.find((column) => column.variant === 'editable');
    if (!baseline || !editable) return;
    pairs.push({
      pairId,
      baselineColumnId: baseline.id,
      baselineField: baseline.field,
      editableColumnId: editable.id,
      editableField: editable.field,
    });
  });

  return { columns, leaves, pairs, depth: schema.length === 0 ? 0 : depth };
}

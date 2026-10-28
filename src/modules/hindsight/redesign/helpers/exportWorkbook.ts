import { getCompPolicyResult, metricDefinitions, scopeSignature } from '../data';
import type { Dataset, PairFact, Scope } from '../data';
import { buildWorkbookBytes as buildSharedWorkbook } from '../../../../shared/components/data/excelExport/writeWorkbook';
import type { ExcelExportColumn, ExcelCellValue } from '../../../../shared/components/data/excelExport/types';
import { permittedText, projectAuthoredValue, projectCase } from '../context/permissions';
import type { CaseRecord } from '../data';

export interface WorkbookOptions {
  dataset?: Dataset;
  contributingPairs?: PairFact[];
  definitions?: { id: string; label: string; definition: string; unit?:string; status?:string; sourceAliases?:string; aggregation?:string; version?:string }[];
  fileName?: string;
  viewState?: Record<string, unknown>;
}
type Cell = string | number | boolean | null;
const restrictedField = (name: string) => /(^|[ _.-])(gm|cogs|margin|gross.?profit)([ _.$%.-]|$)|gmDollars|gmRate|plannedGmRate|gmGap|recognizedCogs|grossMargin/i.test(name);
function flattenRow(row: Record<string, unknown>, restricted: boolean): Record<string, Cell> {
  const result: Record<string, Cell> = {};
  Object.entries(row).forEach(([key, value]) => {
    if (restricted && restrictedField(key)) return;
    if (value && typeof value === 'object' && 'value' in value && 'state' in value) {
      const metric = value as { value: number | null; unit: string; state: string; reason?: string };
      if (restricted && metric.state === 'restricted') return;
      result[key] = metric.value; result[`${key} unit`] = metric.unit; result[`${key} state`] = metric.state; result[`${key} reason`] = metric.reason ?? '';
    } else if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string' || value === null) result[key] = value as Cell;
    else if (Array.isArray(value)) result[key] = value.every(item => typeof item !== 'object') ? value.join(', ') : JSON.stringify(value, (nestedKey, nestedValue) => restricted && restrictedField(nestedKey) ? undefined : nestedValue);
    else if (value !== undefined) result[key] = JSON.stringify(value, (nestedKey, nestedValue) => restricted && restrictedField(nestedKey) ? undefined : nestedValue);
  });
  return result;
}
export function pairExportRows(pairs: PairFact[]): Record<string, unknown>[] {
  return pairs.map(pair => ({ pairId: pair.id, itemId: pair.itemId, item: pair.item.name, storeId: pair.storeId, store: pair.store.name, range: pair.range, eligibility: pair.eligibility, matrixState: pair.matrixState, stockAsOf: pair.stockAsOf, rangeAsOf: pair.rangeAsOf, sales: pair.sales, comparisonSales: pair.comparisonSales, salesDelta: pair.salesDelta, salesChange: pair.salesChange, quantity: pair.quantity, gmDollars: pair.gmDollars, gmRate: pair.gmRate, ohCost: pair.ohCost, physicalOh: pair.physicalOh, sellableOh: pair.sellableOh, openInbound: pair.openInbound, qualifyingQuantity: pair.qualifyingQuantity, exposureWeeks: pair.exposureWeeks, velocity: pair.velocity, wos: pair.wos, caseIds: pair.caseIds }));
}
export function buildWorkbookBytes(title: string, rows: Record<string, unknown>[], scope: Scope, options: WorkbookOptions = {}): Uint8Array {
  const restricted = scope.access === 'restricted-margin';
  const flat = rows.map(row => {
    const safe = typeof row.metric === 'string' && row.actual && typeof row.actual === 'object' && 'value' in row.actual
      ? projectCase(row as unknown as CaseRecord, scope.access) : projectAuthoredValue(row, scope.access);
    return flattenRow(safe as unknown as Record<string, unknown>, restricted);
  });
  const columnsFor = (data: Record<string, Cell>[]): ExcelExportColumn<Record<string, ExcelCellValue>>[] => [...new Set(data.flatMap(Object.keys))].map(key => ({ id: key, header: key, value: row => row[key], format: key.endsWith(' unit') || key.endsWith(' state') || key.endsWith(' reason') ? 'text' : data.some(row => typeof row[key] === 'number') ? 'number' : 'text' }));
  const definitions = (options.definitions ?? metricDefinitions).filter(definition => !restricted || !restrictedField(definition.label));
  const safeViewState = JSON.parse(JSON.stringify(projectAuthoredValue(options.viewState ?? {}, scope.access), (key, value) => restricted && restrictedField(key) ? undefined : value));
  const contributing = options.contributingPairs?.map(pair => flattenRow(pairExportRows([pair])[0], restricted));
  const metricVersion = JSON.parse(scopeSignature(scope,options.dataset)).metricVersion;
  const comp=scope.compPolicyId?getCompPolicyResult(scope,options.dataset):undefined;
  const compMetadata=comp?{'Location cohort label':comp.label,'Comp policy state':comp.state,'Comp policy ID':comp.policy?.id??scope.compPolicyId,'Comp policy version':comp.policy?.version??'Unavailable','Comp approval status':comp.policy?.approval??'Unavailable','Comp policy effective dates':comp.policy?`${comp.policy.effectiveFrom} – ${comp.policy.effectiveTo}`:'Unavailable','Comp policy rationale':comp.policy?.rationale??comp.reason,'Comp exact store cohort':comp.cohortStoreIds,'Comp applied actual weeks':comp.cohortActualWeekIds,'Comp applied comparison weeks':comp.cohortComparisonWeekIds,'Comp displayed actual weeks':comp.actualWeekIds,'Comp displayed comparison weeks':comp.comparisonWeekIds,'Comp member decisions and reasons':comp.members,'Comp local anchor retained':comp.anchored}:{};
  const definitionField=(definition:object,key:string,fallback='')=>key in definition?String((definition as Record<string,unknown>)[key]??fallback):fallback;
  return buildSharedWorkbook({
    rows: flat, columns: columnsFor(flat), sheetName: 'Data', fileName: permittedText(options.fileName ?? title, scope.access),
    currencyCode: 'USD', metadata: {
      sourceLabel: options.dataset?.label ?? 'Illustrative local dataset', sourceVersion: options.dataset?.version ?? 'Illustrative data version unavailable',
      accessPolicy: restricted ? 'GM, margin and COGS fields withheld before aggregation and removed from every worksheet.' : 'Full local design-session access; no production authorization is asserted.',
      scope: { ...projectAuthoredValue(scope, scope.access), ...projectAuthoredValue(compMetadata, scope.access), 'Metric version': metricVersion, 'Calendar version': options.dataset?.calendar?.version ?? 'Illustrative calendar version unavailable', 'Contributing pair rows': options.contributingPairs?.length ?? 'Not requested', 'Population integrity': 'Only canonical dated SKU-store members establish range; aggregate report counts cannot supply member identities.', 'Approval boundary': 'Local design-session evidence. No production assortment or supply execution.' },
      viewState: safeViewState,
      definitions: definitions.map(definition => ({ id: definition.id, label: definition.label, definition: definition.definition, unit: definitionField(definition,'unit',definitionField(definition,'grain_unit')), status: definitionField(definition,'status',definitionField(definition,'evidence_status','Proposed; source-owner validation required')), sourceAliases:definitionField(definition,'sourceAliases',definitionField(definition,'source_labels')), aggregation:definitionField(definition,'aggregation',definitionField(definition,'aggregation_guards')),version:definitionField(definition,'version',metricVersion) })),
    },
    ...(contributing ? { additionalSheets: [{ name: 'Contributing pairs', rows: contributing, columns: columnsFor(contributing) }] } : {}),
  });
}
export function exportRows(title: string, rows: Record<string, unknown>[], scope: Scope, options: WorkbookOptions = {}): void {
  const bytes = buildWorkbookBytes(title, rows, scope, options);
  const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  const link = document.createElement('a'); link.href = url; link.download = permittedText(options.fileName ?? `Hindsight-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${scope.window}.xlsx`, scope.access); document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

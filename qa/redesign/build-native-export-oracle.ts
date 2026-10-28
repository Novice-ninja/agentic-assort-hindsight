import { writeFileSync } from 'node:fs';
import * as data from '../../src/modules/hindsight/redesign/data';

// This is a canonical comparison oracle, not evidence that a browser downloaded a file.
const dataset = data.getDefaultDataset();
const season = { ...data.createDefaultScope('in-season', dataset), window: 'SEASON' as const };
const scalar = (value: unknown): unknown => {
  if (value && typeof value === 'object' && 'value' in value && 'state' in value) return value;
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return value;
  return undefined;
};
const fields = (row: object) => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, scalar(value)]).filter(([, value]) => value !== undefined));
const pairs = data.selectScopedPairs(season, dataset);
const oracle = {
  provenance: 'Expected values computed from the canonical local ledger; actual XLSX is independently parsed with openpyxl. This file is not browser evidence.',
  version: dataset.version,
  scope: season,
  productIds: dataset.products.map(product => product.id),
  storeIds: dataset.stores.map(store => store.id),
  definitions: data.metricDefinitions,
  total: fields(data.aggregatePairs(pairs, dataset)),
  items: data.getItemRows(season, dataset).map(row => ({...fields(row), cases: row.openCaseCount})),
  stores: data.getStoreRows(season, dataset).map(row => ({...fields(row), cases: row.openCaseCount})),
  pairs: pairs.map(pair => ({ ...fields(pair), comparisonSales: pair.comparisonSales, salesDelta: pair.salesDelta, salesChange: pair.salesChange })),
  northportHoustonMembership: data.getPairFact('1000037', 'ST1001', season, dataset)?.rangeHistory,
  northportHoustonSupply: data.getPairFact('1000037', 'ST1001', season, dataset)?.supply,
  comp: data.getCompPolicyResult({ ...season, compPolicyId: data.DEMO_COMP_POLICY_ID }, dataset),
  mix: data.getMixRows(season, 'brand', dataset),
};
writeFileSync('qa/redesign/native-export-oracle.json', JSON.stringify(oracle, null, 2) + '\n');
console.log(JSON.stringify({version: dataset.version, pairs: pairs.length, items: oracle.items.length, stores: oracle.stores.length, definitions: oracle.definitions.length}));

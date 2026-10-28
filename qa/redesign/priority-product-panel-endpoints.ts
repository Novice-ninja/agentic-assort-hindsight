/** Actual local endpoint replay; complements the deferred-response React hook tests. */
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { setupServer } from 'msw/node';
import { pdfDemoHandlers } from '../../src/mocks/handlers/pdf';
import { selectFlooringItems } from '../../src/mocks/flooringDemo';
import { applyFlooringScope } from '../../src/modules/hindsight/priority/flooringScope';

const server = setupServer(...pdfDemoHandlers);
server.listen({ onUnhandledRequest: 'error' });
const checks: { name: string; pass: true; rows: number; pages: number }[] = [];
const bamboo = [{ levelNo: 'l1_name', selectedValues: ['Bamboo'] }];
const empty = [{ levelNo: 'l1_name', selectedValues: [] }];
const baseline = new Map<string, string[]>();

try {
  // Intentionally conflict with each explicit request. The request's captured scope must win.
  applyFlooringScope([{ levelName: 'Category', levelNo: 'l1_name', selectedValues: ['Hardwood'] }], 'PLAN-KB-002');
  for (const [label, scope] of [['full', []], ['Bamboo', bamboo], ['empty', empty], ['all', []]] as const) {
    const allowed = new Set(selectFlooringItems({ hierarchyScope: scope }).map(item => item.article));
    for (const kind of ['topStyleColors', 'missedOpportunities', 'carryForwards']) {
      let cursor = '';
      let total = -1;
      let pages = 0;
      const articles: string[] = [];
      const seenCursors = new Set<string>();
      do {
        assert(!seenCursors.has(cursor), 'Cursor repeated');
        seenCursors.add(cursor);
        const response = await fetch('http://localhost/agentic-assort-go/api/v1/hindsight/overview/recommendations', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ planCode: 'PLAN-KB-002', hierarchyScope: scope, recommendationType: kind, top: 4, cursor }),
        });
        assert.equal(response.status, 200);
        const { data } = await response.json() as any;
        assert.equal(data.planCode, 'PLAN-KB-002');
        if (total === -1) total = data.pagination.totalCount;
        else assert.equal(data.pagination.totalCount, total);
        for (const item of data.products) {
          assert(allowed.has(item.article), `Off-scope ${kind}: ${item.article}`);
          if (label === 'Bamboo' || label === 'empty') assert.notEqual(item.article, 'NOR-WO-DWR');
          articles.push(item.article);
        }
        pages += 1;
        assert(pages <= 20, 'Pagination exceeded the canonical population');
        cursor = data.pagination.hasMore ? data.pagination.cursor : '';
        if (data.pagination.hasMore) assert(cursor.length > 0);
      } while (cursor);
      assert.equal(articles.length, total);
      assert.equal(new Set(articles).size, articles.length);
      if (kind === 'topStyleColors') assert.equal(total, allowed.size);
      if (label === 'empty') assert.equal(total, 0);
      if (label === 'full') baseline.set(kind, articles);
      if (label === 'all') assert.deepEqual(articles, baseline.get(kind));
      checks.push({ name: `${kind}: ${label} explicit scope and all matching pages`, pass: true, rows: total, pages });
    }
  }
} finally {
  server.close();
}

await writeFile('qa/redesign/priority-product-panel-endpoint-checks.json', JSON.stringify({
  kind: 'Actual MSW endpoint replay; separate from browser acceptance',
  passed: checks.length,
  checks,
}, null, 2) + '\n');
console.log(`${checks.length} product-panel endpoint checks passed.`);

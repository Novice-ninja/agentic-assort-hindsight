import { http, HttpResponse, type RequestHandler } from 'msw';
import { pdfByItemHandlers } from './byItem';
import { pdfChartHandlers } from './charts';
import { pdfOverviewHandlers } from './overview';
import { getFlooringSummarize } from '../../flooringDemo';
import { flooringRequestFilters } from '../../flooringDemo/requestScope';

/** Card-level AI narration. Clustering cards are answered by the clustering handlers. */
const pdfSummarizeHandler = http.post('*/v1/summarize', async ({ request }) => {
  const body = (await request.clone().json().catch(() => null)) as Record<string,unknown> | null;
  if (typeof body?.cardType === 'string' && body.cardType.startsWith('cluster')) return undefined;

  return HttpResponse.json({
    requestId: 'pdf-demo-summarize',
    promptKey: 'segment_contribution',
    promptVersion: 1,
    response: getFlooringSummarize(body??{},flooringRequestFilters(body??{})),
    model: 'demo',
    latencyMs: 0,
  });
});

/**
 * Handlers that serve the flooring mock data set (src/mocks/pdfData) for the live `/v1/...`
 * endpoints. Browser worker only: the test server keeps its own deterministic fixtures.
 */
export const pdfDemoHandlers: RequestHandler[] = [
  ...pdfOverviewHandlers,
  ...pdfChartHandlers,
  ...pdfByItemHandlers,
  pdfSummarizeHandler,
];

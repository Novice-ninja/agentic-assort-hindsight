import { http, HttpResponse } from 'msw';
import { FALLBACK_GLOBAL_CONFIG } from '@modules/appConfig/fallback/globalConfig';
import { FALLBACK_METRIC_CONFIG_DTOS } from '@modules/appConfig/fallback/metricConfig';

/** Offline-only support. Deliberately comes after all recovered preview fixtures. */
export const localOnlyHandlers = [
  // These two endpoints already use these exact baked-in values when the deployed
  // service is unavailable. Serve the same catalogues locally without a transient toast.
  http.get('*/v1/global-config', () =>
    HttpResponse.json({ status: true, data: FALLBACK_GLOBAL_CONFIG, message: 'Successful' }),
  ),
  http.get('*/v1/common/metrics-config', () =>
    HttpResponse.json({ status: true, data: FALLBACK_METRIC_CONFIG_DTOS, message: 'Successful' }),
  ),
  http.post('*/api/assort-agent/feedback', () =>
    HttpResponse.json({ status: true, message: 'Feedback saved in this local preview.' }),
  ),
  // A missing fixture must fail visibly rather than contacting a production API.
  // Non-service assets (scripts, fonts and images) continue to the local static server.
  http.all('*', ({ request }) => {
    const path = new URL(request.url).pathname;
    if (!/^\/(?:api|agentic-assort-go\/api)(?:\/|$)/.test(path)) return undefined;
    console.warn(`[local preview] No fixture for ${request.method} ${path}`);
    return HttpResponse.json(
      {
        status: false,
        message: `This local preview does not contain a fixture for ${request.method} ${path}.`,
        error: { code: 'LOCAL_FIXTURE_NOT_FOUND', message: 'Local data is unavailable for this action.' },
      },
      { status: 501 },
    );
  }),
];

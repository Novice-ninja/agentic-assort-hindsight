import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@app/store/hooks';
import { useToast } from '@shared/components/primitives/Toast';

/**
 * Surfaces a one-shot error toast when metrics-config (or global-config) fetch fails.
 * The store already keeps the baked-in fallback, so the UI stays usable — this just
 * makes the failure visible. Mount inside `ToastProvider` + `I18nProvider`.
 */
export function AppConfigErrorListener() {
  const { showToast } = useToast();
  const { t } = useTranslation('common');
  const statuses = useAppSelector((s) => s.appConfig.statuses);
  const errors = useAppSelector((s) => s.appConfig.errors);
  const toastedMetrics = useRef(false);
  // const toastedGlobal = useRef(false); // TODO: Add global config error listener once we have a global config

  useEffect(() => {
    if (statuses.metrics === 'loading') {
      toastedMetrics.current = false;
      return;
    }
    if (statuses.metrics !== 'failed' || toastedMetrics.current) return;

    toastedMetrics.current = true;
    showToast({
      message: t(
        'appConfig.metricsLoadFailed',
        'Could not load metric configuration. Showing default metrics.',
      ),
      variant: 'error',
      position: 'top-right',
    });
  }, [statuses.metrics, errors.metrics, showToast, t]);

  // useEffect(() => // TODO: Add global config error listener once we have a global config
  //   if (statuses.global === 'loading') {
  //     toastedGlobal.current = false;
  //     return;
  //   }
  //   if (statuses.global !== 'failed' || toastedGlobal.current) return;

  //   toastedGlobal.current = true;
  //   showToast({
  //     message: t(
  //       'appConfig.globalLoadFailed',
  //       'Could not load application configuration. Showing default settings.',
  //     ),
  //     variant: 'error',
  //     position: 'top-right',
  //   });
  // }, [statuses.global, errors.global, showToast, t]);

  return null;
}

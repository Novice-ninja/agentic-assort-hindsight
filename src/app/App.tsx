import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '@shared/components/primitives/Toast';
import {
  AppConfigProvider,
  I18nProvider,
  PostHogProvider,
  StoreProvider,
  ThemeProvider,
} from '@app/providers';
import { AppRoutes } from '@app/router';
import { AuthExpiredListener } from '@app/layouts/AuthExpiredListener';
import { AppConfigErrorListener } from '@app/layouts/AppConfigErrorListener';
import { SessionTokenRefresh } from '@app/layouts/SessionTokenRefresh';
import { AIChatProvider } from '@shared/context';
import '@shared/styles/global.css';

export function App() {
  return (
    <PostHogProvider>
      <StoreProvider>
        <AppConfigProvider>
          <ThemeProvider>
            <I18nProvider>
              <ToastProvider>
                <AuthExpiredListener />
                <AppConfigErrorListener />
                <SessionTokenRefresh />
                <BrowserRouter>
                  <AIChatProvider>
                    <AppRoutes />
                  </AIChatProvider>
                </BrowserRouter>
              </ToastProvider>
            </I18nProvider>
          </ThemeProvider>
        </AppConfigProvider>
      </StoreProvider>
    </PostHogProvider>
  );
}

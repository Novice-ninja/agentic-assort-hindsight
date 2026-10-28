import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { provideGlobalGridOptions } from 'ag-grid-community';
import '@shared/components/visualization/AgGridTheme/registerAgGrid';
import 'ag-grid-community/styles/ag-grid.css';
import '@shared/components/data/agGridLayout.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import '@shared/components/data/AgGridTable/agGridTableTheme.css';
import '@shared/components/visualization/AgGridTheme/adminGridTheme.css';
import '@shared/components/data/MatrixGrid/matrixGridTheme.css';
import { useMocks } from '@config/env';
import { App } from './App';

// AG Grid v36 defaults `theme` to the Theming API's `themeQuartz`, which renders alongside the
// class-based CSS imported above instead of replacing it. Every grid in this repo is themed with
// legacy classes, so opt the whole app out once here.
provideGlobalGridOptions({ theme: 'legacy' });

const roots = new WeakMap();
let standaloneMockingReady;

/** Drop a previously registered MSW worker so it cannot keep intercepting live APIs. */
async function unregisterMockServiceWorkers() {
  if (!('serviceWorker' in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    registrations
      .filter((registration) => {
        const scriptUrl =
          registration.active?.scriptURL ??
          registration.waiting?.scriptURL ??
          registration.installing?.scriptURL ??
          '';
        return scriptUrl.includes('mockServiceWorker');
      })
      .map((registration) => registration.unregister()),
  );
}

async function enableMocking() {
  if (!useMocks) {
    await unregisterMockServiceWorkers();
    return;
  }
  const { worker } = await import('@mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

function prepareMocking(enableMocks) {
  if (!enableMocks || !useMocks) {
    return unregisterMockServiceWorkers();
  }
  standaloneMockingReady ??= enableMocking();
  return standaloneMockingReady;
}

function renderApp(el, props = {}) {
  let root = roots.get(el);
  if (!root) {
    root = createRoot(el);
    roots.set(el, root);
  }
  root.render(
    <StrictMode>
      <App {...props} />
    </StrictMode>,
  );
}

// Public micro-frontend contract consumed by the core application.
export function mount(el, { onNavigate, initialPath, enableMocks = false, ...rest } = {}) {
  if (onNavigate) {
    window.addEventListener('popstate', () => {
      onNavigate({ pathname: window.location.pathname });
    });
  }

  if (initialPath && window.location.pathname !== initialPath) {
    window.history.replaceState({}, '', initialPath);
  }

  void prepareMocking(enableMocks).then(() => renderApp(el, rest));

  return {
    onParentNavigate({ pathname: nextPathname }) {
      const { pathname } = window.location;

      if (pathname !== nextPathname) {
        window.history.pushState({}, '', nextPathname);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    },
  };
}

// Keep compatibility with hosts using a default import.
export default mount;

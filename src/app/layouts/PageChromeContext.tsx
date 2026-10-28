import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

export interface BreadcrumbEntry {
  type: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface PageChromeContextValue {
  breadcrumbAction: ReactNode;
  setBreadcrumbAction: Dispatch<SetStateAction<ReactNode>>;
  breadcrumbItems: BreadcrumbEntry[] | null;
  setBreadcrumbItems: Dispatch<SetStateAction<BreadcrumbEntry[] | null>>;
}

const PageChromeContext = createContext<PageChromeContextValue | null>(null);

export function PageChromeProvider({ children }: { children: ReactNode }) {
  const [breadcrumbAction, setBreadcrumbAction] = useState<ReactNode>(null);
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbEntry[] | null>(null);
  const value = useMemo(
    () => ({ breadcrumbAction, setBreadcrumbAction, breadcrumbItems, setBreadcrumbItems }),
    [breadcrumbAction, breadcrumbItems],
  );

  return <PageChromeContext.Provider value={value}>{children}</PageChromeContext.Provider>;
}

export function usePageChrome(): PageChromeContextValue {
  const ctx = useContext(PageChromeContext);
  if (!ctx) {
    throw new Error('usePageChrome must be used within PageChromeProvider');
  }
  return ctx;
}

export function useSetBreadcrumbAction(): Dispatch<SetStateAction<ReactNode>> {
  return usePageChrome().setBreadcrumbAction;
}

/**
 * Pages call this hook to declare their own breadcrumb trail.
 * Items are cleared automatically on unmount.
 */
export function useSetBreadcrumbs(items: BreadcrumbEntry[]): void {
  const { setBreadcrumbItems } = usePageChrome();
  useEffect(() => {
    setBreadcrumbItems(items);
    return () => setBreadcrumbItems(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setBreadcrumbItems, JSON.stringify(items)]);
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ImpactToast } from '@shared/components/vendor/impact-ui';

type ToastVariant = 'success' | 'info' | 'warning' | 'error';
type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastOptions {
  message: string;
  variant?: ToastVariant;
  position?: ToastPosition;
  autoHideDuration?: number;
  zIndex?: number;
}

interface QueuedToast extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
  showToasts: (options: ToastOptions[]) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastIdCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<QueuedToast[]>([]);
  const [activeToast, setActiveToast] = useState<QueuedToast | null>(null);
  const processingRef = useRef(false);

  const showToast = useCallback((options: ToastOptions) => {
    const id = `toast-${++toastIdCounter}`;
    setQueue((prev) => [...prev, { ...options, id }]);
  }, []);

  const showToasts = useCallback((items: ToastOptions[]) => {
    const newToasts = items.map((options) => ({
      ...options,
      id: `toast-${++toastIdCounter}`,
    }));
    setQueue((prev) => [...prev, ...newToasts]);
  }, []);

  useEffect(() => {
    if (!activeToast && queue.length > 0 && !processingRef.current) {
      processingRef.current = true;
      const [next, ...rest] = queue;
      setActiveToast(next);
      setQueue(rest);
      processingRef.current = false;
    }
  }, [activeToast, queue]);

  const handleClose = useCallback(() => {
    setActiveToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, showToasts }}>
      {children}
      {activeToast && (
        <ImpactToast
          isOpen
          message={activeToast.message}
          variant={activeToast.variant ?? 'success'}
          position={activeToast.position ?? 'top-right'}
          autoHideDuration={activeToast.autoHideDuration ?? 2000}
          onClose={handleClose}
          zIndex={activeToast.zIndex ?? 9999}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

import { useEffect, useRef, useState } from 'react';
import type { LoadStatus } from '@shared/types';
import { getClusterScatterInsight } from '../api/getClusterScatterInsight';
import type { ClusterScatterSummarizeRequest } from '../services/clusterScatterSummary';

export interface ClusterScatterInsight {
  status: LoadStatus;
  text: string;
}

/**
 * Loads the scatter insight whenever the on-screen payload changes.
 * A missing payload stays idle so the strip can keep its placeholder.
 */
export function useClusterScatterInsight(
  payload: ClusterScatterSummarizeRequest | null,
): ClusterScatterInsight {
  const [status, setStatus] = useState<LoadStatus>(payload === null ? 'idle' : 'loading');
  const [text, setText] = useState('');
  const requestKey = payload === null ? null : JSON.stringify(payload);
  const payloadRef = useRef(payload);
  payloadRef.current = payload;

  useEffect(() => {
    const current = payloadRef.current;
    if (current === null || requestKey === null) {
      setStatus('idle');
      setText('');
      return;
    }
    const controller = new AbortController();
    setStatus('loading');
    setText('');
    void getClusterScatterInsight(current, controller.signal)
      .then((insight) => {
        if (controller.signal.aborted) return;
        setText(insight);
        setStatus('succeeded');
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setText('');
        setStatus('failed');
      });
    return () => controller.abort();
  }, [requestKey]);

  return { status, text };
}

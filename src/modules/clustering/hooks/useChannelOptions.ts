import { useEffect, useState } from 'react';
import type { LoadStatus } from '@shared/types';
import { getChannelOptions } from '../api/getChannelOptions';
import type { ChannelOption } from '../types';

export interface UseChannelOptionsResult {
  channels: ChannelOption[];
  status: LoadStatus;
}

/** One shared request so a development remount does not hit `/filters/values` twice. */
let channelRequest: Promise<ChannelOption[]> | null = null;

function loadChannelOptions(): Promise<ChannelOption[]> {
  if (!channelRequest) {
    channelRequest = getChannelOptions().catch((error: unknown) => {
      channelRequest = null;
      throw error;
    });
  }
  return channelRequest;
}

/** Drops a cached channel request so the next mount can fetch again. */
export function resetChannelOptionsRequest(): void {
  channelRequest = null;
}

/**
 * Loads the Scope-step channel cards from `/filters/values` once per session.
 * Failures leave `channels` empty with `status: 'failed'` so the step still renders.
 */
export function useChannelOptions(active = true): UseChannelOptionsResult {
  const [channels, setChannels] = useState<ChannelOption[]>([]);
  const [status, setStatus] = useState<LoadStatus>('idle');

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    setStatus('loading');
    void loadChannelOptions()
      .then((result) => {
        if (cancelled) return;
        setChannels(result);
        setStatus('succeeded');
      })
      .catch(() => {
        if (!cancelled) setStatus('failed');
      });
    return () => {
      cancelled = true;
    };
  }, [active]);

  return { channels, status };
}

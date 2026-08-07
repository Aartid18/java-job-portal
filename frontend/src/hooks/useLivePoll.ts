import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../lib/api';

/** Lightweight polling hook for live UI surfaces. */
export function useLivePoll<T>(
  fetcher: () => Promise<T>,
  intervalMs = 12_000,
  enabled = true
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const next = await fetcherRef.current();
      setData(next);
      setError('');
      setUpdatedAt(new Date());
    } catch (err) {
      setError(getErrorMessage(err, 'Live update failed'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    void refresh(false);
    const id = window.setInterval(() => void refresh(true), intervalMs);
    const onFocus = () => void refresh(true);
    window.addEventListener('focus', onFocus);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('focus', onFocus);
    };
  }, [enabled, intervalMs, refresh]);

  return { data, error, loading, updatedAt, refresh };
}

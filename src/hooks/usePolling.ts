import { useEffect, useRef, useCallback, useState } from 'react';

interface UsePollingOptions {
  interval?: number;
  enabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function usePolling<T>(
  fetchFn: () => Promise<T>,
  options: UsePollingOptions = {}
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
} {
  const {
    interval = 30000, // Default 30 seconds
    enabled = true,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      const result = await fetchFn();
      
      if (mountedRef.current) {
        setData(result);
        setError(null);
        setLastUpdated(new Date());
        onSuccess?.();
      }
    } catch (err) {
      if (mountedRef.current) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        onError?.(error);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetchFn, onSuccess, onError]);

  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    mountedRef.current = true;

    if (enabled) {
      // Initial fetch
      fetchData();

      // Set up polling
      const poll = () => {
        timeoutRef.current = setTimeout(async () => {
          await fetchData();
          if (mountedRef.current && enabled) {
            poll();
          }
        }, interval);
      };

      poll();
    }

    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, interval, fetchData]);

  return { data, loading, error, lastUpdated, refetch };
}

export default usePolling;

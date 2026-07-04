// Reusable hook that calls an API function, tracks loading/error state, and returns the result
import { useState, useEffect, useCallback, useRef } from 'react';

export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Ticket counter: each fetch gets a ticket; stale responses (unmount / deps change) are ignored
  const ticketRef = useRef(0);

  const load = useCallback(async () => {
    const ticket = ++ticketRef.current;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFn();
      if (ticket !== ticketRef.current) return;
      setData(res.data.data);
      setMeta(res.data.meta || null);
    } catch (err) {
      if (ticket !== ticketRef.current) return;
      setError(err.response?.data?.error?.message || 'Something went wrong.');
    } finally {
      if (ticket === ticketRef.current) setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
    // Invalidate any in-flight fetch when effect cleans up (deps change or unmount)
    return () => { ticketRef.current++; };
  }, [load]);

  return { data, meta, loading, error, refetch: load };
}

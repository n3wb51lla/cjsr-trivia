import { useEffect, useState } from 'react';
import { fetchServerTimeOffsetMs } from '../lib/firebaseData';

export function useServerTimeOffset() {
  const [offsetMs, setOffsetMs] = useState(0);

  useEffect(() => {
    let disposed = false;

    async function refreshOffset() {
      try {
        const next = await fetchServerTimeOffsetMs();
        if (!disposed) setOffsetMs(next);
      } catch {
        if (!disposed) setOffsetMs(0);
      }
    }

    void refreshOffset();
    window.addEventListener('online', refreshOffset);
    window.addEventListener('focus', refreshOffset);
    document.addEventListener('visibilitychange', refreshOffset);

    return () => {
      disposed = true;
      window.removeEventListener('online', refreshOffset);
      window.removeEventListener('focus', refreshOffset);
      document.removeEventListener('visibilitychange', refreshOffset);
    };
  }, []);

  return offsetMs;
}

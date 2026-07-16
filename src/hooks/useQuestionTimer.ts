import { useEffect, useMemo, useState } from 'react';
import { getQuestionDurationMs } from '../lib/triviaData';
import { useServerTimeOffset } from './useServerTimeOffset';

export function useQuestionTimer(questionStartedAt: number | null) {
  const serverOffsetMs = useServerTimeOffset();
  const durationMs = getQuestionDurationMs();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setNow(Date.now());
    const interval = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(interval);
  }, [questionStartedAt]);

  return useMemo(() => {
    if (questionStartedAt === null) {
      return {
        remainingMs: 0,
        elapsedMs: 0,
        durationMs,
        isExpired: false,
        secondsRemaining: 0,
        progress: 0,
      };
    }
    const adjustedNow = now + serverOffsetMs;
    const elapsedMs = Math.max(0, adjustedNow - questionStartedAt);
    const remainingMs = Math.max(0, durationMs - elapsedMs);
    return {
      remainingMs,
      elapsedMs,
      durationMs,
      isExpired: remainingMs <= 0,
      secondsRemaining: Math.ceil(remainingMs / 1000),
      progress: durationMs > 0 ? remainingMs / durationMs : 0,
    };
  }, [durationMs, now, questionStartedAt, serverOffsetMs]);
}

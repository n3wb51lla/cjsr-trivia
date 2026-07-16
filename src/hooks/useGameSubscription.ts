import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameState } from '../types';
import { fetchGameState, subscribeGameState } from '../lib/firebaseData';

type ConnectionStatus = 'connecting' | 'live' | 'polling' | 'offline' | 'error';

interface UseGameSubscriptionResult {
  readonly gameState: GameState | null;
  readonly status: ConnectionStatus;
  readonly error: Error | null;
  readonly refetch: () => Promise<void>;
}

const POLLING_INTERVAL_MS = 2_000;
const REALTIME_STALE_MS = 8_000;

export function useGameSubscription(gameCode: string): UseGameSubscriptionResult {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>(() => navigator.onLine ? 'connecting' : 'offline');
  const [error, setError] = useState<Error | null>(null);
  const lastRealtimeAtRef = useRef(0);
  const pollingRef = useRef<number | null>(null);

  const refetch = useCallback(async () => {
    try {
      const next = await fetchGameState(gameCode);
      setGameState(next);
      setError(null);
    } catch (caught) {
      const nextError = caught instanceof Error ? caught : new Error('Could not fetch game state.');
      setError(nextError);
      setStatus('error');
    }
  }, [gameCode]);

  useEffect(() => {
    let disposed = false;

    function stopPolling() {
      if (pollingRef.current !== null) {
        window.clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }

    function startPolling() {
      if (pollingRef.current !== null) return;
      setStatus(navigator.onLine ? 'polling' : 'offline');
      pollingRef.current = window.setInterval(() => {
        void refetch();
      }, POLLING_INTERVAL_MS);
    }

    setStatus(navigator.onLine ? 'connecting' : 'offline');
    void refetch();

    const unsubscribe = subscribeGameState(
      gameCode,
      next => {
        if (disposed) return;
        lastRealtimeAtRef.current = Date.now();
        setGameState(next);
        setStatus('live');
        setError(null);
        stopPolling();
      },
      nextError => {
        if (disposed) return;
        setError(nextError);
        startPolling();
      },
    );

    const staleCheck = window.setInterval(() => {
      if (disposed) return;
      if (!navigator.onLine) {
        setStatus('offline');
        startPolling();
        return;
      }
      const lastRealtimeAt = lastRealtimeAtRef.current;
      if (lastRealtimeAt > 0 && Date.now() - lastRealtimeAt > REALTIME_STALE_MS) {
        startPolling();
      }
    }, POLLING_INTERVAL_MS);

    function handleOnline() {
      void refetch();
      setStatus('connecting');
    }

    function handleOffline() {
      setStatus('offline');
      startPolling();
    }

    function handleVisibilityOrFocus() {
      if (document.visibilityState === 'visible') void refetch();
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      disposed = true;
      unsubscribe();
      stopPolling();
      window.clearInterval(staleCheck);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
  }, [gameCode, refetch]);

  return { gameState, status, error, refetch };
}

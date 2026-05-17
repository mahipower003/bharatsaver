import { useState, useEffect, useCallback, useRef } from 'react';
import type { CalculatorType, WorkerMessage, WorkerResponse } from '@/lib/workers/calculator.worker';

export function useCalculatorWorker<T, R>(type: CalculatorType, delayMs: number = 150) {
  const [result, setResult] = useState<R | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize worker
    workerRef.current = new Worker(new URL('../lib/workers/calculator.worker.ts', import.meta.url));

    workerRef.current.onmessage = (e: MessageEvent<WorkerResponse>) => {
      setResult(e.data.result as R);
      setIsCalculating(false);
    };

    workerRef.current.onerror = (e) => {
      console.error('Worker error:', e);
      setIsCalculating(false);
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const calculate = useCallback((payload: T) => {
    setIsCalculating(true);
    
    // Debounce the calculation
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (workerRef.current) {
        const message: WorkerMessage = {
          type,
          payload,
          id: Date.now().toString(),
        };
        workerRef.current.postMessage(message);
      }
    }, delayMs);
  }, [type, delayMs]);

  return { result, isCalculating, calculate };
}

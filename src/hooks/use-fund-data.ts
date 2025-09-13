
'use client';

import { useState, useEffect } from 'react';
import type { RawFund } from '@/lib/overlap-calculator';

let fundDataCache: RawFund[] | null = null;
let fetchPromise: Promise<RawFund[]> | null = null;

export function useFundData() {
  const [allFunds, setAllFunds] = useState<RawFund[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fundDataCache) {
      setAllFunds(fundDataCache);
      setIsLoading(false);
      return;
    }

    if (!fetchPromise) {
        fetchPromise = fetch('/jsonfile/tickertape_top_holdings.json')
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            fundDataCache = data as RawFund[];
            return fundDataCache;
          });
    }

    fetchPromise
      .then(data => {
        setAllFunds(data);
      })
      .catch(err => {
        console.error('Error fetching fund data:', err);
        setError('Failed to load fund data. Please try refreshing the page.');
      })
      .finally(() => {
        setIsLoading(false);
      });

  }, []);

  return { allFunds, isLoading, error };
}


'use client';

import { useState, useEffect } from 'react';
import type { RawFund } from '@/lib/overlap-calculator';
import allFundsData from '@/data/tickertape_top_holdings.json';

let fundDataCache: RawFund[] | null = null;

export function useFundData() {
  const [allFunds, setAllFunds] = useState<RawFund[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If data is already cached, use it.
    if (fundDataCache) {
      setAllFunds(fundDataCache);
      setIsLoading(false);
      return;
    }

    try {
      // Simulate async loading to prevent blocking the main thread on large data
      setTimeout(() => {
        fundDataCache = allFundsData as RawFund[];
        setAllFunds(fundDataCache);
        setIsLoading(false);
      }, 50);
    } catch (err) {
      console.error('Error processing fund data:', err);
      setError('Failed to load fund data. Please try refreshing the page.');
      setIsLoading(false);
    }
  }, []);

  return { allFunds, isLoading, error };
}

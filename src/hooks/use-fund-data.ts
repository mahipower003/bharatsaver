
'use client';

import { useState, useEffect } from 'react';
import type { RawFund } from '@/lib/overlap-calculator';
import fundData from '@/data/tickertape_top_holdings.json';

export function useFundData() {
  const [allFunds, setAllFunds] = useState<RawFund[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Data is now imported directly, not fetched.
      // This avoids any network or pathing issues.
      setAllFunds(fundData as RawFund[]);
    } catch (err) {
      console.error('Error loading fund data:', err);
      setError('Failed to load fund data. The data file might be corrupt.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { allFunds, isLoading, error };
}

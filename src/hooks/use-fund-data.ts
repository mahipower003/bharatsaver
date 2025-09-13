
'use client';

import { useState, useEffect } from 'react';
import type { RawFund } from '@/lib/overlap-calculator';

let fundDataCache: RawFund[] | null = null;
let fetchPromise: Promise<RawFund[]> | null = null;

export function useFundData() {
  const [allFunds, setAllFunds] = useState<RawFund[]>(fundDataCache || []);
  const [isLoading, setIsLoading] = useState(!fundDataCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If data is already cached, no need to fetch again.
    if (fundDataCache) {
      setAllFunds(fundDataCache);
      setIsLoading(false);
      return;
    }

    // If a fetch is already in progress, don't start a new one.
    if (fetchPromise) {
      fetchPromise
        .then(data => {
          setAllFunds(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching fund data:', err);
          setError('Failed to load fund data. Please try refreshing the page.');
          setIsLoading(false);
        });
      return;
    }
    
    // The path must be absolute from the root.
    fetchPromise = fetch('/jsonfile/tickertape_top_holdings.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        fundDataCache = data;
        setAllFunds(data);
        setIsLoading(false);
        fetchPromise = null; // Clear promise after success
        return data;
      })
      .catch(err => {
        console.error('Error fetching fund data:', err);
        setError('Failed to load fund data. Please try refreshing the page.');
        setIsLoading(false);
        fetchPromise = null; // Clear promise after error
        return [];
      });

  }, []);

  return { allFunds, isLoading, error };
}

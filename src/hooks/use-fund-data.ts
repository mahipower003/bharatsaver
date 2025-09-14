
'use client';

import { useState, useEffect } from 'react';
import type { RawFund } from '@/lib/overlap-calculator';
// We are now importing the JSON data directly.
// This is more reliable as it's bundled with the app,
// avoiding potential network or file path issues during build/runtime.
import fundData from '@/data/tickertape_top_holdings.json';

export function useFundData() {
  const [allFunds, setAllFunds] = useState<RawFund[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (!fundData || !Array.isArray(fundData) || fundData.length === 0) {
        throw new Error("Fund data is missing, empty, or not in the expected array format.");
      }
      
      // The imported JSON is directly used.
      // The `as RawFund[]` cast assumes the JSON structure matches our type definition.
      setAllFunds(fundData as RawFund[]);

    } catch (err) {
      // It's good practice to handle potential errors, even with direct imports.
      // This could happen if the JSON file is malformed.
      console.error('Error processing fund data:', err);
      if (err instanceof Error) {
        setError(`Failed to process fund data. ${err.message}`);
      } else {
        setError('An unknown error occurred while processing fund data.');
      }
    } finally {
      // Set loading to false after processing is complete (or has failed).
      setIsLoading(false);
    }
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  return { allFunds, isLoading, error };
}

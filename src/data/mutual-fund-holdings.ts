
import type { FundPortfolio } from '@/types';
import rawFundDataJson from './mutual-fund-data.json';

// Define the structure of the raw data from the JSON file
interface RawConstituent {
  company: string;
  ticker?: string;
  weight_pct: number | string | null;
}

export interface RawFund {
  source: string;
  fetched_at_unix: number;
  fund_name: string;
  coverage_pct?: number;
  constituents_count: number;
  constituents: RawConstituent[];
}

// Since the JSON file might not conform to the type, we cast it.
// In a real-world scenario, you would have validation here (e.g., with Zod).
export const funds: RawFund[] = rawFundDataJson as RawFund[];

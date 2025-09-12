
import type { FundPortfolio } from '@/types';
import rawFundData from './mutual-fund-data.json';

// Raw data structure matching the user's provided JSON schema.
type RawFundData = {
  fund_name: string;
  constituents: {
    company: string;
    weight_pct: number | null;
  }[];
};

// Function to process the raw data into the application's required format.
function processFundData(data: RawFundData[]): FundPortfolio[] {
  return data.map((fund, index) => ({
    // Using index to create a unique schemeCode as it's required by the component
    schemeCode: `FUND${index + 1}`, 
    schemeName: fund.fund_name,
    holdings: fund.constituents
      .filter(c => c.weight_pct !== null && c.weight_pct > 0) // Filter out invalid holdings
      .map(constituent => ({
        name: constituent.company,
        weight: constituent.weight_pct!,
        // Adding a placeholder sector as it's part of the type but not the provided schema
        sector: "N/A" 
      }))
  }));
}

// Export the processed, valid data for use in the application.
export const funds: FundPortfolio[] = processFundData(rawFundData as RawFundData[]);


import type { FundPortfolio } from '@/types';
import rawData from './mutual-fund-data.json';

function processFundData(data: any[]): FundPortfolio[] {
  // Ensure rawData is an array before processing
  if (!Array.isArray(data)) {
    console.error("Mutual fund data is not in the expected array format.");
    return [];
  }

  return data.map((fund: any, index: number) => {
    // Ensure constituents is an array, provide an empty one if not
    const constituents = Array.isArray(fund.constituents) ? fund.constituents : [];

    const holdings = constituents
      // Filter out any holdings that are not valid objects or have null/undefined weight_pct
      .filter((c: any) => c && typeof c === 'object' && c.weight_pct !== null && typeof c.weight_pct === 'number' && c.company)
      .map((c: any) => ({
        name: c.company,
        weight: c.weight_pct,
        // The source JSON does not have a sector, so we default it.
        sector: 'Unknown',
      }));

    // Create a unique, stable schemeCode for each fund
    const schemeName = fund.fund_name || `Unknown Fund ${index}`;
    const schemeCode = schemeName.toUpperCase().replace(/[^A-Z0-9]/g, '_') + `_${index}`;

    return {
      schemeCode,
      schemeName,
      holdings,
    };
  });
}

// Export the processed and cleaned fund data
export const funds: FundPortfolio[] = processFundData(rawData);


import type { FundPortfolio } from '@/types';
import rawData from './mutual-fund-data.json';

// This function processes the raw JSON data and transforms it into the format
// expected by the application. It ensures that only valid stock holdings are included.
function processFundData(data: any[]): FundPortfolio[] {
  return data.map((fund: any, index: number) => {
    // Ensure constituents is an array before processing
    const constituents = Array.isArray(fund.constituents) ? fund.constituents : [];

    const holdings = constituents
      // Filter out any holdings where the weight is null, undefined, or not a number
      .filter((c: any) => typeof c.weight_pct === 'number' && c.weight_pct !== null)
      // Map the valid holdings to the required structure
      .map((c: any) => ({
        name: c.company,
        weight: c.weight_pct,
        sector: c.sector || 'Unknown', // Use provided sector or default
      }));

    return {
      // Create a unique schemeCode if one isn't provided
      schemeCode: (fund.fund_name || `FUND_${index}`).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20) + `_${index}`,
      schemeName: fund.fund_name || 'Unknown Fund',
      holdings: holdings,
    };
  });
}

export const funds: FundPortfolio[] = processFundData(rawData);

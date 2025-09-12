
import type { FundPortfolio } from '@/types';
import rawData from './mutual-fund-data.json';

function processFundData(data: any[]): FundPortfolio[] {
  return data.map((fund: any, index: number) => {
    const constituents = Array.isArray(fund.constituents) ? fund.constituents : [];

    const holdings = constituents
      .filter((c: any) => c.weight_pct !== null && typeof c.weight_pct === 'number')
      .map((c: any) => ({
        name: c.company,
        weight: c.weight_pct,
        sector: c.sector || 'Unknown',
      }));

    return {
      schemeCode: (fund.fund_name || `FUND_${index}`).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20) + `_${index}`,
      schemeName: fund.fund_name || 'Unknown Fund',
      holdings: holdings,
    };
  });
}

export const funds: FundPortfolio[] = processFundData(rawData);

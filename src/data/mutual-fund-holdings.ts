
import rawData from '@/data/mutual-fund-data.json';

export type FundPortfolio = {
    schemeCode: string;
    schemeName: string;
    holdings: {
        name: string;
        weight: number;
        sector: string;
    }[];
};

export const funds: FundPortfolio[] = rawData.map((fund: any) => ({
  schemeCode: (fund.fund_name || "UNKNOWN").toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15) + fund.constituents_count,
  schemeName: fund.fund_name,
  holdings: (fund.constituents || [])
    .filter((c: any) => c.company && c.weight_pct !== null)
    .map((c: any) => ({
      name: c.company,
      weight: c.weight_pct,
      sector: c.sector || 'Unknown',
    })),
}));

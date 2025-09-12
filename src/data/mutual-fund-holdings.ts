
import rawData from '@/../public/json/tickertape_top_holdings.json';

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
  schemeCode: fund.fund_name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15) + fund.constituents_count,
  schemeName: fund.fund_name,
  holdings: (fund.constituents || [])
    .filter((c: any) => c.company && c.weight_pct !== null && c.weight_pct > 0)
    .map((c: any) => ({
      name: c.company,
      weight: c.weight_pct || 0,
      sector: c.sector || 'Unknown',
    })),
}));

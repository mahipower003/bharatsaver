
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

// Mock holdings data for funds that don't have it in the JSON
const generateMockHoldings = (count: number): { name: string; weight: number; sector: string; }[] => {
    const sectors = ['Financials', 'Technology', 'Energy', 'Healthcare', 'Industrials', 'Consumer Staples'];
    const holdings = [];
    let remainingWeight = 100;
    for (let i = 0; i < count && i < 20; i++) {
        const weight = Math.min(remainingWeight, Math.random() * 5 + 1); // 1% to 6%
        holdings.push({
            name: `Stock ${i + 1}`,
            weight: parseFloat(weight.toFixed(2)),
            sector: sectors[i % sectors.length],
        });
        remainingWeight -= weight;
    }
    return holdings;
}


export const funds: FundPortfolio[] = rawData.map((fund: any) => ({
  schemeCode: fund.fund_name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15) + fund.constituents_count,
  schemeName: fund.fund_name,
  holdings: fund.constituents && fund.constituents.length > 0 
    ? (fund.constituents || [])
        .filter((c: any) => c.company && c.weight_pct !== null && c.weight_pct > 0)
        .map((c: any) => ({
          name: c.company,
          weight: c.weight_pct || 0,
          sector: c.sector || 'Unknown',
        }))
    : generateMockHoldings(fund.constituents_count),
}));

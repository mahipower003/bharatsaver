'use client';
import fs from 'fs';
import path from 'path';

export type FundPortfolio = {
    schemeCode: string;
    schemeName: string;
    holdings: {
        name: string;
        weight: number;
        sector: string;
    }[];
};

// This code will only run on the server during the build process,
// but the result (the `funds` array) will be bundled with the client code.
// The webpack config in next.config.js prevents `fs` and `path` from breaking the client build.
const filePath = path.join(process.cwd(), 'public', 'json', 'tickertape_top_holdings.json');
const jsonData = fs.readFileSync(filePath, 'utf-8');
const rawData = JSON.parse(jsonData);

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

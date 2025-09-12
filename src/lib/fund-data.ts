
import fs from 'fs/promises';
import path from 'path';
import type { RawFund } from './overlap-calculator';

let fundDataCache: RawFund[] | null = null;

export async function getFundData(): Promise<RawFund[]> {
  if (fundDataCache) {
    return fundDataCache;
  }

  const filePath = path.join(process.cwd(), 'public', 'jsonfile', 'tickertape_top_holdings.json');
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    fundDataCache = data;
    return data;
  } catch (error) {
    console.error('Error reading or parsing fund data:', error);
    return []; // Return empty array on error
  }
}

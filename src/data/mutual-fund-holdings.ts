import type { FundPortfolio } from '@/types';

// Raw data structure matching the user's provided JSON schema.
type RawFundData = {
  fund_name: string;
  constituents: {
    company: string;
    weight_pct: number | null;
  }[];
};

// Sample data adhering to the specified schema.
const rawFundData: RawFundData[] = [
  {
    "fund_name": "Quant Small Cap Fund",
    "constituents": [
      { "company": "Reliance Industries Ltd.", "weight_pct": 9.8 },
      { "company": "Housing Development Finance Corporation Ltd.", "weight_pct": 6.5 },
      { "company": "IRB Infrastructure Developers Ltd.", "weight_pct": 4.2 },
      { "company": "Hindustan Copper Ltd.", "weight_pct": 3.8 },
      { "company": "RBL Bank Ltd.", "weight_pct": 3.5 }
    ]
  },
  {
    "fund_name": "Nippon India Small Cap Fund",
    "constituents": [
      { "company": "Tube Investments of India Ltd.", "weight_pct": 2.1 },
      { "company": "HDFC Bank Ltd.", "weight_pct": 1.9 },
      { "company": "Apar Industries Ltd.", "weight_pct": 1.8 },
      { "company": "IDFC Ltd.", "weight_pct": 1.6 },
      { "company": "KPIT Technologies Ltd.", "weight_pct": 1.5 },
      // Added a common stock for testing overlap
      { "company": "Reliance Industries Ltd.", "weight_pct": 1.2 } 
    ]
  },
  {
    "fund_name": "HDFC Small Cap Fund",
    "constituents": [
      { "company": "Bank of Baroda", "weight_pct": 3.4 },
      { "company": "Bajaj Electricals Ltd.", "weight_pct": 2.8 },
      { "company": "Firstsource Solutions Ltd.", "weight_pct": 2.7 },
      { "company": "Reliance Industries Ltd.", "weight_pct": 2.5 }, // Overlap with Quant
      { "company": "Sonata Software Ltd.", "weight_pct": 2.4 }
    ]
  },
  {
    "fund_name": "Parag Parikh Flexi Cap Fund",
    "constituents": [
      { "company": "HDFC Bank Ltd.", "weight_pct": 8.5 },
      { "company": "Bajaj Holdings & Investment Ltd.", "weight_pct": 7.2 },
      { "company": "ITC Ltd.", "weight_pct": 6.1 },
      { "company": "Alphabet Inc. (Google)", "weight_pct": 5.8 },
      { "company": "Microsoft Corporation", "weight_pct": 5.5 }
    ]
  }
];

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
export const funds: FundPortfolio[] = processFundData(rawFundData);

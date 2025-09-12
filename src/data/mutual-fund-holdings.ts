import type { FundPortfolio } from '@/types';

// This is a sample data structure. In a real application, this would be fetched from an API or a more complete JSON file.
export const funds: FundPortfolio[] = [
    {
        schemeCode: "119550",
        schemeName: "Quant Small Cap Fund",
        holdings: [
            { name: "Reliance Industries Ltd.", weight: 9.8, sector: "Energy" },
            { name: "Housing Development Finance Corporation Ltd.", weight: 6.5, sector: "Financials" },
            { name: "IRB Infrastructure Developers Ltd.", weight: 4.2, sector: "Industrials" },
            { name: "Hindustan Copper Ltd.", weight: 3.8, sector: "Materials" },
            { name: "RBL Bank Ltd.", weight: 3.5, sector: "Financials" },
        ]
    },
    {
        schemeCode: "105933",
        schemeName: "Nippon India Small Cap Fund",
        holdings: [
            { name: "Tube Investments of India Ltd.", weight: 2.1, sector: "Consumer Discretionary" },
            { name: "HDFC Bank Ltd.", weight: 1.9, sector: "Financials" },
            { name: "Apar Industries Ltd.", weight: 1.8, sector: "Industrials" },
            { name: "IDFC Ltd.", weight: 1.6, sector: "Financials" },
            { name: "KPIT Technologies Ltd.", weight: 1.5, sector: "Information Technology" },
        ]
    },
    {
        schemeCode: "120566",
        schemeName: "HDFC Small Cap Fund",
        holdings: [
            { name: "Bank of Baroda", weight: 3.4, sector: "Financials" },
            { name: "Bajaj Electricals Ltd.", weight: 2.8, sector: "Consumer Discretionary" },
            { name: "Firstsource Solutions Ltd.", weight: 2.7, sector: "Information Technology" },
            { name: "Reliance Industries Ltd.", weight: 2.5, sector: "Energy" }, // Overlap with Quant
            { name: "Sonata Software Ltd.", weight: 2.4, sector: "Information Technology" },
        ]
    },
    {
        schemeCode: "119662",
        schemeName: "Parag Parikh Flexi Cap Fund",
        holdings: [
            { name: "HDFC Bank Ltd.", weight: 8.5, sector: "Financials" },
            { name: "Bajaj Holdings & Investment Ltd.", weight: 7.2, sector: "Financials" },
            { name: "ITC Ltd.", weight: 6.1, sector: "Consumer Staples" },
            { name: "Alphabet Inc. (Google)", weight: 5.8, sector: "Communication Services" },
            { name: "Microsoft Corporation", weight: 5.5, sector: "Information Technology" },
        ]
    }
];

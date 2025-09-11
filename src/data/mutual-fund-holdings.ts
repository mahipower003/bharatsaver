
export type FundPortfolio = {
    schemeCode: string;
    schemeName: string;
    holdings: {
        name: string;
        weight: number;
        sector: string;
    }[];
};

export const funds: FundPortfolio[] = [
    {
        schemeCode: 'PPFAS',
        schemeName: 'Parag Parikh Flexi Cap Fund',
        holdings: [
            { name: 'HDFC Bank Ltd.', weight: 8.5, sector: 'Financials' },
            { name: 'Bajaj Holdings & Investment Ltd.', weight: 7.0, sector: 'Financials' },
            { name: 'ITC Ltd.', weight: 5.5, sector: 'Consumer Staples' },
            { name: 'Coal India Ltd.', weight: 5.0, sector: 'Materials' },
            { name: 'Axis Bank Ltd.', weight: 4.8, sector: 'Financials' },
            { name: 'ICICI Bank Ltd.', weight: 4.5, sector: 'Financials' },
            { name: 'Power Grid Corporation of India Ltd.', weight: 4.0, sector: 'Utilities' },
            { name: 'Alphabet Inc.', weight: 3.5, sector: 'Communication Services' },
            { name: 'Microsoft Corporation', weight: 3.2, sector: 'Information Technology' },
            { name: 'Amazon.com Inc.', weight: 3.0, sector: 'Consumer Discretionary' },
        ],
    },
    {
        schemeCode: 'UTIFLEXI',
        schemeName: 'UTI Flexi Cap Fund',
        holdings: [
            { name: 'HDFC Bank Ltd.', weight: 9.0, sector: 'Financials' },
            { name: 'ICICI Bank Ltd.', weight: 8.5, sector: 'Financials' },
            { name: 'Infosys Ltd.', weight: 6.0, sector: 'Information Technology' },
            { name: 'Reliance Industries Ltd.', weight: 5.8, sector: 'Energy' },
            { name: 'Larsen & Toubro Ltd.', weight: 5.2, sector: 'Industrials' },
            { name: 'Bajaj Finance Ltd.', weight: 4.5, sector: 'Financials' },
            { name: 'Bharti Airtel Ltd.', weight: 4.0, sector: 'Communication Services' },
            { name: 'Tata Consultancy Services Ltd.', weight: 3.8, sector: 'Information Technology' },
            { name: 'Hindustan Unilever Ltd.', weight: 3.2, sector: 'Consumer Staples' },
            { name: 'Axis Bank Ltd.', weight: 3.0, sector: 'Financials' },
        ],
    },
    {
        schemeCode: 'ICICIBLUE',
        schemeName: 'ICICI Prudential Bluechip Fund',
        holdings: [
            { name: 'ICICI Bank Ltd.', weight: 9.5, sector: 'Financials' },
            { name: 'Reliance Industries Ltd.', weight: 8.0, sector: 'Energy' },
            { name: 'Infosys Ltd.', weight: 7.5, sector: 'Information Technology' },
            { name: 'HDFC Bank Ltd.', weight: 7.0, sector: 'Financials' },
            { name: 'Larsen & Toubro Ltd.', weight: 5.0, sector: 'Industrials' },
            { name: 'Bharti Airtel Ltd.', weight: 4.2, sector: 'Communication Services' },
            { name: 'Axis Bank Ltd.', weight: 4.0, sector: 'Financials' },
            { name: 'Maruti Suzuki India Ltd.', weight: 3.5, sector: 'Consumer Discretionary' },
            { name: 'Sun Pharmaceutical Industries Ltd.', weight: 2.8, sector: 'Health Care' },
            { name: 'Hindustan Unilever Ltd.', weight: 2.5, sector: 'Consumer Staples' },
        ],
    },
    {
        schemeCode: 'MIRAEASSET',
        schemeName: 'Mirae Asset Large Cap Fund',
        holdings: [
            { name: 'HDFC Bank Ltd.', weight: 9.2, sector: 'Financials' },
            { name: 'ICICI Bank Ltd.', weight: 8.8, sector: 'Financials' },
            { name: 'Reliance Industries Ltd.', weight: 8.5, sector: 'Energy' },
            { name: 'Infosys Ltd.', weight: 7.0, sector: 'Information Technology' },
            { name: 'Larsen & Toubro Ltd.', weight: 5.5, sector: 'Industrials' },
            { name: 'Bharti Airtel Ltd.', weight: 4.5, sector: 'Communication Services' },
            { name: 'State Bank of India', weight: 4.0, sector: 'Financials' },
            { name: 'Tata Consultancy Services Ltd.', weight: 3.5, sector: 'Information Technology' },
            { name: 'ITC Ltd.', weight: 3.0, sector: 'Consumer Staples' },
            { name: 'Kotak Mahindra Bank Ltd.', weight: 2.8, sector: 'Financials' },
        ],
    }
];

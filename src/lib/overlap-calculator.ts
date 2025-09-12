

/**
 * Mutual Fund Overlap Calculation Utility
 *
 * This utility provides functions to calculate the overlap between mutual funds based on their holdings.
 * It follows a detailed specification for normalization, matching, and metric calculation.
 */

// 1. Types and Interfaces
// =================================

interface RawConstituent {
  company: string;
  ticker?: string;
  weight_pct: number | string | null;
}

export interface RawFund {
  source: string;
  fetched_at_unix: number;
  fund_name: string;
  coverage_pct?: number;
  constituents_count: number;
  constituents: RawConstituent[];
}

interface Holding {
  key: string; // Unique key (ticker or normalized name)
  company: string;
  ticker: string;
  weight: number;
}

interface FundData {
  name: string;
  holdings: Map<string, Holding>;
  coverage: number;
  totalEquityWeight: number;
  holdingsCount: number;
}

export interface CommonHolding {
  company: string;
  ticker: string;
  weight_a: number;
  weight_b: number;
  min_weight: number;
}

export interface PairwiseResult {
  fund_a: string;
  fund_b: string;
  coverage_a: number;
  coverage_b: number;
  holdings_count_a: number;
  holdings_count_b: number;
  common_holdings_count: number;
  common_holdings: CommonHolding[];
  weighted_overlap: number;
  status: 'ok' | 'partial_coverage';
  status_note: string;
}

export interface OverlapOutput {
  meta: {
    generated_at_unix: number;
    fund_count: number;
    method: string;
  };
  pairs: PairwiseResult[];
  per_fund: {
    [fund_name: string]: {
      coverage_pct: number;
      computed_equity_total: number;
      holdings_count: number;
    };
  };
}

// 2. Normalization and Parsing Functions
// =========================================

const NON_STOCK_REGEX = /\b(cash|debt|receivable|payable|triparty|repo|net receivable|net payables|cash & equivalents)\b/i;
const SUFFIX_REGEX = /\s+(ltd\.?|limited|pvt\.?|pvt\. ltd\.?|inc\.?)$/i;

/**
 * Normalizes a company name for matching when a ticker is unavailable.
 */
function normalizeName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(SUFFIX_REGEX, '')
    .replace(/[.,]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Parses a weight value which can be a number, string, or null.
 * Handles percentage signs and comma decimals.
 */
function parseWeight(weight: number | string | null): number {
  if (weight === null || weight === undefined) return 0.0;
  if (typeof weight === 'number') return weight;
  if (typeof weight === 'string') {
    try {
      const cleanedWeight = weight.replace(/%/g, '').replace(/,/g, '.').trim();
      const parsed = parseFloat(cleanedWeight);
      return isNaN(parsed) ? 0.0 : parsed;
    } catch {
      return 0.0;
    }
  }
  return 0.0;
}

// 3. Core Data Processing
// =========================================

/**
 * Processes a raw fund object into a structured FundData object.
 */
function processFund(rawFund: RawFund): FundData {
  const holdings = new Map<string, Holding>();
  let computedEquityTotal = 0;

  for (const constituent of rawFund.constituents) {
    const weight = parseWeight(constituent.weight_pct);
    const ticker = (constituent.ticker || '').trim().toUpperCase();
    const company = constituent.company;

    // Exclude non-stock lines
    if (!ticker && NON_STOCK_REGEX.test(company)) {
      continue;
    }

    const key = ticker ? ticker : normalizeName(company);
    if (!key) continue;

    const existing = holdings.get(key);
    if (existing) {
      existing.weight += weight;
    } else {
      holdings.set(key, { key, company, ticker, weight });
    }
  }

  // Sum weights for computed coverage
  for (const holding of holdings.values()) {
    computedEquityTotal += holding.weight;
  }
  
  return {
    name: rawFund.fund_name,
    holdings,
    coverage: rawFund.coverage_pct || computedEquityTotal,
    totalEquityWeight: computedEquityTotal,
    holdingsCount: holdings.size,
  };
}


// 4. Overlap Calculation
// =========================================

/**
 * Computes the pairwise overlap between two processed funds.
 */
function calculatePairwiseOverlap(fundA: FundData, fundB: FundData): PairwiseResult {
  const common_holdings: CommonHolding[] = [];
  let weighted_overlap = 0;
  
  const [smallerFund, largerFund] = fundA.holdings.size < fundB.holdings.size ? [fundA, fundB] : [fundB, fundA];

  for (const [key, holdingA] of smallerFund.holdings.entries()) {
    const holdingB = largerFund.holdings.get(key);
    if (holdingB) {
      const min_weight = Math.min(holdingA.weight, holdingB.weight);
      weighted_overlap += min_weight;

      // Ensure correct fund order in output
      const isFundAFirst = fundA.name === smallerFund.name;
      
      common_holdings.push({
        company: holdingA.company,
        ticker: holdingA.ticker,
        weight_a: isFundAFirst ? holdingA.weight : holdingB.weight,
        weight_b: isFundAFirst ? holdingB.weight : holdingA.weight,
        min_weight,
      });
    }
  }

  // Sort common holdings by min_weight descending
  common_holdings.sort((a, b) => b.min_weight - a.min_weight);

  const status = fundA.coverage < 80 || fundB.coverage < 80 ? 'partial_coverage' : 'ok';
  let status_note = '';
  if (status === 'partial_coverage') {
    status_note = `Results are partial as one or both funds have coverage below 80%. (Fund A: ${fundA.coverage.toFixed(2)}%, Fund B: ${fundB.coverage.toFixed(2)}%)`;
  }
  
  return {
    fund_a: fundA.name,
    fund_b: fundB.name,
    coverage_a: parseFloat(fundA.coverage.toFixed(4)),
    coverage_b: parseFloat(fundB.coverage.toFixed(4)),
    holdings_count_a: fundA.holdingsCount,
    holdings_count_b: fundB.holdingsCount,
    common_holdings_count: common_holdings.length,
    common_holdings,
    weighted_overlap: parseFloat(weighted_overlap.toFixed(4)),
    status,
    status_note,
  };
}


// 5. Main Public Function
// =========================================

/**
 * Main function to calculate overlap metrics for a list of raw fund objects.
 */
export function calculateAllOverlaps(rawFunds: RawFund[]): OverlapOutput {
  const processedFunds = rawFunds.map(processFund);
  const pairs: PairwiseResult[] = [];
  const per_fund: OverlapOutput['per_fund'] = {};

  // Generate all unique pairs
  for (let i = 0; i < processedFunds.length; i++) {
    for (let j = i + 1; j < processedFunds.length; j++) {
      const fundA = processedFunds[i];
      const fundB = processedFunds[j];
      const pairResult = calculatePairwiseOverlap(fundA, fundB);
      pairs.push(pairResult);
    }
  }

  // Populate per_fund details
  for (const fund of processedFunds) {
    per_fund[fund.name] = {
      coverage_pct: parseFloat(fund.coverage.toFixed(4)),
      computed_equity_total: parseFloat(fund.totalEquityWeight.toFixed(4)),
      holdings_count: fund.holdingsCount,
    };
  }
  
  return {
    meta: {
      generated_at_unix: Math.floor(Date.now() / 1000),
      fund_count: rawFunds.length,
      method: "weighted_overlap",
    },
    pairs,
    per_fund,
  };
}



// src/lib/overlap-calculator.ts
// TypeScript - robust mutual-fund overlap logic
// Exports:
//   - type RawFund
//   - type Constituent
//   - type CommonHolding
//   - type PairwiseResult
//   - type PerFundSummary
//   - type OverlapOutput
//   - function calculateAllOverlaps(funds: RawFund[]): OverlapOutput

export type Constituent = {
  company: string;
  ticker?: string | null;
  weight_pct?: number | string | null;
};

export type RawFund = {
  source?: string;
  fetched_at_unix?: number;
  fund_name: string;
  aum?: number;
  coverage_pct?: number | null;
  constituents_count?: number;
  constituents?: Constituent[] | null;
};

export type CommonHolding = {
  company: string;
  ticker?: string | null;
  weight_a: number; // percent (e.g., 2.34)
  weight_b: number;
  min_weight: number;
};

export type PairwiseResult = {
  fund_a: string;
  fund_b: string;
  coverage_a: number;
  coverage_b: number;
  holdings_count_a: number;
  holdings_count_b: number;
  common_holdings: CommonHolding[];
  weighted_overlap: number; // percent points, rounded to 4 decimals
  weighted_overlap_pct_normalized?: number | null; // optional normalized to min equity totals
  simple_overlap_pct?: number | null; // optional simple overlap %
  status: 'ok' | 'partial_coverage';
};

export type PerFundSummary = {
  coverage_pct: number;
  computed_equity_total: number;
  holdings_count: number;
};

export type OverlapOutput = {
  meta: { generated_at_unix: number; fund_count: number; method: string };
  pairs: PairwiseResult[];
  pair_matrix: Record<string, number>;
  per_fund: Record<string, PerFundSummary>;
};

/* -----------------------
   Helpers & normalization
   ----------------------- */

const NON_STOCK_REGEX = /\b(cash|debt|receivable|payable|triparty|repo|net receivable|net payables|cash & equivalents|cash and equivalents|net receivables|net payables)\b/i;

// Normalize company name for fallback matching
function normalizeName(name?: string | null): string {
  if (!name) return '';
  let s = String(name).trim().toLowerCase();
  // remove common suffixes and punctuation
  s = s.replace(/\b(ltd|ltd\.|limited|pvt|pvt\.|pvt ltd|private limited|inc|l\.td)\b/g, '');
  s = s.replace(/[\.,'"\(\)\-\/&]/g, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

// Normalize ticker (primary key)
function normalizeTicker(t?: string | null): string {
  if (!t) return '';
  return String(t).trim().toUpperCase();
}

// Parse weight robustly (handles numbers, "8.20%", "8,20%", "1,234.56")
function parseWeight(w?: number | string | null): number {
  if (w === null || w === undefined) return 0;
  if (typeof w === 'number') return Number(w);
  const s = String(w).trim();
  if (s === '') return 0;
  // strip percent sign
  let t = s.replace('%', '').trim();
  // if both comma and dot present, assume comma is thousands sep
  if (t.includes(',') && t.includes('.')) {
    t = t.replace(/,/g, '');
  } else if (t.includes(',') && !t.includes('.')) {
    // comma as decimal separator (e.g., "8,20")
    t = t.replace(',', '.');
  }
  // remove non-numeric except dot and minus
  t = t.replace(/[^0-9.\-]/g, '');
  if (t === '') return 0;
  const n = Number(t);
  return isNaN(n) ? 0 : n;
}

function roundTo(v: number, decimals = 4): number {
  const p = Math.pow(10, decimals);
  return Math.round((v + Number.EPSILON) * p) / p;
}

/* -----------------------
   Build per-fund key->weight map
   ----------------------- */
type FundKeyMap = {
  keyToWeight: Map<string, number>;
  keyToTicker: Map<string, string | null>;
  companyByKey: Map<string, string>;
  computed_equity_total: number;
};

function buildFundKeyMap(fund: RawFund): FundKeyMap {
  const keyToWeight = new Map<string, number>();
  const keyToTicker = new Map<string, string | null>();
  const companyByKey = new Map<string, string>();

  const constituents = fund.constituents ?? [];
  for (const c of constituents) {
    if (!c) continue;
    const rawName = c.company ?? '';
    const rawTicker = c.ticker ?? '';
    // Exclude non-stock aggregates
    if (NON_STOCK_REGEX.test(rawName)) {
      // skip from stock-level overlap
      continue;
    }
    const ticker = normalizeTicker(rawTicker);
    const nameKey = normalizeName(rawName);
    const weight = parseWeight(c.weight_pct);

    const key = ticker ? `T:${ticker}` : `N:${nameKey || rawName.toLowerCase().trim() || ('@' + Math.random().toString(36).slice(2, 7))}`;

    const prev = keyToWeight.get(key) ?? 0;
    keyToWeight.set(key, prev + (isFinite(weight) ? weight : 0));
    keyToTicker.set(key, ticker || null);
    // store best company display name (longest / prefer original)
    const prevCompany = companyByKey.get(key);
    if (!prevCompany || (rawName && rawName.length > prevCompany.length)) {
      companyByKey.set(key, rawName || prevCompany || '');
    }
  }

  // compute equity total (sum of all stock weights in map)
  let computed_equity_total = 0;
  for (const w of keyToWeight.values()) computed_equity_total += w;

  return { keyToWeight, keyToTicker, companyByKey, computed_equity_total };
}

/* -----------------------
   Pairwise computation
   ----------------------- */

export function calculateAllOverlaps(funds: RawFund[]): OverlapOutput {
  const fundCount = funds.length;
  const perFundSummary: Record<string, PerFundSummary> = {};
  const maps: FundKeyMap[] = [];

  // Build maps and per-fund summaries
  for (const fund of funds) {
    const map = buildFundKeyMap(fund);
    maps.push(map);
    const computed_equity_total = roundTo(map.computed_equity_total, 6); // keep precision
    const coverage_pct = (typeof fund.coverage_pct === 'number' && isFinite(fund.coverage_pct)) ? fund.coverage_pct : roundTo(computed_equity_total, 4);
    perFundSummary[fund.fund_name] = {
      coverage_pct: roundTo(coverage_pct, 4),
      computed_equity_total: roundTo(computed_equity_total, 4),
      holdings_count: map.keyToWeight.size,
    };
  }

  const pairs: PairwiseResult[] = [];
  const pairMatrix: Record<string, number> = {};

  // compute pairwise for all unique combinations
  for (let i = 0; i < fundCount; i++) {
    for (let j = i + 1; j < fundCount; j++) {
      const A = funds[i];
      const B = funds[j];
      const mapA = maps[i];
      const mapB = maps[j];

      // iterate over smaller map for efficiency
      const [smallMap, largeMap, smallIdxIsA] = mapA.keyToWeight.size <= mapB.keyToWeight.size
        ? [mapA, mapB, true]
        : [mapB, mapA, false];

      const common_holdings: CommonHolding[] = [];

      let weighted_overlap_sum = 0;

      for (const [key, wSmall] of smallMap.keyToWeight) {
        const wLarge = largeMap.keyToWeight.get(key) ?? 0;
        if (!wSmall && !wLarge) continue;
        const minw = Math.min(wSmall, wLarge);
        if (minw <= 0) continue; // ignore zero-min
        // build holding record with correct mapping to fund A/B
        const company = smallMap.companyByKey.get(key) ?? largeMap.companyByKey.get(key) ?? key;
        const ticker = smallMap.keyToTicker.get(key) ?? largeMap.keyToTicker.get(key) ?? null;
        const weight_a = smallIdxIsA ? wSmall : wLarge;
        const weight_b = smallIdxIsA ? wLarge : wSmall;

        common_holdings.push({
          company: company || (ticker ?? key),
          ticker: ticker || null,
          weight_a: roundTo(weight_a, 6),
          weight_b: roundTo(weight_b, 6),
          min_weight: roundTo(minw, 6),
        });

        weighted_overlap_sum += minw;
      }

      // sort common holdings by min_weight desc
      common_holdings.sort((x, y) => y.min_weight - x.min_weight);

      const weighted_overlap = roundTo(weighted_overlap_sum, 4); // percent points (e.g., 27.02)

      // normalized overlap to equity totals
      const equityA = maps[i].computed_equity_total || 0;
      const equityB = maps[j].computed_equity_total || 0;
      const minEquity = Math.min(equityA, equityB);
      const normalized = minEquity > 0 ? roundTo((weighted_overlap_sum / minEquity) * 100, 4) : null;

      // simple overlap % (common weights / min total equity *100)
      const simpleOverlap = minEquity > 0 ? roundTo((weighted_overlap_sum / minEquity) * 100, 4) : null;

      const coverage_a = perFundSummary[A.fund_name]?.coverage_pct ?? 0;
      const coverage_b = perFundSummary[B.fund_name]?.coverage_pct ?? 0;
      const status: PairwiseResult['status'] = (coverage_a < 80 || coverage_b < 80) ? 'partial_coverage' : 'ok';

      const pair: PairwiseResult = {
        fund_a: A.fund_name,
        fund_b: B.fund_name,
        coverage_a: roundTo(coverage_a, 4),
        coverage_b: roundTo(coverage_b, 4),
        holdings_count_a: perFundSummary[A.fund_name].holdings_count,
        holdings_count_b: perFundSummary[B.fund_name].holdings_count,
        common_holdings,
        weighted_overlap,
        weighted_overlap_pct_normalized: normalized,
        simple_overlap_pct: simpleOverlap,
        status,
      };

      pairs.push(pair);
      const keyAB = `${A.fund_name}|${B.fund_name}`;
      pairMatrix[keyAB] = weighted_overlap;
    }
  }

  return {
    meta: { generated_at_unix: Math.floor(Date.now() / 1000), fund_count: fundCount, method: 'weighted_overlap' },
    pairs,
    pair_matrix: pairMatrix,
    per_fund: perFundSummary,
  };
}

// src/hooks/use-lic-surrender-calculator.ts
'use client';

import { useState } from 'react';

// --- TYPE DEFINITIONS ---

export type LicSurrenderFormValues = {
  plan: string;
  basicSumAssured: number;
  policyTerm: number;
  premiumsPaid: number;
  totalPremiumsPayable: number;
  vestedBonus: number;
  loanPrincipal: number;
};

export type CalculationResult = {
  policyYearCompleted: number;
  paidUpSumAssured: number;
  gsv: {
    premiumComponent: number;
    bonusComponent: number;
    total: number;
  };
  ssv: number;
  grossSurrenderValue: number;
  netPayout: number;
  loanAdjustments: {
    principal: number;
    interest: number; // For now, we'll keep it simple as the spec doesn't require complex interest calculation UI yet
  };
};

// --- DUMMY DATA (to be replaced with real plan matrices) ---
// This simulates the plan-specific data model.
const PLAN_DATA: Record<string, any> = {
  'new-jeevan-anand': {
    gsv: {
      premiums_factor_matrix: { '20': { '3': 0.3, '5': 0.5, '10': 0.7, '19': 0.9 } },
      bonus_factor_matrix: { '20': { '3': 0.15, '5': 0.17, '10': 0.3, '19': 0.8 } }
    },
    eligibility: { surrender_allowed_after_years: 1, gsv_accrues_after_years: 2 },
  },
  'jeevan-labh': {
     gsv: {
      premiums_factor_matrix: { '25': { '3': 0.3, '5': 0.5, '10': 0.7, '24': 0.9 } },
      bonus_factor_matrix: { '25': { '3': 0.15, '5': 0.17, '10': 0.3, '24': 0.8 } }
    },
    eligibility: { surrender_allowed_after_years: 2, gsv_accrues_after_years: 2 },
  }
};


// --- CORE CALCULATION FUNCTION ---

function getGsvFactor(matrix: Record<string, Record<string, number>>, term: number, year: number): number {
    const termData = matrix[String(term)];
    if (!termData) return 0; // Or find closest term

    const availableYears = Object.keys(termData).map(Number).sort((a, b) => a - b);
    let applicableFactor = 0;
    // Find the highest year bucket that is less than or equal to the completed year
    for (const yearBucket of availableYears) {
        if (year <= yearBucket) {
            applicableFactor = termData[yearBucket];
            break; // Found the right bucket
        }
        // If it's the last available year bucket, use it
        if (year > yearBucket) {
           applicableFactor = termData[yearBucket];
        }
    }
    return applicableFactor;
}


export function calculateLicSurrenderValue(values: LicSurrenderFormValues): CalculationResult | null {
  const { plan, basicSumAssured, policyTerm, premiumsPaid: premiumsPaidCount, vestedBonus, loanPrincipal } = values;

  // For this simplified version, we derive totalPremiumsPaid from an estimated annual premium.
  // A more robust version would take `base_premium_per_mode` as a direct input.
  const estimatedAnnualPremium = (premiumsPaidCount > 0 && values.totalPremiumsPayable > 0) ? (basicSumAssured / values.totalPremiumsPayable) * 25 : 50000;
  const totalPremiumsPaid = estimatedAnnualPremium * premiumsPaidCount;

  // --- DERIVED VALUES ---
  const policyYearCompleted = premiumsPaidCount; // Simplified fallback
  const paidUpRatio = values.totalPremiumsPayable > 0 ? premiumsPaidCount / values.totalPremiumsPayable : 0;
  const paidUpSumAssured = basicSumAssured * paidUpRatio;
  
  const PLAN = PLAN_DATA[plan] || PLAN_DATA['new-jeevan-anand']; // Fallback to a default plan

  // --- GSV Calculation ---
  let gsvPremiumComponent = 0;
  let gsvBonusComponent = 0;
  let gsvTotal = 0;

  if (policyYearCompleted >= PLAN.eligibility.gsv_accrues_after_years) {
      const gsvFactorPrem = getGsvFactor(PLAN.gsv.premiums_factor_matrix, policyTerm, policyYearCompleted);
      const gsvFactorBonus = getGsvFactor(PLAN.gsv.bonus_factor_matrix, policyTerm, policyYearCompleted);

      gsvPremiumComponent = totalPremiumsPaid * gsvFactorPrem;
      gsvBonusComponent = vestedBonus * gsvFactorBonus;
      gsvTotal = gsvPremiumComponent + gsvBonusComponent;
  }
  
  // --- SSV (Heuristic) Calculation ---
  // As per spec, implementing the heuristic method for now.
  // SSV_est ≈ (PuSA + vested_bonus) × SVF_est[year]
  const ssvFactorEst = Math.min(0.9, 0.3 + (Math.max(0, policyYearCompleted - 2) * 0.05)); // Simplified curve
  const ssvEstimated = (paidUpSumAssured + vestedBonus) * ssvFactorEst;
  const ssvDisplay = Math.max(gsvTotal, ssvEstimated);

  // --- Net Payout ---
  const grossSurrenderValue = ssvDisplay; // Per spec, payout is higher of GSV/SSV
  const accruedLoanInterest = 0; // Simplified for now
  const netPayout = Math.max(0, grossSurrenderValue - loanPrincipal - accruedLoanInterest);

  return {
    policyYearCompleted,
    paidUpSumAssured,
    gsv: {
      premiumComponent: gsvPremiumComponent,
      bonusComponent: gsvBonusComponent,
      total: gsvTotal,
    },
    ssv: ssvDisplay,
    grossSurrenderValue,
    netPayout,
    loanAdjustments: {
      principal: loanPrincipal,
      interest: accruedLoanInterest,
    },
  };
}


// --- THE REACT HOOK ---

export function useLicSurrenderCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performCalculation = (values: LicSurrenderFormValues) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    // Simulate async calculation
    setTimeout(() => {
      try {
        const calcResult = calculateLicSurrenderValue(values);
        setResult(calcResult);
      } catch (e: any) {
        setError(e.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  return { result, isLoading, error, performCalculation };
}

export type CalculatorType = 'ppf' | 'ssy' | 'maturity' | 'nps';

export interface WorkerMessage {
  type: CalculatorType;
  payload: any;
  id: string;
}

export interface WorkerResponse {
  id: string;
  result: any;
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { type, payload, id } = e.data;

  try {
    let result;
    if (type === 'ppf') {
      result = calculatePPF(payload);
    } else if (type === 'ssy') {
      result = calculateSSY(payload);
    } else if (type === 'maturity') {
      result = calculateMaturity(payload);
    } else if (type === 'nps') {
      result = calculateNPS(payload);
    } else {
      throw new Error(`Unknown calculation type: ${type}`);
    }

    self.postMessage({ id, result } as WorkerResponse);
  } catch (error) {
    self.postMessage({ id, error: (error as Error).message });
  }
};

function calculatePPF(payload: { annualInvestment: number; tenure: number; interestRate: number }) {
  let balance = 0;
  let totalInvestment = 0;
  let totalInterest = 0;
  const yearlyData = [];

  for (let i = 1; i <= payload.tenure; i++) {
    const openingBalance = balance;
    const invested = payload.annualInvestment;
    totalInvestment += invested;
    const interest = (openingBalance + invested) * (payload.interestRate / 100);
    totalInterest += interest;
    const closingBalance = openingBalance + invested + interest;
    balance = closingBalance;

    yearlyData.push({
      year: i,
      openingBalance,
      invested,
      interest,
      closingBalance,
      totalInvestment,
      totalInterest,
    });
  }

  return {
    maturityValue: balance,
    totalInvestment,
    totalInterest,
    yearlyData,
  };
}

function calculateSSY(payload: { annualInvestment: number; girlAge: number; interestRate: number }) {
  let balance = 0;
  let totalInvestment = 0;
  let totalInterest = 0;
  const yearlyData = [];
  const tenure = 21; // SSY maturity is 21 years from opening
  const investmentPeriod = 15; // Deposits are made for first 15 years only

  for (let i = 1; i <= tenure; i++) {
    const openingBalance = balance;
    const invested = i <= investmentPeriod ? payload.annualInvestment : 0;
    totalInvestment += invested;
    const interest = (openingBalance + invested) * (payload.interestRate / 100);
    totalInterest += interest;
    const closingBalance = openingBalance + invested + interest;
    balance = closingBalance;

    yearlyData.push({
      year: i,
      childAge: payload.girlAge + i,
      openingBalance,
      invested,
      interest,
      closingBalance,
      totalInvestment,
      totalInterest,
    });
  }

  return {
    maturityValue: balance,
    totalInvestment,
    totalInterest,
    yearlyData,
  };
}

function calculateMaturity(payload: { sumAssured: number; term: number; bonusRate: number; fabRate: number }) {
    // simplified maturity calculation
    const totalBonus = (payload.sumAssured * payload.bonusRate * payload.term) / 1000;
    const finalAdditionalBonus = payload.term >= 15 ? (payload.sumAssured * payload.fabRate) / 1000 : 0;
    const totalReturns = payload.sumAssured + totalBonus + finalAdditionalBonus;
    
    return {
        maturityAmount: totalReturns,
        sumAssured: payload.sumAssured,
        totalBonus: totalBonus,
        fab: finalAdditionalBonus
    }
}

function calculateNPS(payload: { contribution: number; contributionMode: string; currentAge: number; retirementAge: number; expectedReturns: number; annuityPercentage: number; annuityRate: number }) {
  const investmentPeriod = payload.retirementAge - payload.currentAge;
  const annualContribution = payload.contributionMode === 'monthly' ? payload.contribution * 12 : payload.contribution;
  const r = payload.expectedReturns / 100;

  let balance = 0;
  let totalInvestment = 0;
  const yearlyData = [];

  for (let i = 1; i <= investmentPeriod; i++) {
    const openingBalance = balance;
    const interest = (openingBalance + annualContribution) * r;
    const closingBalance = openingBalance + annualContribution + interest;
    balance = closingBalance;
    totalInvestment += annualContribution;

    yearlyData.push({
      year: i,
      age: payload.currentAge + i,
      openingBalance,
      invested: annualContribution,
      interest,
      closingBalance,
      totalInvestment,
    });
  }

  const totalCorpus = balance;
  const annuityValue = totalCorpus * (payload.annuityPercentage / 100);
  const lumpSumValue = totalCorpus - annuityValue;
  const monthlyPension = (annuityValue * (payload.annuityRate / 100)) / 12;

  return {
    totalCorpus,
    lumpSumValue,
    annuityValue,
    monthlyPension,
    totalInvestment,
    totalInterest: totalCorpus - totalInvestment,
    yearlyData,
  };
}

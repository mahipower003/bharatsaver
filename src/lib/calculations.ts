
type FormValues = {
  currentAge: number;
  retirementAge: number;
  monthlyExpenses: number;
  currentSavings: number;
  inflationRate: number;
  preRetirementReturns: number;
  postRetirementReturns: number;
};

type YearlyData = {
  year: number;
  age: number;
  sipValue: number;
  existingCorpusValue: number;
  totalCorpus: number;
};

type CalculationResult = {
  requiredCorpus: number;
  corpusShortfall: number;
  monthlySip: number;
  yearlyData: YearlyData[];
  futureMonthlyExpenses: number;
};

export function calculateRetirementCorpus(values: FormValues): CalculationResult {
    const {
        currentAge,
        retirementAge,
        monthlyExpenses,
        currentSavings,
        inflationRate,
        preRetirementReturns,
        postRetirementReturns
    } = values;

    const yearsToRetire = retirementAge - currentAge;
    const inflation = inflationRate / 100;
    const preRetirementROR = preRetirementReturns / 100;
    const postRetirementROR = postRetirementReturns / 100;

    const futureMonthlyExpenses = monthlyExpenses * Math.pow(1 + inflation, yearsToRetire);
    const futureAnnualExpenses = futureMonthlyExpenses * 12;
    
    const retirementYears = 85 - retirementAge;
    let requiredCorpus;
    
    if (postRetirementROR !== inflation) {
      const realReturnRate = (1 + postRetirementROR) / (1 + inflation) - 1;
      requiredCorpus = futureAnnualExpenses * ((1 - Math.pow(1 + realReturnRate, -retirementYears)) / realReturnRate);
    } else {
      requiredCorpus = futureAnnualExpenses * retirementYears;
    }

    const monthlySip = calculateSip({
        targetCorpus: requiredCorpus,
        yearsToRetire: yearsToRetire,
        rateOfReturn: preRetirementReturns,
        existingSavings: currentSavings,
    });
    
    const yearlyData: YearlyData[] = [];
    let existingCorpusValue = currentSavings;
    let sipCorpusValue = 0;
    const annualSipContribution = monthlySip * 12;

    for (let year = 1; year <= yearsToRetire; year++) {
      existingCorpusValue *= (1 + preRetirementROR);
      sipCorpusValue = sipCorpusValue * (1 + preRetirementROR) + annualSipContribution;

      yearlyData.push({
        year,
        age: currentAge + year,
        sipValue: sipCorpusValue,
        existingCorpusValue,
        totalCorpus: existingCorpusValue + sipCorpusValue,
      });
    }

    const finalCorpus = (yearlyData[yearlyData.length - 1]?.totalCorpus) || 0;
    const corpusShortfall = requiredCorpus - finalCorpus;

    return {
      requiredCorpus,
      corpusShortfall,
      monthlySip: monthlySip > 0 ? monthlySip : 0,
      yearlyData,
      futureMonthlyExpenses,
    };
}


type SipCalculationParams = {
    targetCorpus: number;
    yearsToRetire: number;
    rateOfReturn: number;
    existingSavings: number;
};

export function calculateSip({ targetCorpus, yearsToRetire, rateOfReturn, existingSavings }: SipCalculationParams): number {
    const preRetirementROR = rateOfReturn / 100;
    const futureValueOfCurrentSavings = existingSavings * Math.pow(1 + preRetirementROR, yearsToRetire);
    
    const corpusShortfall = targetCorpus - futureValueOfCurrentSavings;

    let monthlySip = 0;
    if (corpusShortfall > 0) {
      const monthlyRate = preRetirementROR / 12;
      const totalMonths = yearsToRetire * 12;
      if (monthlyRate > 0) {
        monthlySip = (corpusShortfall * monthlyRate) / ((Math.pow(1 + monthlyRate, totalMonths) - 1) * (1 + monthlyRate));
      } else {
        monthlySip = corpusShortfall / totalMonths;
      }
    }
    
    return monthlySip > 0 ? monthlySip : 0;
}

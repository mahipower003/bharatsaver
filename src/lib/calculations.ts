
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
      requiredCorpus = futureAnnualExpenses * ((1 - Math.pow(1 + realReturnRate, -retirementYears)) / realReturnRate) * (1 + realReturnRate);
    } else {
      requiredCorpus = futureAnnualExpenses * retirementYears;
    }

    const futureValueOfCurrentSavings = currentSavings * Math.pow(1 + preRetirementROR, yearsToRetire);
    
    const corpusShortfall = requiredCorpus - futureValueOfCurrentSavings;

    let monthlySip = 0;
    if (corpusShortfall > 0) {
      const monthlyRate = preRetirementROR / 12;
      const totalMonths = yearsToRetire * 12;
      if (monthlyRate > 0) {
        monthlySip = (corpusShortfall * monthlyRate) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
      } else {
        monthlySip = corpusShortfall / totalMonths;
      }
    }
    
    const yearlyData: YearlyData[] = [];
    let existingCorpusValue = currentSavings;
    let sipValue = 0;
    const annualSipContribution = monthlySip * 12;

    for (let year = 1; year <= yearsToRetire; year++) {
      existingCorpusValue *= (1 + preRetirementROR);
      
      let futureValOfSipForYear = 0;
      if (preRetirementROR > 0) {
        futureValOfSipForYear = annualSipContribution * (Math.pow(1 + preRetirementROR, year) - 1) / preRetirementROR;
      } else {
        futureValOfSipForYear = annualSipContribution * year;
      }
      sipValue = futureValOfSipForYear;

      yearlyData.push({
        year,
        age: currentAge + year,
        sipValue,
        existingCorpusValue,
        totalCorpus: existingCorpusValue + sipValue,
      });
    }

    return {
      requiredCorpus,
      corpusShortfall,
      monthlySip: monthlySip > 0 ? monthlySip : 0,
      yearlyData,
      futureMonthlyExpenses,
    };
}

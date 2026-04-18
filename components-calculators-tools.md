# Components Overview: Calculators and Tools

This document provides an overview of the calculator and tool components available in the BharatSaver application. These components are located in `src/components/calculators/` and `src/components/tools/` respectively.

## Calculators

The calculators directory contains various financial calculation components for different investment and insurance products. Each calculator helps users compute returns, premiums, and other financial metrics.

### APY Calculator
- **File**: `ApyCalculator.tsx`
- **Purpose**: Calculates Annual Percentage Yield (APY) for investments, showing compound interest effects.

### APY Premium Chart
- **File**: `ApyPremiumChart.tsx`
- **Purpose**: Visual chart component for displaying APY premium calculations and comparisons.

### FD vs PPF Calculator
- **File**: `FdVsPpfCalculator.tsx`
- **Purpose**: Compares returns between Fixed Deposits (FD) and Public Provident Fund (PPF) investments.

### Jeevan Utsav Calculator
- **File**: `JeevanUtsavCalculator.tsx`
- **Purpose**: Calculates benefits and premiums for LIC Jeevan Utsav insurance plan.

### LIC Child Plan Calculator
- **File**: `LicChildPlanCalculator.tsx`
- **Purpose**: Calculates premiums and benefits for LIC child insurance plans.

### LIC Jeevan Anand Calculator (Page Client)
- **File**: `LicJeevanAnandCalculatorPageClient.tsx`
- **Purpose**: Client-side calculator for LIC Jeevan Anand plan calculations.

### LIC Jeevan Labh Calculator
- **File**: `LicJeevanLabhCalculator.tsx`
- **Purpose**: Calculates returns and benefits for LIC Jeevan Labh insurance plan.

### LIC Jeevan Umang Calculator
- **File**: `LicJeevanUmangCalculator.tsx`
- **Purpose**: Computes premiums and maturity values for LIC Jeevan Umang plan.

### LIC Maturity Calculator
- **File**: `LicMaturityCalculator.tsx`
- **Purpose**: Calculates maturity amounts for LIC insurance policies.

### LIC Maturity Calculator (Page Client)
- **File**: `LicMaturityCalculatorPageClient.tsx`
- **Purpose**: Client-side version of LIC maturity calculator.

### LIC New Jeevan Anand Calculator
- **File**: `LicNewJeevanAnandCalculator.tsx`
- **Purpose**: Updated calculator for LIC Jeevan Anand insurance plan.

### LIC Premium Calculator
- **File**: `LicPremiumCalculator.tsx`
- **Purpose**: Calculates insurance premiums for various LIC plans.

### LIC Single Premium Endowment Calculator
- **File**: `LicSinglePremiumEndowmentCalculator.tsx`
- **Purpose**: Calculates benefits for single premium endowment policies.

### LIC Surrender Value Calculator
- **File**: `LicSurrenderValueCalculator.tsx`
- **Purpose**: Computes surrender values for LIC policies.

### LIC Term Insurance Calculator
- **File**: `LicTermInsuranceCalculator.tsx`
- **Purpose**: Calculates premiums and coverage for term insurance plans.

### LIC Umang Premium Chart
- **File**: `LicUmangPremiumChart.tsx`
- **Purpose**: Chart component for LIC Umang premium visualizations.

### Loan Optimizer
- **File**: `LoanOptimizer.tsx`
- **Purpose**: Helps optimize loan repayment strategies and EMI calculations.

### Mutual Fund Overlap Calculator
- **File**: `MutualFundOverlapCalculator.tsx`
- **Purpose**: Analyzes and calculates overlap between different mutual fund portfolios.

### NPS Calculator
- **File**: `NpsCalculator.tsx`
- **Purpose**: Calculates returns and benefits for National Pension Scheme (NPS).

### PPF Calculator
- **File**: `PpfCalculator.tsx`
- **Purpose**: Computes Public Provident Fund investment returns and maturity values.

### Retirement Corpus Calculator
- **File**: `RetirementCorpusCalculator.tsx`
- **Purpose**: Helps calculate the corpus needed for retirement planning.

### SSY Calculator
- **File**: `SsyCalculator.tsx`
- **Purpose**: Calculates Sukanya Samriddhi Yojana investment returns.

### Tax Regime Calculator
- **File**: `TaxRegimeCalculator.tsx`
- **Purpose**: Compares tax savings under different tax regimes in India.

### UPS Pension Calculator
- **File**: `UpsPensionCalculator.tsx`
- **Purpose**: Calculates pension benefits under Uttar Pradesh State Pension Scheme.

## Tools

The tools directory contains specialized utility components for financial analysis and research.

### Mutual Fund Screener
- **File**: `MutualFundScreener.tsx`
- **Purpose**: A tool for screening and filtering mutual funds based on various criteria like performance, risk, and category.

## Usage Notes

- All calculator components are designed to work with the application's data layer and internationalization system.
- Components follow React best practices and use TypeScript for type safety.
- Many calculators integrate with chart components for visual data representation.
- The application supports multiple languages, and these components are designed to be locale-aware.
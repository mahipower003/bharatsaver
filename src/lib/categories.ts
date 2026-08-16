import { calculators } from '@/data/calculators';
import type { Calculator } from '@/lib/types';

export type CategoryId = 'lic-insurance' | 'pension-retirement' | 'tax-savings' | 'mutual-funds' | 'loans-credit';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  slugs: string[];
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'lic-insurance',
    name: 'LIC Insurance & Policy Calculators',
    shortName: 'LIC Policies',
    description: 'Calculate premiums, maturity, guaranteed additions, and surrender values for active LIC plans.',
    iconName: 'ShieldCheck',
    slugs: [
      'lic-premium-calculator',
      'jeevan-utsav-calculator',
      'lic-jeevan-umang-calculator',
      'lic-jeevan-anand-calculator',
      'lic-jeevan-labh-calculator',
      'lic-single-premium-endowment-calculator',
      'lic-maturity-calculator',
      'lic-surrender-value-calculator',
      'lic-child-plan',
      'lic-term-insurance',
      'calculate-lic-maturity-amount',
    ],
  },
  {
    id: 'pension-retirement',
    name: 'Retirement & Pension Calculators',
    shortName: 'Retirement & Pension',
    description: 'Plan your golden years with National Pension System (NPS), APY, UPS, and corpus tools.',
    iconName: 'TrendingUp',
    slugs: [
      'nps-calculator',
      'apy-calculator',
      'ups-pension-calculator',
      'retirement-corpus-calculator',
    ],
  },
  {
    id: 'tax-savings',
    name: 'Tax Saving & Government Schemes',
    shortName: 'Tax & Savings',
    description: 'Optimize tax under Section 80C and calculate returns for PPF, Sukanya Samriddhi, and FDs.',
    iconName: 'Landmark',
    slugs: [
      'ppf-calculator',
      'ssy-calculator',
      'fd-vs-ppf-calculator',
      'tax-regime-calculator',
    ],
  },
  {
    id: 'mutual-funds',
    name: 'Mutual Funds & Investment Strategy',
    shortName: 'Mutual Funds & SIP',
    description: 'Compare LIC vs Equity SIP, check mutual fund overlap, and screen top direct funds.',
    iconName: 'Layers',
    slugs: [
      'mutual-fund-screener',
      'mutual-fund-overlap-calculator',
      'lic-vs-sip-calculator',
      'lic-vs-ppf-calculator',
    ],
  },
  {
    id: 'loans-credit',
    name: 'Loans & Policy Debt Optimization',
    shortName: 'Loan Optimization',
    description: 'Calculate policy loan eligibility, interest savings on prepayments, and EMI schedules.',
    iconName: 'BadgePercent',
    slugs: [
      'loan-optimizer',
      'lic-loan-calculator',
    ],
  },
];

export function getCalculatorsByCategory(categoryId: CategoryId): Calculator[] {
  const category = CATEGORIES.find(c => c.id === categoryId);
  if (!category) return [];
  return calculators.filter(calc => category.slugs.includes(calc.slug));
}

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return CATEGORIES.find(c => c.slugs.includes(slug));
}

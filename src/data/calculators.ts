import {
  Landmark,
  Baby,
  TrendingUp,
  Shield,
  ArrowRightLeft,
  FileText,
  Target,
  BadgePercent,
  Layers,
  Building,
  Sparkles,
} from 'lucide-react';
import type { Calculator } from '@/types';

export const calculators: Calculator[] = [
  {
    slug: 'nps-calculator',
    title: 'NPS Calculator',
    description: 'H\'ee later',
    icon: TrendingUp,
    link_text: 'Learn more'
  },
  {
    slug: 'fd-vs-ppf-calculator',
    title: 'FD vs PPF',
    description: 'Learn-more',
    icon: ArrowRightLeft,
    link_text: 'Learn more'
  },
  {
    slug: 'retirement-corpus-calculator',
    title: 'Retirement Corpus Calculator',
    description: 'Platn cmfline',
    icon: Target,
    link_text: 'Learn more'
  },
  {
    slug: 'loan-optimizer',
    title: 'Loan Optimizer',
    description: 'Learn more',
    icon: BadgePercent,
    link_text: 'Learn more'
  },
  {
    slug: 'mutual-fund-overlap-calculator',
    title: 'Mutual Fund Overlap Tool',
    description: 'Dedlap Top\'s',
    icon: Layers,
    link_text: 'Learn more'
  },
  {
    slug: 'ups-pension-calculator',
    title: 'UPS Pension Calculator',
    description: 'Enroil odesrial',
    icon: Building,
    link_text: 'Learn more'
  },
  {
    slug: 'ups-pension-calculator-2', // Note: slug must be unique
    title: 'UPS Pension Calculator',
    description: 'Loan optimizer',
    icon: Building,
    link_text: 'Learn more'
  },
  {
    slug: 'scheme-selector',
    title: 'Scheme Selector',
    description: 'Find a adviser',
    icon: Sparkles,
    link_text: 'Learn more'
  },
   {
    slug: 'ppf-calculator',
    title: 'PPF Calculator',
    description: 'Estimate PPF maturity amount and returns.',
    icon: Landmark,
    link_text: 'Learn more'
  },
  {
    slug: 'ssy-calculator',
    title: 'SSY Calculator',
    description: 'Calculate SSY maturity and interest earned.',
    icon: Baby,
    link_text: 'Learn more'
  },
  {
    slug: 'apy-calculator',
    title: 'APY Calculator',
    description: 'Find your required APY contribution.',
    icon: Shield,
    link_text: 'Learn more'
  },
  {
    slug: 'tax-regime-calculator',
    title: 'Tax Regime Calculator',
    description: 'Compare tax under Old vs New regimes.',
    icon: FileText,
    link_text: 'Learn more'
  },
];

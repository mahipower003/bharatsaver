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
    slug: 'ppf-calculator',
    title: 'PPF Calculator',
    description: 'Estimate PPF maturity amount and returns.',
    icon: Landmark,
  },
  {
    slug: 'ssy-calculator',
    title: 'SSY Calculator',
    description: 'Calculate SSY maturity and interest earned.',
    icon: Baby,
  },
  {
    slug: 'nps-calculator',
    title: 'NPS Calculator',
    description: 'Estimate your NPS corpus and pension.',
    icon: TrendingUp,
  },
  {
    slug: 'apy-calculator',
    title: 'APY Calculator',
    description: 'Find your required APY contribution.',
    icon: Shield,
  },
  {
    slug: 'fd-vs-ppf-calculator',
    title: 'FD vs PPF Calculator',
    description: 'Compare returns from FD and PPF.',
    icon: ArrowRightLeft,
  },
  {
    slug: 'tax-regime-calculator',
    title: 'Tax Regime Calculator',
    description: 'Compare tax under Old vs New regimes.',
    icon: FileText,
  },
  {
    slug: 'retirement-corpus-calculator',
    title: 'Retirement Calculator',
    description: 'Plan your required retirement corpus.',
    icon: Target,
  },
  {
    slug: 'loan-optimizer',
    title: 'Loan Optimizer',
    description: 'Calculate loan EMI and optimize payments.',
    icon: BadgePercent,
  },
  {
    slug: 'mutual-fund-overlap-calculator',
    title: 'MF Overlap Calculator',
    description: 'Find common holdings in mutual funds.',
    icon: Layers,
  },
  {
    slug: 'ups-pension-calculator',
    title: 'UPS Pension Calculator',
    description: 'Estimate your potential monthly pension.',
    icon: Building,
  },
  {
    slug: 'scheme-selector',
    title: 'Scheme Selector',
    description: 'AI-powered scheme recommendations.',
    icon: Sparkles,
  },
];

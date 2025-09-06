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
    link_text: 'PPF Calculator'
  },
  {
    slug: 'ssy-calculator',
    title: 'SSY Calculator',
    description: 'Calculate SSY maturity and interest earned.',
    icon: Baby,
    link_text: 'SSY Calculator'
  },
  {
    slug: 'nps-calculator',
    title: 'NPS Calculator',
    description: 'Estimate pension corpus and monthly pension.',
    icon: TrendingUp,
    link_text: 'NPS Calculator'
  },
  {
    slug: 'apy-calculator',
    title: 'APY Calculator',
    description: 'Find your required APY contribution.',
    icon: Shield,
    link_text: 'APY Calculator'
  },
  {
    slug: 'fd-vs-ppf-calculator',
    title: 'FD vs PPF Calculator',
    description: 'Compare FD lump-sum vs PPF recurring.',
    icon: ArrowRightLeft,
    link_text: 'FD vs PPF Calculator'
  },
  {
    slug: 'tax-regime-calculator',
    title: 'Tax Regime Calculator',
    description: 'Compare tax under Old vs New regimes.',
    icon: FileText,
    link_text: 'Tax Regime Calculator'
  },
  {
    slug: 'retirement-corpus-calculator',
    title: 'Retirement Corpus Calculator',
    description: 'Plan for a comfortable post-retirement life.',
    icon: Target,
    link_text: 'Retirement Corpus Calculator'
  },
  {
    slug: 'loan-optimizer',
    title: 'Loan Optimization Calculator',
    description: 'Calculate EMI and optimize loan tenure.',
    icon: BadgePercent,
    link_text: 'Loan Optimization Calculator'
  },
  {
    slug: 'mutual-fund-overlap-calculator',
    title: 'Mutual Fund Overlap',
    description: 'Check for overlap in your mutual funds.',
    icon: Layers,
    link_text: 'Mutual Fund Overlap'
  },
  {
    slug: 'ups-pension-calculator',
    title: 'UPS Pension Calculator',
    description: 'Estimate your UPS pension amount.',
    icon: Building,
    link_text: 'UPS Pension Calculator'
  },
  {
    slug: 'scheme-selector',
    title: 'Scheme Selector',
    description: 'Get an AI-powered scheme recommendation.',
    icon: Sparkles,
    link_text: 'Scheme Selector'
  },
];

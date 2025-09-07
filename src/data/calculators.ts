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
    link_text: 'Calculate Now',
    lastModified: '2024-07-28',
    image: '/ppf-calculator-online.png'
  },
  {
    slug: 'ssy-calculator',
    title: 'SSY Calculator',
    description: 'Calculate SSY maturity and interest earned.',
    icon: Baby,
    link_text: 'Calculate Now',
    lastModified: '2024-07-27',
    image: 'https://picsum.photos/400/250?random=2'
  },
  {
    slug: 'nps-calculator',
    title: 'NPS Calculator',
    description: 'Estimate pension corpus and monthly pension.',
    icon: TrendingUp,
    link_text: 'Calculate Now',
    lastModified: '2024-07-26',
    image: 'https://picsum.photos/400/250?random=3'
  },
  {
    slug: 'apy-calculator',
    title: 'APY Calculator',
    description: 'Find your required APY contribution.',
    icon: Shield,
    link_text: 'Calculate Now',
    lastModified: '2024-07-25',
    image: 'https://picsum.photos/400/250?random=4'
  },
  {
    slug: 'fd-vs-ppf-calculator',
    title: 'FD vs PPF Calculator',
    description: 'Compare FD lump-sum vs PPF recurring.',
    icon: ArrowRightLeft,
    link_text: 'Compare Now',
    lastModified: '2024-07-24',
    image: 'https://picsum.photos/400/250?random=5'
  },
  {
    slug: 'tax-regime-calculator',
    title: 'Tax Regime Calculator',
    description: 'Compare tax under Old vs New regimes.',
    icon: FileText,
    link_text: 'Compare Now',
    lastModified: '2024-07-23',
    image: 'https://picsum.photos/400/250?random=6'
  },
  {
    slug: 'retirement-corpus-calculator',
    title: 'Retirement Corpus Calculator',
    description: 'Plan for a comfortable post-retirement life.',
    icon: Target,
    link_text: 'Plan Now',
    lastModified: '2024-07-22',
    image: 'https://picsum.photos/400/250?random=7'
  },
  {
    slug: 'loan-optimizer',
    title: 'Loan Optimization Calculator',
    description: 'Calculate EMI and optimize loan tenure.',
    icon: BadgePercent,
    link_text: 'Optimize Now',
    lastModified: '2024-07-21',
    image: 'https://picsum.photos/400/250?random=8'
  },
  {
    slug: 'mutual-fund-overlap-calculator',
    title: 'Mutual Fund Overlap',
    description: 'Check for overlap in your mutual funds.',
    icon: Layers,
    link_text: 'Check Now',
    lastModified: '2024-07-20',
    image: 'https://picsum.photos/400/250?random=9'
  },
  {
    slug: 'ups-pension-calculator',
    title: 'UPS Pension Calculator',
    description: 'Estimate your UPS pension amount.',
    icon: Building,
    link_text: 'Calculate Now',
    lastModified: '2024-07-19',
    image: 'https://picsum.photos/400/250?random=10'
  },
  {
    slug: 'scheme-selector',
    title: 'Scheme Selector',
    description: 'Get an AI-powered scheme recommendation.',
    icon: Sparkles,
    link_text: 'Get Advice',
    lastModified: '2024-07-30',
    image: 'https://picsum.photos/400/250?random=11'
  },
];

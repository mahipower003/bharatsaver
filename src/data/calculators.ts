
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
    summary: 'Use our free PPF Calculator to estimate how much you\'ll get from your Public Provident Fund (PPF) investment over time. Get instant results for maturity amount, total interest earned, and a year-wise breakdown, all using current government interest rates.',
    icon: Landmark,
    link_text: 'Calculate Now',
    lastModified: '2024-07-28',
    image: '/images/calculate-ppf-online.png'
  },
  {
    slug: 'ssy-calculator',
    title: 'SSY Calculator',
    description: 'Calculate SSY maturity and interest earned.',
    summary: 'Use our free Sukanya Samriddhi Yojana (SSY) Calculator to calculate returns, maturity amount, and tax benefits for your daughter\'s future. Uses latest interest rates.',
    icon: Baby,
    link_text: 'Calculate Now',
    lastModified: '2024-07-27',
    image: '/images/calculate-ssy-online.png'
  },
  {
    slug: 'nps-calculator',
    title: 'NPS Calculator',
    description: 'Estimate pension corpus and monthly pension.',
    summary: 'Use our free National Pension System (NPS) Calculator to estimate your retirement corpus, monthly pension, and tax benefits in India. Plan for a secure retirement.',
    icon: TrendingUp,
    link_text: 'Calculate Now',
    lastModified: '2024-07-26',
    image: '/images/nps-calculator-online.png'
  },
  {
    slug: 'apy-calculator',
    title: 'APY Calculator',
    description: 'Find your required APY contribution.',
    summary: 'Our free Atal Pension Yojana (APY) Calculator helps you find your required monthly contribution for a desired pension amount. Secure your future with a government-backed pension.',
    icon: Shield,
    link_text: 'Calculate Now',
    lastModified: '2024-07-25',
    image: '/images/APY-Calculator-online.png'
  },
  {
    slug: 'fd-vs-ppf-calculator',
    title: 'FD vs PPF Calculator',
    description: 'Compare FD lump-sum vs PPF recurring.',
    summary: 'Compare returns on Fixed Deposit (FD) lump-sum investments vs recurring Public Provident Fund (PPF) contributions with our free calculator. Make an informed investment decision.',
    icon: ArrowRightLeft,
    link_text: 'Compare Now',
    lastModified: '2024-07-24',
    image: '/images/fdvspf-calculator-online.png'
  },
  {
    slug: 'tax-regime-calculator',
    title: 'Tax Regime Calculator',
    description: 'Compare tax under Old vs New regimes.',
    summary: 'Use our free calculator to compare your income tax liability under the Old and New tax regimes in India and find out which is better for you for the current assessment year.',
    icon: FileText,
    link_text: 'Compare Now',
    lastModified: '2024-07-30',
    image: '/images/tax-regime-calculator-online.png'
  },
  {
    slug: 'retirement-corpus-calculator',
    title: 'Retirement Corpus Calculator',
    description: 'Plan for a comfortable post-retirement life.',
    summary: 'Plan for your retirement by calculating the total corpus required for your post-retirement life based on your financial goals. Use our free retirement calculator.',
    icon: Target,
    link_text: 'Plan Now',
    lastModified: '2024-07-22',
    image: '/images/retirement-corpus-calculator.png'
  },
  {
    slug: 'loan-optimizer',
    title: 'Loan Optimization Calculator',
    description: 'Calculate EMI and optimize loan tenure.',
    summary: 'Use our free Loan Optimization Calculator to calculate your EMI and see how extra payments (prepayment) can help you reduce your loan tenure and save interest.',
    icon: BadgePercent,
    link_text: 'Optimize Now',
    lastModified: '2024-07-21',
    image: '/images/loan-optimizer-online.png'
  },
  {
    slug: 'mutual-fund-overlap-calculator',
    title: 'Mutual Fund Overlap',
    description: 'Check for overlap in your mutual funds.',
    summary: 'Check for portfolio overlap in your mutual funds to ensure proper diversification. Use our free Mutual Fund Overlap Calculator for Indian funds.',
    icon: Layers,
    link_text: 'Check Now',
    lastModified: '2024-07-20',
    image: '/images/Mutual Fund Overlap Calculator.png'
  },
  {
    slug: 'ups-pension-calculator',
    title: 'UPS Pension Calculator',
    description: 'Estimate your UPS pension amount.',
    summary: 'Estimate your potential pension amount under the Universal Pension Scheme (UPS) with our easy-to-use calculator. Plan for your future.',
    icon: Building,
    link_text: 'Calculate Now',
    lastModified: '2024-07-19',
    image: '/images/UPS Pension Scheme Calculator.png'
  },
  {
    slug: 'scheme-selector',
    title: 'Scheme Selector',
    description: 'Get an AI-powered scheme recommendation.',
    summary: 'Use our AI-powered Scheme Selector Quiz to get a recommendation for the best investment scheme (PPF, SSY, NPS, APY, FD) for you.',
    icon: Sparkles,
    link_text: 'Get Advice',
    lastModified: '2024-07-30',
    image: '/images/PPF-NPS-FD-SSY-Scheme-selector.png'
  },
];

    
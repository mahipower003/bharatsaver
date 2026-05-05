
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
  Filter,
  ShieldCheck,
  Calculator,
  PiggyBank,
  Gift,
} from 'lucide-react';
import type { Calculator as CalculatorType } from '@/lib/types';

export const calculators: CalculatorType[] = [
  {
    slug: 'lic-premium-calculator',
    title: 'LIC Premium Calculator',
    description: 'Estimate premiums for LIC plans like Jeevan Umang, Utsav, and Labh.',
    summary: 'Use our free LIC Premium Calculator to instantly estimate premiums for popular plans. Enter your age, sum assured, and term to get accurate results for your life insurance needs.',
    icon: ShieldCheck,
    link_text: 'Calculate Premium',
    lastModified: '2024-09-25',
    image: '/images/lic-premium-calculator.png'
  },
  {
    slug: 'lic-jeevan-umang-calculator',
    title: 'LIC Jeevan Umang Calculator',
    description: 'Estimate premium & survival benefits for LIC\'s Jeevan Umang (Plan 945).',
    summary: 'Use our free LIC Jeevan Umang calculator to estimate premiums, guaranteed survival benefits, and maturity value. Compare different PPT options and download your results.',
    icon: ShieldCheck,
    link_text: 'Calculate Now',
    lastModified: '2024-10-16',
    image: '/images/lic-jeevan-umang-calculator.png'
  },
  {
    slug: 'jeevan-utsav-calculator',
    title: 'Jeevan Utsav Calculator',
    description: 'Estimate premiums & guaranteed income for LIC\'s Jeevan Utsav (Plan 871).',
    summary: 'Use our free LIC Jeevan Utsav calculator to estimate premiums, guaranteed additions, Regular vs Flexi Income, and death benefit. Compare PPT 5–16 years and download results.',
    icon: Gift,
    link_text: 'Calculate Now',
    lastModified: '2024-10-15',
    image: '/images/lic-jeevan-utsav-calculator.png'
  },
  {
    slug: 'lic-jeevan-anand-calculator',
    title: 'LIC Jeevan Anand Calculator',
    description: 'Estimate premium & maturity for LIC\'s New Jeevan Anand (Plan 915).',
    summary: 'Use our free LIC Jeevan Anand calculator (Plan 915) to estimate premiums, maturity, surrender and paid-up values. Includes worked examples, bonus & FAB inputs, PDF download.',
    icon: ShieldCheck,
    link_text: 'Calculate Now',
    lastModified: '2024-09-26',
    image: '/images/lic-jeevan-anand-calculator.png'
  },
  {
    slug: 'lic-jeevan-labh-calculator',
    title: 'LIC Jeevan Labh Calculator',
    description: 'Estimate premium & maturity for LIC\'s Jeevan Labh (Plan 936).',
    summary: 'Use this free LIC Jeevan Labh 936 calculator to instantly estimate maturity benefits, yearly/monthly premiums, bonus rates, and returns. Includes surrender value info and plan comparisons.',
    icon: ShieldCheck,
    link_text: 'Calculate Now',
    lastModified: '2024-09-27',
    image: '/images/lic-jeevan-labh-calculator.png'
  },
  {
    slug: 'lic-single-premium-endowment-calculator',
    title: 'LIC Single Premium Endowment Calculator',
    description: 'Estimate premium & maturity for LIC\'s Single Premium Endowment Plan (Plan 917).',
    summary: 'Use LIC Single Premium Endowment Calculator online free to estimate your premium, maturity value, bonus & tax benefits. Plan 917/717 one-time investment returns explained.',
    icon: PiggyBank,
    link_text: 'Calculate Now',
    lastModified: '2024-09-28',
    image: '/images/lic-single-premium-calculator.png'
  },
  {
    slug: 'lic-maturity-calculator',
    title: 'LIC Maturity Calculator',
    description: 'Estimate maturity, bonus, and surrender values for LIC plans.',
    summary: 'Use our free LIC Maturity Calculator to estimate the final maturity value, including bonuses, for your endowment and traditional plans. Download a PDF summary of your results.',
    icon: Calculator,
    link_text: 'Calculate Maturity',
    lastModified: '2024-10-05',
    image: '/images/lic-maturity-calculator.png'
  },
  {
    slug: 'lic-surrender-value-calculator',
    title: 'LIC Surrender Value Calculator',
    description: 'Calculate GSV & SSV for LIC plans before maturity.',
    summary: 'Use our free LIC Surrender Value Calculator to find the Guaranteed (GSV) and Special Surrender Value (SSV) for your policy. Understand the financial implications before you surrender.',
    icon: FileText,
    link_text: 'Calculate Now',
    lastModified: '2024-10-10',
    image: '/images/lic-surrender-value-calculator.png'
  },
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
    title: 'Loan Optimizer',
    description: 'Optimize EMI, prepayment & refinance.',
    summary: 'Use our free Loan Optimization Calculator to calculate your EMI and see how extra payments (prepayment) can help you reduce your loan tenure and save interest.',
    icon: BadgePercent,
    link_text: 'Optimize Now',
    lastModified: '2024-08-01',
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
    description: 'Estimate your monthly pension under the Unified Pension Scheme.',
    summary: 'Use our free UPS Pension Calculator to estimate your monthly pension, family pension and lump sum under the Unified Pension Scheme.',
    icon: Building,
    link_text: 'Calculate Now',
    lastModified: '2024-08-02',
    image: '/images/UPS Pension Scheme Calculator.png'
  },
  {
    slug: 'mutual-fund-screener',
    title: 'Mutual Fund Screener',
    description: 'Filter and compare the best mutual funds for your goals.',
    summary: 'Use our free mutual fund screener to filter and compare direct funds by returns, risk, AUM, expense ratio and holdings. Includes overlap check, SIP planner & downloadable CSV.',
    icon: Filter,
    link_text: 'Find Funds',
    lastModified: '2024-08-05',
    image: '/images/PPF-NPS-FD-SSY-Scheme-selector.png'
  },
  {
    slug: 'lic-child-plan',
    title: 'LIC Child Plan Calculator',
    description: 'Calculate premiums and benefits for LIC child insurance plans.',
    summary: 'Use our free LIC Child Plan Calculator to estimate premiums, maturity benefits, and returns for child insurance policies. Plan for your child\'s future with confidence.',
    icon: Baby,
    link_text: 'Calculate Now',
    lastModified: '2024-10-20',
    image: '/images/lic-child-plan-calculator.png'
  },

  {
    slug: 'lic-term-insurance',
    title: 'LIC Term Insurance Calculator',
    description: 'Calculate premiums for LIC term life insurance plans.',
    summary: 'Use our free LIC Term Insurance Calculator to estimate premiums and coverage for term life insurance. Compare different term options and find the best plan for your needs.',
    icon: Shield,
    link_text: 'Calculate Now',
    lastModified: '2024-10-19',
    image: '/images/lic-term-insurance-calculator.png'
  },
  {
    slug: 'lic-loan-calculator',
    title: 'LIC Loan Calculator',
    description: 'Check your policy loan eligibility and interest rates.',
    summary: 'Use our free LIC Loan Calculator to instantly check your loan eligibility, estimate interest rates (9-10%), and plan your repayment against your LIC policy surrender value.',
    icon: Landmark,
    link_text: 'Calculate Loan',
    lastModified: '2026-05-05',
    image: '/images/lic-surrender-value-calculator.png'
  },
  {
    slug: 'lic-vs-sip-calculator',
    title: 'LIC vs SIP Calculator',
    description: 'Compare returns, risk, and tax between LIC and SIP.',
    summary: 'In 2026, should you invest in an LIC policy or an equity SIP? Use our free calculator to compare estimated returns, understand risk and liquidity, and see the exact tax implications to make the right choice.',
    icon: ArrowRightLeft,
    link_text: 'Compare Now',
    lastModified: '2026-05-05',
    image: '/images/lic-surrender-value-calculator.png'
  },
  {
    slug: 'calculate-lic-maturity-amount',
    title: 'How to Calculate LIC Maturity',
    description: 'A step-by-step guide to calculating LIC maturity amount with formula and examples.',
    summary: 'Learn the exact formula for calculating your LIC maturity payout, including Reversionary Bonuses, Final Additional Bonus, and the Section 10(10D) tax benefits. Use our free tool to see your payout.',
    icon: Target,
    link_text: 'Read Guide',
    lastModified: '2026-05-05',
    image: '/images/lic-maturity-calculator.png'
  },
];

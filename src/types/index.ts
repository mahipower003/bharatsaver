import type { LucideIcon } from 'lucide-react';
import type { i18nConfig } from '@/lib/i18n-config';

export type Locale = (typeof i18nConfig)['locales'][number];

export type Calculator = {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export type Dictionary = {
  header: {
    nav: {
      home: string;
      calculators: string;
      guides: string;
      blog: string;
    };
    cta: string;
  };
  footer: {
    about: {
      title: string;
      description: string;
    };
    calculators: {
      title: string;
    };
    resources: {
      title: string;
      guides: string;
      blog: string;
    };
    legal: {
      title: string;
      privacy: string;
      terms: string;
    };
  };
  home: {
    hero: {
      accent: string;
      title: string;
      subtitle: string;
      cta_primary: string;
      cta_secondary: string;
      stats: {
        ppf: { title: string; value: string; };
        ssy: { title: string; value: string; };
        nps: { title: string; value: string; };
        loan: { title: string; value: string; };
      }
    };
    popular_tools: {
      title: string;
    };
    latest_guides: {
      title: string;
    };
  };
  ppf_calculator: {
    title: string;
    description: string;
    annual_investment_label: string;
    annual_investment_placeholder: string;
    tenure_label: string;
    interest_rate_label: string;
    interest_rate_placeholder: string;
    calculate_button: string;
    loading: string;
    results_title: string;
    maturity_value: string;
    total_investment: string;
    total_interest: string;
    view_chart: string;
    view_table: string;
    yearly_breakdown_title: string;
    export_csv: string;
    table_year: string;
    table_opening_balance: string;
    table_amount_invested: string;
    table_interest_earned: string;
    table_closing_balance: string;
  };
  [key: string]: any;
};

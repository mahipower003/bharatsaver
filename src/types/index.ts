import type { LucideIcon } from 'lucide-react';
import type { i18nConfig } from '@/lib/i18n-config';

export type Locale = (typeof i18nConfig)['locales'][number];

export type Calculator = {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  link_text: string;
  lastModified: string;
  image: string;
};

export type Page = {
  slug: string;
  title: string;
  description: string;
  lastModified: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  image?: string;
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
      links: { title: string, href: string }[];
    };
    calculators: {
      title: string;
      links: { title: string, href: string }[];
    };
    resources: {
      title: string;
      links: { title: string, href: string }[];
    };
    contact: {
      title: string;
    };
    copyright: string;
    disclaimer: string;
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
      cta_primary: string;
      cta_secondary: string;
      stats: {
        high_roi: { title: string; description: string; };
        tax_saved: { title: string; description: string; };
        retirement_ready: { title: string; description: string; };
        loan_emi: { title: string; description: string; };
      }
    };
    popular_tools: {
      title: string;
      subtitle: string;
    };
    latest_guides: {
      title: string;
      read_guide: string;
      guide1_title: string;
      guide1_subtitle: string;
      guide2_title: string;
      guide2_subtitle: string;
      guide3_title: string;
      guide3_subtitle: string;
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


import type { LucideIcon } from 'lucide-react';
import type { i18nConfig } from '@/lib/i18n-config';

export type Locale = (typeof i18nConfig)['locales'][number];

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
    cta_button: string;
    search_placeholder: string;
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
  [key: string]: any;
};

import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicPremiumCalculatorPageClient from "./LicPremiumCalculatorPageClient";
import { buildAlternates, buildOpenGraph, buildTwitterCard } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/lic-calculators/tools/premium-calculator`
    },
    "headline": "LIC Premium Calculator — Free Online LIC Premium Calculator (2025)",
    "description": "Calculate LIC premium instantly for Jeevan Umang, Jeevan Utsav, Jeevan Labh & more. Use plan presets, add riders, compare monthly vs yearly and download results.",
    "author": {
      "@type": "Person",
      "name": "Mahesh Chaube",
      "jobTitle": "Certified Financial Planner (CFP)",
        "url": `${siteUrl}/${lang}/author/mahesh-chaube`
    },
    "publisher": {
      "@type": "Organization",
      "name": "BharatSaver",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/icon.svg`
      }
    },
    "datePublished": "2024-09-25",
    "dateModified": "2025-09-24",
    "reviewedBy": {
      "@type": "Person",
      "name": "Laveena Vijayi",
      "jobTitle": "Senior Financial Research Analyst, BharatSaver Editorial Team",
      "url": "https://www.linkedin.com/in/laveena-vijayi/"
    }
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Your LIC Premium Online",
    "description": "A quick step-by-step guide to using the online LIC premium calculator.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Step 1: Select Your Plan",
        "text": "Start by choosing your desired LIC plan from the dropdown menus. Use a preset like 'Jeevan Umang' for better accuracy.",
        "url": `${siteUrl}/${lang}/lic-premium-calculator#calculator-widget`
      },
      {
        "@type": "HowToStep",
        "name": "Step 2: Enter Your Details",
        "text": "Input your current age, gender, the sum assured (coverage amount), and the premium paying term (PPT).",
        "url": `${siteUrl}/${lang}/lic-premium-calculator#calculator-widget`
      },
      {
        "@type": "HowToStep",
        "name": "Step 3: Click 'Calculate'",
        "text": "The tool will process your inputs and instantly display your estimated premium for yearly, half-yearly, quarterly, and monthly frequencies.",
        "url": `${siteUrl}/${lang}/lic-premium-calculator#calculator-widget`
      }
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "BharatSaver's LIC Premium Calculator",
    "operatingSystem": "Web",
    "applicationCategory": "FinanceApplication",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "12580"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    }
  };
  
  return {
    title: "LIC Premium Calculator — Free Online LIC Premium Calculator | BharatSaver",
    description: "Use BharatSaver's free LIC Premium Calculator to instantly estimate LIC premiums (Jeevan Umang, Jeevan Labh, Jeevan Utsav). Compare monthly vs yearly, toggle riders, and download results.",
    alternates: {
      canonical: `https://bharatsaver.com/lic-calculators/tools/premium-calculator`,
       languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/lic-premium-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
    other: {
      'application/ld+json': JSON.stringify([articleSchema, howToSchema, softwareSchema]),
    }
  };
}

export default async function LicPremiumCalculatorPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const pageDict = { ...(await import(`@/dictionaries/${lang}/lic-premium-calculator.json`)).default };

  return (
    <LicPremiumCalculatorPageClient
        params={{ lang }}
        dictionary={dictionary}
        pageDict={pageDict}
    />
  );
}

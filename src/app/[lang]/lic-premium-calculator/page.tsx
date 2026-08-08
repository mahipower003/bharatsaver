import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicPremiumCalculatorPageClient from "./LicPremiumCalculatorPageClient";
import { buildAlternates } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pagePath = `lic-premium-calculator`;
  
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/${lang}/${pagePath}`
    },
    "headline": "LIC Premium Calculator 2026 — Calculate LIC Premium, Maturity & Returns Online",
    "description": "Free online LIC Premium Calculator to estimate premiums and maturity returns for Jeevan Labh (936), New Jeevan Anand (915), Jeevan Umang (945), Jeevan Utsav (871) & Term Insurance. Includes 0% GST reform rules.",
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
    "dateModified": "2026-08-08",
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
    "name": "How to Calculate Your LIC Premium and Maturity Value Online",
    "description": "Step-by-step instructions to calculate LIC policy premiums, modal rebates, and maturity returns.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Step 1: Select Your LIC Plan",
        "text": "Choose your specific policy plan from the dropdown list (e.g. Jeevan Labh 936, New Jeevan Anand 915, Jeevan Umang 945, or Tech Term).",
        "url": `${siteUrl}/${lang}/${pagePath}#calculator-widget`
      },
      {
        "@type": "HowToStep",
        "name": "Step 2: Enter Age & Coverage Details",
        "text": "Input the policyholder's current age, policy term, premium paying term (PPT), and basic sum assured coverage.",
        "url": `${siteUrl}/${lang}/${pagePath}#calculator-widget`
      },
      {
        "@type": "HowToStep",
        "name": "Step 3: Select Payment Mode & Optional Riders",
        "text": "Choose yearly, half-yearly, quarterly, or monthly frequency and toggle optional riders like Accidental Death or Term Rider.",
        "url": `${siteUrl}/${lang}/${pagePath}#calculator-widget`
      },
      {
        "@type": "HowToStep",
        "name": "Step 4: View Premium Breakdown & Bonus Projections",
        "text": "Click 'Calculate' to see exact premium installments, 0% GST tax exemptions, and projected maturity payouts factoring in SRB and FAB bonuses.",
        "url": `${siteUrl}/${lang}/${pagePath}#calculator-widget`
      }
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "BharatSaver Universal LIC Premium Calculator Engine",
    "operatingSystem": "Web",
    "applicationCategory": "FinanceApplication",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "14250"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    }
  };
  
  return {
    title: "LIC Premium Calculator 2026 — Calculate LIC Premium & Maturity Online | BharatSaver",
    description: "Use BharatSaver's free LIC Premium Calculator to calculate premiums & maturity payouts for Jeevan Labh, Jeevan Anand, Jeevan Umang & Utsav. 0% GST (2026 rules), modal rebates & SIP comparison.",
    alternates: buildAlternates(lang, pagePath),
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

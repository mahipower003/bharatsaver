import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicJeevanLabhCalculatorPageClient from "./LicJeevanLabhCalculatorPageClient";

export async function generateStaticParams() {
  return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/lic-jeevan-labh-calculator`;
  const pageDict = (await import(`@/dictionaries/${lang}/lic-jeevan-labh-calculator.json`)).default;

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate LIC Jeevan Labh 736 / 936 Premiums & Returns",
    "step": [
      { "@type": "HowToStep", "name": "Enter Age & Sum Assured", "text": "Select your current age and desired basic sum assured coverage." },
      { "@type": "HowToStep", "name": "Choose Policy Term & PPT", "text": "Select policy term: 16 (PPT 10), 21 (PPT 15), or 25 (PPT 16)." },
      { "@type": "HowToStep", "name": "Select Optional Riders", "text": "Optionally toggle Accidental Death, Term Assurance, or PWB rider." },
      { "@type": "HowToStep", "name": "Calculate & View Returns", "text": "View 1st year/2nd year GST premiums, PPT timeline, and tax-free maturity returns." }
    ]
  };

  const financialProductSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "LIC Jeevan Labh (Plan No. 736 / 936)",
    "description": "A non-linked, with-profits, limited premium payment endowment plan from LIC of India.",
    "brand": {
      "@type": "Brand",
      "name": "LIC of India"
    },
    "identifier": "512N304V02",
    "url": pageUrl,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR"
    }
  };

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "LIC Jeevan Labh Calculator",
    "operatingSystem": "All",
    "applicationCategory": "FinanceApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    }
  };

  return {
    title: pageDict.meta_title,
    description: pageDict.meta_description,
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/lic-jeevan-labh-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
    other: {
      'application/ld+json': JSON.stringify([howToSchema, financialProductSchema, softwareAppSchema]),
    },
  };
}

export default async function LicJeevanLabhCalculatorPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const pageDict = { ...(await import(`@/dictionaries/${lang}/lic-jeevan-labh-calculator.json`)).default };

  return (
    <LicJeevanLabhCalculatorPageClient
      params={{ lang }}
      dictionary={dictionary}
      pageDict={pageDict}
    />
  );
}

import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicJeevanUmangCalculatorPageClient from "./LicJeevanUmangCalculatorPageClient";

export async function generateStaticParams() {
  return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/lic-jeevan-umang-calculator`;
  const pageDict = (await import(`@/dictionaries/${lang}/lic-jeevan-umang-calculator.json`).catch(() => import(`@/dictionaries/en/lic-jeevan-umang-calculator.json`))).default;

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate LIC Jeevan Umang Plan 745 Premiums & 8% Survival Income",
    "step": [
      { "@type": "HowToStep", "name": "Select Entry Age & Sum Assured", "text": "Input your current age and desired Basic Sum Assured coverage." },
      { "@type": "HowToStep", "name": "Choose Premium Paying Term", "text": "Select policy PPT: 15, 20, 25, or 30 years." },
      { "@type": "HowToStep", "name": "Select Optional Riders", "text": "Optionally toggle Accidental Death (ADDB), Term Assurance, or PWB rider." },
      { "@type": "HowToStep", "name": "Calculate & View 8% Survival Pension", "text": "View 1st year/2nd year GST premiums, guaranteed annual 8% survival income schedule, and age-100 maturity wealth." }
    ]
  };

  const financialProductSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "LIC Jeevan Umang (Plan No. 745 / 945)",
    "description": "A participating whole-life insurance plan providing guaranteed 8% annual survival income post-PPT and maturity lump sum at age 100.",
    "brand": {
      "@type": "Brand",
      "name": "LIC of India"
    },
    "identifier": "512N312V03",
    "url": pageUrl,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR"
    }
  };

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "LIC Jeevan Umang Calculator",
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
        acc[locale] = `${siteUrl}/${locale}/lic-jeevan-umang-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
    other: {
      'application/ld+json': JSON.stringify([howToSchema, financialProductSchema, softwareAppSchema]),
    },
  };
}

export default async function JeevanUmangCalculatorPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const pageDict = { ...(await import(`@/dictionaries/${lang}/lic-jeevan-umang-calculator.json`).catch(() => import(`@/dictionaries/en/lic-jeevan-umang-calculator.json`))).default };

  return (
    <LicJeevanUmangCalculatorPageClient
      params={{ lang }}
      dictionary={dictionary}
      pageDict={pageDict}
    />
  );
}

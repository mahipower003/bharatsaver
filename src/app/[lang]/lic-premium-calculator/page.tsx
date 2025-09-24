
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicPremiumCalculatorPageClient from "./LicPremiumCalculatorPageClient";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const pageDict = (await import(`@/dictionaries/${params.lang}/lic-premium-calculator.json`)).default;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/lic-premium-calculator`;
  
  return {
    title: "LIC Premium Calculator — Free Online LIC Premium Calculator | BharatSaver",
    description: "Calculate LIC premium instantly. Use our free LIC Premium Calculator to estimate premiums for Jeevan Umang, Jeevan Utsav, Jeevan Labh and other LIC plans. Enter age, sum assured, PPT and frequency — get accurate premium estimates.",
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/lic-premium-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}

export default async function LicPremiumCalculatorPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang);
  const pageDict = (await import(`@/dictionaries/${params.lang}/lic-premium-calculator.json`)).default;

  return (
    <LicPremiumCalculatorPageClient
        params={params}
        dictionary={dictionary}
        pageDict={pageDict}
    />
  );
}

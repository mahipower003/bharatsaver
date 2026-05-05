import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicVsSipCalculatorPageClient from "./LicVsSipCalculatorPageClient";
import { getDictionary } from "@/lib/dictionaries";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const pageDict = (await import(`@/dictionaries/${lang}/lic-vs-sip-calculator.json`)).default;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/lic-vs-sip-calculator`;
  const ogImageUrl = `${siteUrl}/images/lic-premium-calculator.png`; 

  return {
    title: pageDict.meta_title,
    description: pageDict.meta_description,
    openGraph: {
      title: pageDict.meta_title,
      description: pageDict.meta_description,
      url: pageUrl,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'LIC vs SIP Comparison' }],
      locale: lang === 'en' ? 'en_IN' : lang,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageDict.meta_title,
      description: pageDict.meta_description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/lic-vs-sip-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const pageDict = (await import(`@/dictionaries/${lang}/lic-vs-sip-calculator.json`)).default;

  return <LicVsSipCalculatorPageClient params={{ lang }} dictionary={dictionary} pageDict={pageDict} />;
}

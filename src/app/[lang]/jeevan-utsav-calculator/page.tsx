
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import JeevanUtsavCalculatorPageClient from "./JeevanUtsavCalculatorPageClient";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
    const pageDict = (await import(`@/dictionaries/${params.lang}/jeevan-utsav-calculator.json`).catch(() => import(`@/dictionaries/en/jeevan-utsav-calculator.json`))).default;
    const siteUrl = 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${params.lang}/jeevan-utsav-calculator`;
    const ogImageUrl = `${siteUrl}/images/lic-jeevan-utsav-calculator.png`;

    const faqSchema = pageDict.faq_schema;
    const howToSchema = pageDict.how_to_schema;
    const articleSchema = {
        ...pageDict.article_schema,
        mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
        publisher: {
            ...pageDict.article_schema.publisher,
            logo: { "@type": "ImageObject", "url": `${siteUrl}/icon.svg` }
        }
    };


    return {
        title: "Jeevan Utsav Calculator (Plan 771) — Premium, Regular vs Flexi Income, Benefits",
        description: "Free LIC Jeevan Utsav Calculator (Plan 771). Estimate premiums, Guaranteed Additions (₹40/₹1,000), Regular (10% BSA/yr) or Flexi (5.5% accrual) income. Download illustration.",
        alternates: {
            canonical: "https://bharatsaver.com/en/jeevan-utsav-calculator",
            languages: i18nConfig.locales.reduce((acc, locale) => {
                acc[locale] = `${siteUrl}/${locale}/jeevan-utsav-calculator`;
                return acc;
            }, {} as Record<string, string>),
        },
        openGraph: {
          title: "Jeevan Utsav Calculator (Plan 771) — Premium, Regular vs Flexi Income, Benefits",
          description: "Free LIC Jeevan Utsav Calculator (Plan 771). Estimate premiums, Guaranteed Additions (₹40/₹1,000), Regular (10% BSA/yr) or Flexi (5.5% accrual) income. Download illustration.",
          url: pageUrl,
          images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'LIC Jeevan Utsav Calculator' }],
          locale: params.lang === 'en' ? 'en_IN' : params.lang,
          type: 'website',
        },
        other: {
            'application/ld+json': JSON.stringify([faqSchema, howToSchema, articleSchema]),
        },
    };
}


export default async function JeevanUtsavCalculatorPage({ params }: { params: { lang: Locale }}) {
    const dictionary = await getDictionary(params.lang);
    const pageDict = (await import(`@/dictionaries/${params.lang}/jeevan-utsav-calculator.json`).catch(() => import(`@/dictionaries/en/jeevan-utsav-calculator.json`))).default;
    
    return (
        <JeevanUtsavCalculatorPageClient 
            params={params}
            dictionary={dictionary}
            pageDict={pageDict}
        />
    );
}

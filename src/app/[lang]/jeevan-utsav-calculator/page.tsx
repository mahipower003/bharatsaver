
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import JeevanUtsavCalculatorPageClient from "./JeevanUtsavCalculatorPageClient";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const pageDict = (await import(`@/dictionaries/${lang}/jeevan-utsav-calculator.json`).catch(() => import(`@/dictionaries/en/jeevan-utsav-calculator.json`))).default;
    const siteUrl = 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${lang}/jeevan-utsav-calculator`;
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
        title: pageDict.meta_title,
        description: pageDict.meta_description,
        alternates: {
            canonical: pageUrl,
            languages: i18nConfig.locales.reduce((acc, locale) => {
                acc[locale] = `${siteUrl}/${locale}/jeevan-utsav-calculator`;
                return acc;
            }, {} as Record<string, string>),
        },
        openGraph: {
          title: pageDict.meta_title,
          description: pageDict.meta_description,
          url: pageUrl,
          images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'LIC Jeevan Utsav Calculator' }],
          "locale": lang === 'en' ? 'en_IN' : lang,
          type: 'website',
        },
        other: {
            'application/ld+json': JSON.stringify([faqSchema, howToSchema, articleSchema]),
        },
    };
}


export default async function JeevanUtsavCalculatorPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const pageDict = (await import(`@/dictionaries/${lang}/jeevan-utsav-calculator.json`).catch(() => import(`@/dictionaries/en/jeevan-utsav-calculator.json`))).default;
    
    return (
        <JeevanUtsavCalculatorPageClient 
            params={{ lang }}
            dictionary={dictionary}
            pageDict={pageDict}
        />
    );
}

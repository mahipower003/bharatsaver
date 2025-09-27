
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicJeevanLabhCalculatorPageClient from "./LicJeevanLabhCalculatorPageClient";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${params.lang}/lic-jeevan-labh-calculator`;
    const pageDict = (await import(`@/dictionaries/${params.lang}/lic-jeevan-labh-calculator.json`)).default;

    const faqItems = pageDict.article.sections.find((s: any) => s.id === 'faq')?.content.find((c: any) => c.type === 'faq')?.items || [];
    const faqSchema = {
      "@context":"https://schema.org",
      "@type":"FAQPage",
      "mainEntity": faqItems.map((faq: { q: string, a: string }) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
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
            'application/ld+json': JSON.stringify(faqSchema),
        },
    };
}


export default async function LicJeevanLabhCalculatorPage({ params }: { params: { lang: Locale }}) {
    const dictionary = await getDictionary(params.lang);
    const pageDict = (await import(`@/dictionaries/${params.lang}/lic-jeevan-labh-calculator.json`)).default;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${params.lang}/lic-jeevan-labh-calculator`;

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${params.lang}` },
          { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${params.lang}/calculators` },
          { '@type': 'ListItem', position: 3, name: 'LIC Premium Calculator', item: `${siteUrl}/${params.lang}/lic-premium-calculator` },
          { '@type': 'ListItem', position: 4, name: 'LIC Jeevan Labh Calculator', item: pageUrl },
        ],
    };
    
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <LicJeevanLabhCalculatorPageClient 
                params={params}
                dictionary={dictionary}
                pageDict={pageDict}
            />
        </>
    );
}


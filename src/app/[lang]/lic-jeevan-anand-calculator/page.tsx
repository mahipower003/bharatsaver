
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicJeevanAnandCalculatorPageClient from "./LicJeevanAnandCalculatorPageClient";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
    const pageDict = (await import(`@/dictionaries/${params.lang}/lic-jeevan-anand-calculator.json`)).default;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${params.lang}/lic-jeevan-anand-calculator`;

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": pageDict.article.sections.find((s:any) => s.id === 'faq')?.content[0]?.items.map((faq: {q: string, a: string}) => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": { "@type": "Answer", "text": faq.a.replace(/<[^>]*>/g, '') }
        }))
    };

    const howToSteps = pageDict.article.sections.find((s:any) => s.id === 'how-to-use')?.content.find((c:any) => c.type === 'steps')?.items ?? [];
    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to use the LIC Jeevan Anand calculator",
        "step": howToSteps.map((step: {title: string, description: string}, index: number) => ({
            "@type": "HowToStep", "name": `Step ${index+1}: ${step.title}`, "text": step.description
        }))
    };
    
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "mainEntityOfPage": { "@type": "WebPage", "@id": pageUrl },
        "headline": "LIC Jeevan Anand Calculator (Plan 715) — Estimate Premium, Maturity & Surrender",
        "author": { "@type": "Person", "name": "Mahesh Chaube, CFP", "url": `${siteUrl}/${params.lang}/author/mahesh-chaube` },
        "publisher": { "@type": "Organization", "name": "BharatSaver", "logo": { "@type": "ImageObject", "url": `${siteUrl}/icon.svg` } },
        "datePublished": "2025-09-26",
        "dateModified": "2025-09-26",
        "reviewedBy": { "@type": "Person", "name": "Laveena Vijayi", "jobTitle": "Senior Financial Research Analyst, BharatSaver" }
    };

    return {
        title: pageDict.meta_title,
        description: pageDict.meta_description,
        alternates: {
            canonical: pageUrl,
            languages: i18nConfig.locales.reduce((acc, locale) => {
                acc[locale] = `${siteUrl}/${locale}/lic-jeevan-anand-calculator`;
                return acc;
            }, {} as Record<string, string>),
        },
        other: {
            'application/ld+json': JSON.stringify([faqSchema, howToSchema, articleSchema]),
        },
    };
}


export default async function LicJeevanAnandCalculatorPage({ params }: { params: { lang: Locale }}) {
    const dictionary = await getDictionary(params.lang);
    const pageDict = (await import(`@/dictionaries/${params.lang}/lic-jeevan-anand-calculator.json`).catch(() => import(`@/dictionaries/en/lic-jeevan-anand-calculator.json`))).default;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${params.lang}/lic-jeevan-anand-calculator`;

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${params.lang}` },
          { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${params.lang}/calculators` },
          { '@type': 'ListItem', position: 3, name: 'LIC Premium Calculator', item: `${siteUrl}/${params.lang}/lic-premium-calculator` },
          { '@type': 'ListItem', position: 4, name: 'LIC Jeevan Anand Calculator', item: pageUrl },
        ],
    };
    
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <LicJeevanAnandCalculatorPageClient 
                params={params}
                dictionary={dictionary}
                pageDict={pageDict}
            />
        </>
    );
}

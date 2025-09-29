
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

    const faqSection = pageDict.article.sections.find((s:any) => s.id === 'faq');
    const faqItems = (faqSection?.content.find((c: any) => c.type === 'faq') as any)?.items ?? [];
    
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map((faq: {q: string, a: string}) => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": { "@type": "Answer", "text": faq.a.replace(/<[^>]*>/g, '') }
        }))
    };

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to use the LIC Jeevan Anand calculator",
        "step": [
            {"@type": "HowToStep", "name": "Step 1: Enter Your Details", "text": "Input your current age, desired Sum Assured, and the policy term for the plan."},
            {"@type": "HowToStep", "name": "Step 2: Add Optional Riders", "text": "Toggle the Accidental Death & Disability or Term Assurance riders if you need extra coverage."},
            {"@type": "HowToStep", "name": "Step 3: Click Calculate", "text": "Get an instant estimate of your premium (monthly and yearly), maturity benefits including bonuses, and potential surrender values."},
            {"@type": "HowToStep", "name": "Step 4: Download or Share", "text": "Use the buttons to print a PDF of your results or share them via WhatsApp and Twitter."}
        ]
    };
    
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "mainEntityOfPage": { "@type": "WebPage", "@id": pageUrl },
        "headline": "LIC Jeevan Anand Calculator (Plan 715) — Estimate Premium, Maturity & Surrender",
        "author": { "@type": "Person", "name": "Mahesh Chaube, CFP", "url": `${siteUrl}/${params.lang}/author/mahesh-chaube` },
        "publisher": { "@type": "Organization", "name": "BharatSaver", "logo": { "@type": "ImageObject", "url": `${siteUrl}/icon.svg` } },
        "datePublished": "2024-09-26",
        "dateModified": "2024-09-26",
        "reviewedBy": { "@type": "Person", "name": "Laveena Vijayi", "jobTitle": "Senior Financial Research Analyst, BharatSaver" }
    };

    return {
        title: "LIC Jeevan Anand Calculator (Plan 715) — Premium, Maturity & Surrender Estimates",
        description: "Use our free LIC Jeevan Anand calculator (Plan 715) to estimate premiums, maturity, surrender and paid-up values. Includes worked examples, bonus & FAB inputs, PDF download.",
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

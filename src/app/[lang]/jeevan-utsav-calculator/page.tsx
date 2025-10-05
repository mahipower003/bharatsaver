
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import JeevanUtsavCalculatorPageClient from "./JeevanUtsavCalculatorPageClient";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
    const pageDict = (await import(`@/dictionaries/${params.lang}/jeevan-utsav-calculator.json`).catch(() => import(`@/dictionaries/en/jeevan-utsav-calculator.json`))).default;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${params.lang}/jeevan-utsav-calculator`;
    const ogImageUrl = `${siteUrl}/images/lic-jeevan-utsav-calculator.png`;

    const faqSchema = {
        "@context":"https://schema.org",
        "@type":"FAQPage",
        "mainEntity":[
            {"@type":"Question","name":"What are Guaranteed Additions in Jeevan Utsav?","acceptedAnswer":{"@type":"Answer","text":"₹40 per ₹1,000 Basic Sum Assured at the end of each policy year during the premium paying term only."}},
            {"@type":"Question","name":"What is Regular vs Flexi Income?","acceptedAnswer":{"@type":"Answer","text":"Regular pays 10% of BSA every year for life after PPT. Flexi lets you defer income; unclaimed income accrues at ~5.5% p.a. (compounded) as per LIC rules."}},
            {"@type":"Question","name":"What is the death benefit?","acceptedAnswer":{"@type":"Answer","text":"Higher of Sum Assured on Death or 105% of total premiums paid; Sum Assured on Death as defined in LIC brochure."}}
        ]
    };

    const howToSchema = {
        "@context":"https://schema.org",
        "@type":"HowTo",
        "name":"How to use the LIC Jeevan Utsav Calculator",
        "step":[
            {"@type":"HowToStep","name":"Select Plan 771 and PPT","text":"Choose Jeevan Utsav (Plan 771) and a PPT between 5 and 16 years."},
            {"@type":"HowToStep","name":"Pick income option","text":"Select Regular (10% BSA per year) or Flexi (defer and accrue ~5.5% p.a.)."},
            {"@type":"HowToStep","name":"Enter cover & riders","text":"Fill age, BSA, mode, and riders; click Calculate for premiums, Guaranteed Additions and income schedule."}
        ]
    };

    const articleSchema = {
        "@context":"https://schema.org",
        "@type":"Article",
        "headline":"LIC Jeevan Utsav Calculator — Premium, Income & Benefits (Plan 771)",
        "author":{"@type":"Person","name":"Mahesh Chaube, CFP"},
        "reviewedBy":{"@type":"Person","name":"Laveena Vijayi"},
        "publisher":{"@type":"Organization","name":"BharatSaver"},
        "datePublished":"2025-09-23","dateModified":"2025-09-23",
        "mainEntityOfPage": { "@type": "WebPage", "@id": pageUrl },
    };
    articleSchema.publisher.logo = { "@type": "ImageObject", "url": `${siteUrl}/icon.svg` };


    return {
        title: pageDict.meta.title,
        description: pageDict.meta.description,
        alternates: {
            canonical: pageUrl,
            languages: i18nConfig.locales.reduce((acc, locale) => {
                acc[locale] = `${siteUrl}/${locale}/jeevan-utsav-calculator`;
                return acc;
            }, {} as Record<string, string>),
        },
        openGraph: {
          title: pageDict.og.title,
          description: pageDict.og.description,
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

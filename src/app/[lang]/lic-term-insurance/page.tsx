
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicTermInsuranceGuideClient from "./LicTermInsuranceGuideClient";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
    const pageDict = (await import(`@/dictionaries/${params.lang}/lic-term-insurance.json`).catch(() => import(`@/dictionaries/en/lic-term-insurance.json`))).default;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${params.lang}/lic-term-insurance`;
    
    const schemas = [];
    if (pageDict.faq_schema) schemas.push(pageDict.faq_schema);
    if (pageDict.how_to_schema) schemas.push(pageDict.how_to_schema);
    if (pageDict.financial_product_schema) schemas.push({
        ...pageDict.financial_product_schema,
        url: pageUrl
    });
    if (pageDict.article_schema) schemas.push({
        ...pageDict.article_schema,
        mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
        author: { ...pageDict.article_schema.author, url: `${siteUrl}/${params.lang}/author/mahesh-chaube`},
        publisher: { ...pageDict.article_schema.publisher, logo: { "@type": "ImageObject", "url": `${siteUrl}/icon.svg`}}
    });

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${params.lang}` },
          { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${params.lang}/calculators` },
          { '@type': 'ListItem', position: 3, name: 'LIC Term Insurance Guide', item: pageUrl },
        ],
    };
    schemas.push(breadcrumbSchema);

    return {
        title: "LIC Term Insurance Guide (2025): Plans, Premiums & Calculator",
        description: "Compare LIC's term plans for 2025. See premium examples for ₹1 Cr cover, use our free calculator, and learn how to buy online. Get an expert quote now.",
        alternates: {
            canonical: pageUrl,
            languages: i18nConfig.locales.reduce((acc, locale) => {
                acc[locale] = `${siteUrl}/${locale}/lic-term-insurance`;
                return acc;
            }, {} as Record<string, string>),
        },
        openGraph: {
          title: "LIC Term Insurance (2025) — Plans, Premiums, Comparisons & How to Buy",
          description: "Complete LIC Term Insurance guide — compare Tech-Term, Digi Term & Yuva Term, see sample premiums for ₹1Cr, use our calculator, and learn the claim process.",
          url: pageUrl,
          images: [{ url: `${siteUrl}/images/lic-term-insurance-guide.png`, width: 1200, height: 630, alt: 'LIC Term Insurance Guide' }],
          locale: params.lang === 'en' ? 'en_IN' : params.lang,
          type: 'website',
        },
        other: {
            'application/ld+json': JSON.stringify(schemas),
        },
    };
}


export default async function LicTermInsurancePage({ params }: { params: { lang: Locale }}) {
    const dictionary = await getDictionary(params.lang);
    const pageDict = (await import(`@/dictionaries/${params.lang}/lic-term-insurance.json`).catch(() => import(`@/dictionaries/en/lic-term-insurance.json`))).default;
    
    return (
        <LicTermInsuranceGuideClient 
            params={params}
            dictionary={dictionary}
            pageDict={pageDict}
        />
    );
}

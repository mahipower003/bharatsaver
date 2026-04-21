
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicTermInsuranceGuideClient from "./LicTermInsuranceGuideClient";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const pageDict = (await import(`@/dictionaries/en/lic-term-insurance.json`)).default;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${lang}/lic-term-insurance`;
    
    // SEO Optimized Metadata
    const title = "LIC Term Insurance Plan (2025) — ₹1 Crore Premiums & Calculator";
    const description = "Complete 2025 guide to buying the best LIC term insurance plan. Compare Tech-Term, Jeevan Amar & get a ₹1 Crore LIC term life insurance quote with our calculator.";
    
    return {
        title: title,
        description: description,
        alternates: {
            canonical: `${siteUrl}/en/lic-term-insurance`,
            languages: i18nConfig.locales.reduce((acc, locale) => {
                acc[locale] = `${siteUrl}/${locale}/lic-term-insurance`;
                return acc;
            }, {} as Record<string, string>),
        },
        openGraph: {
          title: title,
          description: description,
          url: pageUrl,
          images: [{ url: `${siteUrl}/images/lic-term-insurance-guide.png`, width: 1200, height: 630, alt: 'LIC Term Insurance Guide' }],
          "locale": lang === 'en' ? 'en_IN' : lang,
          type: 'website',
        },
    };
}


export default async function LicTermInsurancePage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const pageDict = { ...(await import(`@/dictionaries/${lang}/lic-term-insurance.json`).catch(() => import(`@/dictionaries/en/lic-term-insurance.json`))).default };
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${lang}/lic-term-insurance`;

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${lang}` },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${lang}/calculators` },
          { '@type': 'ListItem', position: 3, name: 'LIC Term Insurance Guide', item: pageUrl },
        ],
    };
    
    const faqSchema = pageDict.faq_schema;
    const howToSchema = pageDict.how_to_schema;
    const articleSchema = {
      ...pageDict.article_schema,
      mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
      author: { ...pageDict.article_schema.author, url: `${siteUrl}/${lang}/author/mahesh-chaube`},
      publisher: { ...pageDict.article_schema.publisher, logo: { "@type": "ImageObject", "url": `${siteUrl}/icon.svg`}}
    };

    const schemas = [faqSchema, howToSchema, articleSchema, breadcrumbSchema];
    
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
            <LicTermInsuranceGuideClient 
                params={{ lang }}
                dictionary={dictionary}
                pageDict={pageDict}
            />
        </>
    );
}

    

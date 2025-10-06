
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicTermInsuranceGuideClient from "./LicTermInsuranceGuideClient";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
    const pageDict = (await import(`@/dictionaries/en/lic-term-insurance.json`)).default;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${params.lang}/lic-term-insurance`;
    
    // SEO Optimized Metadata
    const title = "LIC Term Insurance — Ultimate Guide 2025 | Plans, Premiums & How to Buy";
    const description = "Complete 2025 guide to LIC term insurance — Tech-Term, Jeevan Amar & Jeevan Kiran. Premium examples, buy online steps, claim process & FAQs.";
    
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
          locale: params.lang === 'en' ? 'en_IN' : params.lang,
          type: 'website',
        },
    };
}


export default async function LicTermInsurancePage({ params }: { params: { lang: Locale }}) {
    const dictionary = await getDictionary(params.lang);
    const pageDict = (await import(`@/dictionaries/${params.lang}/lic-term-insurance.json`).catch(() => import(`@/dictionaries/en/lic-term-insurance.json`))).default;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${params.lang}/lic-term-insurance`;

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${params.lang}` },
          { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${params.lang}/calculators` },
          { '@type': 'ListItem', position: 3, name: 'LIC Term Insurance Guide', item: pageUrl },
        ],
    };
    
    const faqSchema = pageDict.faq_schema;
    const howToSchema = pageDict.how_to_schema;
    const articleSchema = {
      ...pageDict.article_schema,
      mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
      author: { ...pageDict.article_schema.author, url: `${siteUrl}/${params.lang}/author/mahesh-chaube`},
      publisher: { ...pageDict.article_schema.publisher, logo: { "@type": "ImageObject", "url": `${siteUrl}/icon.svg`}}
    };

    const schemas = [faqSchema, howToSchema, articleSchema, breadcrumbSchema];
    
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
            <LicTermInsuranceGuideClient 
                params={params}
                dictionary={dictionary}
                pageDict={pageDict}
            />
        </>
    );
}

    
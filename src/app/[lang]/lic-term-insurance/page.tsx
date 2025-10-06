
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
    const title = "LIC Term Insurance (2025) — Plans, Premiums, Comparisons & How to Buy";
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
    
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the LIC Tech-Term Plan and how is it different?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "LIC Tech-Term is an online-only pure term plan sold directly by LIC with online rebates; it offers low premiums compared with LIC's offline equivalents."
          }
        },
        {
          "@type": "Question",
          "name": "Can I buy LIC term insurance online?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. LIC offers online purchase for Tech-Term and Digi Term via the LIC e-services portal. You must provide KYC docs and may need a medical exam."
          }
        },
        {
          "@type": "Question",
          "name": "How much premium for ₹1 Crore LIC term insurance for a 30-year-old non-smoker?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Premiums vary by plan and mode. Use the calculator on this page for an exact quote, or compare samples from leading aggregators."
          }
        },
        {
          "@type": "Question",
          "name": "Does LIC settle term claims reliably?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "LIC has historically high claim settlement ratios and strong solvency; always check the latest IRDAI/annual report numbers when deciding."
          }
        },
        {
          "@type": "Question",
          "name": "Are return-of-premium (ROP) plans worth it?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ROP plans return premiums on survival but cost much more. Financially, buying a cheap term plan and investing the difference usually gives higher returns."
          }
        }
      ]
    };

    const howToSchema = {
      "@context":"https://schema.org",
      "@type":"HowTo",
      "name":"How to buy LIC Tech-Term online",
      "step":[
        {"@type":"HowToStep","name":"Calculate premium","text":"Use the calculator to set sum assured, age and term."},
        {"@type":"HowToStep","name":"Visit LIC e-services portal","text":"Choose the New Tech-Term option and start application."},
        {"@type":"HowToStep","name":"Fill the form","text":"Provide personal, health and nominee details accurately."},
        {"@type":"HowToStep","name":"Upload documents and pay","text":"Upload PAN/Aadhaar and pay the first premium online."},
        {"@type":"HowToStep","name":"Medical check (if required)","text":"Complete any medical tests requested by LIC to finalize cover."}
      ]
    };

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

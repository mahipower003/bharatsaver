
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

    const faqItems = (pageDict.article.sections.find((s:any) => s.id === 'faq')?.content.find((c: any) => c.type === 'faq') as any)?.items ?? [];
    
    const faqSchema = {
        "@context":"https://schema.org",
        "@type":"FAQPage",
        "mainEntity":[
          {"@type":"Question","name":"What is the LIC Jeevan Anand maturity formula?","acceptedAnswer":{"@type":"Answer","text":"Maturity = Sum Assured + (Vested Simple Reversionary Bonus × Policy Term) + Final Additional Bonus (if declared). Use the calculator with the bonus/FAB inputs for estimates."}},
          {"@type":"Question","name":"How accurate is an online Jeevan Anand calculator?","acceptedAnswer":{"@type":"Answer","text":"It is an estimate that depends on the bonus and FAB rates you input. Final maturity is determined by LIC and depends on declared bonuses and underwriting."}},
          {"@type":"Question","name":"When does Jeevan Anand get surrender value?","acceptedAnswer":{"@type":"Answer","text":"Usually after 2 full years of premium payment; the Guaranteed Surrender Value and Special Surrender Value depend on years paid and plan rules."}},
          {"@type":"Question","name":"Is Jeevan Anand maturity taxable under Section 10(10D)?","acceptedAnswer":{"@type":"Answer","text":"Generally tax-free under 10(10D) subject to conditions (e.g., premium limits). Consult a tax advisor for your specific case."}},
          {"@type":"Question","name":"Should I surrender or make my policy paid-up?","acceptedAnswer":{"@type":"Answer","text":"Paid-up often yields higher final benefit for long-term policies, while surrender gives immediate cash. Use the calculator to compare both options."}},
          {"@type":"Question","name":"Can NRIs buy Jeevan Anand and use this calculator?","acceptedAnswer":{"@type":"Answer","text":"NRIs can use the calculator; actual purchase eligibility depends on LIC rules and FEMA regulations — check with LIC/agent."}},
          {"@type":"Question","name":"How does adding riders affect maturity?","acceptedAnswer":{"@type":"Answer","text":"Riders increase premium but typically do not change the maturity sum assured; rider benefits are payable separately on events covered."}},
          {"@type":"Question","name":"Can I take a loan against Jeevan Anand?","acceptedAnswer":{"@type":"Answer","text":"Yes — loans are generally available after acquiring surrender value, commonly up to 80–90% of the Special Surrender Value."}}
        ]
      };

    const howToSchema = {
        "@context":"https://schema.org",
        "@type":"HowTo",
        "name":"How to use the LIC Jeevan Anand calculator",
        "step":[
          {"@type":"HowToStep","name":"Choose plan preset","text":"Select 'New Jeevan Anand (Plan 715)' to auto-fill PPT and typical bonus ranges."},
          {"@type":"HowToStep","name":"Enter policy details","text":"Input sum assured, policy term, date of birth, annual premium (if asked), bonus per ₹1,000 SA and FAB."},
          {"@type":"HowToStep","name":"Click Calculate","text":"View estimated premium, maturity, IRR, paid-up and surrender values. Download PDF if required."}
        ]
      };
    
    const articleSchema = {
      "@context":"https://schema.org",
      "@type":"Article",
      "headline":"LIC Jeevan Anand Calculator (Plan 715) — Estimate Premium, Maturity & Surrender",
      "author":{"@type":"Person","name":"Mahesh Chaube, CFP"},
      "publisher":{"@type":"Organization","name":"BharatSaver","logo":{"@type":"ImageObject","url":"https://bharatsaver.com/logo.png"}},
      "datePublished":"2025-09-23",
      "dateModified":"2025-09-23",
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

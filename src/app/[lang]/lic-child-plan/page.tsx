
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import LicChildPlanPageClient from "./LicChildPlanPageClient";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
    const pageDict = (await import(`@/dictionaries/${params.lang}/lic-child-plan.json`).catch(() => import(`@/dictionaries/en/lic-child-plan.json`))).default;
    const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${params.lang}/lic-child-plan`;
    
    // SEO Optimized Metadata
    const title = "LIC Child Plan (2025) — Benefits, Calculator, Comparison (Jeevan Tarun & New Children’s Money Back)";
    const description = "Complete guide to LIC child plans (Jeevan Tarun, New Children’s Money Back). Compare benefits, see premium & maturity examples, use our free LIC child plan calculator, and learn tax & surrender rules. Free PDF calculator inside.";
    
    return {
        title: title,
        description: description,
        alternates: {
            canonical: `${siteUrl}/en/lic-child-plan`,
            languages: i18nConfig.locales.reduce((acc, locale) => {
                acc[locale] = `${siteUrl}/${locale}/lic-child-plan`;
                return acc;
            }, {} as Record<string, string>),
        },
        openGraph: {
          title: title,
          description: description,
          url: pageUrl,
          images: [{ url: `${siteUrl}/images/lic-child-plan-guide.png`, width: 1200, height: 630, alt: 'LIC Child Plan Guide' }],
          locale: params.lang === 'en' ? 'en_IN' : params.lang,
          type: 'website',
        },
    };
}


export default async function LicChildPlanPage({ params }: { params: { lang: Locale }}) {
    const dictionary = await getDictionary(params.lang);
    const pageDict = (await import(`@/dictionaries/${params.lang}/lic-child-plan.json`).catch(() => import(`@/dictionaries/en/lic-child-plan.json`))).default;
    
    return (
        <LicChildPlanPageClient 
            params={params}
            dictionary={dictionary}
            pageDict={pageDict}
        />
    );
}

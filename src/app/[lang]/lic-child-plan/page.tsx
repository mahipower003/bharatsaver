
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
    
    return {
        title: pageDict.meta_title,
        description: pageDict.meta_description,
        alternates: {
            canonical: pageUrl,
            languages: i18nConfig.locales.reduce((acc, locale) => {
                acc[locale] = `${siteUrl}/${locale}/lic-child-plan`;
                return acc;
            }, {} as Record<string, string>),
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

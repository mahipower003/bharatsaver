
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const pageDict = dictionary.guides_page;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/guides`;
  return {
    title: pageDict.meta_title,
    description: pageDict.meta_description,
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/guides`;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}

export default async function GuidesPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const pageDict = dictionary.guides_page;
  
  const guides = [
    {
      title: "LIC Policy Status Check Online (2026)",
      subtitle: "Learn how to check your LIC policy status instantly via online portal, SMS, WhatsApp, or phone. Prevent lapses and ensure life cover is active.",
      link: `/${lang}/lic-policy-status`,
      image: '/images/lic-status-check-online.png',
      alt: 'Person checking LIC policy status online',
      hint: 'finance status'
    },
    {
      title: "LIC Term Insurance Premium Guide",
      subtitle: "Compare Tech-Term vs Jeevan Amar, see age-wise rates for ₹1 Crore cover, and learn which plan suits your family best.",
      link: `/${lang}/lic-term-insurance`,
      image: '/images/Bharat-saver-home-page-top.png',
      alt: 'LIC Term Insurance Guide',
      hint: 'term insurance'
    }
  ];

  return (
    <div className="py-12 bg-secondary/20 min-h-[60vh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {pageDict.h1 || "Expert Financial Guides"}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {pageDict.description || "Comprehensive guides to help you navigate your LIC portfolio and personal finance."}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide, index) => (
            <Link key={index} href={guide.link} className="group">
              <Card className="h-full flex flex-col transition-all duration-200 group-hover:shadow-xl group-hover:-translate-y-1 overflow-hidden">
                <div className="relative">
                  <Image 
                    src={guide.image}
                    alt={guide.alt}
                    width={400}
                    height={250}
                    className="w-full h-auto object-cover"
                    data-ai-hint={guide.hint}
                  />
                </div>
                <CardContent className="p-6 flex flex-col flex-grow bg-card">
                  <h3 className="text-xl font-semibold flex-grow">{guide.title}</h3>
                  <p className="mt-2 text-muted-foreground text-sm">{guide.subtitle}</p>
                   <div className="flex items-center text-primary mt-6 text-sm font-medium">
                    <span>Read Guide</span>
                    <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

    
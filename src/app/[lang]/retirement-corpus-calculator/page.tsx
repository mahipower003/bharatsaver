
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { RetirementCorpusCalculator } from "@/components/calculators/RetirementCorpusCalculator";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['retirement_corpus_calculator']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/retirement-corpus-calculator`;
  
  const softwareSchema = {
    "@context":"https://schema.org",
    "@type":"SoftwareApplication",
    "name":"Retirement Corpus Calculator",
    "url": pageUrl,
    "applicationCategory":"FinanceApplication",
    "operatingSystem":"Web",
    "description":"Calculator to estimate retirement corpus, monthly SIP required and post-retirement income for India.",
    "offers": {
      "@type":"Offer",
      "url": pageUrl,
      "price":"0",
      "priceCurrency":"INR"
    }
  };

  const faqItems = dictionary.retirement_corpus_calculator.faqs;
  const faqSchema = {
    "@context":"https://schema.org",
    "@type":"FAQPage",
    "mainEntity": faqItems.map((faq: { question: string, answer: string }) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return {
    title: dictionary.retirement_corpus_calculator.meta_title,
    description: dictionary.retirement_corpus_calculator.meta_description,
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/retirement-corpus-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
    other: {
      'application/ld+json': JSON.stringify([softwareSchema, faqSchema]),
    },
  };
}

export default async function RetirementCorpusCalculatorPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['retirement_corpus_calculator']);
  
  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {dictionary.retirement_corpus_calculator.h1}
            </h1>
        </div>

        <RetirementCorpusCalculator dictionary={dictionary.retirement_corpus_calculator} />

      </div>
    </div>
  );
}


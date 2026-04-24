import { ReactNode } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AuthorCard } from "@/components/layout/AuthorCard";
import { FooterCta } from "@/components/layout/FooterCta";
import { CalculatorActions } from "@/components/layout/CalculatorActions";
import { RelatedCalculatorsWidget } from "@/components/layout/RelatedCalculatorsWidget";
import type { Locale } from "@/lib/i18n-config";

interface FAQ {
  question: string;
  answer: string;
}

interface CalculatorPageLayoutProps {
  lang: Locale;
  dictionary: any; // Ideally typed, but 'any' is flexible for different dictionaries
  pageDict: any;
  h1: string;
  description: string;
  lastUpdated: string;
  calculator: ReactNode;
  children: ReactNode; // The content cards below the calculator
  faqs?: FAQ[];
  faqTitle?: string;
  pageUrl?: string;
}

export function CalculatorPageLayout({
  lang,
  dictionary,
  pageDict,
  h1,
  description,
  lastUpdated,
  calculator,
  children,
  faqs,
  faqTitle,
  pageUrl,
}: CalculatorPageLayoutProps) {
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${lang}` },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${lang}/calculators` },
      { '@type': 'ListItem', position: 3, name: h1, item: pageUrl || `${siteUrl}/${lang}/calculators` },
    ],
  };

  const faqSchema = faqs && faqs.length > 0 ? {
    "@context":"https://schema.org",
    "@type":"FAQPage",
    "mainEntity": faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  return (
    <div className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline" dangerouslySetInnerHTML={{__html: h1}}></h1>
          <div className="bs-byline justify-center text-center mt-4 text-sm text-muted-foreground flex flex-wrap items-center gap-2">
            <span className="bs-author">By <strong className="text-foreground">Mahesh Chaube</strong></span>
            <span className="bs-creds">, CFP</span>
            <span className="bs-sep hidden sm:inline">|</span>
            <span className="bs-updated">Last updated: <time dateTime={lastUpdated}>{lastUpdated}</time></span>
            <div className="bs-reviewed w-full sm:w-auto mt-2 sm:mt-0">Reviewed by <strong className="text-foreground">Laveena Vijayi</strong> — BharatSaver Editorial Team</div>
          </div>
          <div className="mt-4 text-lg text-muted-foreground" dangerouslySetInnerHTML={{__html: description}}></div>
          <CalculatorActions />
        </div>
        
        {/* The Interactive Calculator Component */}
        <div className="mb-12">
          {calculator}
        </div>

        {/* Dynamic Descriptive Content */}
        <div className="space-y-12">
          {children}
        </div>

        {/* Standardized FAQ Section */}
        {faqs && faqs.length > 0 && (
          <div className="mt-12">
              <h2 className="text-2xl font-bold text-center mb-6">{faqTitle || "Frequently Asked Questions"}</h2>
              <Accordion type="single" collapsible className="w-full bg-card border rounded-lg shadow-sm p-4">
                {faqs.map((faq, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-left font-semibold hover:text-primary">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      <div dangerouslySetInnerHTML={{ __html: faq.answer.replace(/{lang}/g, lang) }}></div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
          </div>
        )}

        {/* Related Calculators — retention widget */}
        <RelatedCalculatorsWidget lang={lang} />

        {/* Global Footer Components */}
        <div className="mt-12 space-y-8">
          {dictionary?.author_card && <AuthorCard dictionary={dictionary.author_card} />}
          {dictionary?.footer_cta && <FooterCta dictionary={dictionary.footer_cta} lang={lang} />}
        </div>
      </div>
    </div>
  );
}

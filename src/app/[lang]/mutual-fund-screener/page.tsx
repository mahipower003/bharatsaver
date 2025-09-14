
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AuthorCard } from "@/components/layout/AuthorCard";
import { MutualFundScreenerTool } from "@/components/tools/MutualFundScreener";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['mutual_fund_screener']);
  const dict = dictionary.mutual_fund_screener;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/mutual-fund-screener`;

  const softwareSchema = {
    "@context":"https://schema.org",
    "@type":"SoftwareApplication",
    "name": "Mutual Fund Scheme Selector 2025 India",
    "url": pageUrl,
    "applicationCategory":"FinanceApplication",
    "operatingSystem":"Web",
    "description":"Use our free mutual fund screener to filter and compare direct funds by returns, risk, AUM, expense ratio and holdings. Includes overlap check, SIP planner & downloadable CSV.",
    "offers": {
      "@type":"Offer",
      "url": pageUrl,
      "price":"0",
      "priceCurrency":"INR"
    }
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": dict.h1,
    "author":{"@type":"Person","name":"Mahesh Chaube","jobTitle":"CFP","url":`${siteUrl}/${params.lang}/author/mahesh-chaube`},
    "datePublished":"2025-08-15",
    "dateModified":"2025-09-01",
    "publisher":{"@type":"Organization","name":"BharatSaver","logo":{"@type":"ImageObject","url":`${siteUrl}/icon.svg`}}
  };

  return {
    title: dict.meta_title,
    description: dict.meta_description,
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/mutual-fund-screener`;
        return acc;
      }, {} as Record<string, string>),
    },
    other: {
      'application/ld+json': JSON.stringify([dict.faq_json_ld, softwareSchema, articleSchema]),
    },
  };
}

export default async function MutualFundScreenerPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['mutual_fund_screener', 'author_card']);
  const dict = dictionary.mutual_fund_screener;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${params.lang}` },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${params.lang}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'Mutual Fund Screener', item: pageUrl },
    ],
  };

  return (
    <div className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mx-auto max-w-5xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline mb-4" dangerouslySetInnerHTML={{ __html: dict.h1 }}></h1>
          <div className="text-xl text-muted-foreground prose dark:prose-invert max-w-none mx-auto" dangerouslySetInnerHTML={{ __html: dict.intro }}></div>
          <Button asChild size="lg" className="mt-6">
            <Link href="#interactive-selector">{dict.interactive_tool.cta_button}</Link>
          </Button>
        </header>

        <main className="space-y-12">
          <Card>
            <CardHeader>
              <h2 className="text-3xl font-bold font-headline">{dict.how_it_works.h2}</h2>
            </CardHeader>
            <CardContent className="space-y-6 prose dark:prose-invert max-w-none">
              <h3 className="text-2xl font-semibold">{dict.how_it_works.data_sources.h3}</h3>
              <div dangerouslySetInnerHTML={{ __html: dict.how_it_works.data_sources.body }}></div>
              <h3 className="text-2xl font-semibold">{dict.how_it_works.filters.h3}</h3>
              <div dangerouslySetInnerHTML={{ __html: dict.how_it_works.filters.body }}></div>
              <h3 className="text-2xl font-semibold">{dict.how_it_works.matching_logic.h3}</h3>
              <div dangerouslySetInnerHTML={{ __html: dict.how_it_works.matching_logic.body }}></div>
            </CardContent>
          </Card>

          <section id="interactive-selector">
            <h2 className="text-3xl font-bold font-headline text-center mb-6">{dict.interactive_tool.h2}</h2>
            <p className="text-center text-muted-foreground mb-8" dangerouslySetInnerHTML={{ __html: dict.interactive_tool.guide }}></p>
            <MutualFundScreenerTool />
          </section>

          <Card>
            <CardHeader>
              <h2 className="text-3xl font-bold font-headline">{dict.step_by_step.h2}</h2>
            </CardHeader>
            <CardContent className="space-y-6 prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: dict.step_by_step.body }}></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-3xl font-bold font-headline">{dict.screener_examples.h2}</h2>
            </CardHeader>
            <CardContent className="space-y-6 prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: dict.screener_examples.body }}></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-3xl font-bold font-headline">{dict.compare_funds.h2}</h2>
            </CardHeader>
            <CardContent className="space-y-6 prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: dict.compare_funds.body }}></div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <h2 className="text-3xl font-bold font-headline">{dict.portfolio_hygiene.h2}</h2>
            </CardHeader>
            <CardContent className="space-y-6 prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: dict.portfolio_hygiene.body }}></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-3xl font-bold font-headline">{dict.common_mistakes.h2}</h2>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
                <ul className="list-disc pl-5 space-y-2">
                    {dict.common_mistakes.mistakes.map((mistake: string, index: number) => (
                        <li key={index} dangerouslySetInnerHTML={{ __html: mistake }}></li>
                    ))}
                </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h2 className="text-3xl font-bold font-headline">{dict.goal_based_portfolio.h2}</h2>
            </CardHeader>
            <CardContent className="space-y-6 prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: dict.goal_based_portfolio.body }}></div>
            </CardContent>
          </Card>

          <section id="faq">
            <h2 className="text-3xl font-bold font-headline text-center mb-8">{dict.faq.h2}</h2>
            <Accordion type="single" collapsible className="w-full">
              {dict.faq.questions.map((faq: { q: string, a: string }, index: number) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>
                    <p dangerouslySetInnerHTML={{ __html: faq.a }}></p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <Card>
            <CardHeader>
              <h2 className="text-3xl font-bold font-headline">{dict.tools_downloads.h2}</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{dict.tools_downloads.intro}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dict.tools_downloads.links.map((link: { text: string, href: string, desc: string }, index: number) => (
                    <Button key={index} asChild variant="outline">
                      <Link href={link.href.replace('{lang}', params.lang)} target={link.href.startsWith('/') ? '_self' : '_blank'}>{link.text}</Link>
                    </Button>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <h2 className="text-3xl font-bold font-headline">{dict.sources_methodology.h2}</h2>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none text-sm">
              <div dangerouslySetInnerHTML={{ __html: dict.sources_methodology.body }}></div>
            </CardContent>
          </Card>
          
          <AuthorCard dictionary={dictionary.author_card} />

          <Card className="text-center bg-accent/10 border-accent/30 py-8">
            <CardHeader>
              <CardTitle className="text-2xl">{dict.footer_cta.h2}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{dict.footer_cta.body}</p>
              <Button size="lg" asChild>
                <Link href={`/${params.lang}/contact`}>{dict.footer_cta.cta_text}</Link>
              </Button>
            </CardContent>
          </Card>

        </main>
      </div>
    </div>
  );
}

    
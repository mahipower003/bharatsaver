

import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AuthorCard } from "@/components/layout/AuthorCard";
import { MutualFundScreenerTool } from "@/components/tools/MutualFundScreener";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, ListSteps, Wand2, GitCompareArrows, HeartPulse, Ban, ShieldCheck, Star } from 'lucide-react';


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

  const faqSchema = {
    "@context":"https://schema.org",
    "@type":"FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a mutual fund scheme selector and how does it work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Think of it as a smart filter. It helps you sift through thousands of funds to find the few that actually match your goals. You tell it what you're looking for—like category, returns, and risk—and the selector gives you a shortlist. My tool then lets you dive deeper by comparing holdings and checking for portfolio overlap, so you know you're truly diversified."
        }
      },
      {
        "@type": "Question",
        "name": "How do I choose the right mutual fund scheme for SIP investing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For SIPs, consistency is king. Don't chase last year's winner. Use the selector to find funds with a solid 5-10 year track record and a manager who's been at the helm for a while. A low expense ratio (under 1% for active funds) is also crucial. For most people starting out, a Nifty 50 index fund or a well-managed Flexi Cap fund is a fantastic, reliable choice for SIPs."
        }
      },
      {
        "@type": "Question",
        "name": "Can the selector show top holdings of a mutual fund?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, absolutely. That's one of its most powerful features. Once you've filtered down to a list of funds, you can click on any fund to see its top 10 stock holdings and sector allocation. This is critical for understanding what you're *really* investing in and for comparing it against other funds to avoid costly overlap."
        }
      },
      {
        "@type": "Question",
        "name": "How often are fund holdings and NAV updated in the selector?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "I take data accuracy very seriously. The Net Asset Value (NAV) for each fund is updated daily, so you're always seeing the latest price. The detailed fund holdings (the actual stocks a fund owns) are updated monthly, as soon as the fund houses (AMCs) release their latest portfolios. This ensures you're making decisions on the freshest, most reliable data possible."
        }
      },
      {
        "@type": "Question",
        "name": "What is weighted overlap and why should I care?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Weighted overlap tells you the exact percentage of your portfolio that's duplicated between two funds. You should care because high overlap (I'd say over 30%) means you're not actually diversified; you might just be paying two managers to buy the same stocks. My tool calculates this so you can build a portfolio of funds that genuinely have different strategies, giving you true diversification."
        }
      },
      {
        "@type": "Question",
        "name": "How many funds should I hold in a diversified portfolio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Honestly, less is often more. For most investors, a well-chosen portfolio of 4-6 funds is more than enough. This could be a mix like one large-cap, one mid-cap, one small-cap, and perhaps one international or ELSS fund. The goal is to have funds with different strategies, not just a large number of funds that all do the same thing."
        }
      },
      {
        "@type": "Question",
        "name": "Does a lower expense ratio always mean a better fund?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Not always, but it's a massive head start. A lower expense ratio means more of your hard-earned money is working for you, not going to the fund manager. While a brilliant manager might justify a slightly higher fee with consistent outperformance, you should always be skeptical. For index funds, a low expense ratio is the single most important factor, period."
        }
      },
      {
        "@type": "Question",
        "name": "How do I compare ELSS funds for tax saving?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "When comparing ELSS (tax-saving) funds, look beyond just the tax benefit. Use the selector to filter for the 'ELSS' category, then compare their 3-year and 5-year returns (since they have a 3-year lock-in). Crucially, check their portfolio overlap with your existing funds to ensure the new fund is adding real diversification, not just more of the same stocks."
        }
      },
      {
        "@type": "Question",
        "name": "Can I export the selector results to CSV or Excel?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Once you've created a shortlist of funds you're interested in, you can use our 'Export to CSV' feature. This allows you to download the key data points for your selected funds, so you can do your own offline analysis, keep a record of your research, or share it with your financial advisor to discuss your choices."
        }
      },
      {
        "@type": "Question",
        "name": "How do I use the selector to build a retirement portfolio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For retirement, you have a long time horizon, which is your biggest advantage. I'd start by filtering for equity funds like 'Flexi Cap' or 'Large & Mid-Cap'. Look for funds with a consistent 10-year track record and a high Sharpe Ratio (which indicates good risk-adjusted returns). Combining 2-3 such equity funds with your EPF/PPF is a great way to build a balanced, growth-oriented retirement portfolio."
        }
      },
      {
        "@type": "Question",
        "name": "Will the selector recommend direct plans or regular plans?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "My selector exclusively recommends **Direct Plans**. Why? Because they have lower expense ratios. Direct plans don't involve paying a commission to a distributor, and over the long term, that seemingly small difference can add up to lakhs in extra returns for you, the investor. I believe in putting more of your own money to work for you."
        }
      },
      {
        "@type": "Question",
        "name": "How do I check fund manager track record in the tool?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Experience matters. In our detailed fund view, we show the 'Manager Tenure'—how long the current fund manager has been at the helm. A manager with a tenure of 5+ years is a great sign of stability and a consistent investment process. It shows they've navigated multiple market cycles, which builds a lot of confidence."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use the selector for NRI mutual fund investments?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can. While the funds displayed are Indian domiciled funds, NRIs can invest in them through a Portfolio Investment Scheme (PIS) account or based on their KYC status. The principles of selecting funds based on performance, risk, and overlap are exactly the same. However, I strongly advise you to consult a financial advisor regarding specific tax implications for NRIs, as they can be different."
        }
      },
      {
        "@type": "Question",
        "name": "Is historical performance a reliable predictor of future returns?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "That's a fantastic and important question. The honest answer is no, past performance doesn't *guarantee* future results. However, it's a very useful indicator of a fund's consistency, its risk management, and the fund manager's skill. A fund that has consistently beaten its benchmark over 5-10 years is more likely to have a solid, repeatable process than a fund that was just a one-hit-wonder last year."
        }
      },
      {
        "@type": "Question",
        "name": "How often should I rebalance my mutual fund portfolio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A good rule of thumb that I give my clients is to review your portfolio once a year. Rebalancing simply means bringing your asset allocation back to your original targets. For example, if a great run in mid-caps means they now form 30% of your portfolio instead of your target 20%, you'd sell some of those profits and reinvest in your other funds. It's a disciplined way to book profits and buy low."
        }
      }
    ]
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
      'application/ld+json': JSON.stringify([faqSchema, softwareSchema, articleSchema]),
    },
  };
}

export default async function MutualFundScreenerPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['mutual_fund_screener', 'author_card']);
  const dict = dictionary.mutual_fund_screener;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/mutual-fund-screener`;

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
                <CardTitle className="flex items-center gap-3 text-3xl font-bold font-headline">
                    <BookOpen className="h-8 w-8 text-primary" />
                    {dict.how_it_works.h2}
                </CardTitle>
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
                <CardTitle className="flex items-center gap-3 text-3xl font-bold font-headline">
                    <ListSteps className="h-8 w-8 text-primary" />
                    {dict.step_by_step.h2}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: dict.step_by_step.body }}></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl font-bold font-headline">
                    <Wand2 className="h-8 w-8 text-primary" />
                    {dict.screener_examples.h2}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: dict.screener_examples.body }}></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl font-bold font-headline">
                    <GitCompareArrows className="h-8 w-8 text-primary" />
                    {dict.compare_funds.h2}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: dict.compare_funds.body }}></div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl font-bold font-headline">
                    <HeartPulse className="h-8 w-8 text-primary" />
                    {dict.portfolio_hygiene.h2}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: dict.portfolio_hygiene.body }}></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl font-bold font-headline">
                    <Ban className="h-8 w-8 text-destructive" />
                    {dict.common_mistakes.h2}
                </CardTitle>
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
                <CardTitle className="flex items-center gap-3 text-3xl font-bold font-headline">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                    {dict.goal_based_portfolio.h2}
                </CardTitle>
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

          <Card className="mt-12 shadow-lg bg-accent/10 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Star className="h-7 w-7 text-accent" />
                <h2 className="text-2xl font-bold">{dict.conclusion.h2}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: dict.conclusion.body }} />
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

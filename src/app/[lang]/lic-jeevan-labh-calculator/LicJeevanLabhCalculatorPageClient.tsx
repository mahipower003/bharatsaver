
'use client';

import { LicJeevanLabhCalculator } from "@/components/calculators/LicJeevanLabhCalculator";
import { AuthorCard } from "@/components/layout/AuthorCard";
import type { Dictionary } from "@/lib/types";
import type { Locale } from "@/lib/i18n-config";
import { FooterCta } from "@/components/layout/FooterCta";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, HelpCircle, ShieldCheck } from "lucide-react";

function getIcon(iconName: string) {
    switch (iconName) {
        case 'ShieldCheck': return ShieldCheck;
        case 'CheckCircle': return CheckCircle;
        case 'HelpCircle': return HelpCircle;
        default: return HelpCircle;
    }
}

export default function LicJeevanLabhCalculatorPageClient({
  params,
  dictionary,
  pageDict,
}: {
  params: { lang: Locale };
  dictionary: Dictionary;
  pageDict: any;
}) {

  const ArticleContent = () => (
    <div className="mt-12 space-y-8">
      {pageDict.article.sections.map((section: any, index: number) => {
        const Icon = getIcon(section.icon);
        return (
          <Card key={index} className="shadow-lg" id={section.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Icon className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {section.content.map((item: any, idx: number) => {
                switch (item.type) {
                  case 'paragraph':
                    return <p key={idx} className="text-muted-foreground mb-4" dangerouslySetInnerHTML={{ __html: item.text }} />;
                  case 'list':
                    return (
                      <ul key={idx} className="list-disc pl-5 space-y-2 text-muted-foreground">
                        {item.items.map((li: string, liIdx: number) => <li key={liIdx} dangerouslySetInnerHTML={{ __html: li }} />)}
                      </ul>
                    );
                  default:
                    return null;
                }
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl">
        <header className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline" dangerouslySetInnerHTML={{__html: pageDict.h1}} />
            <p className="mt-4 text-lg text-muted-foreground" dangerouslySetInnerHTML={{__html: pageDict.description}} />
        </header>
        
        <div id="calculator-widget">
          <LicJeevanLabhCalculator dictionary={pageDict.tool} />
        </div>

        <ArticleContent />
        
        <div className="mt-12">
            <AuthorCard dictionary={dictionary.author_card} />
        </div>
        <FooterCta dictionary={dictionary.footer_cta} lang={params.lang} />
      </div>
    </div>
  );
}

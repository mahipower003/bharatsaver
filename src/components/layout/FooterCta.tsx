
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Dictionary } from '@/types';
import { type Locale } from '@/lib/i18n-config';

type FooterCtaProps = {
  dictionary: Dictionary['footer_cta'];
  lang: Locale;
}

export function FooterCta({ dictionary, lang }: FooterCtaProps) {
  if (!dictionary) return null;

  return (
    <Card className="text-center bg-accent/10 border-accent/30 py-8 mt-12">
        <CardHeader>
          <CardTitle className="text-2xl">{dictionary.h2}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{dictionary.body}</p>
          <Button size="lg" asChild>
            <Link href={`/${lang}/contact`}>{dictionary.cta_text}</Link>
          </Button>
        </CardContent>
    </Card>
  );
}

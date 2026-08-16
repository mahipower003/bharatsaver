'use client';

import Link from 'next/link';
import { Menu, ShieldCheck, TrendingUp, Landmark, Layers, BadgePercent } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { BharatSaverLogo } from './BharatSaverLogo';
import type { Locale } from '@/lib/i18n-config';
import type { Dictionary } from '@/lib/types';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CATEGORIES, getCalculatorsByCategory } from '@/lib/categories';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type MobileNavProps = {
  lang: Locale;
  dictionary: Dictionary['header'];
};

const categoryIcons = {
  'lic-insurance': ShieldCheck,
  'pension-retirement': TrendingUp,
  'tax-savings': Landmark,
  'mutual-funds': Layers,
  'loans-credit': BadgePercent,
};

export function MobileNav({ lang, dictionary }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: `/${lang}`, label: dictionary.nav.home },
    { href: `/${lang}/calculators`, label: dictionary.nav.calculators },
    { href: `/${lang}/guides`, label: dictionary.nav.guides },
    { href: `/${lang}/blog`, label: dictionary.nav.blog },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-sm p-0">
        <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-between items-center bg-card">
            <Link href={`/${lang}`} className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <BharatSaverLogo className="h-8 w-8" />
              <span className="font-bold text-lg">BharatSaver</span>
            </Link>
            <LanguageSwitcher currentLocale={lang} />
          </div>
          <div className="flex-grow overflow-y-auto p-4 space-y-6">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-semibold text-foreground/90 hover:text-primary py-1"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="border-t pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Calculators by Bucket
              </h3>
              <Accordion type="single" collapsible className="w-full">
                {CATEGORIES.map((cat) => {
                  const Icon = categoryIcons[cat.id] || ShieldCheck;
                  const catCalcs = getCalculatorsByCategory(cat.id);
                  return (
                    <AccordionItem key={cat.id} value={cat.id} className="border-b-0">
                      <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <span>{cat.shortName}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-2 pt-1 pl-6">
                        <div className="flex flex-col gap-1.5 border-l-2 border-primary/20 pl-3">
                          {catCalcs.map((calc) => (
                            <Link
                              key={calc.slug}
                              href={`/${lang}/${calc.slug}`}
                              className="text-xs font-medium text-muted-foreground hover:text-primary py-1 block"
                              onClick={() => setOpen(false)}
                            >
                              {calc.title}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

'use client';

import Link from 'next/link';
import { Menu, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from './Logo';
import { calculators } from '@/data/calculators';
import type { Locale } from '@/lib/i18n-config';
import type { Dictionary } from '@/types';

type MobileNavProps = {
  lang: Locale;
  dictionary: Dictionary['header'];
};

export function MobileNav({ lang, dictionary }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: `/${lang}`, label: dictionary.nav.home },
    { href: `/${lang}/guides`, label: dictionary.nav.guides },
    { href: `/${lang}/blog`, label: dictionary.nav.blog },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-sm">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <Link href={`/${lang}`} className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <Logo className="h-8 w-8" />
              <span className="font-bold text-lg">BharatSaver</span>
            </Link>
          </div>
          <div className="flex-grow overflow-y-auto p-4">
            <nav className="flex flex-col gap-4 text-lg">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-medium text-foreground/80 hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8">
              <h3 className="font-semibold mb-4 text-foreground/80">{dictionary.nav.calculators}</h3>
              <div className="grid grid-cols-1 gap-2">
                {calculators.map((calc) => (
                  <Link
                    key={calc.slug}
                    href={`/${lang}/${calc.slug}`}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
                    onClick={() => setOpen(false)}
                  >
                    <calc.icon className="h-5 w-5 text-primary" />
                    <span className="font-medium">{calc.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

import Link from 'next/link';
import type { Locale } from '@/lib/i18n-config';
import type { Dictionary } from '@/types';
import { Search } from 'lucide-react';

import { Logo } from './Logo';
import { Button } from '@/components/ui/button';
import { MobileNav } from './MobileNav';

type HeaderProps = {
  lang: Locale;
  dictionary: Dictionary['header'];
};

export function Header({ lang, dictionary }: HeaderProps) {
  const navLinks = [
    { href: `/${lang}`, label: dictionary.nav.home },
    { href: `/${lang}/calculators`, label: dictionary.nav.calculators },
    { href: `/${lang}/guides`, label: dictionary.nav.guides },
    { href: `/${lang}/blog`, label: dictionary.nav.blog },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex h-20 items-center px-4 md:px-6">
        <div className="flex items-center gap-4">
          <MobileNav lang={lang} dictionary={dictionary} />
          <Link href={`/${lang}`} className="hidden sm:flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="font-bold text-2xl text-foreground">BharatSaver</span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-8 mx-auto">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-base font-medium text-muted-foreground transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2 ml-auto">
           <Link href={`/${lang}/search`}>
              <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
              </Button>
           </Link>
          <Button asChild className="hidden xl:flex bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href={`/${lang}/ppf-calculator`}>
              {dictionary.cta}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

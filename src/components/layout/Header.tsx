import Link from 'next/link';
import { ChevronDown, Sparkles } from 'lucide-react';
import type { Locale } from '@/lib/i18n-config';
import type { Dictionary } from '@/types';

import { Logo } from './Logo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNav } from './MobileNav';
import { calculators } from '@/data/calculators';
import { cn } from '@/lib/utils';

type HeaderProps = {
  lang: Locale;
  dictionary: Dictionary['header'];
};

export function Header({ lang, dictionary }: HeaderProps) {
  const navLinks = [
    { href: `/${lang}`, label: dictionary.nav.home },
    { href: `/${lang}/guides`, label: dictionary.nav.guides },
    { href: `/${lang}/blog`, label: dictionary.nav.blog },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-4">
          <MobileNav lang={lang} dictionary={dictionary} />
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <Logo className="h-10 w-10" />
            <div className="flex flex-col">
              <span className="font-bold text-xl text-foreground">BharatSaver</span>
              <span className="text-xs text-muted-foreground">{dictionary.subtitle}</span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 ml-10">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary px-0 hover:bg-transparent">
                {dictionary.nav.calculators}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {calculators.map((calc, index) => (
                <DropdownMenuItem key={calc.slug} asChild>
                  <Link href={`/${lang}/${calc.slug}`} className="flex items-center gap-2">
                    <calc.icon className={cn("h-4 w-4", calc.slug === 'scheme-selector' ? "text-accent" : "text-primary")} />
                    <span>{calc.title}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
          <LanguageSwitcher currentLocale={lang} />
          <Button asChild className="hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href={`/${lang}/scheme-selector`}>
              <Sparkles className="mr-2 h-4 w-4" />
              {dictionary.cta}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

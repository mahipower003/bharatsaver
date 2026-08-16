'use client';

import Link from 'next/link';
import type { Locale } from '@/lib/i18n-config';
import type { Dictionary } from '@/lib/types';
import { ChevronDown, ShieldCheck, TrendingUp, Landmark, Layers, BadgePercent } from 'lucide-react';

import { BharatSaverLogo } from './BharatSaverLogo';
import { Button } from '@/components/ui/button';
import { MobileNav } from './MobileNav';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CATEGORIES } from '@/lib/categories';

type HeaderProps = {
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

export function Header({ lang, dictionary }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b shadow-sm">
      <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-3 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-10">
          <MobileNav lang={lang} dictionary={dictionary} />
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <BharatSaverLogo className="h-7 w-7 sm:h-8 sm:w-8" />
            <span className="font-bold text-lg sm:text-xl text-foreground">BharatSaver</span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-6">
          <Link href={`/${lang}`} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            {dictionary.nav.home}
          </Link>

          {/* Categorized Calculators Mega Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus:outline-none">
                <span>{dictionary.nav.calculators}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[340px] p-2">
              <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground px-2 py-1.5">
                Financial Calculators by Category
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {CATEGORIES.map((cat) => {
                const IconComponent = categoryIcons[cat.id] || ShieldCheck;
                return (
                  <DropdownMenuItem key={cat.id} asChild>
                    <Link
                      href={`/${lang}/calculators#${cat.id}`}
                      className="flex items-start gap-3 p-2 rounded-md hover:bg-accent cursor-pointer group"
                    >
                      <div className="p-2 rounded bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors mt-0.5">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground">{cat.shortName}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{cat.description}</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/${lang}/calculators`}
                  className="w-full text-center text-xs font-bold text-primary hover:underline py-1.5 justify-center"
                >
                  View All Calculators & Tools →
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href={`/${lang}/guides`} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            {dictionary.nav.guides}
          </Link>

          <Link href={`/${lang}/blog`} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            {dictionary.nav.blog}
          </Link>
        </nav>

        <div className="flex items-center justify-end gap-2">
          <LanguageSwitcher currentLocale={lang} />
          <Button asChild className="hidden lg:flex bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
            <Link href={`/${lang}/lic-premium-calculator`}>
              LIC Calculator
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

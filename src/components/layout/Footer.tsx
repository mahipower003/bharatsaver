import Link from 'next/link';
import { Logo } from './Logo';
import type { Locale } from '@/lib/i18n-config';
import type { Dictionary } from '@/types';
import { calculators } from '@/data/calculators';
import { Twitter, Facebook, Instagram } from 'lucide-react';

type FooterProps = {
  lang: Locale;
  dictionary: Dictionary['footer'];
};

export function Footer({ lang, dictionary }: FooterProps) {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href={`/${lang}`} className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <span className="text-xl font-bold">BharatSaver</span>
            </Link>
            <p className="text-sm text-muted-foreground">{dictionary.about.description}</p>
            <div className="flex gap-4">
                <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
                <Link href="#" aria-label="Facebook"><Facebook className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
                <Link href="#" aria-label="Instagram"><Instagram className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">{dictionary.calculators.title}</h3>
            <ul className="mt-4 space-y-2">
              {calculators.slice(0, 6).map((calc) => (
                <li key={calc.slug}>
                  <Link href={`/${lang}/${calc.slug}`} className="text-sm text-muted-foreground hover:text-primary">
                    {calc.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">{dictionary.resources.title}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href={`/${lang}/guides`} className="text-sm text-muted-foreground hover:text-primary">
                  {dictionary.resources.guides}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/blog`} className="text-sm text-muted-foreground hover:text-primary">
                  {dictionary.resources.blog}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">{dictionary.legal.title}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href={`/${lang}/privacy-policy`} className="text-sm text-muted-foreground hover:text-primary">
                  {dictionary.legal.privacy}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/terms-of-service`} className="text-sm text-muted-foreground hover:text-primary">
                  {dictionary.legal.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8">
          <p className="text-sm text-muted-foreground text-center">{dictionary.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

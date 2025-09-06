import Link from 'next/link';
import type { Locale } from '@/lib/i18n-config';
import type { Dictionary } from '@/types';
import { Twitter, Facebook, Linkedin } from 'lucide-react';

type FooterProps = {
  lang: Locale;
  dictionary: Dictionary['footer'];
};

export function Footer({ lang, dictionary }: FooterProps) {
  const allLinks = [
    { title: 'Home', href: `/${lang}` },
    { title: 'Guides', href: `/${lang}/guides` },
    { title: 'Blog', href: `/${lang}/blog` },
    ...dictionary.calculators.links,
    ...dictionary.resources.links,
  ];

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-4 md:gap-8 text-sm text-muted-foreground">
          <p className="text-center md:text-left">{dictionary.copyright}</p>
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
            {allLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-primary">
                {link.title}
              </Link>
            ))}
          </nav>
          <div className="flex gap-4 items-center">
            <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 hover:text-primary" /></Link>
            <Link href="#" aria-label="Facebook"><Facebook className="h-5 w-5 hover:text-primary" /></Link>
            <Link href="#" aria-label="Linkedin"><Linkedin className="h-5 w-5 hover:text-primary" /></Link>
          </div>
          <p className="w-full text-center text-xs mt-4 md:hidden">{dictionary.disclaimer}</p>
          <p className="hidden md:block text-right max-w-md">{dictionary.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}

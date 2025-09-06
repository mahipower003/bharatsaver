import Link from 'next/link';
import type { Locale } from '@/lib/i18n-config';
import type { Dictionary } from '@/types';
import { Twitter, Facebook, Linkedin } from 'lucide-react';

type FooterProps = {
  lang: Locale;
  dictionary: Dictionary['footer'];
};

export function Footer({ lang, dictionary }: FooterProps) {
  return (
    <footer className="bg-secondary/50 border-t">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">{dictionary.about.title}</h3>
            <ul className="space-y-2">
              {dictionary.about.links.map((link) => (
                <li key={link.href}>
                  <Link href={`/${lang}${link.href}`} className="text-sm text-muted-foreground hover:text-primary">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">{dictionary.calculators.title}</h3>
            <ul className="space-y-2">
              {dictionary.calculators.links.map((link) => (
                <li key={link.href}>
                  <Link href={`/${lang}${link.href}`} className="text-sm text-muted-foreground hover:text-primary">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">{dictionary.resources.title}</h3>
            <ul className="space-y-2">
                {dictionary.resources.links.map((link) => (
                    <li key={link.href}>
                    <Link href={`${link.href.startsWith('/') ? `/${lang}`: ''}${link.href}`} className="text-sm text-muted-foreground hover:text-primary" target={link.href.startsWith('/') ? '' : '_blank'}>
                        {link.title}
                    </Link>
                    </li>
                ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">{dictionary.contact.title}</h3>
            <div className="flex gap-4 items-center">
                <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
                <Link href="#" aria-label="Facebook"><Facebook className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
                <Link href="#" aria-label="Linkedin"><Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>{dictionary.copyright}</p>
          <p className="mt-4 md:mt-0 text-center md:text-right max-w-md">{dictionary.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}

import Link from 'next/link';
import { Logo } from './Logo';
import type { Locale } from '@/lib/i18n-config';
import type { Dictionary } from '@/types';
import { Twitter, Facebook, Linkedin } from 'lucide-react';
import { Separator } from '../ui/separator';

type FooterProps = {
  lang: Locale;
  dictionary: Dictionary['footer'];
};

export function Footer({ lang, dictionary }: FooterProps) {
  const mainLinks = [
    { title: dictionary.about.title, links: [{title: 'Home', href: `/${lang}`}, {title: 'Guides', href: `/${lang}/guides`}, {title: 'Blog', href: `/${lang}/blog`}] },
    { title: dictionary.calculators.title, links: dictionary.calculators.links },
    { title: dictionary.resources.title, links: dictionary.resources.links },
  ]
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-4">
            <Link href={`/${lang}`} className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <span className="text-xl font-bold">BharatSaver</span>
            </Link>
          </div>
          {mainLinks.map(section => (
            <div key={section.title}>
              <h3 className="text-base font-semibold">{section.title}</h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
           <div>
            <h3 className="text-base font-semibold">{dictionary.contact.title}</h3>
            <div className="flex gap-4 mt-4">
                <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
                <Link href="#" aria-label="Facebook"><Facebook className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
                <Link href="#" aria-label="Linkedin"><Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
            </div>
          </div>
        </div>
        <Separator className="my-8"/>
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>{dictionary.copyright}</p>
          <p className="mt-4 md:mt-0 max-w-md text-center md:text-right">{dictionary.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}

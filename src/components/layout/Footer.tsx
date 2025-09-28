
import Link from 'next/link';
import type { Locale } from '@/lib/i18n-config';
import type { Dictionary } from '@/lib/types';
import { Twitter, Facebook, Linkedin } from 'lucide-react';

type FooterProps = {
  lang: Locale;
  dictionary: Dictionary['footer'];
};

export function Footer({ lang, dictionary }: FooterProps) {
  const renderLink = (link: { title: string; href: string }) => {
    // Check for any external links
    if (link.href.startsWith('http')) {
        return (
             <a 
                href={link.href} 
                className="text-sm text-muted-foreground hover:text-primary"
                target="_blank" 
                rel="noopener noreferrer"
            >
                {link.title}
            </a>
        )
    }

    const href = link.href.startsWith('/') ? `/${lang}${link.href}` : `/${lang}/${link.href}`;
    
    if (link.href.endsWith('.xml') || link.href.endsWith('.xsl')) {
      return (
         <a 
          href={link.href} 
          className="text-sm text-muted-foreground hover:text-primary"
        >
          {link.title}
        </a>
      )
    }

    return (
      <Link href={href} className="text-sm text-muted-foreground hover:text-primary">
        {link.title}
      </Link>
    );
  };

  return (
    <footer className="bg-secondary/50 border-t">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">{dictionary.about.title}</h3>
            <ul className="space-y-2">
              {dictionary.about.links.map((link) => (
                <li key={link.href}>
                  {renderLink(link)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">{dictionary.calculators.title}</h3>
            <ul className="space-y-2">
              {dictionary.calculators.links.map((link) => (
                <li key={link.href}>
                  {renderLink(link)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">{dictionary.resources.title}</h3>
            <ul className="space-y-2">
              {dictionary.resources.links.map((link) => (
                <li key={link.href}>
                  {renderLink(link)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">{dictionary.contact.title}</h3>
            <div className="flex gap-4 items-center">
                <Link href="https://x.com/mahesh_chaube33" aria-label="Twitter" target="_blank" rel="noopener noreferrer"><Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
                <Link href="https://www.facebook.com/maheshchaube003" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><Facebook className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
                <Link href="https://www.linkedin.com/in/mahi003/" aria-label="Linkedin" target="_blank" rel="noopener noreferrer"><Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
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

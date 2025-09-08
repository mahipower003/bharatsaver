
'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';
import type { Dictionary } from '@/types';
import { usePathname } from 'next/navigation';

type AuthorCardProps = {
  dictionary: Dictionary['author_card'];
}

export function AuthorCard({ dictionary }: AuthorCardProps) {
  const pathname = usePathname();
  const lang = pathname.split('/')[1];
  
  return (
    <aside className="bs-author-box" aria-labelledby="author-name">
        <Image 
            src="/images/mahesh-chaube.jpg" 
            alt="Photo of Mahesh Chaube" 
            width={96} 
            height={96} 
            className="bs-author-photo" 
        />
        <div className="bs-author-info">
            <h4 id="author-name" className="text-xl font-bold">Mahesh Chaube, CFP</h4>
            <p className="bs-author-bio mt-2 text-muted-foreground">
                {dictionary.bio}
            </p>
            <div className="bs-review">
              <strong>Reviewed by:</strong> BharatSaver Editorial Team — calculations and PPF/FD rules verified against official sources (PFRDA, Income Tax Department). Review date: <time dateTime="2025-09-01">September 2025</time>.
            </div>
            <p className="bs-author-links mt-4 flex items-center gap-4">
                <a href="https://www.linkedin.com/in/mahi003/" rel="noopener" target="_blank" className="flex items-center gap-2 hover:text-primary">
                    <Linkedin className="h-5 w-5"/>
                    LinkedIn
                </a>
                 <Link href={`/${lang}/author/mahesh-chaube`} className="flex items-center gap-2 hover:text-primary">
                    {dictionary.author_page_link}
                </Link>
            </p>
        </div>
    </aside>
  );
}

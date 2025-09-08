
'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';
import type { Dictionary } from '@/types';

type AuthorCardProps = {
  dictionary: Dictionary['author_card'];
}

export function AuthorCard({ dictionary }: AuthorCardProps) {
  return (
    <Card className="mt-12 shadow-lg">
      <CardHeader>
        <CardTitle>{dictionary.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row items-center gap-6">
        <Image
          src="/images/mahesh-chaube.jpg"
          alt="Mahesh Chaube"
          width={120}
          height={120}
          className="rounded-full border-4 border-primary/20"
        />
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-bold">Mahesh Chaube</h3>
          <p className="text-sm text-muted-foreground">{dictionary.role}</p>
          <p className="mt-2">{dictionary.bio}</p>
          <div className="mt-4 flex justify-center sm:justify-start gap-4">
            <Link href="https://x.com/mahesh_chaube33" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
              <Twitter className="h-6 w-6 text-muted-foreground hover:text-primary" />
            </Link>
            <Link href="https://www.linkedin.com/in/mahi003/" aria-label="Linkedin" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-6 w-6 text-muted-foreground hover:text-primary" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

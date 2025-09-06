import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Dictionary } from '@/types';
import { ArrowRight } from 'lucide-react';

type LatestGuidesProps = {
  dictionary: Dictionary['home']['latest_guides'];
};

export function LatestGuides({ dictionary }: LatestGuidesProps) {
  const guides = [
    {
      title: dictionary.guide1_title,
      subtitle: dictionary.guide1_subtitle,
      link: '#',
      image: 'https://picsum.photos/400/250',
      alt: 'A person reviewing financial documents, representing a guide on comparing PPF and FD.',
      hint: 'finance documents'
    },
    {
      title: dictionary.guide2_title,
      subtitle: dictionary.guide2_subtitle,
      link: '#',
      image: 'https://picsum.photos/400/251',
      alt: 'A happy child with graduation cap, symbolizing planning for education with SSY.',
      hint: 'child education'
    },
    {
      title: dictionary.guide3_title,
      subtitle: dictionary.guide3_subtitle,
      link: '#',
      image: 'https://picsum.photos/400/252',
      alt: 'A comparison chart showing two different tax regimes side-by-side.',
      hint: 'tax comparison'
    },
  ];

  return (
    <section className="w-full py-20 bg-secondary/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {dictionary.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guides.map((guide, index) => (
            <Link key={index} href={guide.link} className="group">
              <Card className="h-full flex flex-col transition-all duration-200 group-hover:shadow-xl group-hover:-translate-y-1 overflow-hidden">
                <div className="relative">
                  <Image 
                    src={guide.image}
                    alt={guide.alt}
                    width={400}
                    height={250}
                    className="w-full h-auto object-cover"
                    data-ai-hint={guide.hint}
                  />
                </div>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold flex-grow">{guide.title}</h3>
                  <p className="mt-2 text-muted-foreground">{guide.subtitle}</p>
                   <div className="flex items-center text-primary mt-6 text-sm font-medium">
                    <span>{dictionary.read_guide}</span>
                    <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

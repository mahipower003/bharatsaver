import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { Dictionary } from '@/types';
import { Separator } from '../ui/separator';

type LatestGuidesProps = {
  dictionary: Dictionary['home']['latest_guides'];
};

export function LatestGuides({ dictionary }: LatestGuidesProps) {
  const guides = [
    {
      title: dictionary.guide1_title,
      subtitle: dictionary.guide1_subtitle,
      link: "#",
    },
    {
      title: dictionary.guide2_title,
      subtitle: dictionary.guide2_subtitle,
      link: "#",
    },
    {
      title: dictionary.guide3_title,
      subtitle: dictionary.guide3_subtitle,
      link: "#",
    },
  ];

  return (
    <section className="w-full py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {dictionary.title}
          </h2>
        </div>
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {guides.map((guide, index) => (
              <Link key={index} href={guide.link} className="group p-8">
                  <h3 className="text-xl font-semibold">{guide.title}</h3>
                  <p className="mt-2 text-muted-foreground">{guide.subtitle}</p>
              </Link>
            ))}
          </div>
          <Separator className="absolute top-0 left-1/3 h-full w-[1px] hidden md:block" orientation="vertical" />
          <Separator className="absolute top-0 left-2/3 h-full w-[1px] hidden md:block" orientation="vertical" />
          <Separator className="absolute top-0 left-0 w-full" />
          <Separator className="absolute bottom-0 left-0 w-full" />
        </div>
      </div>
    </section>
  );
}

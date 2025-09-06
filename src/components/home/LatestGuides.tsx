import Link from 'next/link';
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guides.map((guide, index) => (
            <Link key={index} href={guide.link} className="group">
              <Card className="h-full flex flex-col transition-all duration-200 group-hover:shadow-xl group-hover:-translate-y-1">
                <CardContent className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold flex-grow">{guide.title}</h3>
                  <p className="mt-2 text-muted-foreground">{guide.subtitle}</p>
                   <div className="flex items-center text-primary mt-6 text-sm font-medium">
                    <span>Read Guide</span>
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

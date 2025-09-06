import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import type { Dictionary } from '@/types';

type LatestGuidesProps = {
  dictionary: Dictionary['home']['latest_guides'];
};

export function LatestGuides({ dictionary }: LatestGuidesProps) {
  const guides = [
    {
      title: dictionary.guide1_title,
      image: "https://picsum.photos/600/400?random=1",
      dataAiHint: "finance chart",
      link: "#",
    },
    {
      title: dictionary.guide2_title,
      image: "https://picsum.photos/600/400?random=2",
      dataAiHint: "family planning",
      link: "#",
    },
    {
      title: dictionary.guide3_title,
      image: "https://picsum.photos/600/400?random=3",
      dataAiHint: "tax documents",
      link: "#",
    },
  ];

  return (
    <section className="w-full py-12 md:py-20 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {dictionary.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {guides.map((guide, index) => (
            <Link key={index} href={guide.link}>
              <Card className="group overflow-hidden h-full flex flex-col">
                <div className="overflow-hidden">
                  <Image
                    src={guide.image}
                    alt={guide.title}
                    width={600}
                    height={400}
                    data-ai-hint={guide.dataAiHint}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <h3 className="text-lg font-semibold flex-grow">{guide.title}</h3>
                  <div className="mt-4 flex items-center text-primary font-medium">
                    Read More <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
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

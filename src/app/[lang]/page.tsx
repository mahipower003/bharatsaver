import type { Locale } from '@/lib/i18n-config';
import { getDictionary } from '@/lib/dictionaries';
import { Hero } from '@/components/home/Hero';
import { PopularTools } from '@/components/home/PopularTools';
import { LatestGuides } from '@/components/home/LatestGuides';

export default async function Home({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);

  return (
    <>
      <Hero lang={lang} dictionary={dictionary.home.hero} />
      <PopularTools lang={lang} dictionary={dictionary.home.popular_tools} />
      <LatestGuides dictionary={dictionary.home.latest_guides}/>
    </>
  );
}

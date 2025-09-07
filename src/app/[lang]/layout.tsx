
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { Locale } from '@/lib/i18n-config';
import { getDictionary } from '@/lib/dictionaries';
import { Suspense } from 'react';
import Loading from './loading';
import { ScrollToBottomButton } from '@/components/layout/ScrollToBottomButton';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(params.lang, ['header', 'footer']);
  return (
    <div className="flex min-h-screen flex-col">
      <Header lang={params.lang} dictionary={dictionary.header} />
      <main className="flex flex-1 flex-col container mx-auto px-4 md:px-6">
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </main>
      <Footer lang={params.lang} dictionary={dictionary.footer} />
      <ScrollToBottomButton />
    </div>
  );
}


import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { Locale } from '@/lib/i18n-config';
import { getDictionary } from '@/lib/dictionaries';
import { Suspense } from 'react';
import Loading from './loading';
import { ScrollToTopButton } from '@/components/layout/ScrollToTopButton';
import { ScrollToBottomButton } from '@/components/layout/ScrollToBottomButton';
import { LeadCaptureModal } from '@/components/layout/LeadCaptureModal';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return (
    <div className="flex min-h-screen flex-col">
      <Header lang={lang} dictionary={dictionary.header} />
      <main className="flex flex-1 flex-col container mx-auto px-4 md:px-6">
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </main>
      <Footer lang={lang} dictionary={dictionary.footer} />
      <ScrollToTopButton />
      <ScrollToBottomButton />
      <LeadCaptureModal />
    </div>
  );
}

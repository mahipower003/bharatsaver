import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { Locale } from '@/lib/i18n-config';
import { getDictionary } from '@/lib/dictionaries';

export default async function LocaleLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  return (
    <div className="flex min-h-screen flex-col">
      <Header lang={lang} dictionary={dictionary.header} />
      <main className="flex-grow">{children}</main>
      <Footer lang={lang} dictionary={dictionary.footer} />
    </div>
  );
}

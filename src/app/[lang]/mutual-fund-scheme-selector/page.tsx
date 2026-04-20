
import { redirect } from 'next/navigation';
import type { Locale } from '@/lib/i18n-config';

// This component now permanently redirects to the new screener page.
export default async function MutualFundSchemeSelectorRedirectPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  redirect(`/${lang}/mutual-fund-screener`);
}


import { redirect } from 'next/navigation';
import type { Locale } from '@/lib/i18n-config';

// This component now permanently redirects to the new screener page.
export default function MutualFundSchemeSelectorRedirectPage({ params }: { params: { lang: Locale }}) {
  redirect(`/${params.lang}/mutual-fund-screener`);
}

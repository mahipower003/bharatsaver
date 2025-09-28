
import { redirect } from 'next/navigation';
import type { Locale } from '@/lib/i18n-config';

// This component now permanently redirects to the guides page.
export default function HowToCheckLicPolicyStatusRedirectPage({ params }: { params: { lang: Locale }}) {
  redirect(`/${params.lang}/guides`);
}

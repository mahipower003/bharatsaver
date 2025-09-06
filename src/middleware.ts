import { NextResponse, type NextRequest } from 'next/server';
import { i18nConfig } from './lib/i18n-config';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string {
  const { locales, defaultLocale } = i18nConfig;
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  return (
    languages.find(lang =>
      locales.some(locale => locale.toLowerCase() === lang.toLowerCase())
    ) || defaultLocale
  );
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for API routes, public files, etc.
  if (
    [
      '/api/',
      '/public/',
      '/A_2D_digital_screenshot_of_the_homepage_of_BharatS.png', // Legacy name from prompt
      '/hero-screenshot.png',
      '/hero-image.png'
    ].some(p => pathname.startsWith(p)) || /\..*$/.test(pathname)
  ) {
    return;
  }

  const pathnameIsMissingLocale = i18nConfig.locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};


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

  // Paths to ignore from localization
  const ignoredPaths = [
    '/sitemap.xml',
    '/robots.txt',
    '/hero-image.png',
    '/api/',
    '/public/'
  ];

  if (ignoredPaths.some(p => pathname.startsWith(p)) || (/\..*$/.test(pathname) && !pathname.endsWith('.xml'))) {
    return NextResponse.next();
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18nConfig.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // e.g. incoming request is /products
    // The new URL is now /en/products
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and static files (e.g. images, favicon).
    '/((?!api|_next/static|_next/image|images|favicon.ico|.*\\.png$).*)',
  ],
};

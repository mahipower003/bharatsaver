import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';

export const metadata: Metadata = {
  title: {
    default: 'BharatSaver - Smarter Savings for Every Indian',
    template: '%s | BharatSaver',
  },
  description: 'Free calculators, guides and tools to plan your financial future— in English and regional languages.',
  openGraph: {
    title: 'BharatSaver - Smarter Savings for Every Indian',
    description: 'Free calculators, guides and tools to plan your financial future.',
    url: siteUrl,
    siteName: 'BharatSaver',
    images: [{ 
      url: `${siteUrl}/hero-image.png`, 
      width: 960, 
      height: 640, 
      alt: 'BharatSaver Hero Image' 
    }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BharatSaver - Smarter Savings for Every Indian',
    description: 'Free calculators, guides and tools to plan your financial future.',
    images: [`${siteUrl}/hero-image.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

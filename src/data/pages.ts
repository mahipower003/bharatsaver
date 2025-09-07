
import { calculators } from './calculators';

type Page = {
  slug: string;
  title: string;
  description: string;
  lastModified: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
};

const staticPages: Page[] = [
  {
    slug: '/',
    title: 'Home',
    description: 'Free calculators, guides and tools to plan your financial future— in English and regional languages.',
    lastModified: '2024-07-29',
    priority: 1.0,
    changefreq: 'weekly',
  },
  {
    slug: '/about',
    title: 'About Us',
    description: 'Learn more about BharatSaver and our mission to empower every Indian with financial knowledge.',
    lastModified: '2024-07-29',
    priority: 0.5,
    changefreq: 'monthly',
  },
  {
    slug: '/blog',
    title: 'Blog',
    description: 'Latest articles and updates on personal finance, tax planning, and investment strategies in India.',
    lastModified: '2024-07-29',
    priority: 0.7,
    changefreq: 'weekly',
  },
  {
    slug: '/calculators',
    title: 'Financial Calculators',
    description: 'A comprehensive suite of free financial calculators for PPF, NPS, SSY, and more.',
    lastModified: '2024-07-29',
    priority: 0.8,
    changefreq: 'monthly',
  },
  {
    slug: '/contact',
    title: 'Contact Us',
    description: 'Get in touch with the BharatSaver team for any questions or feedback.',
    lastModified: '2024-07-29',
    priority: 0.3,
    changefreq: 'yearly',
  },
  {
    slug: '/guides',
    title: 'Financial Guides',
    description: 'In-depth guides on financial planning, investment schemes (PPF, NPS), and savings strategies for Indians.',
    lastModified: '2024-07-29',
    priority: 0.6,
    changefreq: 'monthly',
  },
  {
    slug: '/terms',
    title: 'Terms and Conditions',
    description: 'Read the terms and conditions for using the BharatSaver website and its tools.',
    lastModified: '2024-07-29',
    priority: 0.3,
    changefreq: 'yearly',
  },
];

const calculatorPages: Page[] = calculators.map(calc => ({
    slug: `/${calc.slug}`,
    title: calc.title,
    description: calc.description,
    lastModified: '2024-07-29',
    priority: 0.9,
    changefreq: 'monthly'
}));

export const pages: Page[] = [...staticPages, ...calculatorPages];

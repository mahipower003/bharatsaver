# Folder Structure Context

This document provides an overview of the project folder structure for the BharatSaver application, a Next.js-based financial calculator and savings tool.

## Root Directory

- `apphosting.yaml` - Firebase App Hosting configuration
- `components.json` - Shadcn/UI component configuration
- `next.config.js` & `next.config.mjs` - Next.js configuration files
- `package.json` - Node.js dependencies and scripts
- `postcss.config.mjs` - PostCSS configuration for Tailwind CSS
- `README.md` - Project documentation
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## Key Directories

### `data/`
Contains static data files:
- `calculators.ts` - Calculator configurations and data

### `docs/`
- `blueprint.md` - Project blueprint or design document

### `public/`
Static assets served by Next.js:
- `robots.txt` - Search engine crawling instructions
- `sitemap-*.xml` - XML sitemaps for different languages
- `sitemap.xsl` - XSL stylesheet for sitemap display
- `data/` - Public data files
  - `mutual-fund-holdings.json` - Mutual fund holdings data
  - `images/` - Public images
  - `jsonfile/` - Additional JSON data files
    - `funds.json`
    - `tickertape_top_holdings.json`

### `scripts/`
- `generate-sitemap.js` - Script to generate sitemaps

### `src/`
Main source code directory:
- `middleware.ts` - Next.js middleware
- `ai/` - AI-related code
  - `dev.ts` - Development AI configuration
  - `genkit.ts` - Google AI Genkit configuration
- `app/` - Next.js App Router directory
  - `actions.ts` - Server actions
  - `globals.css` - Global CSS styles
  - `layout.tsx` - Root layout component
  - `[lang]/` - Internationalized routes
    - `layout.tsx` - Language-specific layout
    - `loading.tsx` - Loading component
    - `page.tsx` - Home page
    - Various calculator and tool pages (e.g., `apy-calculator/`, `fd-vs-ppf-calculator/`, etc.)
- `components/` - React components
  - `calculators/` - Calculator-specific components
  - `home/` - Home page components
  - `layout/` - Layout components
  - `tools/` - Tool components
  - `ui/` - UI components (likely Shadcn/UI)
- `data/` - Application data
  - `apy-chart.ts` - APY chart data
  - `calculators.ts` - Calculator data
  - `funds.json` - Funds data
  - `lic-plans.ts` - LIC plan data
  - `tickertape_top_holdings.json` - Top holdings data
- `dictionaries/` - Internationalization dictionaries
  - `en.json`, `hi.json`, `mr.json`, `ta.json`, `te.json` - Language files
  - `en/`, `hi/`, `mr/`, `ta/`, `te/` - Additional language directories
- `hooks/` - Custom React hooks
- `lib/` - Utility libraries
  - `calculations.ts` - Calculation functions
  - `dictionaries.ts` - Dictionary utilities
  - `i18n-config.ts` - i18n configuration
  - `overlap-calculator.ts` - Overlap calculation logic
  - `types.ts` - TypeScript type definitions
  - `utils.ts` - General utilities

## Development and Build

- Uses Next.js 15 with Turbopack for development
- TypeScript for type safety
- Tailwind CSS for styling
- Shadcn/UI for component library
- Firebase for backend services
- Google AI Genkit for AI features
- Supports multiple languages (English, Hindi, Marathi, Tamil, Telugu)

## Architecture Notes

- App Router-based Next.js application
- Internationalization support with language-specific routes
- Extensive calculator tools for financial planning
- AI integration for enhanced features
- Static data served from public directory
- Component-based architecture with reusable UI components
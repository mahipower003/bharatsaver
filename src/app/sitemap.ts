
import { MetadataRoute } from 'next';

// This file is intentionally left minimal. 
// The primary sitemap generation logic is now in `next-sitemap.config.js`
// to correctly handle multi-language support with hreflang tags.
// This file can be used for simple sitemaps, but our needs are more complex.
export default function sitemap(): MetadataRoute.Sitemap {
  return [];
}

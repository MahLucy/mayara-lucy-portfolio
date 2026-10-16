/**
 * Public site URL. Set NEXT_PUBLIC_SITE_URL when a domain is connected;
 * until then the Vercel production URL (or localhost) is used.
 */
export const siteUrl: string =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

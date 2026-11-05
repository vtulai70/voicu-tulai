// Canonical site URL for metadata, robots and sitemap.
// Override with NEXT_PUBLIC_SITE_URL (e.g. a custom domain); on Vercel it falls back to the
// project's production domain, and locally to localhost.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

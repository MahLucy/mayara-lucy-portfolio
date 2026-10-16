import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { "pt-BR": `${siteUrl}/`, en: `${siteUrl}/en` };
  return [
    { url: `${siteUrl}/`, changeFrequency: "monthly", priority: 1, alternates: { languages } },
    { url: `${siteUrl}/en`, changeFrequency: "monthly", priority: 0.9, alternates: { languages } },
  ];
}

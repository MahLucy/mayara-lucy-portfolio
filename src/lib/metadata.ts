import type { Metadata, Viewport } from "next";
import { getDictionary } from "@/content/dictionary";
import { profile } from "@/content/profile";
import { htmlLang, localePath, ogLocale, type Locale } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";

export function buildMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  const path = localePath(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: dict.meta.title,
    description: dict.meta.description,
    applicationName: profile.name,
    authors: [{ name: profile.name }],
    creator: profile.name,
    alternates: {
      canonical: path,
      languages: {
        "pt-BR": "/",
        en: "/en",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      url: path,
      title: dict.meta.title,
      description: dict.meta.description,
      siteName: profile.name,
      locale: ogLocale[locale],
      alternateLocale: locale === "pt" ? ogLocale.en : ogLocale.pt,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
    robots: { index: true, follow: true },
    other: { "content-language": htmlLang[locale] },
  };
}

export const viewport: Viewport = {
  themeColor: "#0b1020",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export function personJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: locale === "pt" ? "Desenvolvedora Full Stack" : "Full Stack Developer",
    url: new URL(localePath(locale), siteUrl).toString(),
    email: `mailto:${profile.email}`,
    address: { "@type": "PostalAddress", addressLocality: "São Paulo", addressCountry: "BR" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Universidade Cruzeiro do Sul" },
    sameAs: ["https://www.linkedin.com/in/mayaralucy/", "https://github.com/MahLucy"],
    knowsAbout: ["Full Stack Development", "Generative AI", "RAG", "AWS", "Application Security"],
  };
}

import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export function buildMetadata({
  title,
  description,
  path = "/",
  image = siteConfig.defaultOgImage,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const resolvedTitle = title
    ? title.includes(siteConfig.name)
      ? title
      : `${title} | ${siteConfig.name}`
    : siteConfig.title;
  const resolvedDescription = description ?? siteConfig.description;
  const url = path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: siteConfig.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 1200,
          alt: title ?? siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [image],
    },
  };
}

export function organizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    sameAs: [siteConfig.instagramUrl, siteConfig.tiktokUrl],
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressCountry: siteConfig.country,
    },
  };
}

export function productStructuredData({
  name,
  description,
  price,
  slug,
  image,
}: {
  name: string;
  description: string;
  price: number;
  slug: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    ...(image ? { image: [image] } : {}),
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "RON",
      price,
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/products/${slug}`,
    },
  };
}

/**
 * Structured Data (JSON-LD) component for SEO
 */

interface StructuredDataProps {
  data: Record<string, any>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Organization structured data
 */
export function OrganizationStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DesignFi Studio",
    url: "https://designfi.studio",
    logo: "https://designfi.studio/favicon.png",
    description:
      "Hybrid Web2 & Web3 creative agency delivering elegant design systems, growth campaigns, and brand strategy for ambitious brands.",
    sameAs: [
      "https://x.com/DesignFiStudio",
      "https://t.me/DesignFiStudio",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "blaine@designfi.studio",
      contactType: "Customer Service",
    },
  };

  return <StructuredData data={data} />;
}

/**
 * WebSite structured data with search action
 */
export function WebSiteStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DesignFi Studio",
    url: "https://designfi.studio",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://designfi.studio/articles?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <StructuredData data={data} />;
}

/**
 * Article structured data
 */
export function ArticleStructuredData({
  title,
  description,
  image,
  author,
  publishedAt,
  url,
}: {
  title: string;
  description: string;
  image?: string;
  author: string;
  publishedAt: string;
  url: string;
}) {
  // Handle image URL - convert base64 to API endpoint if needed
  let imageUrl = "https://designfi.studio/favicon.png";
  if (image) {
    if (image.startsWith("data:image")) {
      // Extract article ID from URL to create image API endpoint
      const articleId = url.split("/articles/")[1]?.split("/")[0] || url.split("/").pop();
      imageUrl = `https://designfi.studio/api/articles/${articleId}/image`;
    } else if (image.startsWith("http://") || image.startsWith("https://")) {
      imageUrl = image;
    } else if (image.startsWith("/")) {
      imageUrl = `https://designfi.studio${image}`;
    } else {
      imageUrl = `https://designfi.studio/${image}`;
    }
  }

  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: imageUrl,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "DesignFi Studio",
      logo: {
        "@type": "ImageObject",
        url: "https://designfi.studio/favicon.png",
      },
    },
    datePublished: publishedAt,
    dateModified: publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return <StructuredData data={data} />;
}

/**
 * Service structured data
 */
export function ServiceStructuredData({
  name,
  description,
  provider = "DesignFi Studio",
}: {
  name: string;
  description: string;
  provider?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: name,
    description: description,
    provider: {
      "@type": "Organization",
      name: provider,
    },
    areaServed: "Worldwide",
  };

  return <StructuredData data={data} />;
}


import type { Metadata } from "next";
import { generateArticleKeywords, generateMetaDescription } from "@/lib/seo-utils";
import { ArticleStructuredData } from "@/components/structured-data";
import { getArticleById } from "@/lib/articles-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    return {
      title: "Article Not Found | DesignFi Studio",
      description: "The requested article could not be found.",
    };
  }

  // Generate keywords from article content
  const keywords = generateArticleKeywords(article.title, article.content);
  
  // Generate meta description - ensure it's always present and well-formatted
  const description = generateMetaDescription(
    article.content || article.title,
    160
  ) || `Read ${article.title} on DesignFi Studio. ${article.content.substring(0, 120)}...`;

  // Handle image URL for Open Graph
  // If image is base64, we need to serve it through an API endpoint
  // Otherwise, ensure it's an absolute URL
  let ogImage: string;
  if (article.image) {
    if (article.image.startsWith("data:image")) {
      // Base64 image - serve through API endpoint
      ogImage = `https://designfi.studio/api/articles/${article.id}/image`;
    } else if (article.image.startsWith("http://") || article.image.startsWith("https://")) {
      // Already an absolute URL
      ogImage = article.image;
    } else if (article.image.startsWith("/")) {
      // Relative URL - make it absolute
      ogImage = `https://designfi.studio${article.image}`;
    } else {
      // Assume it's a relative path
      ogImage = `https://designfi.studio/${article.image}`;
    }
  } else {
    // Fallback to favicon
    ogImage = "https://designfi.studio/favicon.png";
  }

  return {
    title: `${article.title} | DesignFi Studio Articles`,
    description: description,
    keywords: keywords,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: description,
      url: `https://designfi.studio/articles/${article.id}`,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      siteName: "DesignFi Studio",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: description,
      images: [ogImage],
      creator: "@DesignFiStudio",
    },
    alternates: {
      canonical: `https://designfi.studio/articles/${article.id}`,
    },
  };
}

export default async function ArticleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id);

  return (
    <>
      {article && (
        <ArticleStructuredData
          title={article.title}
          description={generateMetaDescription(article.content || article.title, 160) || `Read ${article.title} on DesignFi Studio. ${article.content.substring(0, 120)}...`}
          image={article.image}
          author={article.author}
          publishedAt={article.publishedAt}
          url={`https://designfi.studio/articles/${article.id}`}
        />
      )}
      {children}
    </>
  );
}


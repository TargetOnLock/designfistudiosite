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
  
  // Generate meta description
  const description = generateMetaDescription(
    article.content || article.title,
    160
  );

  // Use article image for Open Graph if available
  const ogImage = article.image || "/favicon.png";

  return {
    title: `${article.title} | DesignFi Studio Articles`,
    description: description || `Read ${article.title} on DesignFi Studio. ${article.content.substring(0, 100)}...`,
    keywords: keywords,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: description || article.content.substring(0, 160),
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
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: description || article.content.substring(0, 160),
      images: [ogImage],
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
          description={generateMetaDescription(article.content || article.title, 160)}
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


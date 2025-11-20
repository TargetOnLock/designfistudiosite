/**
 * SEO utility functions for extracting keywords and generating metadata
 */

/**
 * Extract keywords from text content
 * Removes common stop words and returns relevant keywords
 */
export function extractKeywords(text: string, maxKeywords: number = 10): string[] {
  if (!text) return [];

  // Common stop words to filter out
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
    "by", "from", "as", "is", "was", "are", "were", "been", "be", "have", "has", "had",
    "do", "does", "did", "will", "would", "should", "could", "may", "might", "must",
    "can", "this", "that", "these", "those", "i", "you", "he", "she", "it", "we", "they",
    "what", "which", "who", "whom", "whose", "where", "when", "why", "how", "all", "each",
    "every", "both", "few", "more", "most", "other", "some", "such", "no", "nor", "not",
    "only", "own", "same", "so", "than", "too", "very", "just", "now", "then", "here",
    "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more",
    "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so",
    "than", "too", "very", "can", "will", "just", "don", "should", "now"
  ]);

  // Extract words (alphanumeric, minimum 3 characters)
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(word => word.length >= 3 && !stopWords.has(word));

  // Count word frequency
  const wordCount: Record<string, number> = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // Sort by frequency and return top keywords
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Generate SEO keywords from article content and title
 */
export function generateArticleKeywords(title: string, content: string): string[] {
  const titleKeywords = extractKeywords(title, 5);
  const contentKeywords = extractKeywords(content, 10);
  
  // Combine and deduplicate
  const allKeywords = [...titleKeywords, ...contentKeywords];
  const uniqueKeywords = Array.from(new Set(allKeywords));
  
  // Add common Web3/DesignFi related keywords if not present
  const commonKeywords = [
    "web3", "crypto", "blockchain", "nft", "token", "defi", "marketing",
    "design", "branding", "growth", "strategy", "agency", "creative"
  ];
  
  commonKeywords.forEach(keyword => {
    if (!uniqueKeywords.some(k => k.includes(keyword) || keyword.includes(k))) {
      uniqueKeywords.push(keyword);
    }
  });
  
  return uniqueKeywords.slice(0, 15);
}

/**
 * Generate a meta description from content (max 160 characters)
 */
export function generateMetaDescription(text: string, maxLength: number = 160): string {
  if (!text) return "";
  
  // Remove extra whitespace and newlines
  const cleaned = text.replace(/\s+/g, " ").trim();
  
  if (cleaned.length <= maxLength) return cleaned;
  
  // Try to cut at a sentence boundary
  const truncated = cleaned.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf(".");
  const lastSpace = truncated.lastIndexOf(" ");
  
  if (lastPeriod > maxLength * 0.7) {
    return truncated.substring(0, lastPeriod + 1);
  }
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + "...";
  }
  
  return truncated + "...";
}


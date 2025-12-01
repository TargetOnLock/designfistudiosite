/**
 * Telegram Bot utility for posting articles to a Telegram channel
 */

interface Article {
  id: string;
  title: string;
  content: string;
  image: string;
  telegramLink?: string;
  twitterLink?: string;
  websiteLink?: string;
  publishedAt: string;
  author: string;
  source?: "self-published" | "external";
  externalUrl?: string;
  sourceName?: string;
}

/**
 * Check if Telegram bot is configured
 */
export function isTelegramConfigured(): boolean {
  return !!(
    process.env.TELEGRAM_BOT_TOKEN && 
    process.env.TELEGRAM_CHANNEL_ID
  );
}

/**
 * Format article content for Telegram message
 */
function formatArticleMessage(article: Article, articleUrl: string): string {
  let message = `📰 *${article.title}*\n\n`;
  
  // Add content preview (first 500 characters)
  const contentPreview = article.content.length > 500 
    ? article.content.substring(0, 500) + "..."
    : article.content;
  message += `${contentPreview}\n\n`;
  
  // Add author
  message += `👤 *Author:* ${article.author}\n`;
  
  // Add date
  const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  message += `📅 *Published:* ${date}\n\n`;
  
  // Add article link
  message += `🔗 [Read Full Article](${articleUrl})\n\n`;
  
  // Add social links for self-published articles
  if (article.source === "self-published") {
    const links: string[] = [];
    if (article.telegramLink) {
      links.push(`[📱 Telegram](${article.telegramLink})`);
    }
    if (article.twitterLink) {
      links.push(`[🐦 X (Twitter)](${article.twitterLink})`);
    }
    if (article.websiteLink) {
      links.push(`[🌐 Website](${article.websiteLink})`);
    }
    if (links.length > 0) {
      message += `*Connect with the Author:*\n${links.join(" | ")}\n\n`;
    }
  } else if (article.source === "external" && article.externalUrl) {
    message += `*Source:* ${article.sourceName || "External"}\n`;
    message += `🔗 [Read on Original Source](${article.externalUrl})\n\n`;
  }
  
  // Add hashtags
  message += `#DesignFi #Web3 #Crypto`;
  
  return message;
}

/**
 * Check if string is a valid URL
 */
function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

/**
 * Send article to Telegram channel
 */
export async function sendArticleToTelegram(
  article: Article,
  articleUrl: string
): Promise<{ success: boolean; messageId?: number; error?: string }> {
  if (!isTelegramConfigured()) {
    console.log("Telegram bot not configured, skipping notification");
    return { success: false, error: "Telegram bot not configured" };
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN!;
  const channelId = process.env.TELEGRAM_CHANNEL_ID!;

  try {
    const message = formatArticleMessage(article, articleUrl);
    
    // Check if image is a valid URL
    const isUrl = isValidUrl(article.image);
    
    // For base64 images, use the article image endpoint
    let imageUrl = article.image;
    if (!isUrl && article.id) {
      // Construct URL to the image endpoint
      const baseUrl = articleUrl.split('/articles/')[0];
      imageUrl = `${baseUrl}/api/articles/${article.id}/image`;
    }
    
    if (isUrl || (article.id && !isUrl)) {
      // Send photo with URL
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendPhoto`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: channelId,
            photo: imageUrl,
            caption: message,
            parse_mode: "Markdown",
            disable_web_page_preview: false,
          }),
        }
      );

      const data = await response.json();
      
      if (data.ok) {
        return { success: true, messageId: data.result.message_id };
      } else {
        console.error("Telegram API error:", data);
        // If photo fails, try text-only
        return await sendTextOnlyMessage(botToken, channelId, message, articleUrl);
      }
    } else {
      // Fallback to text-only if we can't determine image URL
      console.log("Could not determine image URL, sending text-only message");
      return await sendTextOnlyMessage(botToken, channelId, message, articleUrl);
    }
  } catch (error) {
    console.error("Error sending article to Telegram:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send text-only message if image fails
 */
async function sendTextOnlyMessage(
  botToken: string,
  channelId: string,
  message: string,
  articleUrl?: string
): Promise<{ success: boolean; messageId?: number; error?: string }> {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: channelId,
          text: message,
          parse_mode: "Markdown",
          disable_web_page_preview: false,
        }),
      }
    );

    const data = await response.json();
    
    if (data.ok) {
      return { success: true, messageId: data.result.message_id };
    } else {
      console.error("Telegram API error:", data);
      return { success: false, error: data.description || "Unknown error" };
    }
  } catch (error) {
    console.error("Error sending text message to Telegram:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send tweet links to Telegram channel
 */
export async function sendTweetLinksToTelegram(
  tweetLinks: Array<{ text: string; url: string }>
): Promise<{ success: boolean; messageId?: number; error?: string }> {
  if (!isTelegramConfigured()) {
    console.log("Telegram bot not configured, skipping tweet links");
    return { success: false, error: "Telegram bot not configured" };
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN!;
  const channelId = process.env.TELEGRAM_CHANNEL_ID!;

  try {
    let message = "🐦 *New Tweets Posted on X/Twitter*\n\n";
    
    tweetLinks.forEach((tweet, index) => {
      // Truncate tweet text for preview (first 100 chars)
      const preview = tweet.text.length > 100 
        ? tweet.text.substring(0, 100) + "..."
        : tweet.text;
      message += `${index + 1}. ${preview}\n🔗 [View Tweet](${tweet.url})\n\n`;
    });

    message += "#DesignFi #Web3 #Crypto";

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: channelId,
          text: message,
          parse_mode: "Markdown",
          disable_web_page_preview: false,
        }),
      }
    );

    const data = await response.json();

    if (data.ok) {
      console.log("Tweet links sent to Telegram successfully! Message ID:", data.result.message_id);
      return { success: true, messageId: data.result.message_id };
    } else {
      console.error("Telegram API error:", JSON.stringify(data, null, 2));
      return { success: false, error: data.description || `Telegram API error: ${JSON.stringify(data)}` };
    }
  } catch (error) {
    console.error("Error sending tweet links to Telegram:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send market update message to Telegram channel
 */
export async function sendMarketUpdateToTelegram(): Promise<{
  success: boolean;
  messageId?: number;
  error?: string;
}> {
  if (!isTelegramConfigured()) {
    const errorMsg = "Telegram bot not configured - missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID";
    console.error(errorMsg);
    return { success: false, error: errorMsg };
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN!;
  const channelId = process.env.TELEGRAM_CHANNEL_ID!;

  console.log("Starting market update fetch...");
  console.log("Channel ID:", channelId);

  try {
    // Import here to avoid circular dependencies
    const { fetchTopCryptos, fetchGlobalMarketData, formatCryptoPricesMessage } = await import("./crypto-prices");

    console.log("Fetching crypto data from CoinGecko...");
    
    // Fetch crypto prices and market data
    const [cryptos, marketData] = await Promise.all([
      fetchTopCryptos(20),
      fetchGlobalMarketData(),
    ]);

    console.log(`Fetched ${cryptos.length} cryptocurrencies`);
    console.log("Market data:", marketData ? "Success" : "Failed");

    // Format the message
    const message = formatCryptoPricesMessage(cryptos, marketData);
    console.log(`Message length: ${message.length} characters`);

    // Send to Telegram
    console.log("Sending message to Telegram...");
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: channelId,
          text: message,
          parse_mode: "Markdown",
          disable_web_page_preview: false,
        }),
      }
    );

    const data = await response.json();

    if (data.ok) {
      console.log("Market update sent successfully! Message ID:", data.result.message_id);
      return { success: true, messageId: data.result.message_id };
    } else {
      console.error("Telegram API error:", JSON.stringify(data, null, 2));
      return { success: false, error: data.description || `Telegram API error: ${JSON.stringify(data)}` };
    }
  } catch (error) {
    console.error("Error sending market update to Telegram:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
}


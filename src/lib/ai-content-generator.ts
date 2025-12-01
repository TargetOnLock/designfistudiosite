/**
 * AI Content Generator for X/Twitter marketing posts
 */

import OpenAI from "openai";

/**
 * Check if OpenAI is configured
 */
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

/**
 * Initialize OpenAI client
 */
function getOpenAIClient(): OpenAI {
  if (!isOpenAIConfigured()) {
    throw new Error("OpenAI API key not configured");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });
}

/**
 * Generate marketing content for X/Twitter
 */
export async function generateMarketingContent(
  type: "fact" | "tip" | "joke" | "random"
): Promise<string> {
  if (!isOpenAIConfigured()) {
    // Fallback to predefined content if OpenAI is not configured
    return getFallbackContent(type);
  }

  try {
    const client = getOpenAIClient();

    const prompts: Record<string, string> = {
      fact: `Create a fun, engaging marketing fact about digital marketing, Web3, crypto, or branding. Make it comical and entertaining. Keep it under 250 characters. Include an emoji or two. Make it relevant to DesignFi Studio's services (Web3 marketing, crypto marketing, digital marketing).`,
      tip: `Create a helpful marketing tip for businesses. Make it practical and actionable. Add some humor or personality. Keep it under 250 characters. Include an emoji. Make it relevant to Web3, crypto, or digital marketing.`,
      joke: `Create a lighthearted marketing joke or pun. Make it funny and relatable to marketers, business owners, or crypto enthusiasts. Keep it under 250 characters. Include an emoji.`,
      random: `Create an engaging marketing post for DesignFi Studio. It could be a fact, tip, joke, or insight about Web3 marketing, crypto marketing, or digital marketing. Make it comical and entertaining. Keep it under 250 characters. Include emojis.`,
    };

    const prompt = prompts[type] || prompts.random;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // Using mini for cost efficiency
      messages: [
        {
          role: "system",
          content: "You are a creative social media manager for DesignFi Studio, a Web3 and crypto marketing agency. Create engaging, comical, and entertaining marketing content for X/Twitter.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.9, // Higher temperature for more creativity
    });

    const content = completion.choices[0]?.message?.content?.trim() || "";
    
    if (content) {
      // Ensure it's within Twitter's character limit
      return content.length > 280 ? content.substring(0, 277) + "..." : content;
    }

    return getFallbackContent(type);
  } catch (error) {
    console.error("Error generating AI content:", error);
    return getFallbackContent(type);
  }
}

/**
 * Fallback content if OpenAI is not available
 */
function getFallbackContent(type: "fact" | "tip" | "joke" | "random"): string {
  const fallbackContent: Record<string, string[]> = {
    fact: [
      "📊 Fun fact: The average person sees 4,000-10,000 ads per day. Make yours count with Web3 marketing! 🚀 #DesignFi #Marketing",
      "💡 Did you know? 73% of crypto projects fail due to poor marketing, not bad tech. Your message matters! 🎯 #Web3Marketing",
      "🎨 Brand recognition increases by 80% when you use consistent visual identity. That's why we're obsessed with design! ✨ #Branding",
      "📱 Mobile-first marketing isn't optional anymore—it's essential. Especially in crypto where everyone's on their phone! 📲 #CryptoMarketing",
    ],
    tip: [
      "💡 Marketing Tip: Your brand voice should be as unique as your product. Don't sound like everyone else—stand out! 🎯 #MarketingTips",
      "🚀 Pro tip: In Web3, community > everything. Build genuine connections, not just followers. That's where real growth happens! 💪 #Web3",
      "📊 Data-driven marketing is great, but don't forget the human element. Storytelling wins hearts AND wallets! ❤️ #MarketingStrategy",
      "🎨 Tip: Your logo isn't your brand. Your brand is the feeling people get when they think of you. Make it a good one! ✨ #Branding",
    ],
    joke: [
      "Why did the marketer break up with the blockchain? Because it was too committed! 😂 #MarketingHumor #Web3",
      "A marketer walks into a bar... and immediately starts analyzing the target demographic! 🍺📊 #MarketingJokes",
      "Why do crypto marketers love coffee? Because they're always grinding! ☕️💎 #CryptoHumor",
      "What's a marketer's favorite type of music? Ad-lib! 🎵😂 #MarketingPuns",
    ],
    random: [
      "🎯 Marketing isn't about shouting the loudest—it's about saying the right thing to the right people at the right time. Precision > volume! #MarketingWisdom",
      "💎 In Web3, your community is your superpower. Build it with care, engage authentically, and watch magic happen! ✨ #CommunityBuilding",
      "🚀 The best marketing feels like a conversation, not a sales pitch. Let's talk! 💬 #AuthenticMarketing",
      "📈 Growth hacking is cool, but sustainable growth is cooler. Build for the long term! 🌱 #MarketingStrategy",
    ],
  };

  const contentArray = fallbackContent[type] || fallbackContent.random;
  return contentArray[Math.floor(Math.random() * contentArray.length)];
}

/**
 * Generate crypto market update post for X/Twitter
 */
export async function generateCryptoMarketUpdatePost(): Promise<string> {
  try {
    // Import crypto prices utilities
    const { fetchTopCryptos, fetchGlobalMarketData } = await import("./crypto-prices");
    
    // Fetch crypto data
    const [cryptos, marketData] = await Promise.all([
      fetchTopCryptos(5),
      fetchGlobalMarketData(),
    ]);

    // Format for X/Twitter (concise format)
    let post = "📊 Crypto Market Update\n\n";
    
    if (marketData) {
      const marketEmoji = marketData.market_cap_change_percentage_24h > 0 ? "🚀" : marketData.market_cap_change_percentage_24h > -2 ? "📈" : "🔴";
      const marketCapT = (marketData.total_market_cap / 1e12).toFixed(2);
      const change = marketData.market_cap_change_percentage_24h >= 0 ? "+" : "";
      post += `🌍 Market: $${marketCapT}T ${marketEmoji} ${change}${marketData.market_cap_change_percentage_24h.toFixed(2)}%\n\n`;
    }

    // Top 5 cryptos (compact format with $ ticker symbols)
    post += "💰 Top 5:\n";
    cryptos.slice(0, 5).forEach((crypto) => {
      const emoji = crypto.price_change_percentage_24h > 0 ? "🟢" : "🔴";
      const change = crypto.price_change_percentage_24h >= 0 ? "+" : "";
      const price = crypto.current_price < 1 
        ? crypto.current_price.toFixed(4) 
        : crypto.current_price.toFixed(2);
      const ticker = `$${crypto.symbol.toUpperCase()}`;
      post += `${ticker} $${price} ${emoji} ${change}${crypto.price_change_percentage_24h.toFixed(2)}%\n`;
    });

    post += "\n#Crypto #MarketUpdate #Web3";
    
    // Ensure within 280 character limit
    if (post.length > 280) {
      // Truncate and keep essential info
      post = "📊 Crypto Market Update\n\n";
      if (marketData) {
        const marketEmoji = marketData.market_cap_change_percentage_24h > 0 ? "🚀" : "🔴";
        const marketCapT = (marketData.total_market_cap / 1e12).toFixed(2);
        const change = marketData.market_cap_change_percentage_24h >= 0 ? "+" : "";
        post += `Market: $${marketCapT}T ${marketEmoji} ${change}${marketData.market_cap_change_percentage_24h.toFixed(2)}%\n\n`;
      }
      post += "Top 3: ";
      cryptos.slice(0, 3).forEach((crypto, i) => {
        const emoji = crypto.price_change_percentage_24h > 0 ? "🟢" : "🔴";
        const change = crypto.price_change_percentage_24h >= 0 ? "+" : "";
        const ticker = `$${crypto.symbol.toUpperCase()}`;
        post += `${ticker} ${change}${crypto.price_change_percentage_24h.toFixed(1)}% ${emoji}${i < 2 ? " " : ""}`;
      });
      post += "\n\n#Crypto #MarketUpdate";
    }
    
    return post;
  } catch (error) {
    console.error("Error generating crypto market update:", error);
    return "📊 Crypto markets are active today! Check out the latest prices and trends. #Crypto #MarketUpdate #Web3";
  }
}

/**
 * Generate website promotion post
 */
export async function generateWebsitePromoPost(): Promise<string> {
  if (isOpenAIConfigured()) {
    try {
      const client = getOpenAIClient();
      
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a creative social media manager for DesignFi Studio, a Web3 and crypto marketing agency. Create engaging, comical marketing posts that promote the website designfi.studio.",
          },
          {
            role: "user",
            content: "Create an engaging marketing post that encourages people to visit designfi.studio. Make it comical, entertaining, and highlight our Web3/crypto marketing services. Include the website URL. Keep it under 250 characters. Include emojis.",
          },
        ],
        max_tokens: 150,
        temperature: 0.9,
      });

      const content = completion.choices[0]?.message?.content?.trim() || "";
      
      if (content && content.length <= 280) {
        return content;
      }
    } catch (error) {
      console.error("Error generating website promo:", error);
    }
  }

  // Fallback content
  const fallbackPromos = [
    "🚀 Ready to level up your Web3 marketing? Visit designfi.studio for cutting-edge crypto marketing strategies that actually work! 💎 #Web3Marketing #CryptoMarketing",
    "💡 Your crypto project deserves better marketing. Check out designfi.studio for Web3 marketing that gets results! 🎯 #DesignFi #CryptoMarketing",
    "🎨 Need help with your Web3 brand? DesignFi Studio has you covered! Visit designfi.studio to see how we help crypto projects shine ✨ #Web3 #Branding",
    "📈 Stop guessing, start growing! Visit designfi.studio for proven Web3 marketing strategies that drive real results 🚀 #Marketing #Web3",
  ];

  return fallbackPromos[Math.floor(Math.random() * fallbackPromos.length)];
}

/**
 * Generate multiple marketing posts (4 posts: crypto update, website promo, and 2 regular marketing posts)
 */
export async function generateDailyMarketingPosts(): Promise<string[]> {
  const posts: string[] = [];
  
  // 1. Crypto market update
  console.log("Generating crypto market update post...");
  const cryptoPost = await generateCryptoMarketUpdatePost();
  posts.push(cryptoPost);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // 2. Website promotion
  console.log("Generating website promotion post...");
  const promoPost = await generateWebsitePromoPost();
  posts.push(promoPost);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // 3 & 4. Two regular marketing posts (shuffle types for variety)
  const types: Array<"fact" | "tip" | "joke" | "random"> = ["fact", "tip", "joke", "random"];
  const shuffled = types.sort(() => Math.random() - 0.5).slice(0, 2);
  
  for (const type of shuffled) {
    console.log(`Generating ${type} marketing post...`);
    const post = await generateMarketingContent(type);
    posts.push(post);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  
  return posts;
}


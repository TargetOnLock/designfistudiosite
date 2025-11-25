/**
 * Crypto prices and market data utilities
 */

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
  market_cap_rank: number;
}

export interface MarketData {
  total_market_cap: number;
  total_volume: number;
  market_cap_change_percentage_24h: number;
  active_cryptocurrencies: number;
  markets: number;
}

/**
 * Get emoji for price change
 */
function getPriceChangeEmoji(change: number): string {
  if (change > 5) return "🚀";
  if (change > 2) return "📈";
  if (change > 0) return "🟢";
  if (change > -2) return "🟡";
  if (change > -5) return "🔴";
  return "💥";
}

/**
 * Format number with commas and decimals
 */
function formatNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format large numbers (market cap, volume)
 */
function formatLargeNumber(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${formatNumber(num)}`;
}

/**
 * Fetch top cryptocurrency prices from CoinGecko
 */
export async function fetchTopCryptos(limit: number = 20): Promise<CryptoPrice[]> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`,
      {
        headers: {
          'Accept': 'application/json',
        },
        // Remove next.js specific options for API route context
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`CoinGecko API error: ${response.status} - ${errorText}`);
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching crypto prices:", error);
    throw error;
  }
}

/**
 * Fetch global market data
 */
export async function fetchGlobalMarketData(): Promise<MarketData | null> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/global",
      {
        headers: {
          'Accept': 'application/json',
        },
        // Remove next.js specific options for API route context
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`CoinGecko API error: ${response.status} - ${errorText}`);
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      total_market_cap: data.data.total_market_cap.usd,
      total_volume: data.data.total_volume.usd,
      market_cap_change_percentage_24h: data.data.market_cap_change_percentage_24h_usd,
      active_cryptocurrencies: data.data.active_cryptocurrencies,
      markets: data.data.markets,
    };
  } catch (error) {
    console.error("Error fetching global market data:", error);
    return null;
  }
}

/**
 * Format crypto prices message for Telegram
 */
export function formatCryptoPricesMessage(
  cryptos: CryptoPrice[],
  marketData: MarketData | null
): string {
  const now = new Date();
  const timeString = now.toLocaleString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  let message = `📊 *Crypto Market Update* 📊\n\n`;
  message += `🕐 ${timeString}\n\n`;

  // Global market data
  if (marketData) {
    const marketEmoji = getPriceChangeEmoji(marketData.market_cap_change_percentage_24h);
    message += `*🌍 Global Market*\n`;
    message += `Market Cap: ${formatLargeNumber(marketData.total_market_cap)} ${marketEmoji}\n`;
    message += `24h Change: ${marketData.market_cap_change_percentage_24h >= 0 ? "+" : ""}${marketData.market_cap_change_percentage_24h.toFixed(2)}%\n`;
    message += `24h Volume: ${formatLargeNumber(marketData.total_volume)}\n`;
    message += `Active Cryptos: ${marketData.active_cryptocurrencies.toLocaleString()}\n`;
    message += `Markets: ${marketData.markets.toLocaleString()}\n\n`;
  }

  // Top cryptocurrencies
  message += `*💰 Top Cryptocurrencies*\n\n`;

  // Group by market cap tiers
  const top5 = cryptos.slice(0, 5);
  const top10 = cryptos.slice(5, 10);
  const top20 = cryptos.slice(10, 20);

  if (top5.length > 0) {
    message += `*🏆 Top 5*\n`;
    top5.forEach((crypto) => {
      const emoji = getPriceChangeEmoji(crypto.price_change_percentage_24h);
      const change = crypto.price_change_percentage_24h >= 0 ? "+" : "";
      message += `${emoji} *${crypto.name}* (${crypto.symbol.toUpperCase()})\n`;
      message += `   💵 $${formatNumber(crypto.current_price)}\n`;
      message += `   📊 ${change}${crypto.price_change_percentage_24h.toFixed(2)}% (24h)\n`;
      message += `   🏅 Rank #${crypto.market_cap_rank}\n\n`;
    });
  }

  if (top10.length > 0) {
    message += `*📈 Top 6-10*\n`;
    top10.forEach((crypto) => {
      const emoji = getPriceChangeEmoji(crypto.price_change_percentage_24h);
      const change = crypto.price_change_percentage_24h >= 0 ? "+" : "";
      message += `${emoji} ${crypto.symbol.toUpperCase()}: $${formatNumber(crypto.current_price)} (${change}${crypto.price_change_percentage_24h.toFixed(2)}%)\n`;
    });
    message += `\n`;
  }

  if (top20.length > 0) {
    message += `*📊 Top 11-20*\n`;
    const top20List = top20
      .map((crypto) => {
        const emoji = getPriceChangeEmoji(crypto.price_change_percentage_24h);
        const change = crypto.price_change_percentage_24h >= 0 ? "+" : "";
        return `${emoji} ${crypto.symbol.toUpperCase()}: $${formatNumber(crypto.current_price)} (${change}${crypto.price_change_percentage_24h.toFixed(2)}%)`;
      })
      .join("\n");
    message += `${top20List}\n\n`;
  }

  // Telegram has a 4096 character limit, truncate if needed
  if (message.length > 4000) {
    message = message.substring(0, 4000);
    message += "\n\n_Message truncated due to length limit_";
  }

  // Market sentiment
  const gainers = cryptos.filter((c) => c.price_change_percentage_24h > 0).length;
  const losers = cryptos.filter((c) => c.price_change_percentage_24h < 0).length;
  const sentiment = gainers > losers ? "🟢 Bullish" : gainers < losers ? "🔴 Bearish" : "🟡 Neutral";

  message += `*📊 Market Sentiment*\n`;
  message += `${sentiment}\n`;
  message += `Gainers: ${gainers} | Losers: ${losers}\n\n`;

  message += `_Data provided by CoinGecko_\n`;
  message += `#Crypto #MarketUpdate #Blockchain #Web3`;

  return message;
}


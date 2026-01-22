import { NextRequest, NextResponse } from "next/server";

// This is a placeholder - you'll need to configure with your actual Solana wallet address
const MERCHANT_WALLET = process.env.SOLANA_MERCHANT_WALLET || "DA7GPnpyxVkL7Lfc3vnRw1bz9XGbSAiTs7Z2GEGanvWj";
const PUBLICATION_COST_USD = 20;

// Fetch SOL price in USD
async function getSolPrice(): Promise<number> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
      { next: { revalidate: 60 } } // Cache for 60 seconds
    );
    const data = await response.json();
    return data.solana.usd;
  } catch (error) {
    console.error("Error fetching SOL price:", error);
    // Fallback price if API fails
    return 150; // Approximate SOL price
  }
}

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json();

    // Get current SOL price and calculate amount needed
    const solPrice = await getSolPrice();
    const solAmount = PUBLICATION_COST_USD / solPrice;

    // Create Solana Pay payment request URL
    // Format: solana:<recipient>?amount=<amount>&reference=<reference>&label=<label>
    const paymentRequestUrl = `solana:${MERCHANT_WALLET}?amount=${solAmount}&reference=${encodeURIComponent(reference)}&label=${encodeURIComponent("DesignFi Studio Article Publication")}`;

    return NextResponse.json({
      paymentUrl: paymentRequestUrl,
      amount: solAmount,
      amountUSD: PUBLICATION_COST_USD,
      solPrice,
      merchant: MERCHANT_WALLET,
      reference,
    });
  } catch (error) {
    console.error("Error creating payment request:", error);
    return NextResponse.json(
      { error: "Failed to create payment request" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json(
      { error: "Reference parameter required" },
      { status: 400 }
    );
  }

  // TODO: Verify payment on Solana blockchain
  // This would typically:
  // 1. Check transaction signature
  // 2. Verify amount matches
  // 3. Verify reference matches
  // 4. Return payment status

  return NextResponse.json({
    status: "pending",
    reference,
    message: "Payment verification not yet implemented",
  });
}


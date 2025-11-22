import { NextRequest, NextResponse } from "next/server";

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

// Lazy load Supabase only when needed
const getSupabase = async () => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  // Dynamic import to avoid errors when Supabase is not configured
  try {
    const { supabase } = await import("@/lib/supabase");
    // Verify it's actually configured (not placeholder)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return supabase;
    }
    return null;
  } catch (error) {
    console.error("Error loading Supabase:", error);
    return null;
  }
};

// In-memory store for referrals (fallback)
interface Referral {
  id: string;
  referrerWallet: string;
  referralCode: string;
  totalEarnings: number; // in lamports
  totalReferrals: number;
  createdAt: string;
}

interface ReferralEarning {
  id: string;
  referralId: string;
  articleId: string;
  publisherWallet: string;
  amount: number; // in lamports (10% of payment)
  createdAt: string;
}

const referralsStore: Referral[] = [];
const referralEarningsStore: ReferralEarning[] = [];

// GET - Get referral stats for a wallet or create referral code
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get("wallet");
    const code = searchParams.get("code");

    if (code) {
      // Look up referral by code
      if (isSupabaseConfigured()) {
        const supabase = await getSupabase();
        if (!supabase) {
          // Fallback to in-memory store
          const referral = referralsStore.find((r) => r.referralCode === code);
          if (!referral) {
            return NextResponse.json(
              { error: "Referral code not found" },
              { status: 404 }
            );
          }
          return NextResponse.json(referral);
        }
        const { data, error } = await supabase
          .from("referrals")
          .select("*")
          .eq("referral_code", code)
          .single();

        if (error || !data) {
          return NextResponse.json(
            { error: "Referral code not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          id: data.id,
          referrerWallet: data.referrer_wallet,
          referralCode: data.referral_code,
          totalEarnings: data.total_earnings || 0,
          totalReferrals: data.total_referrals || 0,
          createdAt: data.created_at,
        });
      } else {
        const referral = referralsStore.find((r) => r.referralCode === code);
        if (!referral) {
          return NextResponse.json(
            { error: "Referral code not found" },
            { status: 404 }
          );
        }
        return NextResponse.json(referral);
      }
    }

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet address or referral code required" },
        { status: 400 }
      );
    }

    // Get or create referral for wallet
    if (isSupabaseConfigured()) {
      const supabase = await getSupabase();
      if (!supabase) {
        // Fallback to in-memory store
        let referral = referralsStore.find((r) => r.referrerWallet === wallet);
        if (!referral) {
          const referralCode = generateReferralCode(wallet);
          referral = {
            id: crypto.randomUUID(),
            referrerWallet: wallet,
            referralCode,
            totalEarnings: 0,
            totalReferrals: 0,
            createdAt: new Date().toISOString(),
          };
          referralsStore.push(referral);
        }

        const earnings = referralEarningsStore.filter(
          (e) => e.referralId === referral!.id
        );

        return NextResponse.json({
          ...referral,
          earnings,
        });
      }
      let { data, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_wallet", wallet)
        .single();

      if (error || !data) {
        // Create new referral
        const referralCode = generateReferralCode(wallet);
        const { data: newData, error: insertError } = await supabase
          .from("referrals")
          .insert([
            {
              referrer_wallet: wallet,
              referral_code: referralCode,
              total_earnings: 0,
              total_referrals: 0,
            },
          ])
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        return NextResponse.json({
          id: newData.id,
          referrerWallet: newData.referrer_wallet,
          referralCode: newData.referral_code,
          totalEarnings: newData.total_earnings || 0,
          totalReferrals: newData.total_referrals || 0,
          createdAt: newData.created_at,
        });
      }

      // Get earnings
      const { data: earnings } = await supabase
        .from("referral_earnings")
        .select("*")
        .eq("referral_id", data.id)
        .order("created_at", { ascending: false });

      return NextResponse.json({
        id: data.id,
        referrerWallet: data.referrer_wallet,
        referralCode: data.referral_code,
        totalEarnings: data.total_earnings || 0,
        totalReferrals: data.total_referrals || 0,
        createdAt: data.created_at,
        earnings: (earnings || []).map((e) => ({
          id: e.id,
          articleId: e.article_id,
          publisherWallet: e.publisher_wallet,
          amount: e.amount,
          createdAt: e.created_at,
        })),
      });
    } else {
      // In-memory fallback
      let referral = referralsStore.find((r) => r.referrerWallet === wallet);
      if (!referral) {
        const referralCode = generateReferralCode(wallet);
        referral = {
          id: crypto.randomUUID(),
          referrerWallet: wallet,
          referralCode,
          totalEarnings: 0,
          totalReferrals: 0,
          createdAt: new Date().toISOString(),
        };
        referralsStore.push(referral);
      }

      const earnings = referralEarningsStore.filter(
        (e) => e.referralId === referral!.id
      );

      return NextResponse.json({
        ...referral,
        earnings,
      });
    }
  } catch (error) {
    console.error("Error fetching referral:", error);
    return NextResponse.json(
      { error: "Failed to fetch referral" },
      { status: 500 }
    );
  }
}

// POST - Record a referral earning
export async function POST(request: NextRequest) {
  try {
    const { referralCode, articleId, publisherWallet, paymentAmount } =
      await request.json();

    if (!referralCode || !articleId || !publisherWallet || !paymentAmount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate 10% referral earnings
    const referralEarning = Math.floor(paymentAmount * 0.1);

    if (isSupabaseConfigured()) {
      const supabase = await getSupabase();
      if (!supabase) {
        // Fallback to in-memory store
        const referral = referralsStore.find(
          (r) => r.referralCode === referralCode
        );
        if (!referral) {
          return NextResponse.json(
            { error: "Referral code not found" },
            { status: 404 }
          );
        }

        const earning: ReferralEarning = {
          id: crypto.randomUUID(),
          referralId: referral.id,
          articleId,
          publisherWallet,
          amount: referralEarning,
          createdAt: new Date().toISOString(),
        };

        referralEarningsStore.push(earning);
        referral.totalEarnings += referralEarning;
        referral.totalReferrals += 1;

        return NextResponse.json(earning);
      }
      // Get referral by code
      const { data: referral, error: refError } = await supabase
        .from("referrals")
        .select("*")
        .eq("referral_code", referralCode)
        .single();

      if (refError || !referral) {
        return NextResponse.json(
          { error: "Referral code not found" },
          { status: 404 }
        );
      }

      // Record earning
      const { data: earning, error: earningError } = await supabase
        .from("referral_earnings")
        .insert([
          {
            referral_id: referral.id,
            article_id: articleId,
            publisher_wallet: publisherWallet,
            amount: referralEarning,
          },
        ])
        .select()
        .single();

      if (earningError) {
        throw earningError;
      }

      // Update referral totals
      await supabase
        .from("referrals")
        .update({
          total_earnings: (referral.total_earnings || 0) + referralEarning,
          total_referrals: (referral.total_referrals || 0) + 1,
        })
        .eq("id", referral.id);

      return NextResponse.json({
        id: earning.id,
        referralId: earning.referral_id,
        articleId: earning.article_id,
        publisherWallet: earning.publisher_wallet,
        amount: earning.amount,
        createdAt: earning.created_at,
      });
    } else {
      // In-memory fallback
      const referral = referralsStore.find(
        (r) => r.referralCode === referralCode
      );
      if (!referral) {
        return NextResponse.json(
          { error: "Referral code not found" },
          { status: 404 }
        );
      }

      const earning: ReferralEarning = {
        id: crypto.randomUUID(),
        referralId: referral.id,
        articleId,
        publisherWallet,
        amount: referralEarning,
        createdAt: new Date().toISOString(),
      };

      referralEarningsStore.push(earning);
      referral.totalEarnings += referralEarning;
      referral.totalReferrals += 1;

      return NextResponse.json(earning);
    }
  } catch (error) {
    console.error("Error recording referral earning:", error);
    return NextResponse.json(
      { error: "Failed to record referral earning" },
      { status: 500 }
    );
  }
}

// Generate a referral code from wallet address
function generateReferralCode(wallet: string): string {
  // Use first 8 chars of wallet + last 4 chars for a unique code
  return wallet.slice(0, 8) + wallet.slice(-4);
}


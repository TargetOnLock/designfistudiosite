"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Copy, CheckCircle2, ExternalLink, TrendingUp, Users, DollarSign } from "lucide-react";
import Link from "next/link";

const PUBLICATION_COST_USD = 100;

interface ReferralData {
  id: string;
  referrerWallet: string;
  referralCode: string;
  totalEarnings: number;
  totalReferrals: number;
  createdAt: string;
  earnings?: Array<{
    id: string;
    articleId: string;
    publisherWallet: string;
    amount: number;
    createdAt: string;
  }>;
}

export default function ReferralsPage() {
  const { publicKey, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (connected && publicKey) {
      loadReferralData();
    } else {
      setIsLoading(false);
    }
  }, [connected, publicKey]);

  const loadReferralData = async () => {
    if (!publicKey) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/referrals?wallet=${publicKey.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setReferralData(data);
      } else {
        console.error("Failed to load referral data");
      }
    } catch (error) {
      console.error("Error loading referral data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (!referralData) return;

    const referralLink = `${window.location.origin}/articles/publish?ref=${referralData.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSOL = (lamports: number) => {
    return (lamports / 1_000_000_000).toFixed(4);
  };

  const formatUSD = (lamports: number) => {
    // Assuming ~$150 per SOL (this should match the current rate)
    const solAmount = lamports / 1_000_000_000;
    return (solAmount * 150).toFixed(2);
  };

  if (!connected) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="max-w-3xl space-y-4 mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Referral Program
          </p>
          <h1 className="text-4xl font-semibold text-white">
            Earn 10% from Every Referral
          </h1>
          <p className="text-lg text-slate-300">
            Connect your wallet to get your unique referral link and start earning.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-xl font-semibold text-white mb-4">
            Connect Your Wallet
          </p>
          <p className="text-slate-300 mb-6">
            Connect your Solana wallet to access your referral dashboard.
          </p>
          <button
            onClick={() => setVisible(true)}
            className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(139,92,246,0.35)]"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-xl font-semibold text-white">Loading referral data...</p>
        </div>
      </div>
    );
  }

  if (!referralData) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-xl font-semibold text-white mb-4">
            Error loading referral data
          </p>
          <button
            onClick={loadReferralData}
            className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/articles/publish?ref=${referralData.referralCode}`;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="max-w-3xl space-y-4 mb-10">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          Referral Program
        </p>
        <h1 className="text-4xl font-semibold text-white">
          Your Referral Dashboard
        </h1>
        <p className="text-lg text-slate-300">
          Share your referral link and earn 10% from every article publication.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-5 w-5 text-emerald-400" />
            <p className="text-sm text-slate-400">Total Earnings</p>
          </div>
          <p className="text-3xl font-semibold text-white">
            {formatSOL(referralData.totalEarnings)} SOL
          </p>
          <p className="text-sm text-slate-400 mt-1">
            ~${formatUSD(referralData.totalEarnings)} USD
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-violet-400" />
            <p className="text-sm text-slate-400">Total Referrals</p>
          </div>
          <p className="text-3xl font-semibold text-white">
            {referralData.totalReferrals}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Successful referrals
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-fuchsia-400" />
            <p className="text-sm text-slate-400">Referral Code</p>
          </div>
          <p className="text-lg font-mono font-semibold text-white break-all">
            {referralData.referralCode}
          </p>
        </div>
      </div>

      {/* Referral Link */}
      <div className="rounded-3xl border border-violet-400/40 bg-gradient-to-r from-violet-600/40 via-fuchsia-600/30 to-slate-900/50 p-8 mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Your Referral Link
        </h2>
        <p className="text-slate-200 mb-4">
          Share this link with others. When they publish an article using your link, you&apos;ll earn 10% of their payment.
        </p>
        <div className="flex gap-3">
          <div className="flex-1 rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white break-all">
            {referralLink}
          </div>
          <button
            onClick={copyReferralLink}
            className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-white hover:bg-white/20 transition flex items-center gap-2"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Earnings History */}
      {referralData.earnings && referralData.earnings.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Earnings History
          </h2>
          <div className="space-y-4">
            {referralData.earnings.map((earning) => (
              <div
                key={earning.id}
                className="rounded-2xl border border-white/10 bg-black/30 p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-semibold">
                    {formatSOL(earning.amount)} SOL (~${formatUSD(earning.amount)})
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    From: {earning.publisherWallet.slice(0, 4)}...{earning.publisherWallet.slice(-4)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(earning.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href={`/articles/${earning.articleId}`}
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition flex items-center gap-2"
                >
                  View Article
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-2xl font-semibold text-white mb-4">
          How It Works
        </h2>
        <ul className="space-y-3 text-slate-300">
          <li className="flex items-start gap-3">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-400" />
            <span>Share your unique referral link with others</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-400" />
            <span>When someone publishes an article using your link, they pay the normal ${PUBLICATION_COST_USD} USD fee</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-400" />
            <span>You automatically earn <strong>10%</strong> of their payment in SOL</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-400" />
            <span>Earnings are tracked and displayed in your dashboard</span>
          </li>
        </ul>
      </div>
    </div>
  );
}


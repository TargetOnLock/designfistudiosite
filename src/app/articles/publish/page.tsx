"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, X as XIcon, Loader2, CheckCircle2 } from "lucide-react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Phantom wallet provider type
interface PhantomProvider {
  signAndSendTransaction: (transaction: Transaction) => Promise<{ signature: string }>;
  isPhantom?: boolean;
}

// Helper to get Phantom provider
function getProvider(): PhantomProvider | null {
  if (typeof window !== "undefined" && "solana" in window) {
    const provider = (window as any).solana;
    if (provider?.isPhantom) {
      return provider as PhantomProvider;
    }
  }
  return null;
}

const MAX_CHARACTERS = 3000;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const RECOMMENDED_IMAGE_SIZE = "1200x630px";
const PUBLICATION_COST_USD = 100;
const MERCHANT_WALLET = "DA7GPnpyxVkL7Lfc3vnRw1bz9XGbSAiTs7Z2GEGanvWj";
// Wallets that get free publishing
const FREE_PUBLISHING_WALLETS = [
  "DA7GPnpyxVkL7Lfc3vnRw1bz9XGbSAiTs7Z2GEGanvWj", // Dev wallet
  "5kPWDedQYWuXkjLwZcfk9RYp6Vg9oXbqwEvaXDdDUj5J", // Additional free wallet
];

export default function PublishPage() {
  const router = useRouter();
  const { publicKey, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [telegramLink, setTelegramLink] = useState("");
  const [twitterLink, setTwitterLink] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [imageError, setImageError] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [solAmount, setSolAmount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if connected wallet gets free publishing
  const isFreeWallet = publicKey ? FREE_PUBLISHING_WALLETS.includes(publicKey.toString()) : false;

  // Fetch SOL price and calculate amount
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
        );
        const data = await response.json();
        const price = data.solana.usd;
        setSolAmount(PUBLICATION_COST_USD / price);
      } catch (error) {
        console.error("Error fetching SOL price:", error);
        // Fallback
        setSolAmount(PUBLICATION_COST_USD / 150);
      }
    };
    fetchSolPrice();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError("");

    // Check file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Only JPEG, PNG, and WebP images are allowed.");
      return;
    }

    // Check file size
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError(`Image size must be less than 5MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    setImageError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePayment = async () => {
    // If not connected, open wallet modal
    if (!connected) {
      setVisible(true);
      return;
    }

    if (!publicKey) {
      alert("Please connect your wallet first.");
      return;
    }

    // If free wallet, just confirm and skip payment
    if (isFreeWallet) {
      const confirmed = window.confirm("Confirm you want to publish this article? (Free publishing)");
      if (confirmed) {
        setIsPaid(true);
        setPaymentStatus("success");
      }
      return;
    }

    // Regular users need to pay
    if (!solAmount) {
      alert("Please wait for SOL price to load.");
      return;
    }

    setPaymentStatus("pending");

    try {
      // Use the connection from wallet context (better for rate limits)
      const merchantPublicKey = new PublicKey(MERCHANT_WALLET);
      
      // Convert SOL to lamports (ensure minimum 1 lamport)
      const lamports = Math.max(1, Math.floor(solAmount * LAMPORTS_PER_SOL));

      // Check if user has enough balance (with error handling for RPC issues)
      let balance;
      try {
        balance = await connection.getBalance(publicKey);
      } catch (balanceError) {
        console.error("Error checking balance:", balanceError);
        // If balance check fails, we'll still try the transaction (wallet will reject if insufficient)
        // But warn the user
        console.warn("Could not verify balance, proceeding with transaction...");
        balance = 0; // Set to 0 so we skip the check
      }
      
      if (balance > 0 && balance < lamports) {
        throw new Error(`Insufficient balance. You need at least ${solAmount.toFixed(4)} SOL (plus transaction fees).`);
      }

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: merchantPublicKey,
          lamports,
        })
      );

      // Get recent blockhash with retry
      let blockhash;
      try {
        const { blockhash: bh } = await connection.getLatestBlockhash("confirmed");
        blockhash = bh;
      } catch (error) {
        console.error("Error getting blockhash:", error);
        throw new Error("Failed to connect to Solana network. Please try again.");
      }

      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      console.log("Sending transaction...", {
        from: publicKey.toString(),
        to: merchantPublicKey.toString(),
        amount: solAmount,
        lamports,
      });

      let signature: string;

      // Use Phantom's native API if available (more secure, avoids "possibly malicious" warning)
      const phantomProvider = getProvider();
      if (phantomProvider && phantomProvider.isPhantom) {
        try {
          console.log("Using Phantom's native signAndSendTransaction API");
          const result = await phantomProvider.signAndSendTransaction(transaction);
          signature = result.signature;
          console.log("Transaction sent via Phantom, signature:", signature);
        } catch (error) {
          console.error("Phantom native API failed, falling back to wallet adapter:", error);
          // Fallback to wallet adapter method
          signature = await sendTransaction(transaction, connection, {
            skipPreflight: false,
            preflightCommitment: "confirmed",
          });
          console.log("Transaction sent via wallet adapter, signature:", signature);
        }
      } else {
        // Use wallet adapter for other wallets (Solflare, etc.)
        console.log("Using wallet adapter sendTransaction");
        signature = await sendTransaction(transaction, connection, {
          skipPreflight: false,
          preflightCommitment: "confirmed",
        });
        console.log("Transaction sent, signature:", signature);
      }

      // Wait for confirmation using Phantom's recommended method
      console.log("Waiting for transaction confirmation...");
      const confirmation = await Promise.race([
        (async () => {
          // Poll for signature status (Phantom's recommended approach)
          let status = await connection.getSignatureStatus(signature);
          while (!status.value || (status.value.confirmationStatus !== "confirmed" && status.value.confirmationStatus !== "finalized")) {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
            status = await connection.getSignatureStatus(signature);
          }
          return status;
        })(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Transaction confirmation timeout")), 60000)
        ),
      ]);

      console.log("Transaction confirmed:", confirmation);

      setPaymentStatus("success");
      setIsPaid(true);
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("error");
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Better error messages
      if (errorMessage.includes("User rejected") || errorMessage.includes("User cancelled")) {
        alert("Payment was cancelled. Please try again when ready.");
      } else if (errorMessage.includes("Insufficient balance")) {
        alert(errorMessage);
      } else if (errorMessage.includes("timeout")) {
        alert("Transaction is taking longer than expected. Please check your wallet to see if the payment went through.");
      } else if (
        errorMessage.includes("network") || 
        errorMessage.includes("connection") || 
        errorMessage.includes("403") ||
        errorMessage.includes("Forbidden") ||
        errorMessage.includes("fetch") ||
        errorMessage.includes("Failed to fetch")
      ) {
        alert(
          "Network/RPC error. This might be due to RPC endpoint issues. " +
          "Please try again in a moment, or contact support if the issue persists. " +
          "Error: " + errorMessage
        );
      } else {
        alert(`Payment failed: ${errorMessage}. Please try again or contact support if the issue persists.`);
      }
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim() || !image) {
      alert("Please fill in all required fields: title, content, and image.");
      return;
    }

    if (content.length > MAX_CHARACTERS) {
      alert(`Content exceeds ${MAX_CHARACTERS} characters.`);
      return;
    }

    if (!isPaid) {
      alert("Please complete payment before publishing.");
      return;
    }

    setIsPublishing(true);

    try {
      // Convert image to base64 for storage (in production, upload to IPFS/Arweave/server)
      const imageBase64 = imagePreview || "";

      // Create article object
      const newArticle = {
        id: crypto.randomUUID(),
        title: title.trim(),
        content: content.trim(),
        image: imageBase64,
        telegramLink: telegramLink.trim() || undefined,
        twitterLink: twitterLink.trim() || undefined,
        websiteLink: websiteLink.trim() || undefined,
        publishedAt: new Date().toISOString(),
        author: publicKey ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` : "Anonymous",
      };

      // Save to API (which stores on server)
      console.log("Saving article to API...", { title: newArticle.title, hasImage: !!newArticle.image });
      
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newArticle),
      });

      console.log("API response status:", response.status, response.statusText);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        const errorMessage = errorData.error || "Failed to save article";
        const errorDetails = errorData.details ? `: ${errorData.details}` : "";
        console.error("API error:", errorData);
        throw new Error(`${errorMessage}${errorDetails}`);
      }

      const savedArticle = await response.json();
      console.log("Article saved successfully:", savedArticle.id);

      // Also save to localStorage as backup
      const existingArticles = localStorage.getItem("publishedArticles");
      const articles = existingArticles ? JSON.parse(existingArticles) : [];
      articles.unshift(newArticle);
      localStorage.setItem("publishedArticles", JSON.stringify(articles));

      // Dispatch custom event to notify articles page
      window.dispatchEvent(new Event("articlePublished"));

      // Redirect to articles page
      router.push("/articles");
    } catch (error) {
      console.error("Error publishing article:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to publish article: ${errorMessage}`);
      setIsPublishing(false);
    }
  };

  const charactersRemaining = MAX_CHARACTERS - content.length;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <div className="max-w-3xl space-y-4 mb-10">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          Self-Publishing Platform
        </p>
        <h1 className="text-4xl font-semibold text-white">
          Publish Your Article
        </h1>
        <p className="text-lg text-slate-300">
          Share your insights with the community. Each publication costs ${PUBLICATION_COST_USD} USD
          {solAmount && ` (~${solAmount.toFixed(4)} SOL)`}.
        </p>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Article Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your article title"
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-slate-500 focus:border-white/50 focus:outline-none"
            maxLength={200}
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Article Content * ({charactersRemaining} characters remaining)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article here..."
            rows={12}
            maxLength={MAX_CHARACTERS}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-slate-500 focus:border-white/50 focus:outline-none resize-none"
          />
          <p className="mt-2 text-xs text-slate-400">
            Maximum {MAX_CHARACTERS} characters. Current: {content.length}
          </p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Featured Image * (Recommended: {RECOMMENDED_IMAGE_SIZE})
          </label>
          {!imagePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center cursor-pointer hover:border-white/40 transition"
            >
              <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-300 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-slate-500">
                PNG, JPG, WebP up to 5MB. Recommended size: {RECOMMENDED_IMAGE_SIZE}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto max-h-96 object-cover"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 p-2 bg-black/80 rounded-full text-white hover:bg-black transition"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          )}
          {imageError && (
            <p className="mt-2 text-sm text-red-400">{imageError}</p>
          )}
          <p className="mt-2 text-xs text-slate-400">
            Image requirements: Max 5MB, formats: JPEG, PNG, WebP. Recommended dimensions: {RECOMMENDED_IMAGE_SIZE} for optimal display.
          </p>
        </div>

        {/* Payment Section */}
        {!isPaid ? (
          <div className={`rounded-3xl border p-8 ${
            isFreeWallet 
              ? "border-emerald-400/40 bg-gradient-to-r from-emerald-600/40 via-teal-600/30 to-slate-900/50" 
              : "border-violet-400/40 bg-gradient-to-r from-violet-600/40 via-fuchsia-600/30 to-slate-900/50"
          }`}>
            <h3 className="text-xl font-semibold text-white mb-2">
              {isFreeWallet ? "Free Publishing Enabled" : "Payment Required"}
            </h3>
            <p className="text-slate-200 mb-4">
              {isFreeWallet ? (
                <>
                  Publishing is free for this wallet. Confirm to proceed with publishing.
                  {!connected && " Connect your wallet to proceed."}
                </>
              ) : (
                <>
                  Pay ${PUBLICATION_COST_USD} USD ({solAmount ? `${solAmount.toFixed(4)} SOL` : "calculating..."}) to unlock publishing and add your links.
                  {!connected && " Connect your wallet to proceed."}
                </>
              )}
            </p>
            <button
              onClick={handlePayment}
              disabled={paymentStatus === "pending"}
              className="rounded-full bg-white px-6 py-3 font-semibold text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {paymentStatus === "pending" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : !connected ? (
                "Connect Wallet"
              ) : isFreeWallet ? (
                "Confirm & Publish (Free)"
              ) : (
                `Pay ${solAmount ? `${solAmount.toFixed(4)} SOL` : ""} ($${PUBLICATION_COST_USD} USD)`
              )}
            </button>
            {paymentStatus === "error" && (
              <p className="mt-2 text-sm text-red-400">
                Payment failed. Please try again.
              </p>
            )}
            {connected && publicKey && (
              <p className="mt-2 text-xs text-slate-300">
                Connected: {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                {isFreeWallet && " (Free Publishing)"}
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Links Section - Only shown after payment */}
            <div className="rounded-3xl border border-emerald-400/40 bg-emerald-600/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <h3 className="text-lg font-semibold text-white">
                  Payment Confirmed - Add Your Links
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Telegram Link (optional)
                  </label>
                  <input
                    type="url"
                    value={telegramLink}
                    onChange={(e) => setTelegramLink(e.target.value)}
                    placeholder="https://t.me/yourusername"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-white placeholder:text-slate-500 focus:border-white/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    X (Twitter) Link (optional)
                  </label>
                  <input
                    type="url"
                    value={twitterLink}
                    onChange={(e) => setTwitterLink(e.target.value)}
                    placeholder="https://x.com/yourusername"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-white placeholder:text-slate-500 focus:border-white/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Website Link (optional)
                  </label>
                  <input
                    type="url"
                    value={websiteLink}
                    onChange={(e) => setWebsiteLink(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-white placeholder:text-slate-500 focus:border-white/50 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Publish Button */}
            <button
              onClick={handlePublish}
              disabled={isPublishing || !title.trim() || !content.trim() || !image}
              className="w-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-4 text-lg font-semibold text-white shadow-[0_10px_25px_rgba(139,92,246,0.35)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Article"
              )}
            </button>
          </>
        )}
      </div>

      {/* Publishing Rules */}
      <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Publishing Rules & Guidelines
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-400" />
            <span>Each publication costs <strong>${PUBLICATION_COST_USD} USD</strong> (payable in SOL via Solana Pay)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-400" />
            <span>Article content must be <strong>maximum {MAX_CHARACTERS} characters</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-400" />
            <span>Featured image must be <strong>under 5MB</strong> (JPEG, PNG, or WebP)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-400" />
            <span>Recommended image size: <strong>{RECOMMENDED_IMAGE_SIZE}</strong> for optimal display</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-400" />
            <span>Links (Telegram, X, Website) can only be added <strong>after payment is confirmed</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-400" />
            <span>All content must comply with our community guidelines and terms of service</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

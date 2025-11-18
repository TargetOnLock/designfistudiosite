"use client";

import { useState, useRef } from "react";
import { Upload, X as XIcon, Loader2, CheckCircle2 } from "lucide-react";

const MAX_CHARACTERS = 3000;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const RECOMMENDED_IMAGE_SIZE = "1200x630px";
const PUBLICATION_COST_SOL = 100;

export default function ArticlesPage() {
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setPaymentStatus("pending");
    
    try {
      // Generate unique reference for this payment
      const reference = crypto.randomUUID();
      
      // Create payment request
      const response = await fetch("/api/solana-pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reference }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment request");
      }

      const { paymentUrl } = await response.json();

      // Open Solana Pay URL (will trigger wallet if installed)
      if (paymentUrl) {
        window.location.href = paymentUrl;
        
        // Poll for payment confirmation
        const checkPayment = setInterval(async () => {
          try {
            const verifyResponse = await fetch(`/api/solana-pay?reference=${reference}`);
            const verifyData = await verifyResponse.json();
            
            if (verifyData.status === "confirmed") {
              clearInterval(checkPayment);
              setPaymentStatus("success");
              setIsPaid(true);
            }
          } catch (error) {
            console.error("Error checking payment:", error);
          }
        }, 3000); // Check every 3 seconds

        // Timeout after 5 minutes
        setTimeout(() => {
          clearInterval(checkPayment);
          if (!isPaid) {
            setPaymentStatus("error");
          }
        }, 300000);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("error");
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

    // TODO: Implement actual publishing logic
    // This would typically:
    // 1. Upload image to storage (IPFS, Arweave, or your server)
    // 2. Save article data to database
    // 3. Include links if provided

    setTimeout(() => {
      setIsPublishing(false);
      alert("Article published successfully!");
      // Reset form
      setTitle("");
      setContent("");
      setImage(null);
      setImagePreview(null);
      setTelegramLink("");
      setTwitterLink("");
      setWebsiteLink("");
      setIsPaid(false);
      setPaymentStatus("idle");
    }, 2000);
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
          Share your insights with the community. Each publication costs {PUBLICATION_COST_SOL} SOL.
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
          <div className="rounded-3xl border border-violet-400/40 bg-gradient-to-r from-violet-600/40 via-fuchsia-600/30 to-slate-900/50 p-8">
            <h3 className="text-xl font-semibold text-white mb-2">
              Payment Required
            </h3>
            <p className="text-slate-200 mb-4">
              Pay {PUBLICATION_COST_SOL} SOL to unlock publishing and add your links.
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
              ) : (
                `Pay ${PUBLICATION_COST_SOL} SOL with Solana Pay`
              )}
            </button>
            {paymentStatus === "error" && (
              <p className="mt-2 text-sm text-red-400">
                Payment failed. Please try again.
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
            <span>Each publication costs <strong>{PUBLICATION_COST_SOL} SOL</strong> (payable via Solana Pay)</span>
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

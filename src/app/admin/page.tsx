"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, LogOut, Loader2, AlertCircle } from "lucide-react";

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
  image?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check if already authenticated (stored in sessionStorage)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAuth = sessionStorage.getItem("adminAuth");
      if (storedAuth) {
        try {
          const auth = JSON.parse(storedAuth);
          if (auth.email && auth.passwordHash) {
            setIsAuthenticated(true);
            loadArticles();
          }
        } catch (e) {
          // Invalid stored auth, clear it
          sessionStorage.removeItem("adminAuth");
        }
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    // Verify email and password with server
    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        if (typeof window !== "undefined") {
          // Store auth info (password hash for subsequent requests)
          sessionStorage.setItem("adminAuth", JSON.stringify({
            email: email.trim().toLowerCase(),
            passwordHash: data.passwordHash, // Server returns a hash for subsequent requests
          }));
        }
        setPassword(""); // Clear password from state
        loadArticles();
      } else {
        const data = await response.json();
        setError(data.error || "Invalid email or password");
      }
    } catch (error) {
      console.error("Error verifying credentials:", error);
      setError("Failed to verify credentials. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    setArticles([]);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("adminAuth");
    }
  };

  const loadArticles = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/articles?includeExternal=false");
      if (response.ok) {
        const data = await response.json();
        // Filter only self-published articles (not external)
        const selfPublished = data.filter(
          (article: Article & { source?: string }) =>
            !article.source || article.source === "self-published"
        );
        setArticles(selfPublished);
      } else {
        setError("Failed to load articles");
      }
    } catch (error) {
      console.error("Error loading articles:", error);
      setError("Failed to load articles");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(articleId);
    setError("");
    setSuccess("");

    try {
      const storedAuth = sessionStorage.getItem("adminAuth");
      if (!storedAuth) {
        setError("Not authenticated. Please log in again.");
        setIsAuthenticated(false);
        return;
      }

      const auth = JSON.parse(storedAuth);
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "DELETE",
        headers: {
          "x-admin-email": auth.email || "",
          "x-admin-password-hash": auth.passwordHash || "",
        },
      });

      if (response.ok) {
        setSuccess("Article deleted successfully");
        // Reload articles
        await loadArticles();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete article");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      setError("Failed to delete article");
    } finally {
      setIsDeleting(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
            <h1 className="text-3xl font-semibold text-white mb-2">Admin Login</h1>
            <p className="text-slate-400 mb-6">Enter your admin credentials to continue</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-500/20 border border-red-500/30 p-3 flex items-center gap-2 text-red-300 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(139,92,246,0.35)] transition hover:-translate-y-0.5"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-semibold text-white mb-2">Admin Panel</h1>
            <p className="text-slate-400">Manage self-published articles</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/20 border border-red-500/30 p-4 flex items-center gap-2 text-red-300">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 p-4 flex items-center gap-2 text-emerald-300">
            <span className="text-lg">✓</span>
            {success}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          </div>
        ) : articles.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
            <p className="text-slate-400">No articles found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <div
                key={article.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:border-white/20 transition"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-sm text-slate-400 mb-2">
                      By {article.author} • {new Date(article.publishedAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-slate-300 line-clamp-2">
                      {article.content}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(article.id)}
                    disabled={isDeleting === article.id}
                    className="flex items-center gap-2 rounded-lg bg-red-500/20 border border-red-500/30 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting === article.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


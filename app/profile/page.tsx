"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Bookmark, Trash2, ExternalLink, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import GridBackground from "@/components/GridBackground";
import AuthButton from "@/components/AuthButton";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { formatAddress } from "@/lib/validation";
import { getUserProfile, getBookmarks, removeBookmark } from "@/lib/api-client";

interface UserData {
  id: string;
  email: string;
  display_name: string | null;
}

interface BookmarkData {
  id: number;
  wallet_address: string;
  chain: string;
  label: string | null;
  created_at: string;
}

export default function ProfilePage() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<UserData | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.allSettled([getUserProfile(), getBookmarks()])
      .then(([profileRes, bookmarksRes]) => {
        if (profileRes.status === "fulfilled") {
          setProfile(profileRes.value);
        } else {
          setError("Failed to load profile. Please log in first.");
        }
        if (bookmarksRes.status === "fulfilled") {
          setBookmarks(bookmarksRes.value);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRemoveBookmark = async (id: number) => {
    try {
      await removeBookmark(id);
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    } catch (e) {
      console.error("Failed to remove bookmark:", e);
    }
  };

  return (
    <main className="relative min-h-screen">
      <GridBackground />

      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-text-muted hover:text-text transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-bold gradient-text">Onchain Score</span>
          </Link>
          <div className="flex items-center gap-3">
            <AuthButton />
            <LanguageSelector />
          </div>
        </div>
      </nav>

      <div className="relative px-4 pt-24 pb-20">
        <div className="max-w-3xl mx-auto space-y-6">

          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 text-center"
            >
              <p className="text-danger text-sm mb-4">{error}</p>
              <Link href="/login" className="text-primary text-sm hover:underline">
                Go to Login
              </Link>
            </motion.div>
          )}

          {profile && (
            <>
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-text">
                      {profile.display_name || profile.email.split("@")[0]}
                    </h1>
                    <p className="text-sm text-text-muted">{profile.email}</p>
                  </div>
                </div>
              </motion.div>

              {/* Bookmarks */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Bookmark className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-text">
                    Bookmarked Wallets ({bookmarks.length})
                  </h2>
                </div>

                {bookmarks.length === 0 ? (
                  <p className="text-text-muted text-sm text-center py-8">
                    No bookmarked wallets yet. Visit a wallet dashboard and click the bookmark icon.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {bookmarks.map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors group"
                      >
                        <Link
                          href={`/dashboard/${b.wallet_address}`}
                          className="flex items-center gap-3 flex-1 min-w-0"
                        >
                          <span className="text-sm font-mono text-text truncate">
                            {formatAddress(b.wallet_address)}
                          </span>
                          <span className="text-[10px] text-text-muted px-2 py-0.5 rounded-md bg-white/[0.04]">
                            {b.chain}
                          </span>
                          {b.label && (
                            <span className="text-xs text-text-dim">{b.label}</span>
                          )}
                          <ExternalLink className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </Link>
                        <button
                          onClick={() => handleRemoveBookmark(b.id)}
                          className="p-2 text-text-muted hover:text-danger transition-colors shrink-0 ml-2"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

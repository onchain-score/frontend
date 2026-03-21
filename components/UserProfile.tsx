"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Bookmark, ExternalLink } from "lucide-react";
import { getUserProfile, getBookmarks } from "@/lib/api-client";
import { formatAddress } from "@/lib/validation";
import Link from "next/link";

export default function UserProfile() {
  const [profile, setProfile] = useState<{ id: string; email: string; display_name: string | null } | null>(null);
  const [bookmarks, setBookmarks] = useState<{ id: number; wallet_address: string; chain: string; label: string | null }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getUserProfile(), getBookmarks()])
      .then(([profileResult, bookmarksResult]) => {
        if (profileResult.status === "fulfilled") setProfile(profileResult.value);
        if (bookmarksResult.status === "fulfilled") setBookmarks(bookmarksResult.value);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!profile) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      {/* Profile */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-text">{profile.display_name || profile.email}</p>
          <p className="text-[10px] text-text-muted">{profile.email}</p>
        </div>
      </div>

      {/* Bookmarks */}
      {bookmarks.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Bookmark className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-xs font-medium text-text-muted">Bookmarked Wallets ({bookmarks.length})</span>
          </div>
          <div className="space-y-1.5">
            {bookmarks.slice(0, 5).map((b) => (
              <Link
                key={b.id}
                href={`/dashboard/${b.wallet_address}`}
                className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-text">{formatAddress(b.wallet_address)}</span>
                  <span className="text-[10px] text-text-muted px-1.5 py-0.5 rounded bg-white/[0.04]">{b.chain}</span>
                </div>
                <ExternalLink className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

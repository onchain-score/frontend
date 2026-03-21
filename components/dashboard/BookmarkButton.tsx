"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { getBookmarks, addBookmark, removeBookmark } from "@/lib/api-client";

interface Props {
  address: string;
  chain?: string;
}

export default function BookmarkButton({ address, chain = "ethereum" }: Props) {
  const [bookmarkId, setBookmarkId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBookmarks()
      .then((bookmarks) => {
        const found = bookmarks.find(
          (b) => b.wallet_address.toLowerCase() === address.toLowerCase() && b.chain === chain
        );
        if (found) setBookmarkId(found.id);
      })
      .catch(() => {}); // Not logged in or Spring Boot down
  }, [address, chain]);

  const toggle = async () => {
    setLoading(true);
    try {
      if (bookmarkId) {
        await removeBookmark(bookmarkId);
        setBookmarkId(null);
      } else {
        const result = await addBookmark(address, chain);
        setBookmarkId((result as { id: number }).id);
      }
    } catch (e) {
      console.error("Bookmark failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`p-2 rounded-lg border transition-colors ${
        bookmarkId
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border text-text-muted hover:text-text hover:border-border-light"
      }`}
      title={bookmarkId ? "Remove bookmark" : "Bookmark this wallet"}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : bookmarkId ? (
        <BookmarkCheck className="w-4 h-4" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
    </button>
  );
}

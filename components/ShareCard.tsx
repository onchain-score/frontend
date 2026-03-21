"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Download, Check, X, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import type { ScoreResult } from "@/lib/types";
import { CATEGORY_CONFIGS } from "@/lib/scoring-config";
import { formatAddress } from "@/lib/validation";
import { useLanguage } from "./providers/LanguageProvider";

interface Props {
  result: ScoreResult;
}

export default function ShareCard({ result }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showCard, setShowCard] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { locale, t } = useLanguage();

  const shortAddress = formatAddress(result.address);

  const handleDownload = async () => {
    if (!cardRef.current || exporting) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, backgroundColor: "#050510" });
      const link = document.createElement("a");
      link.download = `onchain-score-${shortAddress}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("[share] Image export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("[share] Clipboard write failed");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="flex items-center justify-center gap-3 mt-8"
      >
        <button
          onClick={() => setShowCard(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold text-sm rounded-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-300 hover:scale-[1.02]"
        >
          <Share2 className="w-4 h-4" />
          {t("score.share")}
        </button>
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-6 py-3 border border-border hover:border-primary/30 text-text-dim hover:text-text font-medium text-sm rounded-xl transition-all duration-300"
        >
          {copied ? (
            <><Check className="w-4 h-4 text-success" /> {t("score.copied")}</>
          ) : (
            t("score.copyLink")
          )}
        </button>
      </motion.div>

      <AnimatePresence>
        {showCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowCard(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full"
            >
              <button
                onClick={() => setShowCard(false)}
                className="absolute -top-12 right-0 text-text-muted hover:text-text transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div
                ref={cardRef}
                className="w-full p-8 rounded-3xl"
                style={{
                  background: "linear-gradient(160deg, #0a0a1a 0%, #111128 50%, #0a0a1a 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="text-center mb-6">
                  <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-text-muted mb-1">
                    Onchain Score
                  </h3>
                  <p className="font-mono text-text-dim text-sm">{shortAddress}</p>
                </div>

                <div className="text-center mb-6">
                  <div className="inline-flex items-baseline gap-2">
                    <span className="text-7xl font-black" style={{ color: result.tier.color }}>
                      {result.totalScore}
                    </span>
                    <span className="text-2xl text-text-muted font-medium">/1000</span>
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <span className="text-xl">{result.tier.emoji}</span>
                    <span className="font-bold" style={{ color: result.tier.color }}>
                      {locale === "ko" ? result.tier.nameKo : result.tier.name}
                    </span>
                  </div>
                  <p className="text-text-dim text-sm mt-1">Top {result.percentile}%</p>
                </div>

                <div className="space-y-3">
                  {result.categories.map((cat) => {
                    const config = CATEGORY_CONFIGS.find((c) => c.category === cat.category);
                    if (!config) return null;
                    const pct = (cat.score / cat.maxScore) * 100;
                    return (
                      <div key={cat.category} className="flex items-center gap-3">
                        <span className="text-xs text-text-dim w-20 shrink-0 text-right">{cat.label}</span>
                        <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${config.barClass}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-mono font-bold w-12" style={{ color: config.color }}>
                          {cat.score}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
                  <span className="text-text-muted text-xs">onchain-score.vercel.app</span>
                </div>
              </div>

              <button
                onClick={handleDownload}
                disabled={exporting}
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-300 disabled:opacity-50"
              >
                {exporting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {t("score.exporting")}</>
                ) : (
                  <><Download className="w-4 h-4" /> {t("score.download")}</>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

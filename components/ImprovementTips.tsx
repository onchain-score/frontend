"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import type { ScoreResult } from "@/lib/types";
import type { ScoreCategory } from "@/lib/types";
import type { TranslationKey } from "@/lib/i18n";
import { useLanguage } from "./providers/LanguageProvider";

interface Props {
  result: ScoreResult;
  index: number;
}

const TIP_KEYS: Record<ScoreCategory, TranslationKey> = {
  walletAge: "tip.walletAge",
  txVolume: "tip.txVolume",
  defiActivity: "tip.defiActivity",
  balance: "tip.balance",
  tokenDiversity: "tip.tokenDiversity",
};

const PRIORITY_COLORS = {
  high: "bg-danger",
  medium: "bg-warning",
  low: "bg-text-muted",
} as const;

export default function ImprovementTips({ result, index }: Props) {
  const { t } = useLanguage();

  const tips: { text: string; priority: "high" | "medium" }[] = [];
  for (const cat of result.categories) {
    const ratio = cat.score / cat.maxScore;
    if (ratio >= 0.3) continue;
    const key = TIP_KEYS[cat.category];
    if (!key) continue;
    tips.push({ text: t(key), priority: ratio < 0.15 ? "high" : "medium" });
  }
  const displayTips = tips.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 + index * 0.12, duration: 0.6 }}
      className="glass-card p-5 sm:p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-text text-sm">{t("score.tips")}</h3>
        </div>
        <div className="space-y-2">
          {displayTips.length > 0 ? (
            displayTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-text-dim">
                <div className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${PRIORITY_COLORS[tip.priority]}`} />
                {tip.text}
              </div>
            ))
          ) : (
            <p className="text-xs text-success">{t("score.tipsGreat")}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

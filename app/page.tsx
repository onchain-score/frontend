"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import GridBackground from "@/components/GridBackground";
import WalletInput from "@/components/WalletInput";
import LanguageSelector from "@/components/LanguageSelector";
import AuthButton from "@/components/AuthButton";
import SplashScreen from "@/components/SplashScreen";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { CATEGORY_CONFIGS } from "@/lib/scoring-config";

const STEPS_KEYS = [
  { step: "01", label: "step.connect" as const, desc: "step.connectDesc" as const, color: "#06b6d4" },
  { step: "02", label: "step.scan" as const, desc: "step.scanDesc" as const, color: "#3b82f6" },
  { step: "03", label: "step.score" as const, desc: "step.scoreDesc" as const, color: "#8b5cf6" },
  { step: "04", label: "step.share" as const, desc: "step.shareDesc" as const, color: "#f59e0b" },
];

const CAT_KEYS: Record<string, { name: "cat.walletAge" | "cat.txVolume" | "cat.defiActivity" | "cat.balance" | "cat.tokenDiversity"; desc: "cat.walletAge.desc" | "cat.txVolume.desc" | "cat.defiActivity.desc" | "cat.balance.desc" | "cat.tokenDiversity.desc" }> = {
  walletAge:      { name: "cat.walletAge", desc: "cat.walletAge.desc" },
  txVolume:       { name: "cat.txVolume", desc: "cat.txVolume.desc" },
  defiActivity:   { name: "cat.defiActivity", desc: "cat.defiActivity.desc" },
  balance:        { name: "cat.balance", desc: "cat.balance.desc" },
  tokenDiversity: { name: "cat.tokenDiversity", desc: "cat.tokenDiversity.desc" },
};

export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(true);
  const { t } = useLanguage();

  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      <main className="relative min-h-screen">
        <GridBackground />

        {/* Nav bar */}
        <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <span className="text-sm font-bold gradient-text tracking-tight">
              Onchain Score
            </span>
            <div className="flex items-center gap-3">
              <AuthButton />
              <LanguageSelector />
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative px-4 pt-24 sm:pt-32 pb-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.8, duration: 0.6 }}
            >
              <div
                className="
                  inline-flex items-center gap-2 px-4 py-1.5 mb-8
                  rounded-full border border-border
                  text-text-dim text-xs font-medium
                "
              >
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-glow-pulse" />
                {t("landing.badge")}
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.9, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="
                text-5xl sm:text-7xl lg:text-8xl
                font-black tracking-tight leading-[0.95] mb-6
              "
            >
              <span className="gradient-text">Onchain</span>
              <br />
              <span className="text-text">Score</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4.1, duration: 0.6 }}
              className="
                text-text-dim text-base sm:text-lg max-w-md mx-auto
                mb-4 leading-relaxed whitespace-pre-line
              "
            >
              {t("landing.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4.3 }}
            >
              <ArrowDown className="w-4 h-4 text-text-muted mx-auto animate-float" />
            </motion.div>
          </div>
        </section>

        {/* Wallet Connect */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.4, duration: 0.7 }}
          className="relative px-4 pb-20"
        >
          <div className="max-w-xl mx-auto">
            <div className="glass-card p-6 sm:p-8">
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold text-text mb-1">
                  {t("landing.checkScore")}
                </h2>
                <p className="text-text-muted text-sm">
                  {t("landing.checkScoreDesc")}
                </p>
              </div>
              <WalletInput />
            </div>
          </div>
        </motion.section>

        {/* Scoring breakdown */}
        <section className="relative px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-text mb-2">
                {t("landing.metricsTitle")}
              </h2>
              <p className="text-text-dim text-sm max-w-md mx-auto">
                {t("landing.metricsDesc")}
              </p>
            </div>

            <div className="glass-card p-6 sm:p-8 mb-6">
              <div className="space-y-4">
                {CATEGORY_CONFIGS.map((config, i) => {
                  const keys = CAT_KEYS[config.category];
                  return (
                    <div key={config.category} className="flex items-center gap-4">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${config.color}12` }}
                      >
                        <config.icon className="w-4 h-4" style={{ color: config.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-text">
                            {t(keys.name)}
                          </span>
                          <span className="text-xs text-text-muted font-mono">
                            / {config.maxScore}
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full opacity-40"
                            style={{
                              width: `${60 + i * 8}%`,
                              background: `linear-gradient(90deg, ${config.color}, ${config.color}80)`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between">
                <span className="text-sm font-bold text-text">{t("landing.totalScore")}</span>
                <span className="text-sm font-mono font-bold gradient-text">??? / 1000</span>
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CATEGORY_CONFIGS.map((config) => {
                const keys = CAT_KEYS[config.category];
                return (
                  <div key={config.category} className="glass-card glass-card-hover p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${config.color}12` }}
                      >
                        <config.icon className="w-4 h-4" style={{ color: config.color }} />
                      </div>
                      <h3 className="font-semibold text-text text-sm">{t(keys.name)}</h3>
                    </div>
                    <p className="text-text-muted text-xs leading-relaxed">{t(keys.desc)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="relative px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-text">
                {t("landing.howTitle")}
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STEPS_KEYS.map((item) => (
                <div key={item.step} className="glass-card p-4 text-center">
                  <div
                    className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center text-sm font-bold font-mono"
                    style={{ backgroundColor: `${item.color}12`, color: item.color }}
                  >
                    {item.step}
                  </div>
                  <p className="font-semibold text-text text-sm mb-1">{t(item.label)}</p>
                  <p className="text-text-muted text-xs leading-relaxed">{t(item.desc)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative px-4 py-8 border-t border-border">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <span className="text-text-muted text-xs">Onchain Score</span>
            <span className="text-text-muted text-xs">{t("footer.poweredBy")}</span>
          </div>
        </footer>
      </main>
    </>
  );
}

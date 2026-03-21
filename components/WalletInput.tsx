"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "./providers/LanguageProvider";
import { useWallet } from "@/hooks/useWallet";
import WalletConnectView from "./wallet/WalletConnectView";
import ManualEntryView from "./wallet/ManualEntryView";

type Tab = "connect" | "manual";

export default function WalletInput() {
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("connect");
  const wallet = useWallet();
  const { t } = useLanguage();

  const tabs: { key: Tab; label: string }[] = [
    { key: "connect", label: t("wallet.connectTab") },
    { key: "manual", label: t("wallet.manualTab") },
  ];

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Tab switcher */}
      <div className="flex gap-1 p-1 mb-6 rounded-xl bg-surface/60 border border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setError(""); }}
            className={`
              relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
              ${activeTab === tab.key
                ? "text-white"
                : "text-text-muted hover:text-text-dim"
              }
            `}
          >
            {activeTab === tab.key && (
              <motion.div
                layoutId="wallet-tab"
                className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80 rounded-lg"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === "connect" ? (
          <motion.div
            key="connect"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <WalletConnectView wallet={wallet} onError={setError} />
          </motion.div>
        ) : (
          <motion.div
            key="manual"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ManualEntryView onError={setError} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 mt-4 text-danger text-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

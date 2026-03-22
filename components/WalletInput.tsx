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
    <div className="w-full">
      {/* Tab switcher - matching design: active=gradient pill, inactive=transparent */}
      <div
        className="flex gap-1 p-1 mb-6 rounded-full"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setError(""); }}
            className={`
              relative flex-1 py-3 text-sm font-bold rounded-full transition-all duration-200
              ${activeTab === tab.key
                ? "text-white"
                : "text-white/35 hover:text-white/50"
              }
            `}
          >
            {activeTab === tab.key && (
              <motion.div
                layoutId="wallet-tab"
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                  boxShadow: "0 0 15px rgba(59,130,246,0.3), 0 0 30px rgba(139,92,246,0.15)",
                }}
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
            className="flex items-center justify-center gap-2 mt-4 text-sm text-red-400"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

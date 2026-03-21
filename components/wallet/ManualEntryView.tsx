"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Clipboard, ArrowRight, ChevronDown } from "lucide-react";
import WalletAvatar from "@/components/WalletAvatar";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { isValidAddress, detectChain } from "@/lib/validation";
import { CHAIN_LIST } from "@/lib/chains";
import type { ChainType } from "@/lib/types";

interface Props {
  onError: (msg: string) => void;
}

const SAMPLE_ADDRESSES = [
  { label: "vitalik.eth", address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", chain: "ethereum" as ChainType },
  { label: "Tron Sample",  address: "TJCnKsPa7y5okkXvQAidZBzqx3QyQ6sxMW", chain: "tron" as ChainType },
  { label: "SOL Sample",  address: "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg", chain: "solana" as ChainType },
];

export default function ManualEntryView({ onError }: Props) {
  const [address, setAddress] = useState("");
  const [selectedChain, setSelectedChain] = useState<ChainType | "auto">("auto");
  const [showChainDropdown, setShowChainDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const { t, locale } = useLanguage();

  // Auto-detect chain when address changes
  const detectedChain = detectChain(address);
  const effectiveChain: ChainType | null =
    selectedChain === "auto" ? detectedChain : selectedChain;

  const isValid = effectiveChain ? isValidAddress(address, effectiveChain) : false;

  // Auto-select chain from pasted address
  useEffect(() => {
    if (address && selectedChain === "auto" && detectedChain) {
      // chain is auto-detected, no action needed
    }
  }, [address, selectedChain, detectedChain]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = address.trim();
    if (!trimmed) { onError(t("wallet.enterAddress")); return; }

    const chain = effectiveChain;
    if (!chain || !isValidAddress(trimmed, chain)) {
      onError(t("wallet.invalidAddress"));
      return;
    }

    // Navigate with chain param if not ethereum
    const chainParam = chain !== "ethereum" ? `?chain=${chain}` : "";
    router.push(`/dashboard/${trimmed}${chainParam}`);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const trimmed = text.trim();
      const pastedChain = detectChain(trimmed);
      if (pastedChain && isValidAddress(trimmed, pastedChain)) {
        setAddress(trimmed);
        if (selectedChain === "auto") {
          // auto-detect will handle it
        }
        onError("");
      } else {
        onError(t("wallet.clipboardInvalid"));
      }
    } catch {
      onError(t("wallet.clipboardFail"));
    }
  };

  const handleSampleClick = (sample: typeof SAMPLE_ADDRESSES[number]) => {
    setAddress(sample.address);
    setSelectedChain(sample.chain);
    onError("");
  };

  const currentChainConfig = effectiveChain
    ? CHAIN_LIST.find((c) => c.id === effectiveChain)
    : null;

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Chain selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowChainDropdown(!showChainDropdown)}
            className="w-full flex items-center justify-between px-4 py-3 bg-surface/80 border border-border rounded-xl text-sm hover:border-primary/30 transition-colors"
          >
            <span className="flex items-center gap-2 text-text-dim">
              {selectedChain === "auto" ? (
                <>
                  <span className="text-base">
                    {currentChainConfig?.icon ?? "\u{1F310}"}
                  </span>
                  {t("wallet.chainAuto")}
                  {currentChainConfig && (
                    <span className="text-text-muted text-xs">
                      ({locale === "ko" ? currentChainConfig.nameKo : currentChainConfig.name})
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="text-base">
                    {CHAIN_LIST.find((c) => c.id === selectedChain)?.icon}
                  </span>
                  {locale === "ko"
                    ? CHAIN_LIST.find((c) => c.id === selectedChain)?.nameKo
                    : CHAIN_LIST.find((c) => c.id === selectedChain)?.name}
                </>
              )}
            </span>
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${showChainDropdown ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {showChainDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute z-20 top-full mt-1 w-full rounded-xl border border-border bg-surface shadow-xl shadow-black/40 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => { setSelectedChain("auto"); setShowChainDropdown(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    selectedChain === "auto"
                      ? "bg-primary/10 text-primary"
                      : "text-text-dim hover:bg-elevated hover:text-text"
                  }`}
                >
                  <span className="text-base">{"\u{1F310}"}</span>
                  {t("wallet.chainAuto")}
                </button>
                {CHAIN_LIST.map((chain) => (
                  <button
                    key={chain.id}
                    type="button"
                    onClick={() => { setSelectedChain(chain.id); setShowChainDropdown(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      selectedChain === chain.id
                        ? "bg-primary/10 text-primary"
                        : "text-text-dim hover:bg-elevated hover:text-text"
                    }`}
                  >
                    <span className="text-base">{chain.icon}</span>
                    {locale === "ko" ? chain.nameKo : chain.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Address input */}
        <div className={`relative rounded-2xl transition-all duration-300 ${isFocused ? "shadow-[0_0_40px_rgba(6,182,212,0.12)]" : ""}`}>
          <div className={`absolute -inset-[1px] rounded-2xl transition-opacity duration-300 bg-gradient-to-r from-primary via-accent to-primary ${isFocused ? "opacity-60" : "opacity-20"}`} />
          <div className="relative flex items-center bg-surface rounded-2xl">
            <Wallet className="absolute left-4 w-5 h-5 text-text-muted" />
            <input
              type="text"
              value={address}
              onChange={(e) => { setAddress(e.target.value); onError(""); }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={t("wallet.placeholder")}
              className="w-full py-4.5 pl-12 pr-24 bg-transparent text-text placeholder:text-text-muted font-mono text-sm outline-none rounded-2xl"
              spellCheck={false}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={handlePaste}
              className="absolute right-3 px-3 py-1.5 text-text-muted hover:text-primary text-xs font-medium rounded-lg hover:bg-primary/10 transition-all duration-200 flex items-center gap-1.5"
            >
              <Clipboard className="w-3.5 h-3.5" />
              {t("wallet.paste")}
            </button>
          </div>
        </div>

        {isValid && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-center gap-3 px-4"
          >
            <WalletAvatar address={address} size={24} />
            <span className="text-xs text-text-dim font-mono">
              {address.slice(0, 10)}...{address.slice(-8)}
            </span>
            {currentChainConfig && (
              <span className="text-xs text-text-muted">
                {currentChainConfig.icon} {locale === "ko" ? currentChainConfig.nameKo : currentChainConfig.name}
              </span>
            )}
          </motion.div>
        )}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          disabled={!address.trim()}
          className="
            w-full py-4 rounded-2xl font-bold text-white
            bg-gradient-to-r from-primary to-accent
            hover:shadow-[0_0_40px_rgba(6,182,212,0.25)]
            transition-all duration-300 flex items-center justify-center gap-2 text-base
            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none
          "
        >
          {t("wallet.analyzeWallet")}
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </form>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {SAMPLE_ADDRESSES.map((sample) => (
          <button
            key={sample.label}
            onClick={() => handleSampleClick(sample)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-text-muted text-xs font-mono hover:border-primary/30 hover:text-primary transition-all duration-200"
          >
            <WalletAvatar address={sample.address} size={14} />
            {sample.label}
          </button>
        ))}
      </div>
    </div>
  );
}

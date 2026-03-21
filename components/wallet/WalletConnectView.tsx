"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Loader2, Unplug } from "lucide-react";
import WalletAvatar from "@/components/WalletAvatar";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { formatAddress } from "@/lib/validation";
import type { useWallet } from "@/hooks/useWallet";

interface Props {
  wallet: ReturnType<typeof useWallet>;
  onError: (msg: string) => void;
}

export default function WalletConnectView({ wallet }: Props) {
  const router = useRouter();
  const { t } = useLanguage();
  const { state, hasMetaMask, hasPhantom, connectMetaMask, connectPhantom, disconnect } = wallet;

  const handleAnalyze = () => {
    if (state.status !== "connected") return;
    const chainParam = state.provider === "phantom" ? "?chain=solana" : "";
    router.push(`/dashboard/${state.address}${chainParam}`);
  };

  if (state.status === "connecting") {
    return (
      <div className="glass-card p-8 flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <div className="text-center">
          <p className="font-semibold text-text">{t("wallet.connecting")}</p>
          <p className="text-text-muted text-sm mt-1">{t("wallet.connectingDesc")}</p>
        </div>
      </div>
    );
  }

  if (state.status === "connected") {
    const providerLabel = state.provider === "phantom" ? "Phantom (Solana)" : "MetaMask (Ethereum)";
    return (
      <div className="space-y-4">
        <div className="glass-card p-5 flex items-center gap-4">
          <WalletAvatar address={state.address} size={44} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-success font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              {t("wallet.connected")} · {providerLabel}
            </p>
            <p className="font-mono text-text text-sm mt-0.5 truncate">
              {formatAddress(state.address)}
            </p>
          </div>
          <button
            onClick={disconnect}
            className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all duration-200"
          >
            <Unplug className="w-4 h-4" />
          </button>
        </div>
        <motion.button
          onClick={handleAnalyze}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="
            w-full py-4 rounded-2xl font-bold text-white
            bg-gradient-to-r from-primary to-accent
            hover:shadow-[0_0_40px_rgba(6,182,212,0.25)]
            transition-shadow duration-300
            flex items-center justify-center gap-2 text-base
          "
        >
          {t("wallet.analyzeMyWallet")}
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* MetaMask */}
      <motion.button
        onClick={connectMetaMask}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="
          w-full glass-card p-5 flex items-center gap-4 cursor-pointer group
          hover:border-primary/30 transition-all duration-300
          hover:shadow-[0_0_40px_rgba(6,182,212,0.1)]
        "
      >
        <div className="w-11 h-11 rounded-2xl bg-[#F6851B]/10 flex items-center justify-center shrink-0">
          <svg width="24" height="24" viewBox="0 0 35 33" fill="none">
            <path d="M32.96 1L19.7 10.87l2.45-5.81L32.96 1Z" fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.04 1l13.14 9.97-2.33-5.91L2.04 1ZM28.15 23.53l-3.53 5.4 7.55 2.08 2.17-7.35-6.19-.13ZM.67 23.66l2.16 7.35 7.55-2.08-3.53-5.4-6.18.13Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.98 14.51l-2.1 3.18 7.49.34-.25-8.06-5.14 4.54ZM25.02 14.51l-5.2-4.63-.17 8.15 7.48-.34-2.11-3.18ZM10.38 28.93l4.52-2.2-3.9-3.04-.62 5.24ZM20.1 26.73l4.53 2.2-.63-5.24-3.9 3.04Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex-1 text-left">
          <p className="font-semibold text-text group-hover:text-primary-glow transition-colors">
            MetaMask
          </p>
          <p className="text-text-muted text-xs mt-0.5">Ethereum</p>
        </div>
        <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors group-hover:translate-x-1 duration-200" />
      </motion.button>

      {/* Phantom */}
      <motion.button
        onClick={connectPhantom}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="
          w-full glass-card p-5 flex items-center gap-4 cursor-pointer group
          hover:border-purple-500/30 transition-all duration-300
          hover:shadow-[0_0_40px_rgba(139,92,246,0.1)]
        "
      >
        <div className="w-11 h-11 rounded-2xl bg-purple-500/10 flex items-center justify-center shrink-0">
          <svg width="24" height="24" viewBox="0 0 128 128" fill="none">
            <circle cx="64" cy="64" r="64" fill="url(#phantom-grad)"/>
            <path d="M110.5 64.7C110.5 93 88.9 104.3 64.5 104.3H44.9c-3.2 0-5.9-2.5-6.1-5.7L33.3 29.7c-.2-3.7 2.7-6.8 6.4-6.8h25.4c22.1 0 39 9.6 42.7 28.1.7 3.6 1.1 7.5 1.1 11.6 0 .7 0 1.4-.1 2.1h1.7Z" fill="#fff"/>
            <circle cx="54" cy="56" r="5.5" fill="#AB9FF2"/>
            <circle cx="74" cy="56" r="5.5" fill="#AB9FF2"/>
            <defs><linearGradient id="phantom-grad" x1="0" y1="0" x2="128" y2="128"><stop stopColor="#534BB1"/><stop offset="1" stopColor="#551BF9"/></linearGradient></defs>
          </svg>
        </div>
        <div className="flex-1 text-left">
          <p className="font-semibold text-text group-hover:text-purple-400 transition-colors">
            Phantom
          </p>
          <p className="text-text-muted text-xs mt-0.5">Solana</p>
        </div>
        <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-purple-400 transition-colors group-hover:translate-x-1 duration-200" />
      </motion.button>

      {/* Install hints */}
      <div className="flex justify-center gap-4 pt-1">
        {hasMetaMask === false && (
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors"
          >
            MetaMask 설치
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
        {hasPhantom === false && (
          <a
            href="https://phantom.app/download"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-purple-400/70 hover:text-purple-400 transition-colors"
          >
            Phantom 설치
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}

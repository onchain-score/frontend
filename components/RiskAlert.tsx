"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, Info, Download, Loader2 } from "lucide-react";
import { useLanguage } from "./providers/LanguageProvider";
import { generatePdfReport } from "@/lib/api-client";
import type { RiskAnalysis, RiskType } from "@/lib/types";
import type { TranslationKey } from "@/lib/i18n";

interface Props {
  riskAnalysis: RiskAnalysis;
  index: number;
  address?: string;
}

const RISK_TYPE_KEYS: Record<RiskType, TranslationKey> = {
  mixer_interaction: "risk.mixer",
  high_frequency: "risk.highFreq",
  dust_attack: "risk.dust",
  circular_trading: "risk.circular",
  young_wallet_high_vol: "risk.youngHighVol",
  sanctioned_address: "risk.sanctioned",
};

const SEVERITY_COLORS = {
  high: { bg: "bg-danger/10", border: "border-danger/20", text: "text-danger", dot: "bg-danger" },
  medium: { bg: "bg-warning/10", border: "border-warning/20", text: "text-warning", dot: "bg-warning" },
  low: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-400", dot: "bg-yellow-400" },
} as const;

const RISK_LEVEL_CONFIG = {
  safe: {
    icon: ShieldCheck,
    labelKey: "risk.safe" as TranslationKey,
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/20",
  },
  low: {
    icon: Shield,
    labelKey: "risk.low" as TranslationKey,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  medium: {
    icon: ShieldAlert,
    labelKey: "risk.medium" as TranslationKey,
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
  },
  high: {
    icon: AlertTriangle,
    labelKey: "risk.high" as TranslationKey,
    color: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/20",
  },
  critical: {
    icon: AlertTriangle,
    labelKey: "risk.critical" as TranslationKey,
    color: "text-danger",
    bg: "bg-danger/15",
    border: "border-danger/30",
  },
};

export default function RiskAlert({ riskAnalysis, index, address }: Props) {
  const { t, locale } = useLanguage();
  const [downloading, setDownloading] = useState(false);
  const config = RISK_LEVEL_CONFIG[riskAnalysis.riskLevel];

  const handleDownloadPdf = async () => {
    if (!address || downloading) return;
    setDownloading(true);
    try {
      const blob = await generatePdfReport(address);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `onchain-report-${address.slice(0, 8)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("PDF download failed:", e);
    } finally {
      setDownloading(false);
    }
  };
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
      className="w-full"
    >
      <div className={`glass-card p-5 sm:p-6 border ${config.border}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-text text-sm">{t("risk.title")}</h3>
              <span className={`text-xs font-medium ${config.color}`}>
                {t(config.labelKey)}
              </span>
            </div>
          </div>

          {/* Risk score badge */}
          <div className={`px-3 py-1.5 rounded-lg ${config.bg} flex items-center gap-2`}>
            <span className={`text-xs font-medium ${config.color}`}>
              {t("risk.score")}
            </span>
            <span className={`text-lg font-bold font-mono ${config.color}`}>
              {riskAnalysis.riskScore}
            </span>
          </div>
        </div>

        {/* Safe state */}
        {riskAnalysis.riskLevel === "safe" && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-success/5 border border-success/10">
            <ShieldCheck className="w-5 h-5 text-success shrink-0" />
            <p className="text-sm text-text-dim">{t("risk.safe")}</p>
          </div>
        )}

        {/* Risk flags */}
        {riskAnalysis.flags.length > 0 && (
          <div className="space-y-2">
            {riskAnalysis.flags.map((flag, i) => {
              const severityStyle = SEVERITY_COLORS[flag.severity];
              const translationKey = RISK_TYPE_KEYS[flag.type];
              return (
                <motion.div
                  key={`${flag.type}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 + i * 0.1 }}
                  className={`flex items-start gap-3 p-3 rounded-xl ${severityStyle.bg} border ${severityStyle.border}`}
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${severityStyle.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${severityStyle.text}`}>
                      {t(translationKey)}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {locale === "ko" ? flag.descriptionKo : flag.description}
                    </p>
                    <div className="flex items-start gap-1.5 mt-1.5">
                      <Info className="w-3 h-3 text-text-muted shrink-0 mt-0.5" />
                      <p className="text-xs text-text-muted">{flag.detail}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium shrink-0 px-2 py-0.5 rounded-full ${severityStyle.bg} ${severityStyle.text}`}>
                    {flag.severity}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
        {/* PDF Export Button */}
        {address && (
          <div className="mt-4 pt-3 border-t border-border">
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border border-border text-text-muted hover:text-text hover:border-primary/40 transition-colors disabled:opacity-50"
            >
              {downloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              {downloading ? "Generating..." : "Download PDF Report"}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

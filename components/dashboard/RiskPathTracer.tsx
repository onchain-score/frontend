"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Shield, ExternalLink } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { formatAddress } from "@/lib/validation";
import type { RiskPath } from "@/lib/api-client";

interface Props {
  riskPaths: RiskPath[];
  centerAddress: string;
}

const RISK_TYPE_CONFIG: Record<string, { label: string; color: string; icon: typeof AlertTriangle }> = {
  mixer: { label: "Mixer (Tornado Cash)", color: "#ef4444", icon: AlertTriangle },
  sanctioned: { label: "OFAC Sanctioned", color: "#dc2626", icon: Shield },
};

export default function RiskPathTracer({ riskPaths, centerAddress }: Props) {
  const { t } = useLanguage();

  if (!riskPaths || riskPaths.length === 0) {
    return (
      <div className="glass-card p-4 text-center">
        <Shield className="w-8 h-8 text-success mx-auto mb-2" />
        <p className="text-sm text-text-muted">No risk paths detected in the network</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-danger" />
        <h3 className="text-sm font-semibold text-text">
          Risk Path Trace ({riskPaths.length} path{riskPaths.length > 1 ? "s" : ""})
        </h3>
      </div>

      {riskPaths.map((path, idx) => {
        const config = RISK_TYPE_CONFIG[path.risk_type] || RISK_TYPE_CONFIG.mixer;
        const Icon = config.icon;

        return (
          <motion.div
            key={`${path.target}-${idx}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-4 border-l-2"
            style={{ borderLeftColor: config.color }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-4 h-4" style={{ color: config.color }} />
              <span className="text-xs font-medium" style={{ color: config.color }}>
                {config.label}
              </span>
              <span className="text-[10px] text-text-muted ml-auto">
                {path.hops} hop{path.hops > 1 ? "s" : ""}
              </span>
            </div>

            {/* Path visualization */}
            <div className="flex items-center gap-1 flex-wrap">
              {path.addresses.map((addr, i) => {
                const isCenter = addr.toLowerCase() === centerAddress.toLowerCase();
                const isRisk = addr.toLowerCase() === path.target.toLowerCase();

                return (
                  <div key={`${addr}-${i}`} className="flex items-center gap-1">
                    {i > 0 && (
                      <ArrowRight className="w-3 h-3 text-text-muted shrink-0" />
                    )}
                    <div
                      className={`
                        px-2 py-1 rounded-md text-xs font-mono
                        ${isRisk ? "bg-danger/15 text-danger border border-danger/30" : ""}
                        ${isCenter ? "bg-primary/15 text-primary border border-primary/30" : ""}
                        ${!isRisk && !isCenter ? "bg-white/[0.04] text-text-muted border border-border" : ""}
                      `}
                    >
                      {formatAddress(addr)}
                      {isCenter && <span className="ml-1 text-[10px]">(you)</span>}
                      {isRisk && <span className="ml-1 text-[10px]">(risk)</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Amount info */}
            {path.total_amount !== undefined && path.total_amount > 0 && (
              <div className="mt-2 text-[10px] text-text-muted">
                Total volume: ${Number(path.total_amount).toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

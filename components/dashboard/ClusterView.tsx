"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { formatAddress } from "@/lib/validation";
import type { ClusterResponse } from "@/lib/api-client";

/* ── Props ── */
interface Props {
  cluster: ClusterResponse;
}

/* ── Layout ── */
const SVG_SIZE = 400;
const CENTER = SVG_SIZE / 2;
const MAIN_RADIUS = 28;
const SAT_RADIUS = 18;
const ORBIT_RADIUS = 130;

/* ── Signal Labels ── */
const SIGNAL_CONFIG: {
  key: keyof ClusterResponse["signals"];
  labelKo: string;
  labelEn: string;
  color: string;
}[] = [
  { key: "direct_transfer", labelKo: "직접 전송", labelEn: "Direct Transfer", color: "#06b6d4" },
  { key: "exchange_pattern", labelKo: "거래소 패턴", labelEn: "Exchange Pattern", color: "#f59e0b" },
  { key: "timing_similarity", labelKo: "시간 유사성", labelEn: "Timing Similarity", color: "#8b5cf6" },
];

/* ── Component ── */
export default function ClusterView({ cluster }: Props) {
  const { t, locale } = useLanguage();

  const satellites = useMemo(() => {
    // First wallet is the main wallet; rest are satellites
    const sats = cluster.wallets.slice(1);
    return sats.map((w, i) => {
      const angle = (i / Math.max(sats.length, 1)) * Math.PI * 2 - Math.PI / 2;
      const r = sats.length <= 4 ? ORBIT_RADIUS : ORBIT_RADIUS + (i % 2) * 25;
      return {
        ...w,
        x: CENTER + Math.cos(angle) * r,
        y: CENTER + Math.sin(angle) * r,
        angle,
      };
    });
  }, [cluster.wallets]);

  const activeSignals = SIGNAL_CONFIG.filter((s) => cluster.signals?.[s.key]);
  const confidencePct = (cluster.confidence * 100).toFixed(0);

  const hasSatellites = satellites.length > 0;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-text flex items-center gap-2">
          <svg className="w-4 h-4 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="2" x2="12" y2="5" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="2" y1="12" x2="5" y2="12" />
            <line x1="19" y1="12" x2="22" y2="12" />
          </svg>
          {t("dash.clusterViz")}
        </h2>

        {/* Confidence badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">{t("dash.confidence")}</span>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-mono font-medium"
            style={{
              background:
                cluster.confidence >= 0.7
                  ? "rgba(16,185,129,0.15)"
                  : cluster.confidence >= 0.4
                    ? "rgba(245,158,11,0.15)"
                    : "rgba(239,68,68,0.15)",
              color:
                cluster.confidence >= 0.7
                  ? "var(--color-success)"
                  : cluster.confidence >= 0.4
                    ? "var(--color-warning)"
                    : "var(--color-danger)",
            }}
          >
            {confidencePct}%
          </span>
        </div>
      </div>

      {/* Signal indicators */}
      {activeSignals.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {activeSignals.map((sig) => (
            <span
              key={sig.key}
              className="px-2 py-1 rounded-lg text-xs font-medium border"
              style={{
                background: `${sig.color}10`,
                borderColor: `${sig.color}30`,
                color: sig.color,
              }}
            >
              {locale === "ko" ? sig.labelKo : sig.labelEn}
            </span>
          ))}
        </div>
      )}

      {!hasSatellites ? (
        <p className="text-xs text-text-muted text-center py-8 whitespace-pre-line">
          {t("dash.noCluster")}
        </p>
      ) : (
        <div className="relative overflow-hidden rounded-xl bg-white/[0.01] border border-border">
          <svg
            width="100%"
            height={SVG_SIZE}
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
            className="block"
          >
            {/* Orbit ring */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={ORBIT_RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
              strokeDasharray="6 6"
            />

            {/* Connection lines */}
            {satellites.map((sat, i) => {
              const confColor =
                sat.confidence >= 0.7
                  ? "rgba(16,185,129,"
                  : sat.confidence >= 0.4
                    ? "rgba(245,158,11,"
                    : "rgba(239,68,68,";

              return (
                <motion.line
                  key={`line-${i}`}
                  x1={CENTER}
                  y1={CENTER}
                  x2={sat.x}
                  y2={sat.y}
                  stroke={`${confColor}0.2)`}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                />
              );
            })}

            {/* Satellite nodes */}
            {satellites.map((sat, i) => {
              const confColor =
                sat.confidence >= 0.7
                  ? "#10b981"
                  : sat.confidence >= 0.4
                    ? "#f59e0b"
                    : "#ef4444";

              return (
                <motion.g
                  key={`sat-${i}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1, type: "spring" }}
                  style={{ originX: `${sat.x}px`, originY: `${sat.y}px` }}
                >
                  <circle
                    cx={sat.x}
                    cy={sat.y}
                    r={SAT_RADIUS}
                    fill={`${confColor}15`}
                    stroke={confColor}
                    strokeWidth="1"
                  />
                  {/* Chain initial */}
                  <text
                    x={sat.x}
                    y={sat.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={confColor}
                    fontSize="9"
                    fontFamily="var(--font-family-mono)"
                    fontWeight="600"
                  >
                    {sat.chain.charAt(0).toUpperCase()}
                  </text>
                  {/* Address label */}
                  <text
                    x={sat.x}
                    y={sat.y + SAT_RADIUS + 12}
                    textAnchor="middle"
                    fill="var(--color-text-muted)"
                    fontSize="7"
                    fontFamily="var(--font-family-mono)"
                  >
                    {formatAddress(sat.address, 4, 4)}
                  </text>
                  {/* Confidence */}
                  <text
                    x={sat.x}
                    y={sat.y + SAT_RADIUS + 22}
                    textAnchor="middle"
                    fill={confColor}
                    fontSize="7"
                    fontFamily="var(--font-family-mono)"
                  >
                    {(sat.confidence * 100).toFixed(0)}%
                  </text>
                </motion.g>
              );
            })}

            {/* Center (main wallet) */}
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, type: "spring", delay: 0.1 }}
              style={{ originX: `${CENTER}px`, originY: `${CENTER}px` }}
            >
              {/* Glow ring */}
              <circle
                cx={CENTER}
                cy={CENTER}
                r={MAIN_RADIUS + 6}
                fill="none"
                stroke="rgba(6,182,212,0.15)"
                strokeWidth="2"
              />
              <circle
                cx={CENTER}
                cy={CENTER}
                r={MAIN_RADIUS}
                fill="rgba(6,182,212,0.12)"
                stroke="var(--color-primary)"
                strokeWidth="2"
              />
              <text
                x={CENTER}
                y={CENTER + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--color-primary)"
                fontSize="10"
                fontFamily="var(--font-family-sans)"
                fontWeight="700"
              >
                {t("dash.mainWallet")}
              </text>
              {/* Main wallet address below */}
              <text
                x={CENTER}
                y={CENTER + MAIN_RADIUS + 14}
                textAnchor="middle"
                fill="var(--color-text-dim)"
                fontSize="8"
                fontFamily="var(--font-family-mono)"
              >
                {cluster.wallets[0] && formatAddress(cluster.wallets[0].address, 6, 4)}
              </text>
            </motion.g>
          </svg>
        </div>
      )}
    </div>
  );
}

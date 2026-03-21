/**
 * Scoring Configuration — Strategy Pattern
 *
 * All scoring thresholds, tiers, and category metadata
 * live here as the single source of truth.
 * Scoring logic reads from this config; no magic numbers elsewhere.
 */

import type { ScoreCategory, TierInfo } from "./types";
import type { LucideIcon } from "lucide-react";
import { Clock, Activity, Layers, Wallet, Coins } from "lucide-react";

// ── Threshold-based scoring ──

export interface ScoringThreshold {
  min: number;
  score: number;
}

export interface CategoryConfig {
  category: ScoreCategory;
  label: string;
  description: string;
  maxScore: number;
  icon: LucideIcon;
  color: string;
  barClass: string;
  thresholds: ScoringThreshold[];
}

/**
 * Config-driven scoring: thresholds are evaluated top-down.
 * First match (value >= min) wins.
 */
export const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    category: "walletAge",
    label: "Wallet Age",
    description: "How long your wallet has been active on-chain",
    maxScore: 200,
    icon: Clock,
    color: "#06b6d4",
    barClass: "bar-age",
    thresholds: [
      { min: 1825, score: 200 },
      { min: 1095, score: 180 },
      { min: 730, score: 160 },
      { min: 365, score: 135 },
      { min: 180, score: 100 },
      { min: 90, score: 70 },
      { min: 30, score: 40 },
      { min: 7, score: 20 },
      { min: 0, score: 5 },
    ],
  },
  {
    category: "txVolume",
    label: "Transaction Volume",
    description: "Total number of on-chain transactions",
    maxScore: 200,
    icon: Activity,
    color: "#3b82f6",
    barClass: "bar-tx",
    thresholds: [
      { min: 5000, score: 200 },
      { min: 2000, score: 180 },
      { min: 1000, score: 160 },
      { min: 500, score: 140 },
      { min: 200, score: 115 },
      { min: 100, score: 90 },
      { min: 50, score: 70 },
      { min: 20, score: 50 },
      { min: 5, score: 25 },
      { min: 1, score: 10 },
    ],
  },
  {
    category: "defiActivity",
    label: "DeFi Activity",
    description: "Interaction with DeFi protocols",
    maxScore: 200,
    icon: Layers,
    color: "#8b5cf6",
    barClass: "bar-defi",
    thresholds: [
      { min: 12, score: 200 },
      { min: 8, score: 170 },
      { min: 6, score: 140 },
      { min: 4, score: 110 },
      { min: 3, score: 85 },
      { min: 2, score: 60 },
      { min: 1, score: 35 },
    ],
  },
  {
    category: "balance",
    label: "Balance Health",
    description: "Current ETH balance assessment",
    maxScore: 200,
    icon: Wallet,
    color: "#10b981",
    barClass: "bar-balance",
    thresholds: [
      { min: 100, score: 200 },
      { min: 50, score: 180 },
      { min: 10, score: 155 },
      { min: 5, score: 130 },
      { min: 1, score: 105 },
      { min: 0.5, score: 80 },
      { min: 0.1, score: 55 },
      { min: 0.01, score: 30 },
      { min: 0.001, score: 15 },
      { min: 0, score: 5 },
    ],
  },
  {
    category: "tokenDiversity",
    label: "Token Diversity",
    description: "Variety of ERC-20 tokens interacted with",
    maxScore: 200,
    icon: Coins,
    color: "#f59e0b",
    barClass: "bar-token",
    thresholds: [
      { min: 50, score: 200 },
      { min: 30, score: 170 },
      { min: 20, score: 140 },
      { min: 15, score: 115 },
      { min: 10, score: 90 },
      { min: 5, score: 65 },
      { min: 3, score: 40 },
      { min: 1, score: 20 },
    ],
  },
];

// ── Tiers ──

export const TIERS: TierInfo[] = [
  { name: "Onchain Legend", nameKo: "온체인 레전드", emoji: "👑", minScore: 901, color: "#f59e0b" },
  { name: "DeFi Veteran",  nameKo: "DeFi 베테랑",  emoji: "🏆", minScore: 801, color: "#8b5cf6" },
  { name: "Crypto Whale",  nameKo: "크립토 고래",   emoji: "🐋", minScore: 651, color: "#06b6d4" },
  { name: "Power User",    nameKo: "파워 유저",     emoji: "⚡", minScore: 451, color: "#3b82f6" },
  { name: "Active Explorer",nameKo: "활성 탐험가",  emoji: "🔍", minScore: 251, color: "#10b981" },
  { name: "Rising Star",   nameKo: "라이징 스타",   emoji: "⭐", minScore: 101, color: "#a78bfa" },
  { name: "Newcomer",      nameKo: "뉴커머",        emoji: "🌱", minScore: 0,   color: "#555570" },
];

const PERCENTILE_BRACKETS: ScoringThreshold[] = [
  { min: 900, score: 1 },
  { min: 800, score: 5 },
  { min: 700, score: 10 },
  { min: 600, score: 18 },
  { min: 500, score: 30 },
  { min: 400, score: 45 },
  { min: 300, score: 60 },
  { min: 200, score: 75 },
  { min: 100, score: 88 },
  { min: 0, score: 95 },
];

export function getTierForScore(score: number): TierInfo {
  return TIERS.find((t) => score >= t.minScore) ?? TIERS[TIERS.length - 1];
}

export function getPercentile(score: number): number {
  return matchThreshold(PERCENTILE_BRACKETS, score);
}

/** Shared threshold matcher — DRY helper used by scoring + percentile */
export function matchThreshold(
  thresholds: ScoringThreshold[],
  value: number,
): number {
  for (const t of thresholds) {
    if (value >= t.min) return t.score;
  }
  return 0;
}

// ── DeFi protocol registry ──

export const DEFI_PROTOCOLS: Record<string, string> = {
  "0x7a250d5630b4cf539739df2c5dacb4c659f2488d": "Uniswap V2",
  "0xe592427a0aece92de3edee1f18e0157c05861564": "Uniswap V3",
  "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45": "Uniswap V3 Router2",
  "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad": "Uniswap Universal",
  "0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9": "Aave V2",
  "0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2": "Aave V3",
  "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9": "Aave Token",
  "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b": "Compound",
  "0xc3d688b66703497daa19211eedff47f25384cdc3": "Compound V3",
  "0xd51a44d3fae010294c616388b506acda1bfaae46": "Curve",
  "0x99a58482bd75cbab83b27ec03ca68ff489b5788f": "Curve Router",
  "0x1111111254eeb25477b68fb85ed929f73a960582": "1inch V5",
  "0x111111125421ca6dc452d289314280a0f8842a65": "1inch V6",
  "0xae7ab96520de3a18e5e111b5eaab095312d7fe84": "Lido stETH",
  "0x9759a6ac90977b93b58547b4a71c78317f391a28": "MakerDAO",
  "0x6b175474e89094c44da98b954eedeac495271d0f": "DAI",
  "0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f": "SushiSwap",
  "0xba12222222228d8ba445958a75a0704d566bf2c8": "Balancer",
  "0x00000000000000adc04c56bf30ac9d3c0aaf14dc": "Seaport",
  "0x00000000006c3852cbef3e08e8df289169ede581": "Seaport 1.1",
  "0x283af0b28c62c092c9727f1ee09c02ca627eb7f5": "ENS Registrar",
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": "WETH",
  "0x858646372cc42e1a627fce94aa7a7033e7cf075a": "EigenLayer",
};

// ── Improvement tips config ──

export const IMPROVEMENT_TIPS: Record<ScoreCategory, string> = {
  walletAge: "Keep your wallet active over time to improve your age score",
  txVolume: "Increase your on-chain activity with more transactions",
  defiActivity: "Try interacting with DeFi protocols like Uniswap or Aave",
  balance: "Maintaining a healthy ETH balance improves your score",
  tokenDiversity: "Diversify your token portfolio for a better diversity score",
};

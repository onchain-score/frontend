/**
 * Domain types — shared across client and server.
 */

// ── Chain types ──

export type ChainType = "ethereum" | "tron" | "arbitrum" | "polygon" | "bnb";

export interface ChainConfig {
  id: ChainType;
  name: string;
  nameKo: string;
  addressRegex: RegExp;
  explorerApiBase: string;
  icon: string; // emoji
}

// ── Scoring ──

export type ScoreCategory =
  | "walletAge"
  | "txVolume"
  | "defiActivity"
  | "balance"
  | "tokenDiversity";

export interface CategoryScore {
  category: ScoreCategory;
  label: string;
  score: number;
  maxScore: number;
  description: string;
  detail: string;
}

// ── Risk Analysis ──

export type RiskType =
  | "mixer_interaction"
  | "high_frequency"
  | "dust_attack"
  | "circular_trading"
  | "young_wallet_high_vol"
  | "sanctioned_address";

export interface RiskFlag {
  type: RiskType;
  severity: "high" | "medium" | "low";
  description: string;
  descriptionKo: string;
  detail: string;
}

export interface RiskAnalysis {
  riskScore: number; // 0-100, higher = more risky
  riskLevel: "safe" | "low" | "medium" | "high" | "critical";
  flags: RiskFlag[];
}

// ── Score Result ──

export interface ScoreResult {
  address: string;
  totalScore: number;
  maxTotalScore: number;
  categories: CategoryScore[];
  tier: TierInfo;
  percentile: number;
  analyzedAt: string;
  chainId: number;
  chain: ChainType;
  riskAnalysis: RiskAnalysis;
}

export interface TierInfo {
  name: string;
  nameKo: string;
  emoji: string;
  minScore: number;
  color: string;
}

// ── Wallet data (server-side) ──

export interface WalletData {
  address: string;
  chain: ChainType;
  firstTxTimestamp: number | null;
  txCount: number;
  ethBalance: number;
  uniqueContracts: string[];
  defiProtocols: string[];
  uniqueTokens: string[];
  transactions: RawTransaction[];
}

/** Minimal transaction shape for risk analysis across all chains */
export interface RawTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
}

// ── Etherscan API response shapes ──

export interface EtherscanTx {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasUsed: string;
  isError: string;
  input: string;
  contractAddress: string;
}

export interface EtherscanTokenTx {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  value: string;
}

// ── API response envelope ──

export interface ScoreApiResponse extends ScoreResult {
  isDemo?: boolean;
}

export interface ApiErrorResponse {
  error: string;
  code: string;
}

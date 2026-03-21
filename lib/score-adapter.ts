/**
 * Adapts FastAPI CreditScoreResponse to legacy ScoreResult type
 * so existing components (CategoryCard, RiskAlert, ShareCard, etc.) keep working.
 */

import type { ScoreResult, CategoryScore, RiskAnalysis, ChainType } from "./types";
import type { CreditScoreResponse, WalletInfo } from "./api-client";
import { CATEGORY_CONFIGS, getTierForScore, getPercentile } from "./scoring-config";

export function toScoreResult(
  score: CreditScoreResponse,
  wallet: WalletInfo,
): ScoreResult {
  const f = score.features;

  const categories: CategoryScore[] = CATEGORY_CONFIGS.map((config) => {
    let rawValue = 0;
    switch (config.category) {
      case "walletAge":
        rawValue = (f.wallet_age as number) || 0;
        break;
      case "txVolume":
        rawValue = (f.transaction_count as number) || 0;
        break;
      case "defiActivity":
        rawValue = (f.defi_usage as number) || 0;
        break;
      case "balance":
        rawValue = (f.total_volume as number) || 0;
        break;
      case "tokenDiversity":
        rawValue = (f.unique_counterparties as number) || 0;
        break;
    }

    // Use threshold-based scoring from config
    let catScore = 0;
    for (const t of config.thresholds) {
      if (rawValue >= t.min) {
        catScore = t.score;
        break;
      }
    }

    return {
      category: config.category,
      label: config.label,
      score: catScore,
      maxScore: config.maxScore,
      description: config.description,
      detail: `${rawValue.toLocaleString()}`,
    };
  });

  const tier = getTierForScore(score.credit_score);
  const percentile = getPercentile(score.credit_score);

  const riskAnalysis: RiskAnalysis = {
    riskScore: score.risk_score,
    riskLevel: (score.risk_level as RiskAnalysis["riskLevel"]) || "safe",
    flags: [],
  };

  return {
    address: wallet.address,
    totalScore: score.credit_score,
    maxTotalScore: 1000,
    categories,
    tier,
    percentile,
    analyzedAt: score.scored_at || new Date().toISOString(),
    chainId: 1,
    chain: (wallet.chain as ChainType) || "ethereum",
    riskAnalysis,
  };
}

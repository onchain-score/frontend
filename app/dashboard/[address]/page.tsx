"use client";

import { Suspense, use, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Shield,
  Network,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
  Clock,
  Activity,
  Hexagon,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import GridBackground from "@/components/GridBackground";
import WalletAvatar from "@/components/WalletAvatar";
import LanguageSelector from "@/components/LanguageSelector";
import AuthButton from "@/components/AuthButton";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { formatAddress } from "@/lib/validation";
import {
  getWallet,
  getCreditScore,
  getWalletCluster,
  getTransactions,
  getGraph,
  type WalletInfo,
  type CreditScoreResponse,
  type ClusterResponse,
  type TransactionItem,
  type GraphResponse,
} from "@/lib/api-client";
import CategoryCard from "@/components/CategoryCard";
import RiskAlert from "@/components/RiskAlert";
import ImprovementTips from "@/components/ImprovementTips";
import ShareCard from "@/components/ShareCard";
import NetworkGraph from "@/components/dashboard/NetworkGraph";
import FlowChart from "@/components/dashboard/FlowChart";
import TransactionTimeline from "@/components/dashboard/TransactionTimeline";
import ClusterView from "@/components/dashboard/ClusterView";
import type { NetworkNode, NetworkEdge } from "@/components/dashboard/NetworkGraph";
import { toScoreResult } from "@/lib/score-adapter";
import ScoreHistoryChart from "@/components/dashboard/ScoreHistoryChart";
import BookmarkButton from "@/components/dashboard/BookmarkButton";
import UserProfile from "@/components/UserProfile";

type DashboardState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | {
      status: "success";
      wallet: WalletInfo;
      score: CreditScoreResponse;
      cluster: ClusterResponse;
      transactions: TransactionItem[];
      graphData: GraphResponse | null;
    };

type TabId = "overview" | "network" | "flow" | "activity";

export default function DashboardPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  return (
    <Suspense>
      <DashboardContent params={params} />
    </Suspense>
  );
}

function DashboardContent({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = use(params);
  const { t } = useLanguage();
  const [state, setState] = useState<DashboardState>({ status: "loading" });
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const loadData = () => {
    setState({ status: "loading" });
    Promise.allSettled([
      getWallet(address),
      getCreditScore(address),
      getWalletCluster(address),
      getTransactions(address, undefined, 50),
      getGraph(address),
    ]).then(([walletRes, scoreRes, clusterRes, txRes, graphRes]) => {
      const wallet = walletRes.status === "fulfilled" ? walletRes.value : null;
      const score = scoreRes.status === "fulfilled" ? scoreRes.value : null;
      const cluster = clusterRes.status === "fulfilled" ? clusterRes.value : null;
      const transactions = txRes.status === "fulfilled" ? txRes.value.transactions : [];
      const graphData = graphRes.status === "fulfilled" ? graphRes.value : null;

      if (wallet || score) {
        setState({
          status: "success",
          wallet: wallet ?? {
            address, chain: "ethereum", first_seen: null, last_seen: null,
            tx_count: 0, wallet_age_days: 0, total_inflow_usdt: 0,
            total_outflow_usdt: 0, unique_counterparties: 0,
          },
          score: score ?? {
            cluster_id: "", wallets: [address], credit_score: 0,
            risk_score: 0, trust_level: "Unknown", risk_level: "unknown",
            features: {}, scored_at: "",
          },
          cluster: cluster ?? {
            cluster_id: "", confidence: 0,
            wallets: [{ address, chain: "ethereum", confidence: 1 }],
            signals: { direct_transfer: false, exchange_pattern: false, bridge_pattern: false, timing_similarity: false, gas_pattern: false },
          },
          transactions,
          graphData,
        });
      } else {
        const firstError = [walletRes, scoreRes, clusterRes, txRes, graphRes]
          .find((r) => r.status === "rejected");
        setState({
          status: "error",
          message: firstError?.status === "rejected" ? String(firstError.reason) : "API Error",
        });
      }
    });
  };

  useEffect(() => { loadData(); }, [address]);

  return (
    <main className="relative min-h-screen">
      <GridBackground />

      {/* Header */}
      <header className="relative px-4 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-text-dim hover:text-text transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("score.back")}
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <WalletAvatar address={address} size={22} />
              <span className="text-text-dim text-xs font-mono">{formatAddress(address)}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-glow-pulse" />
            </div>
            <BookmarkButton address={address} chain={state.status === "success" ? state.wallet.chain : "ethereum"} />
            <AuthButton />
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className="relative px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {state.status === "loading" && (
              <motion.div
                key="loading"
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center min-h-[60vh] gap-8"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="text-primary/30"
                  >
                    <Hexagon className="w-24 h-24" strokeWidth={1} />
                  </motion.div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  </div>
                </div>
                <p className="text-text-dim text-sm">{t("dash.loading")}</p>
              </motion.div>
            )}

            {state.status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center min-h-[60vh] gap-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-danger" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-text mb-2">{t("dash.error")}</h2>
                  <p className="text-text-dim text-sm max-w-md">{state.message}</p>
                  <p className="text-text-muted text-xs mt-2">{t("dash.errorHint")}</p>
                </div>
                <button
                  onClick={loadData}
                  className="flex items-center gap-2 px-6 py-3 border border-border hover:border-primary/30 text-text-dim hover:text-text font-medium text-sm rounded-xl transition-all duration-300"
                >
                  <RefreshCw className="w-4 h-4" />
                  {t("score.retry")}
                </button>
              </motion.div>
            )}

            {state.status === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Top Metrics - always visible */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <MetricCard
                    icon={<TrendingUp className="w-4 h-4" />}
                    label={t("dash.creditScore")}
                    value={String(state.score.credit_score)}
                    color="var(--color-primary)"
                    sub={`${t("dash.trustLevel")}: ${state.score.trust_level}`}
                    index={0}
                  />
                  <MetricCard
                    icon={<Shield className="w-4 h-4" />}
                    label={t("dash.riskScore")}
                    value={String(state.score.risk_score)}
                    color="var(--color-success)"
                    sub={state.score.risk_level}
                    index={1}
                  />
                  <MetricCard
                    icon={<Activity className="w-4 h-4" />}
                    label={t("dash.transactions")}
                    value={state.wallet.tx_count.toLocaleString()}
                    color="var(--color-accent)"
                    sub={`${state.wallet.wallet_age_days} ${t("dash.daysActive")}`}
                    index={2}
                  />
                  <MetricCard
                    icon={<Users className="w-4 h-4" />}
                    label={t("dash.clusterSize")}
                    value={String(state.cluster.wallets.length)}
                    color="var(--color-warning)"
                    sub={`${(state.cluster.confidence * 100).toFixed(0)}% ${t("dash.confidence")}`}
                    index={3}
                  />
                </div>

                {/* Tabs Navigation */}
                <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {activeTab === "overview" && (
                    <OverviewTab
                      key="overview"
                      state={state}
                      address={address}
                    />
                  )}
                  {activeTab === "network" && (
                    <NetworkTab
                      key="network"
                      state={state}
                      address={address}
                    />
                  )}
                  {activeTab === "flow" && (
                    <FlowTab
                      key="flow"
                      state={state}
                      address={address}
                    />
                  )}
                  {activeTab === "activity" && (
                    <ActivityTab
                      key="activity"
                      state={state}
                      address={address}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

/* ── Tab Bar ── */

const TABS: { id: TabId; iconEl: React.ReactNode; labelKey: "dash.tab.overview" | "dash.tab.network" | "dash.tab.flow" | "dash.tab.activity" }[] = [
  { id: "overview", iconEl: <TrendingUp className="w-3.5 h-3.5" />, labelKey: "dash.tab.overview" },
  { id: "network", iconEl: <Network className="w-3.5 h-3.5" />, labelKey: "dash.tab.network" },
  { id: "flow", iconEl: <ArrowUpRight className="w-3.5 h-3.5" />, labelKey: "dash.tab.flow" },
  { id: "activity", iconEl: <Activity className="w-3.5 h-3.5" />, labelKey: "dash.tab.activity" },
];

function TabBar({ activeTab, onTabChange }: { activeTab: TabId; onTabChange: (t: TabId) => void }) {
  const { t } = useLanguage();

  return (
    <div className="flex gap-1 p-1 rounded-xl bg-white/[0.02] border border-border">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            relative flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-200
            ${activeTab === tab.id
              ? "text-text"
              : "text-text-muted hover:text-text-dim"
            }
          `}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 rounded-lg"
              style={{
                background: "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(139,92,246,0.08))",
                border: "1px solid rgba(6,182,212,0.15)",
              }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            {tab.iconEl}
            {t(tab.labelKey)}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ── Overview Tab ── */

function OverviewTab({
  state,
  address,
}: {
  state: Extract<DashboardState, { status: "success" }>;
  address: string;
}) {
  const { t } = useLanguage();
  const sr = useMemo(
    () => toScoreResult(state.score, state.wallet),
    [state.score, state.wallet],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Credit Score Detail */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <h2 className="text-sm font-semibold text-text mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            {t("dash.scoreBreakdown")}
          </h2>

          <div className="flex items-center justify-center mb-6">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke="rgba(255,255,255,0.04)" strokeWidth="8"
                />
                <motion.circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke="url(#dashGradient)" strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 314" }}
                  animate={{
                    strokeDasharray: `${(state.score.credit_score / 1000) * 314} 314`,
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="dashGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--color-primary)" />
                    <stop offset="100%" stopColor="var(--color-accent)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-text">
                  {state.score.credit_score}
                </span>
                <span className="text-xs text-text-muted">/ 1000</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <FeatureBar
              label={t("dash.walletAge")}
              value={state.score.features.wallet_age as number || 0}
              max={1000} unit="days" color="var(--color-cat-age)"
            />
            <FeatureBar
              label={t("dash.txCount")}
              value={state.score.features.transaction_count as number || 0}
              max={500} color="var(--color-cat-tx)"
            />
            <FeatureBar
              label={t("dash.volume")}
              value={state.score.features.total_volume as number || 0}
              max={1000000} unit="USDT" color="var(--color-cat-defi)"
            />
            <FeatureBar
              label={t("dash.counterparties")}
              value={state.score.features.unique_counterparties as number || 0}
              max={100} color="var(--color-cat-balance)"
            />
          </div>
        </motion.div>

        {/* Cluster Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ClusterView cluster={state.cluster} />
        </motion.div>
      </div>

      {/* Risk Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <RiskAlert riskAnalysis={sr.riskAnalysis} index={0} />
      </motion.div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sr.categories.map((cat, i) => (
          <CategoryCard key={cat.category} data={cat} index={i} />
        ))}
        <ImprovementTips result={sr} index={sr.categories.length} />
      </div>

      {/* Share Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ShareCard result={sr} />
      </motion.div>

      {/* Score History Chart */}
      <ScoreHistoryChart address={address} />

      {/* User Profile & Bookmarks */}
      <UserProfile />

      {/* Transaction Flow list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h2 className="text-sm font-semibold text-text mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent" />
          {t("dash.recentTx")}
        </h2>

        <div className="space-y-1.5">
          {state.transactions.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-8">
              {t("dash.noTx")}
            </p>
          ) : (
            state.transactions.slice(0, 10).map((tx, i) => (
              <motion.div
                key={tx.tx_hash}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.03 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: tx.direction === "in"
                      ? "rgba(16,185,129,0.1)"
                      : "rgba(239,68,68,0.1)",
                  }}
                >
                  {tx.direction === "in" ? (
                    <ArrowDownLeft className="w-4 h-4 text-success" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-danger" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-text-dim truncate">
                    {tx.direction === "in"
                      ? `${t("dash.from")} ${tx.from_address}`
                      : `${t("dash.to")} ${tx.to_address}`}
                  </p>
                  <p className="text-xs text-text-muted">
                    {new Date(tx.timestamp).toLocaleDateString("ko-KR")} · {tx.chain}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className="text-sm font-mono font-medium"
                    style={{
                      color: tx.direction === "in"
                        ? "var(--color-success)"
                        : "var(--color-danger)",
                    }}
                  >
                    {tx.direction === "in" ? "+" : "-"}
                    {tx.amount.toLocaleString()} {tx.token}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Volume Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-success/10">
              <ArrowDownLeft className="w-4 h-4 text-success" />
            </div>
            <span className="text-sm text-text-dim">{t("dash.totalInflow")}</span>
          </div>
          <p className="text-2xl font-bold text-success">
            ${state.wallet.total_inflow_usdt.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-text-muted mt-1">{t("dash.received")}</p>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-danger/10">
              <ArrowUpRight className="w-4 h-4 text-danger" />
            </div>
            <span className="text-sm text-text-dim">{t("dash.totalOutflow")}</span>
          </div>
          <p className="text-2xl font-bold text-danger">
            ${state.wallet.total_outflow_usdt.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-text-muted mt-1">{t("dash.sent")}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Network Tab ── */

function NetworkTab({
  state,
  address,
}: {
  state: Extract<DashboardState, { status: "success" }>;
  address: string;
}) {
  // Transform transaction data into network graph nodes & edges
  const { nodes, edges } = useMemo(() => {
    const nodeMap = new Map<string, NetworkNode>();
    const edgeList: NetworkEdge[] = [];

    // Main wallet node
    nodeMap.set(address, {
      id: address,
      type: "wallet",
      label: address,
      volume: state.wallet.total_inflow_usdt + state.wallet.total_outflow_usdt,
    });

    // Build nodes from transactions
    state.transactions.forEach((tx) => {
      const counterparty = tx.direction === "in" ? tx.from_address : tx.to_address;

      if (!nodeMap.has(counterparty)) {
        nodeMap.set(counterparty, {
          id: counterparty,
          type: "wallet",
          label: counterparty,
          volume: 0,
        });
      }
      const node = nodeMap.get(counterparty)!;
      node.volume += tx.amount;

      edgeList.push({
        source: tx.direction === "in" ? counterparty : address,
        target: tx.direction === "in" ? address : counterparty,
        amount: tx.amount,
      });
    });

    // Add cluster wallets
    state.cluster.wallets.forEach((w) => {
      if (!nodeMap.has(w.address)) {
        nodeMap.set(w.address, {
          id: w.address,
          type: "wallet",
          label: w.address,
          volume: 0,
        });
      }
    });

    // Classify high-volume counterparties as exchanges (heuristic)
    const allVolumes = Array.from(nodeMap.values()).map((n) => n.volume);
    const medianVolume = allVolumes.sort((a, b) => a - b)[Math.floor(allVolumes.length / 2)] || 0;
    nodeMap.forEach((node) => {
      if (node.id !== address && node.volume > medianVolume * 3 && node.volume > 10000) {
        node.type = "exchange";
      }
    });

    return {
      nodes: Array.from(nodeMap.values()).slice(0, 50),
      edges: edgeList,
    };
  }, [state.transactions, state.cluster, state.wallet, address]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <NetworkGraph nodes={nodes} edges={edges} width={700} height={450} />
    </motion.div>
  );
}

/* ── Flow Tab ── */

function FlowTab({
  state,
  address,
}: {
  state: Extract<DashboardState, { status: "success" }>;
  address: string;
}) {
  // Aggregate inflows and outflows by counterparty
  const flowData = useMemo(() => {
    const inflowMap = new Map<string, number>();
    const outflowMap = new Map<string, number>();

    state.transactions.forEach((tx) => {
      if (tx.direction === "in") {
        inflowMap.set(tx.from_address, (inflowMap.get(tx.from_address) || 0) + tx.amount);
      } else {
        outflowMap.set(tx.to_address, (outflowMap.get(tx.to_address) || 0) + tx.amount);
      }
    });

    const ins = Array.from(inflowMap.entries())
      .map(([from, amount]) => ({ from, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);

    const outs = Array.from(outflowMap.entries())
      .map(([to, amount]) => ({ to, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);

    return { inflows: ins, outflows: outs };
  }, [state.transactions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <FlowChart address={address} inflows={flowData.inflows} outflows={flowData.outflows} />
    </motion.div>
  );
}

/* ── Activity Tab ── */

function ActivityTab({
  state,
  address,
}: {
  state: Extract<DashboardState, { status: "success" }>;
  address: string;
}) {
  const { t } = useLanguage();

  const timelineData = useMemo(
    () =>
      state.transactions.map((tx) => ({
        timestamp: tx.timestamp,
        amount: tx.amount,
        direction: tx.direction,
      })),
    [state.transactions],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <TransactionTimeline transactions={timelineData} />

      {/* Volume Summary below the chart */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-success/10">
              <ArrowDownLeft className="w-4 h-4 text-success" />
            </div>
            <span className="text-sm text-text-dim">
              {t("dash.totalInflow")}
            </span>
          </div>
          <p className="text-2xl font-bold text-success">
            ${state.wallet.total_inflow_usdt.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-danger/10">
              <ArrowUpRight className="w-4 h-4 text-danger" />
            </div>
            <span className="text-sm text-text-dim">
              {t("dash.totalOutflow")}
            </span>
          </div>
          <p className="text-2xl font-bold text-danger">
            ${state.wallet.total_outflow_usdt.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Sub Components ── */

function MetricCard({
  icon,
  label,
  value,
  color,
  sub,
  index,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  sub: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08 }}
      className="glass-card glass-card-hover p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: `${color}15`, color }}
        >
          {icon}
        </div>
        <span className="text-xs text-text-muted">{label}</span>
      </div>
      <p className="text-2xl font-bold text-text">{value}</p>
      <p className="text-xs text-text-muted mt-1">{sub}</p>
    </motion.div>
  );
}

function FeatureBar({
  label,
  value,
  max,
  unit,
  color,
}: {
  label: string;
  value: number;
  max: number;
  unit?: string;
  color: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const display = unit === "USDT"
    ? `$${value.toLocaleString()}`
    : unit
      ? `${value.toLocaleString()} ${unit}`
      : value.toLocaleString();

  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-text-dim">{label}</span>
        <span className="text-text-muted font-mono">{display}</span>
      </div>
      <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }}
        />
      </div>
    </div>
  );
}

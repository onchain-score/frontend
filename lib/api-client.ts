/**
 * Dual Backend Client
 * FastAPI (Analysis Engine) + Spring Boot (User/CRUD Service)
 */

const ANALYSIS_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const USER_API = process.env.NEXT_PUBLIC_USER_API_URL || "http://localhost:8001/api/v2";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchBase<T>(base: string, path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new ApiError(res.status, body.detail || "API Error");
  }

  return res.json();
}

/** FastAPI analysis endpoints */
async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  return fetchBase(ANALYSIS_API, path, options);
}

/** Spring Boot user/CRUD endpoints (with optional JWT) */
async function fetchUserApi<T>(path: string, options?: RequestInit): Promise<T> {
  let token: string | null = null;
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    token = session?.access_token ?? null;
  } catch {}

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return fetchBase(USER_API, path, { ...options, headers });
}

// ===== Wallet API =====

export interface WalletInfo {
  address: string;
  chain: string;
  first_seen: string | null;
  last_seen: string | null;
  tx_count: number;
  wallet_age_days: number;
  total_inflow_usdt: number;
  total_outflow_usdt: number;
  unique_counterparties: number;
}

export async function getWallet(
  address: string,
  chain?: string,
): Promise<WalletInfo> {
  const params = chain ? `?chain=${chain}` : "";
  return fetchApi(`/wallet/${address}${params}`);
}

export async function triggerIndex(
  address: string,
  chain?: string,
): Promise<{ indexed: number }> {
  const params = chain ? `?chain=${chain}` : "";
  return fetchApi(`/wallet/${address}/index`, { method: "POST" });
}

// ===== Transaction API =====

export interface TransactionItem {
  tx_hash: string;
  chain: string;
  from_address: string;
  to_address: string;
  token: string;
  amount: number;
  timestamp: string;
  block_number: number;
  direction: "in" | "out";
}

export interface TransactionResponse {
  address: string;
  chain: string;
  count: number;
  transactions: TransactionItem[];
}

export async function getTransactions(
  address: string,
  chain?: string,
  limit = 50,
  offset = 0,
): Promise<TransactionResponse> {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (chain) params.set("chain", chain);
  return fetchApi(`/transactions/${address}?${params}`);
}

// ===== Cluster API =====

export interface ClusterWallet {
  address: string;
  chain: string;
  confidence: number;
}

export interface ClusterResponse {
  cluster_id: string;
  confidence: number;
  wallets: ClusterWallet[];
  signals: {
    direct_transfer: boolean;
    exchange_pattern: boolean;
    bridge_pattern: boolean;
    timing_similarity: boolean;
    gas_pattern: boolean;
  };
}

export async function getWalletCluster(
  address: string,
  chain?: string,
): Promise<ClusterResponse> {
  const params = chain ? `?chain=${chain}` : "";
  return fetchApi(`/wallet-cluster/${address}${params}`);
}

// ===== Credit Score API =====

export interface CategoryScore {
  category: string;
  score: number;
  max_score: number;
  raw_value: number;
}

export interface CreditScoreResponse {
  cluster_id: string;
  wallets: string[];
  credit_score: number;
  risk_score: number;
  trust_level: string;
  risk_level: string;
  category_scores?: CategoryScore[];
  features: Record<string, number | boolean>;
  scored_at: string;
}

export async function getCreditScore(
  address: string,
  chain?: string,
  clusterId?: string,
): Promise<CreditScoreResponse> {
  const params = new URLSearchParams();
  if (chain) params.set("chain", chain);
  if (clusterId) params.set("cluster_id", clusterId);
  const qs = params.toString() ? `?${params}` : "";
  return fetchApi(`/credit-score/${address}${qs}`);
}

// ===== Graph API =====

export interface RiskPath {
  target: string;
  risk_type: string;
  hops: number;
  addresses: string[];
  total_amount?: number;
}

export interface GraphResponse {
  nodes: { address: string; chain: string; type: string }[];
  edges: { from: string; to: string; amount: number; chain: string }[];
  communities: unknown[];
  risk_paths: RiskPath[];
}

export async function getGraph(
  address: string,
  depth = 2,
): Promise<GraphResponse> {
  return fetchApi(`/graph/${address}?depth=${depth}`);
}

// ===== Spring Boot User API =====

export interface TransactionFilterParams {
  chain?: string;
  direction?: "in" | "out";
  token?: string;
  minAmount?: number;
  maxAmount?: number;
  dateFrom?: string;
  dateTo?: string;
  counterparty?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface TransactionPageResponse {
  transactions: TransactionItem[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export async function getTransactionsFiltered(
  address: string,
  filters: TransactionFilterParams = {},
): Promise<TransactionPageResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
  });
  return fetchUserApi(`/wallets/${address}/transactions?${params}`);
}

export interface ScoreHistoryItem {
  credit_score: number;
  risk_score: number;
  risk_level: string;
  trust_level: string;
  scored_at: string;
}

export async function getScoreHistory(
  address: string,
  chain?: string,
  days = 30,
): Promise<ScoreHistoryItem[]> {
  const params = new URLSearchParams({ days: String(days) });
  if (chain) params.set("chain", chain);
  return fetchUserApi(`/wallets/${address}/score-history?${params}`);
}

export async function generatePdfReport(address: string, chain?: string): Promise<Blob> {
  let token: string | null = null;
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    token = session?.access_token ?? null;
  } catch {}

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const params = chain ? `?chain=${chain}` : "";
  const res = await fetch(`${USER_API}/reports/${address}/pdf${params}`, {
    method: "POST",
    headers,
  });
  if (!res.ok) throw new ApiError(res.status, "PDF generation failed");
  return res.blob();
}

export async function getUserProfile() {
  return fetchUserApi<{ id: string; email: string; display_name: string | null }>("/users/me");
}

export async function getBookmarks() {
  return fetchUserApi<{ id: number; wallet_address: string; chain: string; label: string | null; created_at: string }[]>("/users/me/bookmarks");
}

export async function addBookmark(walletAddress: string, chain: string, label?: string) {
  return fetchUserApi("/users/me/bookmarks", {
    method: "POST",
    body: JSON.stringify({ wallet_address: walletAddress, chain, label }),
  });
}

export async function removeBookmark(id: number) {
  return fetchUserApi(`/users/me/bookmarks/${id}`, { method: "DELETE" });
}

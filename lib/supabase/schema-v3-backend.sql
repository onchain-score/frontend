-- Schema V3: Backend tables for FastAPI onchain analysis
-- Run in Supabase Dashboard -> SQL Editor after schema-v2.sql
-- These tables are used by the FastAPI backend (not the Next.js frontend)

-- =============================================
-- 1. wallets: 분석된 지갑 정보
-- =============================================
CREATE TABLE IF NOT EXISTS wallets (
  address   VARCHAR(128) NOT NULL,
  chain     VARCHAR(32)  NOT NULL,
  first_seen TIMESTAMPTZ NOT NULL,
  last_seen  TIMESTAMPTZ NOT NULL,
  tx_count   INTEGER     DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (address, chain)
);

-- =============================================
-- 2. transactions: 수집된 거래 데이터
-- =============================================
CREATE TABLE IF NOT EXISTS transactions (
  tx_hash       VARCHAR(128) PRIMARY KEY,
  chain         VARCHAR(32)  NOT NULL,
  from_address  VARCHAR(128) NOT NULL,
  to_address    VARCHAR(128) NOT NULL,
  token         VARCHAR(32)  DEFAULT 'USDT',
  amount        NUMERIC(28,8) NOT NULL,
  "timestamp"   TIMESTAMPTZ  NOT NULL,
  block_number  BIGINT       NOT NULL,
  created_at    TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tx_from_chain
  ON transactions(from_address, chain, "timestamp");
CREATE INDEX IF NOT EXISTS idx_tx_to_chain
  ON transactions(to_address, chain, "timestamp");
CREATE INDEX IF NOT EXISTS idx_tx_block
  ON transactions(chain, block_number);

-- =============================================
-- 3. wallet_clusters: 지갑 클러스터 (동일 사용자 추정)
-- =============================================
CREATE TABLE IF NOT EXISTS wallet_clusters (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cluster_id     UUID         NOT NULL,
  wallet_address VARCHAR(128) NOT NULL,
  chain          VARCHAR(32)  NOT NULL,
  confidence     NUMERIC(5,4) DEFAULT 0,
  created_at     TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cluster_wallet
  ON wallet_clusters(wallet_address, chain);
CREATE INDEX IF NOT EXISTS idx_cluster_id
  ON wallet_clusters(cluster_id);

-- =============================================
-- 4. scores: 신용 점수 결과
-- =============================================
CREATE TABLE IF NOT EXISTS scores (
  cluster_id   UUID PRIMARY KEY,
  credit_score INTEGER     NOT NULL,
  risk_score   INTEGER     NOT NULL,
  risk_level   VARCHAR(16) DEFAULT 'unknown',
  trust_level  VARCHAR(16) DEFAULT 'unknown',
  scored_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. features: 행동 Feature 벡터
-- =============================================
CREATE TABLE IF NOT EXISTS features (
  cluster_id          UUID PRIMARY KEY REFERENCES scores(cluster_id),
  -- Wallet Activity
  wallet_age          INTEGER     DEFAULT 0,
  transaction_count   INTEGER     DEFAULT 0,
  active_days         INTEGER     DEFAULT 0,
  -- Volume
  total_volume        NUMERIC(28,8) DEFAULT 0,
  inflow              NUMERIC(28,8) DEFAULT 0,
  outflow             NUMERIC(28,8) DEFAULT 0,
  median_transaction  NUMERIC(28,8) DEFAULT 0,
  -- Stablecoin
  total_usdt_volume   NUMERIC(28,8) DEFAULT 0,
  stablecoin_ratio    NUMERIC(5,4)  DEFAULT 0,
  -- Counterparty
  unique_counterparties INTEGER    DEFAULT 0,
  counterparty_entropy  NUMERIC(10,6) DEFAULT 0,
  -- Behavior
  tx_interval_std     NUMERIC(16,6) DEFAULT 0,
  weekend_activity_ratio NUMERIC(5,4) DEFAULT 0,
  -- Network
  degree_centrality   NUMERIC(10,8) DEFAULT 0,
  pagerank            NUMERIC(10,8) DEFAULT 0,
  cluster_size        INTEGER     DEFAULT 1,
  -- Risk
  mixer_interaction   BOOLEAN     DEFAULT FALSE,
  suspicious_ratio    NUMERIC(5,4) DEFAULT 0,
  -- Protocol
  defi_usage          INTEGER     DEFAULT 0,
  cross_chain_count   INTEGER     DEFAULT 0,
  --
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RLS (Row Level Security) - 서비스 레벨 접근
-- 백엔드가 service_role 키로 접근하므로 RLS는 비활성
-- 필요시 아래 주석 해제
-- =============================================
-- ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE wallet_clusters ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE features ENABLE ROW LEVEL SECURITY;

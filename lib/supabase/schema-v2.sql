-- Schema V2: Multi-chain + Risk Analysis
-- Run in Supabase Dashboard -> SQL Editor after schema.sql

-- Add chain column
ALTER TABLE score_history ADD COLUMN IF NOT EXISTS chain text NOT NULL DEFAULT 'ethereum';

-- Add risk columns
ALTER TABLE score_history ADD COLUMN IF NOT EXISTS risk_score integer NOT NULL DEFAULT 0;
ALTER TABLE score_history ADD COLUMN IF NOT EXISTS risk_level text NOT NULL DEFAULT 'safe';
ALTER TABLE score_history ADD COLUMN IF NOT EXISTS risk_flags jsonb DEFAULT '[]'::jsonb;

-- Update index for chain-aware lookups
DROP INDEX IF EXISTS idx_score_history_user_address;
CREATE INDEX idx_score_history_user_chain_address
  ON score_history(user_id, chain, address, analyzed_at DESC);

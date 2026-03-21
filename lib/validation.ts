/**
 * Shared validation utilities - Single Source of Truth
 */

import type { ChainType } from "./types";
import { CHAIN_CONFIGS } from "./chains";

export const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
const TRON_ADDRESS_REGEX = /^T[1-9A-HJ-NP-Za-km-z]{33}$/;

export function isValidEthAddress(address: string): boolean {
  return ETH_ADDRESS_REGEX.test(address);
}

/**
 * Detect chain type from address format.
 * - 0x... (42 chars, hex) → ethereum (default EVM)
 * - T... (34 chars, base58) → tron
 * Returns null if format is unrecognized.
 */
export function detectChain(address: string): ChainType | null {
  const trimmed = address.trim();
  if (ETH_ADDRESS_REGEX.test(trimmed)) return "ethereum";
  if (TRON_ADDRESS_REGEX.test(trimmed)) return "tron";
  return null;
}

/**
 * Validate address for a specific chain.
 */
export function isValidAddress(address: string, chain: ChainType): boolean {
  const config = CHAIN_CONFIGS[chain];
  return config.addressRegex.test(address.trim());
}

export function formatAddress(
  address: string,
  prefixLen = 6,
  suffixLen = 4,
): string {
  if (address.length <= prefixLen + suffixLen) return address;
  return `${address.slice(0, prefixLen)}...${address.slice(-suffixLen)}`;
}

export function normalizeAddress(address: string): string {
  const trimmed = address.trim();
  if (TRON_ADDRESS_REGEX.test(trimmed)) return trimmed;
  return trimmed.toLowerCase();
}

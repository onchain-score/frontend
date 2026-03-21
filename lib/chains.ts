/**
 * Multi-chain configuration registry.
 */

import type { ChainType, ChainConfig } from "./types";

export const CHAIN_CONFIGS: Record<ChainType, ChainConfig> = {
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    nameKo: "\uC774\uB354\uB9AC\uC6C0",
    addressRegex: /^0x[a-fA-F0-9]{40}$/,
    explorerApiBase: "https://api.etherscan.io/v2/api",
    icon: "\u{1F539}",
  },
  tron: {
    id: "tron",
    name: "Tron",
    nameKo: "\uD2B8\uB860",
    addressRegex: /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
    explorerApiBase: "https://api.trongrid.io",
    icon: "\u{1F534}",
  },
  arbitrum: {
    id: "arbitrum",
    name: "Arbitrum",
    nameKo: "\uC544\uBE44\uD2B8\uB7FC",
    addressRegex: /^0x[a-fA-F0-9]{40}$/,
    explorerApiBase: "https://api.arbiscan.io/api",
    icon: "\u{1F535}",
  },
  polygon: {
    id: "polygon",
    name: "Polygon",
    nameKo: "\uD3F4\uB9AC\uACE4",
    addressRegex: /^0x[a-fA-F0-9]{40}$/,
    explorerApiBase: "https://api.polygonscan.com/api",
    icon: "\u{1F7E3}",
  },
  bnb: {
    id: "bnb",
    name: "BNB Chain",
    nameKo: "BNB \uCCB4\uC778",
    addressRegex: /^0x[a-fA-F0-9]{40}$/,
    explorerApiBase: "https://api.bscscan.com/api",
    icon: "\u{1F7E1}",
  },
};

/** Ordered list for UI display */
export const CHAIN_LIST: ChainConfig[] = [
  CHAIN_CONFIGS.ethereum,
  CHAIN_CONFIGS.tron,
  CHAIN_CONFIGS.arbitrum,
  CHAIN_CONFIGS.polygon,
  CHAIN_CONFIGS.bnb,
];

/** Map chain to its API key env var name */
export const CHAIN_API_KEY_ENV: Record<ChainType, string> = {
  ethereum: "ETHERSCAN_API_KEY",
  tron: "TRONGRID_API_KEY",
  arbitrum: "ARBISCAN_API_KEY",
  polygon: "POLYGONSCAN_API_KEY",
  bnb: "BSCSCAN_API_KEY",
};

/** Get chain ID for EVM chains */
export const CHAIN_IDS: Record<ChainType, string> = {
  ethereum: "1",
  tron: "0",
  arbitrum: "42161",
  polygon: "137",
  bnb: "56",
};

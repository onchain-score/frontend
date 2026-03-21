"use client";

/**
 * useWallet — Custom hook for wallet connections.
 *
 * Supports MetaMask (EVM) and Phantom (Solana).
 */

import { useState, useEffect, useCallback } from "react";
import { isUserRejection } from "@/lib/errors";

export type WalletProvider = "metamask" | "phantom";

export type WalletState =
  | { status: "idle" }
  | { status: "connecting"; provider: WalletProvider }
  | { status: "connected"; address: string; provider: WalletProvider }
  | { status: "error"; message: string };

interface UseWalletReturn {
  state: WalletState;
  hasMetaMask: boolean | null;
  hasPhantom: boolean | null;
  connectMetaMask: () => Promise<void>;
  connectPhantom: () => Promise<void>;
  disconnect: () => void;
}

export function useWallet(): UseWalletReturn {
  const [state, setState] = useState<WalletState>({ status: "idle" });
  const [hasMetaMask, setHasMetaMask] = useState<boolean | null>(null);
  const [hasPhantom, setHasPhantom] = useState<boolean | null>(null);

  // Detect wallets on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasMetaMask(typeof window !== "undefined" && !!window.ethereum?.isMetaMask);
      setHasPhantom(typeof window !== "undefined" && !!window.phantom?.solana?.isPhantom);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Listen for MetaMask account changes
  useEffect(() => {
    const ethereum = window.ethereum;
    if (!ethereum) return;

    const handleAccountsChanged = (accounts: unknown) => {
      const accs = Array.isArray(accounts) ? (accounts as string[]) : [];
      if (accs.length === 0) {
        setState({ status: "idle" });
      } else {
        setState({ status: "connected", address: accs[0], provider: "metamask" });
      }
    };

    ethereum.on("accountsChanged", handleAccountsChanged);
    return () => ethereum.removeListener("accountsChanged", handleAccountsChanged);
  }, []);

  const connectMetaMask = useCallback(async () => {
    const ethereum = window.ethereum;
    if (!ethereum) {
      setState({ status: "error", message: "MetaMask not detected" });
      return;
    }

    setState({ status: "connecting", provider: "metamask" });

    try {
      const accounts = (await ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts.length > 0) {
        setState({ status: "connected", address: accounts[0], provider: "metamask" });
      } else {
        setState({ status: "error", message: "No accounts returned" });
      }
    } catch (err) {
      const message = isUserRejection(err)
        ? "Connection rejected by user"
        : "Failed to connect wallet";
      setState({ status: "error", message });
    }
  }, []);

  const connectPhantom = useCallback(async () => {
    const phantom = window.phantom?.solana;
    if (!phantom) {
      setState({ status: "error", message: "Phantom not detected" });
      return;
    }

    setState({ status: "connecting", provider: "phantom" });

    try {
      const resp = await phantom.connect();
      const address = resp.publicKey.toString();
      setState({ status: "connected", address, provider: "phantom" });
    } catch (err) {
      const message = isUserRejection(err)
        ? "Connection rejected by user"
        : "Failed to connect Phantom";
      setState({ status: "error", message });
    }
  }, []);

  const disconnect = useCallback(() => {
    // Disconnect Phantom if it was connected
    try { window.phantom?.solana?.disconnect(); } catch {}
    setState({ status: "idle" });
  }, []);

  return { state, hasMetaMask, hasPhantom, connectMetaMask, connectPhantom, disconnect };
}

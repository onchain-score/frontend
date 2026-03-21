"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import {
  getTransactionsFiltered,
  type TransactionItem,
  type TransactionFilterParams,
} from "@/lib/api-client";
import { formatAddress } from "@/lib/validation";

interface Props {
  address: string;
}

const CHAINS = [
  { value: "", label: "All Chains" },
  { value: "ethereum", label: "Ethereum" },
  { value: "tron", label: "TRON" },
  { value: "arbitrum", label: "Arbitrum" },
  { value: "polygon", label: "Polygon" },
  { value: "bnb", label: "BNB Chain" },
];

export default function TransactionFilter({ address }: Props) {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<TransactionFilterParams>({
    page: 0,
    size: 20,
    sortBy: "timestamp",
    sortDir: "desc",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTransactionsFiltered(address, filters);
      setTransactions(data.transactions);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (e) {
      console.error("Failed to fetch filtered transactions:", e);
    } finally {
      setLoading(false);
    }
  }, [address, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateFilter = (key: keyof TransactionFilterParams, value: string | number | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined, page: 0 }));
  };

  return (
    <div className="space-y-4">
      {/* Filter controls */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Direction toggle */}
        <div className="flex rounded-lg overflow-hidden border border-border">
          {["", "in", "out"].map((dir) => (
            <button
              key={dir}
              onClick={() => updateFilter("direction", dir as "in" | "out" | undefined)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                (filters.direction || "") === dir
                  ? "bg-primary/20 text-primary"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {dir === "" ? "All" : dir === "in" ? "Inflow" : "Outflow"}
            </button>
          ))}
        </div>

        {/* Chain select */}
        <select
          value={filters.chain || ""}
          onChange={(e) => updateFilter("chain", e.target.value)}
          className="px-3 py-1.5 text-xs bg-surface border border-border rounded-lg text-text"
        >
          {CHAINS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        {/* Toggle advanced filters */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs text-text-muted hover:text-text border border-border rounded-lg"
        >
          <Filter className="w-3 h-3" />
          Filters
        </button>

        <span className="text-xs text-text-muted ml-auto">{total} transactions</span>
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          <div>
            <label className="text-xs text-text-muted block mb-1">Min Amount</label>
            <input
              type="number"
              placeholder="0"
              onChange={(e) => updateFilter("minAmount", e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-2 py-1.5 text-xs bg-surface border border-border rounded-lg text-text"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-1">Max Amount</label>
            <input
              type="number"
              placeholder="999999"
              onChange={(e) => updateFilter("maxAmount", e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-2 py-1.5 text-xs bg-surface border border-border rounded-lg text-text"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-1">From Date</label>
            <input
              type="date"
              onChange={(e) => updateFilter("dateFrom", e.target.value ? new Date(e.target.value).toISOString() : undefined)}
              className="w-full px-2 py-1.5 text-xs bg-surface border border-border rounded-lg text-text"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-1">To Date</label>
            <input
              type="date"
              onChange={(e) => updateFilter("dateTo", e.target.value ? new Date(e.target.value).toISOString() : undefined)}
              className="w-full px-2 py-1.5 text-xs bg-surface border border-border rounded-lg text-text"
            />
          </div>
          <div className="col-span-2 sm:col-span-4">
            <label className="text-xs text-text-muted block mb-1">Counterparty Address</label>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-text-muted" />
              <input
                type="text"
                placeholder="0x..."
                onChange={(e) => updateFilter("counterparty", e.target.value)}
                className="w-full pl-7 pr-2 py-1.5 text-xs bg-surface border border-border rounded-lg text-text"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Transaction list */}
      <div className="space-y-1">
        {loading ? (
          <div className="text-center text-text-muted text-sm py-8">Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-text-muted text-sm py-8">No transactions found</div>
        ) : (
          transactions.map((tx) => (
            <div key={tx.tx_hash} className="glass-card p-3 flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  tx.direction === "in" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                }`}
              >
                {tx.direction === "in" ? "+" : "-"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-text truncate">
                    {tx.direction === "in" ? formatAddress(tx.from_address) : formatAddress(tx.to_address)}
                  </span>
                  <span className="text-[10px] text-text-muted px-1.5 py-0.5 rounded bg-white/[0.04]">
                    {tx.chain}
                  </span>
                </div>
                <span className="text-[10px] text-text-muted">
                  {new Date(tx.timestamp).toLocaleDateString()}
                </span>
              </div>
              <span className={`text-xs font-mono font-medium ${
                tx.direction === "in" ? "text-success" : "text-danger"
              }`}>
                {tx.direction === "in" ? "+" : "-"}${Number(tx.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setFilters((p) => ({ ...p, page: Math.max(0, (p.page || 0) - 1) }))}
            disabled={(filters.page || 0) === 0}
            className="p-1.5 rounded-lg border border-border text-text-muted hover:text-text disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-text-muted">
            {(filters.page || 0) + 1} / {totalPages}
          </span>
          <button
            onClick={() => setFilters((p) => ({ ...p, page: Math.min(totalPages - 1, (p.page || 0) + 1) }))}
            disabled={(filters.page || 0) >= totalPages - 1}
            className="p-1.5 rounded-lg border border-border text-text-muted hover:text-text disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

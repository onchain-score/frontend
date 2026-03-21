"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getScoreHistory, type ScoreHistoryItem } from "@/lib/api-client";

interface Props {
  address: string;
}

export default function ScoreHistoryChart({ address }: Props) {
  const [history, setHistory] = useState<ScoreHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getScoreHistory(address, undefined, days)
      .then(setHistory)
      .catch((e) => {
        setHistory([]);
        setError(e?.message || "Failed to load score history");
      })
      .finally(() => setLoading(false));
  }, [address, days]);

  if (loading) {
    return (
      <div className="glass-card p-6 text-center text-text-muted text-sm">
        Loading score history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 text-center text-danger text-sm">
        Score History Error: {error}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="glass-card p-6 text-center text-text-muted text-sm">
        No score history available yet
      </div>
    );
  }

  const latest = history[0];
  const oldest = history[history.length - 1];
  const scoreDiff = latest.credit_score - oldest.credit_score;
  const maxScore = Math.max(...history.map((h) => h.credit_score));
  const minScore = Math.min(...history.map((h) => h.credit_score));
  const range = maxScore - minScore || 1;

  // Reverse for chronological order (oldest first)
  const chronological = [...history].reverse();

  const SVG_WIDTH = 600;
  const SVG_HEIGHT = 160;
  const PAD_X = 40;
  const PAD_Y = 20;
  const chartW = SVG_WIDTH - PAD_X * 2;
  const chartH = SVG_HEIGHT - PAD_Y * 2;

  const points = chronological.map((h, i) => {
    const x = PAD_X + (i / Math.max(chronological.length - 1, 1)) * chartW;
    const y = PAD_Y + chartH - ((h.credit_score - minScore) / range) * chartH;
    return { x, y, score: h.credit_score, date: h.scored_at };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${PAD_Y + chartH} L ${points[0].x} ${PAD_Y + chartH} Z`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text">Score History</h3>
        <div className="flex items-center gap-2">
          {/* Period selector */}
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-2 py-0.5 text-[10px] rounded-md transition-colors ${
                days === d
                  ? "bg-primary/20 text-primary"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {d}D
            </button>
          ))}

          {/* Trend indicator */}
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
            scoreDiff > 0
              ? "bg-success/10 text-success"
              : scoreDiff < 0
              ? "bg-danger/10 text-danger"
              : "bg-white/5 text-text-muted"
          }`}>
            {scoreDiff > 0 ? <TrendingUp className="w-3 h-3" /> : scoreDiff < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            {scoreDiff > 0 ? "+" : ""}{scoreDiff}
          </div>
        </div>
      </div>

      {/* Chart */}
      <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-auto">
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <g key={pct}>
            <line
              x1={PAD_X} y1={PAD_Y + chartH * (1 - pct)}
              x2={PAD_X + chartW} y2={PAD_Y + chartH * (1 - pct)}
              stroke="white" strokeOpacity="0.05"
            />
            <text
              x={PAD_X - 4} y={PAD_Y + chartH * (1 - pct) + 4}
              textAnchor="end" fill="white" fillOpacity="0.3" fontSize="9"
            >
              {Math.round(minScore + range * pct)}
            </text>
          </g>
        ))}

        {/* Area */}
        <path d={areaPath} fill="url(#scoreGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#06b6d4" stroke="#050510" strokeWidth="1.5" />
        ))}
      </svg>

      {/* Summary */}
      <div className="flex items-center justify-between mt-3 text-[10px] text-text-muted">
        <span>{history.length} data points</span>
        <span>Latest: {latest.credit_score}/1000 ({latest.trust_level})</span>
      </div>
    </motion.div>
  );
}

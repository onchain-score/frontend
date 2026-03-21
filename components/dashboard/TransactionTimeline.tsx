"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";

/* ── Types ── */
export interface TimelineTransaction {
  timestamp: string;
  amount: number;
  direction: "in" | "out";
}

interface Props {
  transactions: TimelineTransaction[];
}

interface DayBucket {
  label: string;
  dateKey: string;
  inflow: number;
  outflow: number;
}

/* ── Constants ── */
const SVG_HEIGHT = 280;
const BAR_AREA_TOP = 40;
const BAR_AREA_BOTTOM = 50;
const X_LABEL_AREA = 40;
const Y_LABEL_WIDTH = 55;
const MIN_BAR_WIDTH = 12;
const MAX_BAR_WIDTH = 48;
const BAR_GAP = 4;

/* ── Helpers ── */
function groupByDay(txs: TimelineTransaction[]): DayBucket[] {
  const map = new Map<string, { inflow: number; outflow: number }>();
  txs.forEach((tx) => {
    const d = new Date(tx.timestamp);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const bucket = map.get(key) || { inflow: 0, outflow: 0 };
    if (tx.direction === "in") bucket.inflow += tx.amount;
    else bucket.outflow += tx.amount;
    map.set(key, bucket);
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => ({
      dateKey: key,
      label: key.slice(5), // MM-DD
      ...val,
    }));
}

function groupByWeek(txs: TimelineTransaction[]): DayBucket[] {
  const map = new Map<string, { inflow: number; outflow: number; firstDate: string }>();
  txs.forEach((tx) => {
    const d = new Date(tx.timestamp);
    // Week key: year-weekNumber
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + yearStart.getDay() + 1) / 7);
    const key = `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
    const bucket = map.get(key) || { inflow: 0, outflow: 0, firstDate: tx.timestamp };
    if (tx.direction === "in") bucket.inflow += tx.amount;
    else bucket.outflow += tx.amount;
    if (tx.timestamp < bucket.firstDate) bucket.firstDate = tx.timestamp;
    map.set(key, bucket);
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => {
      const d = new Date(val.firstDate);
      return {
        dateKey: key,
        label: `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`,
        inflow: val.inflow,
        outflow: val.outflow,
      };
    });
}

function groupByMonth(txs: TimelineTransaction[]): DayBucket[] {
  const map = new Map<string, { inflow: number; outflow: number }>();
  txs.forEach((tx) => {
    const d = new Date(tx.timestamp);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const bucket = map.get(key) || { inflow: 0, outflow: 0 };
    if (tx.direction === "in") bucket.inflow += tx.amount;
    else bucket.outflow += tx.amount;
    map.set(key, bucket);
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => ({
      dateKey: key,
      label: key.slice(2), // YY-MM
      ...val,
    }));
}

/* ── Component ── */
export default function TransactionTimeline({ transactions }: Props) {
  const { t, locale } = useLanguage();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const buckets = useMemo(() => {
    if (transactions.length === 0) return [];

    const sorted = [...transactions].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
    const first = new Date(sorted[0].timestamp).getTime();
    const last = new Date(sorted[sorted.length - 1].timestamp).getTime();
    const rangeDays = (last - first) / 86400000;

    if (rangeDays <= 31) return groupByDay(sorted);
    if (rangeDays <= 180) return groupByWeek(sorted);
    return groupByMonth(sorted);
  }, [transactions]);

  // Layout calculations
  const layout = useMemo(() => {
    if (buckets.length === 0) return null;

    const maxVal = Math.max(
      ...buckets.map((b) => b.inflow + b.outflow),
      1,
    );

    const chartWidth = 700;
    const availableWidth = chartWidth - Y_LABEL_WIDTH - 20;
    const barWidth = Math.min(
      MAX_BAR_WIDTH,
      Math.max(MIN_BAR_WIDTH, (availableWidth - (buckets.length - 1) * BAR_GAP) / buckets.length),
    );
    const totalBarsWidth = buckets.length * barWidth + (buckets.length - 1) * BAR_GAP;
    const startX = Y_LABEL_WIDTH + (availableWidth - totalBarsWidth) / 2;

    const barAreaHeight = SVG_HEIGHT - BAR_AREA_TOP - BAR_AREA_BOTTOM;

    const bars = buckets.map((b, i) => {
      const total = b.inflow + b.outflow;
      const totalHeight = (total / maxVal) * barAreaHeight;
      const inflowHeight = total > 0 ? (b.inflow / total) * totalHeight : 0;
      const outflowHeight = total > 0 ? (b.outflow / total) * totalHeight : 0;
      const x = startX + i * (barWidth + BAR_GAP);
      const barBottom = BAR_AREA_TOP + barAreaHeight;

      return {
        ...b,
        x,
        barWidth,
        inflowY: barBottom - totalHeight,
        inflowHeight,
        outflowY: barBottom - outflowHeight,
        outflowHeight,
        total,
      };
    });

    // Y-axis gridlines (4 lines)
    const yLines = [0.25, 0.5, 0.75, 1].map((frac) => ({
      y: BAR_AREA_TOP + barAreaHeight * (1 - frac),
      label: formatCompact(maxVal * frac),
    }));

    return { bars, yLines, chartWidth, maxVal };
  }, [buckets]);

  if (!layout || buckets.length === 0) {
    return (
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-text mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
          </svg>
          {t("dash.activity")}
        </h2>
        <p className="text-text-muted text-sm text-center py-8">{t("dash.noTx")}</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h2 className="text-sm font-semibold text-text mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
        {t("dash.activity")}
      </h2>

      {/* Legend */}
      <div className="flex gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-success" />
          <span className="text-xs text-text-muted">{t("dash.totalInflow")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-danger" />
          <span className="text-xs text-text-muted">{t("dash.totalOutflow")}</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-white/[0.01] border border-border">
        <svg
          width="100%"
          height={SVG_HEIGHT}
          viewBox={`0 0 ${layout.chartWidth} ${SVG_HEIGHT}`}
          className="block"
        >
          {/* Y-axis gridlines */}
          {layout.yLines.map((line, i) => (
            <g key={`grid-${i}`}>
              <line
                x1={Y_LABEL_WIDTH - 8}
                y1={line.y}
                x2={layout.chartWidth - 10}
                y2={line.y}
                stroke="rgba(255,255,255,0.04)"
                strokeDasharray="4 4"
              />
              <text
                x={Y_LABEL_WIDTH - 12}
                y={line.y + 3}
                textAnchor="end"
                fill="var(--color-text-muted)"
                fontSize="8"
                fontFamily="var(--font-family-mono)"
              >
                {line.label}
              </text>
            </g>
          ))}

          {/* Bars */}
          {layout.bars.map((bar, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <g
                key={bar.dateKey}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                {/* Hit area */}
                <rect
                  x={bar.x - 2}
                  y={BAR_AREA_TOP}
                  width={bar.barWidth + 4}
                  height={SVG_HEIGHT - BAR_AREA_TOP - BAR_AREA_BOTTOM}
                  fill="transparent"
                />

                {/* Inflow (green, bottom) */}
                <motion.rect
                  x={bar.x}
                  y={bar.inflowY}
                  width={bar.barWidth}
                  rx={2}
                  fill={isHovered ? "rgba(16,185,129,0.5)" : "rgba(16,185,129,0.3)"}
                  stroke={isHovered ? "rgba(16,185,129,0.7)" : "none"}
                  strokeWidth="1"
                  initial={{ height: 0, y: BAR_AREA_TOP + SVG_HEIGHT - BAR_AREA_TOP - BAR_AREA_BOTTOM }}
                  animate={{ height: bar.inflowHeight, y: bar.inflowY }}
                  transition={{ duration: 0.6, delay: 0.05 + i * 0.03, ease: "easeOut" }}
                />

                {/* Outflow (red, top / stacked on inflow) */}
                <motion.rect
                  x={bar.x}
                  y={bar.outflowY}
                  width={bar.barWidth}
                  rx={2}
                  fill={isHovered ? "rgba(239,68,68,0.5)" : "rgba(239,68,68,0.3)"}
                  stroke={isHovered ? "rgba(239,68,68,0.7)" : "none"}
                  strokeWidth="1"
                  initial={{ height: 0, y: BAR_AREA_TOP + SVG_HEIGHT - BAR_AREA_TOP - BAR_AREA_BOTTOM }}
                  animate={{ height: bar.outflowHeight, y: bar.outflowY }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.03, ease: "easeOut" }}
                />

                {/* X-axis label */}
                <text
                  x={bar.x + bar.barWidth / 2}
                  y={SVG_HEIGHT - BAR_AREA_BOTTOM + 16}
                  textAnchor="middle"
                  fill={isHovered ? "var(--color-text-dim)" : "var(--color-text-muted)"}
                  fontSize="8"
                  fontFamily="var(--font-family-mono)"
                  transform={`rotate(-30, ${bar.x + bar.barWidth / 2}, ${SVG_HEIGHT - BAR_AREA_BOTTOM + 16})`}
                >
                  {bar.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip */}
        <AnimatePresence>
          {hoveredIdx !== null && layout.bars[hoveredIdx] && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.12 }}
              className="absolute top-3 right-3 glass-card p-3 pointer-events-none"
              style={{ minWidth: 140 }}
            >
              <p className="text-xs font-mono text-text-dim mb-1.5">
                {layout.bars[hoveredIdx].dateKey}
              </p>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-sm bg-success" />
                <span className="text-xs text-text-muted">{t("dash.totalInflow")}:</span>
                <span className="text-xs font-mono text-success">
                  {formatCompact(layout.bars[hoveredIdx].inflow)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-danger" />
                <span className="text-xs text-text-muted">{t("dash.totalOutflow")}:</span>
                <span className="text-xs font-mono text-danger">
                  {formatCompact(layout.bars[hoveredIdx].outflow)}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function formatCompact(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

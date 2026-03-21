"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { formatAddress } from "@/lib/validation";

/* ── Types ── */
export interface FlowInflow {
  from: string;
  amount: number;
}

export interface FlowOutflow {
  to: string;
  amount: number;
}

interface Props {
  address: string;
  inflows: FlowInflow[];
  outflows: FlowOutflow[];
}

/* ── Layout Constants ── */
const SVG_WIDTH = 700;
const SVG_HEIGHT = 420;
const LEFT_X = 60;
const CENTER_X = SVG_WIDTH / 2;
const RIGHT_X = SVG_WIDTH - 60;
const NODE_WIDTH = 14;
const MIN_FLOW_HEIGHT = 4;
const VERTICAL_PAD = 28;
const TOP_PAD = 50;
const BOTTOM_PAD = 30;

/* ── Helpers ── */
function cubicBezier(
  x0: number, y0: number,
  x3: number, y3: number,
  h0: number, h1: number,
): string {
  const cpOffset = Math.abs(x3 - x0) * 0.45;
  return [
    `M ${x0},${y0}`,
    `C ${x0 + cpOffset},${y0} ${x3 - cpOffset},${y3} ${x3},${y3}`,
    `L ${x3},${y3 + h1}`,
    `C ${x3 - cpOffset},${y3 + h1} ${x0 + cpOffset},${y0 + h0} ${x0},${y0 + h0}`,
    `Z`,
  ].join(" ");
}

/* ── Component ── */
export default function FlowChart({ address, inflows, outflows }: Props) {
  const { t } = useLanguage();

  const layout = useMemo(() => {
    const totalInflow = inflows.reduce((s, f) => s + f.amount, 0);
    const totalOutflow = outflows.reduce((s, f) => s + f.amount, 0);
    const maxTotal = Math.max(totalInflow, totalOutflow, 1);

    const usableHeight = SVG_HEIGHT - TOP_PAD - BOTTOM_PAD;

    // Inflow node layout (left side)
    const inflowNodes = inflows.map((f) => ({
      label: formatAddress(f.from),
      fullAddress: f.from,
      amount: f.amount,
      height: Math.max((f.amount / maxTotal) * usableHeight * 0.8, MIN_FLOW_HEIGHT),
    }));

    // Outflow node layout (right side)
    const outflowNodes = outflows.map((f) => ({
      label: formatAddress(f.to),
      fullAddress: f.to,
      amount: f.amount,
      height: Math.max((f.amount / maxTotal) * usableHeight * 0.8, MIN_FLOW_HEIGHT),
    }));

    // Center node
    const centerHeight = Math.max(
      inflowNodes.reduce((s, n) => s + n.height, 0) + (inflowNodes.length - 1) * 2,
      outflowNodes.reduce((s, n) => s + n.height, 0) + (outflowNodes.length - 1) * 2,
      40,
    );

    // Position inflowNodes vertically
    const inflowTotalH = inflowNodes.reduce((s, n) => s + n.height, 0) + Math.max(0, inflowNodes.length - 1) * VERTICAL_PAD;
    let inflowY = TOP_PAD + (usableHeight - inflowTotalH) / 2;
    const inflowPositioned = inflowNodes.map((n) => {
      const y = inflowY;
      inflowY += n.height + VERTICAL_PAD;
      return { ...n, y };
    });

    // Position outflowNodes vertically
    const outflowTotalH = outflowNodes.reduce((s, n) => s + n.height, 0) + Math.max(0, outflowNodes.length - 1) * VERTICAL_PAD;
    let outflowY = TOP_PAD + (usableHeight - outflowTotalH) / 2;
    const outflowPositioned = outflowNodes.map((n) => {
      const y = outflowY;
      outflowY += n.height + VERTICAL_PAD;
      return { ...n, y };
    });

    // Center node Y
    const centerY = TOP_PAD + (usableHeight - centerHeight) / 2;

    // Build flow paths (inflow -> center)
    let centerInY = centerY;
    const inflowPaths = inflowPositioned.map((n) => {
      const h = n.height;
      const path = cubicBezier(
        LEFT_X + NODE_WIDTH, n.y,
        CENTER_X - NODE_WIDTH / 2, centerInY,
        h, h,
      );
      centerInY += h + 2;
      return { ...n, path };
    });

    // Build flow paths (center -> outflow)
    let centerOutY = centerY;
    const outflowPaths = outflowPositioned.map((n) => {
      const h = n.height;
      const path = cubicBezier(
        CENTER_X + NODE_WIDTH / 2, centerOutY,
        RIGHT_X - NODE_WIDTH, n.y,
        h, h,
      );
      centerOutY += h + 2;
      return { ...n, path };
    });

    return {
      inflowPaths,
      outflowPaths,
      centerY,
      centerHeight,
      totalInflow,
      totalOutflow,
    };
  }, [inflows, outflows]);

  const formatAmount = (v: number) =>
    v >= 1_000_000
      ? `$${(v / 1_000_000).toFixed(1)}M`
      : v >= 1_000
        ? `$${(v / 1_000).toFixed(1)}K`
        : `$${v.toFixed(0)}`;

  return (
    <div className="glass-card p-6">
      <h2 className="text-sm font-semibold text-text mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        {t("dash.flow")}
      </h2>

      {/* Summary row */}
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success" />
          <span className="text-xs text-text-dim">
            {t("dash.totalInflow")}: <span className="text-success font-mono">{formatAmount(layout.totalInflow)}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-danger" />
          <span className="text-xs text-text-dim">
            {t("dash.totalOutflow")}: <span className="text-danger font-mono">{formatAmount(layout.totalOutflow)}</span>
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-white/[0.01] border border-border">
        <svg
          width="100%"
          height={SVG_HEIGHT}
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="block"
        >
          {/* Column headers */}
          <text x={LEFT_X + NODE_WIDTH / 2} y={24} textAnchor="middle" fill="var(--color-text-muted)" fontSize="10" fontFamily="var(--font-family-sans)">
            {t("dash.inflowSources")}
          </text>
          <text x={CENTER_X} y={24} textAnchor="middle" fill="var(--color-text-dim)" fontSize="10" fontFamily="var(--font-family-sans)">
            {formatAddress(address)}
          </text>
          <text x={RIGHT_X - NODE_WIDTH / 2} y={24} textAnchor="middle" fill="var(--color-text-muted)" fontSize="10" fontFamily="var(--font-family-sans)">
            {t("dash.outflowDest")}
          </text>

          {/* Inflow flows (green) */}
          {layout.inflowPaths.map((f, i) => (
            <motion.path
              key={`in-${i}`}
              d={f.path}
              fill="rgba(16,185,129,0.15)"
              stroke="rgba(16,185,129,0.3)"
              strokeWidth="0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 + i * 0.08 }}
            />
          ))}

          {/* Outflow flows (red) */}
          {layout.outflowPaths.map((f, i) => (
            <motion.path
              key={`out-${i}`}
              d={f.path}
              fill="rgba(239,68,68,0.15)"
              stroke="rgba(239,68,68,0.3)"
              strokeWidth="0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.08 }}
            />
          ))}

          {/* Left nodes (inflow sources) */}
          {layout.inflowPaths.map((f, i) => (
            <g key={`in-node-${i}`}>
              <motion.rect
                x={LEFT_X}
                y={f.y}
                width={NODE_WIDTH}
                height={f.height}
                rx={3}
                fill="rgba(16,185,129,0.25)"
                stroke="rgba(16,185,129,0.5)"
                strokeWidth="1"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.06 }}
                style={{ originY: `${f.y + f.height / 2}px` }}
              />
              <text
                x={LEFT_X - 6}
                y={f.y + f.height / 2 - 5}
                textAnchor="end"
                fill="var(--color-text-dim)"
                fontSize="8"
                fontFamily="var(--font-family-mono)"
              >
                {f.label}
              </text>
              <text
                x={LEFT_X - 6}
                y={f.y + f.height / 2 + 7}
                textAnchor="end"
                fill="var(--color-success)"
                fontSize="8"
                fontFamily="var(--font-family-mono)"
              >
                {formatAmount(f.amount)}
              </text>
            </g>
          ))}

          {/* Center node (wallet) */}
          <motion.rect
            x={CENTER_X - NODE_WIDTH / 2}
            y={layout.centerY}
            width={NODE_WIDTH}
            height={layout.centerHeight}
            rx={4}
            fill="rgba(6,182,212,0.2)"
            stroke="rgba(6,182,212,0.5)"
            strokeWidth="1.5"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />

          {/* Right nodes (outflow destinations) */}
          {layout.outflowPaths.map((f, i) => (
            <g key={`out-node-${i}`}>
              <motion.rect
                x={RIGHT_X - NODE_WIDTH}
                y={f.y}
                width={NODE_WIDTH}
                height={f.height}
                rx={3}
                fill="rgba(239,68,68,0.25)"
                stroke="rgba(239,68,68,0.5)"
                strokeWidth="1"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.06 }}
                style={{ originY: `${f.y + f.height / 2}px` }}
              />
              <text
                x={RIGHT_X + 6}
                y={f.y + f.height / 2 - 5}
                textAnchor="start"
                fill="var(--color-text-dim)"
                fontSize="8"
                fontFamily="var(--font-family-mono)"
              >
                {f.label}
              </text>
              <text
                x={RIGHT_X + 6}
                y={f.y + f.height / 2 + 7}
                textAnchor="start"
                fill="var(--color-danger)"
                fontSize="8"
                fontFamily="var(--font-family-mono)"
              >
                {formatAmount(f.amount)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

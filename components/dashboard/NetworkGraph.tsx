"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";

/* ── Types ── */
export interface NetworkNode {
  id: string;
  type: "wallet" | "exchange" | "protocol" | "risk";
  label: string;
  volume: number;
  chain?: string;
}

export interface NetworkEdge {
  source: string;
  target: string;
  amount: number;
  chain?: string;
}

export interface RiskPathInfo {
  target: string;
  addresses: string[];
  risk_type?: string;
}

interface SimNode extends NetworkNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Props {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  riskPaths?: RiskPathInfo[];
  width?: number;
  height?: number;
}

/* ── Constants ── */
const NODE_COLORS: Record<NetworkNode["type"], string> = {
  wallet: "#06b6d4",   // primary
  exchange: "#f59e0b", // warning
  protocol: "#10b981", // success
  risk: "#ef4444",     // danger - for mixer/sanctioned nodes
};

const NODE_LABELS: Record<NetworkNode["type"], { ko: string; en: string }> = {
  wallet: { ko: "지갑", en: "Wallet" },
  exchange: { ko: "거래소", en: "Exchange" },
  protocol: { ko: "프로토콜", en: "Protocol" },
  risk: { ko: "위험", en: "Risk" },
};

const CHAIN_COLORS: Record<string, string> = {
  ethereum: "#627EEA",
  tron: "#FF0013",
  arbitrum: "#28A0F0",
  polygon: "#8247E5",
  bnb: "#F0B90B",
};

const MIN_RADIUS = 8;
const MAX_RADIUS = 28;
const REPULSION = 800;
const ATTRACTION = 0.005;
const DAMPING = 0.92;
const CENTER_GRAVITY = 0.01;
const MAX_TICKS = 300;
const VELOCITY_THRESHOLD = 0.01;

/* ── Component ── */
export default function NetworkGraph({ nodes, edges, width = 600, height = 400 }: Props) {
  const { t, locale } = useLanguage();
  const rafRef = useRef<number>(0);
  const tickRef = useRef(0);
  const [simNodes, setSimNodes] = useState<SimNode[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Compute radius scale
  const maxVolume = useMemo(
    () => Math.max(...nodes.map((n) => n.volume), 1),
    [nodes],
  );

  const radiusFor = useCallback(
    (vol: number) => MIN_RADIUS + ((vol / maxVolume) * (MAX_RADIUS - MIN_RADIUS)),
    [maxVolume],
  );

  // Initialize simulation nodes
  useEffect(() => {
    const cx = width / 2;
    const cy = height / 2;
    const initial: SimNode[] = nodes.slice(0, 50).map((n, i) => {
      const angle = (i / nodes.length) * Math.PI * 2;
      const spread = Math.min(width, height) * 0.3;
      return {
        ...n,
        x: cx + Math.cos(angle) * spread + (Math.random() - 0.5) * 40,
        y: cy + Math.sin(angle) * spread + (Math.random() - 0.5) * 40,
        vx: 0,
        vy: 0,
        radius: radiusFor(n.volume),
      };
    });
    setSimNodes(initial);
    setReady(false);
    tickRef.current = 0;
  }, [nodes, width, height, radiusFor]);

  // Force simulation loop
  useEffect(() => {
    if (simNodes.length === 0) return;

    const nodesCopy = simNodes.map((n) => ({ ...n }));
    const cx = width / 2;
    const cy = height / 2;

    // Build adjacency for attraction
    const adj = new Map<string, Set<string>>();
    edges.forEach((e) => {
      if (!adj.has(e.source)) adj.set(e.source, new Set());
      if (!adj.has(e.target)) adj.set(e.target, new Set());
      adj.get(e.source)!.add(e.target);
      adj.get(e.target)!.add(e.source);
    });

    const idxMap = new Map<string, number>();
    nodesCopy.forEach((n, i) => idxMap.set(n.id, i));

    function tick() {
      tickRef.current++;

      // Repulsion between all pairs
      for (let i = 0; i < nodesCopy.length; i++) {
        for (let j = i + 1; j < nodesCopy.length; j++) {
          const a = nodesCopy[i];
          const b = nodesCopy[j];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 1) dist = 1;
          const force = REPULSION / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          a.vx -= fx;
          a.vy -= fy;
          b.vx += fx;
          b.vy += fy;
        }
      }

      // Attraction along edges
      edges.forEach((e) => {
        const si = idxMap.get(e.source);
        const ti = idxMap.get(e.target);
        if (si === undefined || ti === undefined) return;
        const a = nodesCopy[si];
        const b = nodesCopy[ti];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = dist * ATTRACTION;
        const fx = (dx / (dist || 1)) * force;
        const fy = (dy / (dist || 1)) * force;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      });

      // Center gravity
      let totalVelocity = 0;
      for (const n of nodesCopy) {
        n.vx += (cx - n.x) * CENTER_GRAVITY;
        n.vy += (cy - n.y) * CENTER_GRAVITY;
        n.vx *= DAMPING;
        n.vy *= DAMPING;
        n.x += n.vx;
        n.y += n.vy;
        // Clamp to bounds
        const pad = n.radius + 4;
        n.x = Math.max(pad, Math.min(width - pad, n.x));
        n.y = Math.max(pad, Math.min(height - pad, n.y));
        totalVelocity += Math.abs(n.vx) + Math.abs(n.vy);
      }

      setSimNodes(nodesCopy.map((n) => ({ ...n })));

      const avgVelocity = totalVelocity / nodesCopy.length;
      if (tickRef.current < MAX_TICKS && avgVelocity > VELOCITY_THRESHOLD) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setReady(true);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simNodes.length === 0 ? 0 : 1]); // run once when simNodes first populate

  // Node map for edge lookup
  const nodeMap = useMemo(() => {
    const m = new Map<string, SimNode>();
    simNodes.forEach((n) => m.set(n.id, n));
    return m;
  }, [simNodes]);

  // Hovered node details
  const hoveredData = useMemo(() => {
    if (!hoveredNode) return null;
    return nodeMap.get(hoveredNode) || null;
  }, [hoveredNode, nodeMap]);

  const formatVolume = (v: number) =>
    v >= 1_000_000
      ? `$${(v / 1_000_000).toFixed(1)}M`
      : v >= 1_000
        ? `$${(v / 1_000).toFixed(1)}K`
        : `$${v.toFixed(0)}`;

  return (
    <div className="glass-card p-6">
      <h2 className="text-sm font-semibold text-text mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="5" r="3" />
          <circle cx="5" cy="19" r="3" />
          <circle cx="19" cy="19" r="3" />
          <line x1="12" y1="8" x2="5" y2="16" />
          <line x1="12" y1="8" x2="19" y2="16" />
        </svg>
        {t("dash.network")}
      </h2>

      {/* Legend */}
      <div className="flex gap-4 mb-3 flex-wrap">
        {(Object.keys(NODE_COLORS) as NetworkNode["type"][]).map((type) => (
          <div key={type} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: NODE_COLORS[type] }}
            />
            <span className="text-xs text-text-muted">
              {NODE_LABELS[type][locale]}
            </span>
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-xl bg-white/[0.01] border border-border">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="block"
        >
          {/* Defs for arrow markers */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="8"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.15)" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((e, i) => {
            const s = nodeMap.get(e.source);
            const tgt = nodeMap.get(e.target);
            if (!s || !tgt) return null;
            const isHighlight = hoveredNode === e.source || hoveredNode === e.target;
            return (
              <motion.line
                key={`edge-${i}`}
                x1={s.x}
                y1={s.y}
                x2={tgt.x}
                y2={tgt.y}
                stroke={isHighlight ? "rgba(6,182,212,0.4)" : "rgba(255,255,255,0.06)"}
                strokeWidth={isHighlight ? 2 : 1}
                markerEnd="url(#arrowhead)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.02 }}
              />
            );
          })}

          {/* Nodes */}
          {simNodes.map((node, i) => {
            const color = NODE_COLORS[node.type];
            const isHovered = hoveredNode === node.id;
            return (
              <motion.g
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.03, type: "spring" }}
                style={{ originX: `${node.x}px`, originY: `${node.y}px` }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer"
              >
                {/* Glow */}
                {isHovered && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius + 6}
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                    opacity={0.3}
                  />
                )}
                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius}
                  fill={`${color}20`}
                  stroke={color}
                  strokeWidth={isHovered ? 2 : 1}
                />
                {/* Label (show for large nodes or hovered) */}
                {(node.radius > 16 || isHovered) && (
                  <text
                    x={node.x}
                    y={node.y + node.radius + 14}
                    textAnchor="middle"
                    fill="var(--color-text-dim)"
                    fontSize="9"
                    fontFamily="var(--font-family-mono)"
                  >
                    {node.label.length > 10
                      ? `${node.label.slice(0, 6)}...${node.label.slice(-4)}`
                      : node.label}
                  </text>
                )}
              </motion.g>
            );
          })}
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredData && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute top-3 right-3 glass-card p-3 pointer-events-none"
              style={{ minWidth: 160 }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: NODE_COLORS[hoveredData.type] }}
                />
                <span className="text-xs font-medium text-text">
                  {NODE_LABELS[hoveredData.type][locale]}
                </span>
              </div>
              <p className="text-xs font-mono text-text-dim truncate mb-1">
                {hoveredData.label}
              </p>
              <p className="text-xs text-text-muted">
                {t("dash.volume")}: {formatVolume(hoveredData.volume)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

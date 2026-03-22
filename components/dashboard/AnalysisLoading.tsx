"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface BlockchainCube {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  x: number;
  y: number;
  delay: number;
  labels: string[];
}

const CUBES: BlockchainCube[] = [
  {
    id: "btc",
    name: "BTC",
    color: "#F7931A",
    glowColor: "rgba(247,147,26,0.3)",
    x: 50,
    y: 8,
    delay: 0,
    labels: ["BTC"],
  },
  {
    id: "tron",
    name: "TRX",
    color: "#FF0013",
    glowColor: "rgba(255,0,19,0.3)",
    x: 25,
    y: 35,
    delay: 0.3,
    labels: ["TRX", "DeFi"],
  },
  {
    id: "usdt",
    name: "USDT",
    color: "#26A17B",
    glowColor: "rgba(38,161,123,0.3)",
    x: 72,
    y: 28,
    delay: 0.15,
    labels: ["USDT"],
  },
  {
    id: "eth",
    name: "ETH",
    color: "#627EEA",
    glowColor: "rgba(98,126,234,0.3)",
    x: 65,
    y: 55,
    delay: 0.45,
    labels: ["ETH"],
  },
  {
    id: "sol",
    name: "SOL",
    color: "#14F195",
    glowColor: "rgba(20,241,149,0.3)",
    x: 30,
    y: 72,
    delay: 0.6,
    labels: ["SOL"],
  },
];

const CONNECTIONS = [
  { from: "btc", to: "usdt", color: "#F7931A" },
  { from: "tron", to: "usdt", color: "#26A17B" },
  { from: "usdt", to: "eth", color: "#627EEA" },
  { from: "tron", to: "eth", color: "#FF0013" },
  { from: "eth", to: "sol", color: "#627EEA" },
];

function getCubePosition(cube: BlockchainCube) {
  return { x: cube.x, y: cube.y };
}

function BlockCubeIcon({ color, size = 64 }: { color: string; size?: number }) {
  const topColor = color;
  const rightColor = `${color}99`;
  const frontColor = `${color}CC`;

  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      {/* Top face */}
      <path d="M40 10 L65 25 L40 40 L15 25 Z" fill={topColor} opacity="0.9" />
      {/* Left face */}
      <path d="M15 25 L40 40 L40 65 L15 50 Z" fill={frontColor} opacity="0.7" />
      {/* Right face */}
      <path d="M65 25 L40 40 L40 65 L65 50 Z" fill={rightColor} opacity="0.5" />
      {/* Edge highlights */}
      <path d="M40 10 L65 25 L40 40 L15 25 Z" stroke={color} strokeWidth="0.5" fill="none" opacity="0.6" />
      <path d="M15 25 L40 40 L40 65 L15 50 Z" stroke={color} strokeWidth="0.5" fill="none" opacity="0.4" />
      <path d="M65 25 L40 40 L40 65 L65 50 Z" stroke={color} strokeWidth="0.5" fill="none" opacity="0.3" />
    </svg>
  );
}

export default function AnalysisLoading() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] gap-6">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-xl sm:text-2xl font-bold text-white tracking-tight"
      >
        {t("dash.loading")}
      </motion.h2>

      {/* Blockchain cube network */}
      <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px]">
        {/* Connection lines SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {CONNECTIONS.map((conn, i) => {
            const from = CUBES.find((c) => c.id === conn.from)!;
            const to = CUBES.find((c) => c.id === conn.to)!;
            const fromPos = getCubePosition(from);
            const toPos = getCubePosition(to);

            return (
              <motion.line
                key={`${conn.from}-${conn.to}`}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke={conn.color}
                strokeWidth="0.3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 1, delay: 0.8 + i * 0.15 }}
              />
            );
          })}

          {/* Animated particles on lines */}
          {CONNECTIONS.map((conn, i) => {
            const from = CUBES.find((c) => c.id === conn.from)!;
            const to = CUBES.find((c) => c.id === conn.to)!;
            const fromPos = getCubePosition(from);
            const toPos = getCubePosition(to);

            return (
              <motion.circle
                key={`particle-${conn.from}-${conn.to}`}
                r="0.8"
                fill={conn.color}
                initial={{ opacity: 0 }}
                animate={{
                  cx: [fromPos.x, toPos.x],
                  cy: [fromPos.y, toPos.y],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: 1.5 + i * 0.4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            );
          })}
        </svg>

        {/* Cube nodes */}
        {CUBES.map((cube) => (
          <motion.div
            key={cube.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -6, 0],
            }}
            transition={{
              opacity: { duration: 0.5, delay: cube.delay },
              scale: { duration: 0.6, delay: cube.delay, ease: [0.16, 1, 0.3, 1] },
              y: { duration: 3, delay: cube.delay + 1, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute flex flex-col items-center"
            style={{
              left: `${cube.x}%`,
              top: `${cube.y}%`,
              transform: "translate(-50%, -50%)",
              filter: `drop-shadow(0 0 15px ${cube.glowColor})`,
            }}
          >
            <BlockCubeIcon color={cube.color} size={56} />
            {/* Labels */}
            <div className="flex gap-1 mt-1">
              {cube.labels.map((label) => (
                <span
                  key={label}
                  className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                  style={{
                    color: cube.color,
                    background: `${cube.color}15`,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center gap-3"
      >
        {/* Pulsing dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.2,
                delay: i * 0.2,
                repeat: Infinity,
              }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
            />
          ))}
        </div>

        <p className="text-white/30 text-xs">
          Analyzing on-chain data...
        </p>
      </motion.div>
    </div>
  );
}

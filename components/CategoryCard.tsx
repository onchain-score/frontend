"use client";

import { motion } from "framer-motion";
import type { CategoryScore } from "@/lib/types";
import { CATEGORY_CONFIGS } from "@/lib/scoring-config";

interface Props {
  data: CategoryScore;
  index: number;
}

/** Derive UI metadata from the shared config */
function getCategoryConfig(category: string) {
  return CATEGORY_CONFIGS.find((c) => c.category === category);
}

export default function CategoryCard({ data, index }: Props) {
  const config = getCategoryConfig(data.category);
  if (!config) return null;

  const Icon = config.icon;
  const percent = (data.score / data.maxScore) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.8 + index * 0.12,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="glass-card glass-card-hover p-5 sm:p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${config.color}15` }}
          >
            <Icon className="w-5 h-5" style={{ color: config.color }} />
          </div>
          <div>
            <h3 className="font-semibold text-text text-sm">{data.label}</h3>
            <p className="text-text-muted text-xs mt-0.5">{data.description}</p>
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-text-dim text-xs font-mono">{data.detail}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono" style={{ color: config.color }}>
              {data.score}
            </span>
            <span className="text-text-muted text-xs font-mono">/{data.maxScore}</span>
          </div>
        </div>

        <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{
              delay: 1.0 + index * 0.12,
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`h-full rounded-full ${config.barClass}`}
          />
        </div>
      </div>
    </motion.div>
  );
}

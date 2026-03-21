"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./providers/LanguageProvider";

interface Props {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: Props) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState(0);
  // 0: grid + glow appear
  // 1: logo text reveal
  // 2: tagline
  // 3: score numbers flash
  // 4: exit

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2000),
      setTimeout(() => setPhase(4), 3200),
      setTimeout(() => onComplete(), 3800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 4 && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg overflow-hidden"
        >
          {/* Animated grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 grid-bg"
          />

          {/* Center glow */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)",
            }}
          />

          {/* Orbiting particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5],
                x: [0, Math.cos((i * Math.PI) / 3) * 120, Math.cos((i * Math.PI) / 3) * 200],
                y: [0, Math.sin((i * Math.PI) / 3) * 120, Math.sin((i * Math.PI) / 3) * 200],
              }}
              transition={{
                duration: 3,
                delay: 0.3 + i * 0.15,
                ease: "easeOut",
              }}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: i % 2 === 0 ? "#06b6d4" : "#8b5cf6",
                boxShadow: `0 0 12px ${i % 2 === 0 ? "#06b6d4" : "#8b5cf6"}`,
              }}
            />
          ))}

          {/* Hexagon ring */}
          <motion.div
            initial={{ opacity: 0, rotate: 0, scale: 0.5 }}
            animate={{
              opacity: phase >= 1 ? [0.2, 0.1] : 0,
              rotate: 180,
              scale: 1,
            }}
            transition={{ duration: 3, ease: "linear" }}
            className="absolute"
          >
            <svg width="280" height="280" viewBox="0 0 280 280" fill="none">
              <path
                d="M140 10 L250 75 L250 205 L140 270 L30 205 L30 75 Z"
                stroke="url(#hexGrad)"
                strokeWidth="0.5"
                fill="none"
              />
              <defs>
                <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo text */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: 80, opacity: 0 }}
                animate={phase >= 1 ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-7xl font-black tracking-tight leading-none"
              >
                <span className="gradient-text">ONCHAIN</span>
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: 80, opacity: 0 }}
                animate={phase >= 1 ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-7xl font-black tracking-tight leading-none text-text"
              >
                SCORE
              </motion.h1>
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mt-4 text-text-dim text-sm sm:text-base"
            >
              {t("splash.tagline")}
            </motion.p>

            {/* Score numbers flash */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={phase >= 3 ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
              className="mt-8 flex items-center gap-3"
            >
              {[847, 623, 912, 756, 491].map((num, i) => (
                <motion.span
                  key={num}
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={
                    phase >= 3
                      ? { opacity: [0, 1, 0.3], scale: [0.5, 1, 0.9], y: [20, 0, 0] }
                      : {}
                  }
                  transition={{
                    duration: 0.6,
                    delay: i * 0.08,
                    ease: "easeOut",
                  }}
                  className="font-mono text-lg font-bold"
                  style={{
                    color: ["#06b6d4", "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"][i],
                    opacity: 0.3,
                  }}
                >
                  {num}
                </motion.span>
              ))}
            </motion.div>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={phase >= 1 ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="mt-8 w-48 h-[2px] bg-white/[0.06] rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.8, ease: [0.4, 0, 0.2, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

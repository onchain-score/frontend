"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState(0);
  // 0: black void
  // 1: background + icons fade in
  // 2: text appears
  // 3: exit

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1600),
      setTimeout(() => setPhase(3), 3200),
      setTimeout(() => onComplete(), 3800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] overflow-hidden flex items-center justify-center"
          style={{ background: "#010104" }}
        >
          {/* Subtle radial noise texture */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 0.15 : 0 }}
            transition={{ duration: 1 }}
            style={{
              background: "radial-gradient(ellipse at 50% 40%, rgba(0,100,200,0.06) 0%, transparent 60%)",
            }}
          />

          {/* Center ambient glow */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: "min(100vw, 700px)",
              height: "min(100vw, 700px)",
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: phase >= 2 ? 0.5 : phase >= 1 ? 0.2 : 0,
              background: phase >= 2
                ? "radial-gradient(circle, rgba(0,100,255,0.15) 0%, rgba(150,0,255,0.08) 40%, transparent 65%)"
                : "radial-gradient(circle, rgba(0,100,255,0.08) 0%, transparent 50%)",
            }}
            transition={{ duration: 1 }}
          />

          {/* USDT - top */}
          <NeonCoinIcon phase={phase} color="#00FFA3" xPct={50} yPct={14} flickerDelay={0}
            icon={<span className="text-[1.8em] font-black leading-none" style={{ fontFamily: "Arial, sans-serif" }}>T</span>}
          />

          {/* BTC - left */}
          <NeonCoinIcon phase={phase} color="#FF9500" xPct={18} yPct={46} flickerDelay={0.1}
            icon={<span className="text-[1.8em] font-black leading-none" style={{ fontFamily: "Arial, sans-serif" }}>B</span>}
          />

          {/* TRON - right */}
          <NeonCoinIcon phase={phase} color="#FF2050" xPct={82} yPct={46} flickerDelay={0.2}
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="w-[1.6em] h-[1.6em]">
                <path d="M4 4L20.5 2 14.5 22 4 4z" fill="currentColor" opacity="0.4"/>
                <path d="M4 4l8 3.5L20.5 2 14.5 22 4 4z" fill="currentColor"/>
              </svg>
            }
          />

          {/* ETH - bottom-left */}
          <NeonCoinIcon phase={phase} color="#00BFFF" xPct={28} yPct={78} flickerDelay={0.15}
            icon={
              <svg viewBox="0 0 24 28" fill="none" className="w-[1.4em] h-[1.8em]">
                <path d="M12 0L0 14.4 12 10.4V0z" fill="currentColor"/>
                <path d="M12 0v10.4l12 4L12 0z" fill="currentColor" opacity="0.6"/>
                <path d="M12 19.2V28l12-12.8L12 19.2z" fill="currentColor" opacity="0.6"/>
                <path d="M12 28v-8.8L0 15.2 12 28z" fill="currentColor"/>
                <path d="M0 14.4l12 4.8V10.4L0 14.4z" fill="currentColor" opacity="0.6"/>
                <path d="M12 19.2l12-4.8L12 10.4v8.8z" fill="currentColor" opacity="0.3"/>
              </svg>
            }
          />

          {/* SOL - bottom-right */}
          <NeonCoinIcon phase={phase} color="#BF5FFF" xPct={72} yPct={78} flickerDelay={0.25}
            icon={
              <svg viewBox="0 0 24 20" fill="none" className="w-[1.6em] h-[1.3em]">
                <path d="M0 15.5h16L20 19.5H4L0 15.5z" fill="currentColor"/>
                <path d="M0 4.5h16L20 0.5H4L0 4.5z" fill="currentColor"/>
                <path d="M20 10H4L0 6h16l4 4z" fill="currentColor" opacity="0.7"/>
              </svg>
            }
          />

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-7xl font-black tracking-tight leading-none gradient-text"
              >
                ONCHAIN
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-7xl font-black tracking-tight leading-none text-text"
              >
                SCORE
              </motion.h1>
            </div>
          </div>

          {/* Neon loading bar */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-36 sm:w-48 z-30">
            <div className="h-[2px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.8, ease: [0.4, 0, 0.2, 1] }}
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #00f0ff, #d050ff)",
                  boxShadow: "0 0 8px #00f0ff, 0 0 16px #d050ff80",
                }}
              />
            </div>
          </div>

          {/* Ambient neon particles */}
          {phase >= 2 && [...Array(20)].map((_, i) => {
            const x = (i * 47 + 13) % 100;
            const y = (i * 61 + 7) % 100;
            const colors = ["#00f0ff", "#ff00aa", "#00ff88", "#ff6600", "#bf5fff"];
            const c = colors[i % 5];
            return (
              <motion.div
                key={`np-${i}`}
                className="absolute rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{
                  duration: ((i % 3) + 2),
                  repeat: Infinity,
                  delay: (i % 5) * 0.3,
                }}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: 2,
                  height: 2,
                  background: c,
                  boxShadow: `0 0 6px ${c}`,
                }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NeonCoinIcon({
  phase,
  color,
  xPct,
  yPct,
  flickerDelay,
  icon,
}: {
  phase: number;
  color: string;
  xPct: number;
  yPct: number;
  flickerDelay: number;
  icon: React.ReactNode;
}) {
  const isOn = phase >= 2;

  return (
    <motion.div
      className="absolute z-10 flex items-center justify-center"
      style={{
        width: "clamp(80px, 18vw, 120px)",
        height: "clamp(80px, 18vw, 120px)",
        left: `${xPct}%`,
        top: `${yPct}%`,
        transform: "translate(-50%, -50%)",
        color: isOn ? color : "#111",
        transition: "color 0.2s",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isOn ? 1 : 0 }}
      transition={{ duration: 0.5, delay: isOn ? flickerDelay : 0 }}
    >
      {/* Outer neon glow - strong */}
      <motion.div
        className="absolute inset-[-8px] rounded-full"
        animate={
          isOn
            ? {
                boxShadow: [
                  `0 0 20px ${color}70, 0 0 50px ${color}35, 0 0 80px ${color}15`,
                  `0 0 30px ${color}90, 0 0 70px ${color}50, 0 0 100px ${color}25`,
                  `0 0 20px ${color}70, 0 0 50px ${color}35, 0 0 80px ${color}15`,
                ],
              }
            : { boxShadow: "0 0 0px transparent" }
        }
        transition={{
          boxShadow: isOn
            ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.2 },
        }}
      />

      {/* Ring border - neon */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `2px solid ${isOn ? color : "transparent"}`,
          boxShadow: isOn ? `inset 0 0 12px ${color}30` : "none",
          transition: "all 0.3s",
        }}
      />

      {/* 3D sphere body */}
      <div
        className="absolute inset-[2px] rounded-full overflow-hidden"
        style={{
          background: isOn
            ? `radial-gradient(circle at 35% 28%, ${color}50, ${color}20 35%, ${color}08 55%, #050810 80%)`
            : "#050810",
          transition: "background 0.4s",
        }}
      >
        {/* Specular highlight */}
        <div
          className="absolute rounded-full"
          style={{
            width: "50%",
            height: "35%",
            top: "8%",
            left: "15%",
            background: isOn
              ? `radial-gradient(ellipse, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 40%, transparent 70%)`
              : "transparent",
            filter: "blur(1.5px)",
          }}
        />
        {/* Rim light - bottom edge */}
        <div
          className="absolute"
          style={{
            width: "80%",
            height: "15%",
            bottom: "5%",
            left: "10%",
            background: isOn
              ? `radial-gradient(ellipse, ${color}30, transparent 70%)`
              : "transparent",
            filter: "blur(3px)",
          }}
        />
        {/* Side rim */}
        <div
          className="absolute rounded-full"
          style={{
            width: "10%",
            height: "60%",
            top: "20%",
            right: "5%",
            background: isOn
              ? `linear-gradient(180deg, transparent, ${color}15, transparent)`
              : "transparent",
            filter: "blur(2px)",
          }}
        />
      </div>

      {/* Icon - brighter with stronger glow */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        animate={
          isOn
            ? {
                filter: [
                  `drop-shadow(0 0 4px ${color}A0) drop-shadow(0 0 8px ${color}50)`,
                  `drop-shadow(0 0 6px ${color}C0) drop-shadow(0 0 12px ${color}60)`,
                  `drop-shadow(0 0 4px ${color}A0) drop-shadow(0 0 8px ${color}50)`,
                ],
              }
            : { filter: "none" }
        }
        transition={{
          filter: isOn
            ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.2 },
        }}
      >
        {icon}
      </motion.div>

      {/* Power-on burst */}
      {isOn && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: color, filter: "blur(25px)" }}
          initial={{ opacity: 0.6, scale: 0.8 }}
          animate={{ opacity: 0, scale: 2.5 }}
          transition={{ duration: 0.7, delay: flickerDelay }}
        />
      )}
    </motion.div>
  );
}

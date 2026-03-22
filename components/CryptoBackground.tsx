"use client";

import { motion } from "framer-motion";

const NEON_ICONS = [
  { name: "BTC", color: "#FF9500", x: "3%", y: "40%", delay: 0 },
  { name: "TRON", color: "#FF2050", x: "95%", y: "42%", delay: 0.3 },
  { name: "ETH", color: "#00BFFF", x: "6%", y: "85%", delay: 0.6 },
  { name: "SOL", color: "#BF5FFF", x: "92%", y: "88%", delay: 0.9 },
];

const ICONS: Record<string, React.ReactNode> = {
  BTC: <span className="text-lg font-black" style={{ fontFamily: "Arial, sans-serif" }}>B</span>,
  TRON: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M4 4L20.5 2 14.5 22 4 4z" fill="currentColor" opacity="0.4"/>
      <path d="M4 4l8 3.5L20.5 2 14.5 22 4 4z" fill="currentColor"/>
    </svg>
  ),
  ETH: (
    <svg viewBox="0 0 24 28" fill="none" className="w-4 h-5">
      <path d="M12 0L0 14.4 12 10.4V0z" fill="currentColor"/>
      <path d="M12 0v10.4l12 4L12 0z" fill="currentColor" opacity="0.6"/>
      <path d="M12 19.2V28l12-12.8L12 19.2z" fill="currentColor" opacity="0.6"/>
      <path d="M12 28v-8.8L0 15.2 12 28z" fill="currentColor"/>
    </svg>
  ),
  SOL: (
    <svg viewBox="0 0 24 20" fill="none" className="w-5 h-4">
      <path d="M0 15.5h16L20 19.5H4L0 15.5z" fill="currentColor"/>
      <path d="M0 4.5h16L20 0.5H4L0 4.5z" fill="currentColor"/>
      <path d="M20 10H4L0 6h16l4 4z" fill="currentColor" opacity="0.7"/>
    </svg>
  ),
};

export default function CryptoBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: "#010104" }}>
      {/* Deep ambient glows */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,60,180,0.1) 0%, rgba(100,0,200,0.05) 40%, transparent 65%)",
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px]"
        style={{
          background: "radial-gradient(ellipse at 50% 100%, rgba(200,0,255,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Neon particles */}
      {[...Array(20)].map((_, i) => {
        const x = (i * 47 + 13) % 100;
        const y = (i * 61 + 7) % 100;
        const colors = ["#00f0ff", "#ff00aa", "#00ff88", "#ff9500", "#bf5fff"];
        const c = colors[i % 5];
        return (
          <motion.div
            key={`np-${i}`}
            className="absolute rounded-full"
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{
              duration: ((i % 3) + 2),
              repeat: Infinity,
              delay: (i % 5) * 0.5,
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

      {/* Floating neon coin icons */}
      {NEON_ICONS.map((coin) => (
        <motion.div
          key={coin.name}
          className="absolute flex items-center justify-center"
          style={{
            left: coin.x,
            top: coin.y,
            width: 52,
            height: 52,
            color: coin.color,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.6,
            y: [0, -6, 0],
          }}
          transition={{
            opacity: { duration: 0.8, delay: coin.delay },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: coin.delay },
          }}
        >
          {/* Outer glow */}
          <div
            className="absolute inset-[-5px] rounded-full"
            style={{ boxShadow: `0 0 15px ${coin.color}50, 0 0 35px ${coin.color}25, 0 0 60px ${coin.color}10` }}
          />
          {/* Ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: `1.5px solid ${coin.color}70`, boxShadow: `inset 0 0 8px ${coin.color}20` }}
          />
          {/* 3D sphere body */}
          <div
            className="absolute inset-[1.5px] rounded-full overflow-hidden"
            style={{
              background: `radial-gradient(circle at 35% 28%, ${coin.color}45, ${coin.color}15 40%, #050810 75%)`,
            }}
          >
            <div
              className="absolute rounded-full"
              style={{
                width: "50%", height: "30%", top: "8%", left: "15%",
                background: "radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 70%)",
                filter: "blur(1.5px)",
              }}
            />
          </div>
          {/* Icon */}
          <div
            className="relative z-10 flex items-center justify-center w-full h-full"
            style={{ filter: `drop-shadow(0 0 4px ${coin.color}A0) drop-shadow(0 0 8px ${coin.color}50)` }}
          >
            {ICONS[coin.name]}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

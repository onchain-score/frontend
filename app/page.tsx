"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import CryptoBackground from "@/components/CryptoBackground";
import WalletInput from "@/components/WalletInput";
import SplashScreen from "@/components/SplashScreen";
import AuthButton from "@/components/AuthButton";
import LanguageSelector from "@/components/LanguageSelector";

export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <CryptoBackground />

        {/* Nav bar */}
        <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <span className="text-sm font-bold gradient-text tracking-tight">
              Onchain Score
            </span>
            <div className="flex items-center gap-3">
              <AuthButton />
              <LanguageSelector />
            </div>
          </div>
        </nav>

        {/* Title - large italic bold, Onchain=cyan, Score=purple like the design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-6 sm:mb-10"
        >
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9]">
            <span className="gradient-text">Onchain</span>
            <br />
            <span className="text-text">Score</span>
          </h1>
        </motion.div>

        {/* Wallet card - neon blue border with bottom glow like design */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative"
        >
          {/* Bottom glow effect under card */}
          <div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-20 rounded-full"
            style={{
              background: "radial-gradient(ellipse, rgba(80,140,255,0.4) 0%, rgba(140,80,255,0.25) 40%, transparent 70%)",
              filter: "blur(16px)",
            }}
          />

          <div
            className="relative rounded-2xl p-6 sm:p-8 overflow-hidden"
            style={{
              background: "linear-gradient(180deg, rgba(10,15,40,0.92) 0%, rgba(8,10,30,0.95) 100%)",
              border: "1px solid rgba(80,140,255,0.35)",
              boxShadow: "0 0 20px rgba(80,140,255,0.15), 0 0 50px rgba(80,140,255,0.08), 0 0 100px rgba(120,60,255,0.06), inset 0 0 30px rgba(80,140,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* Top highlight line */}
            <div
              className="absolute top-0 left-0 right-0 h-[1px]"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(100,160,255,0.5), rgba(160,100,255,0.4), transparent)",
                boxShadow: "0 0 10px rgba(100,160,255,0.3)",
              }}
            />

            <WalletInput />
          </div>
        </motion.div>
      </main>
    </>
  );
}

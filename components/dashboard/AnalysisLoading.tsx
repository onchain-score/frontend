"use client";

import { motion } from "framer-motion";
import Lottie from "lottie-react";
import blockchainAnimation from "@/public/blockchain-loading.json";

export default function AnalysisLoading() {

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl sm:text-2xl font-bold text-white text-center"
      >
        지갑 데이터 분석 중...
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="w-full max-w-md sm:max-w-lg"
      >
        <Lottie
          animationData={blockchainAnimation}
          loop
          autoplay
          style={{ width: "100%", height: "auto" }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col items-center gap-3"
      >
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
        <p className="text-white/40 text-sm">Analyzing on-chain data...</p>
      </motion.div>
    </div>
  );
}

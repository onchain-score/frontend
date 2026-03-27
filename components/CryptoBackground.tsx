"use client";

import Lottie from "lottie-react";
import cryptoAnimation from "@/public/crypto-bg.json";

export default function CryptoBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Dark base */}
      <div className="absolute inset-0 bg-[#050510]" />

      {/* Lottie animation centered */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40">
        <Lottie
          animationData={cryptoAnimation}
          loop
          autoplay
          style={{ width: "120%", height: "120%", maxWidth: "none" }}
        />
      </div>

      {/* Top/bottom gradient fade */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050510] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050510] to-transparent" />
    </div>
  );
}

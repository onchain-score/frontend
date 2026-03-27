"use client";

import Lottie from "lottie-react";
import cryptoAnimation from "@/public/crypto-bg.json";

export default function CryptoBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Dark base */}
      <div className="absolute inset-0 bg-[#050510]" />

      {/* Lottie animation - color shifted to match dark blue/cyan/purple theme */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: 0.3,
          filter: "hue-rotate(200deg) saturate(1.8) brightness(0.7)",
        }}
      >
        <Lottie
          animationData={cryptoAnimation}
          loop
          autoplay
          style={{ width: "140%", height: "140%", maxWidth: "none" }}
        />
      </div>

      {/* Subtle blue/purple overlay blend */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(6,182,212,0.06) 0%, rgba(139,92,246,0.04) 50%, transparent 80%)",
        }}
      />

      {/* Edge fades */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#050510] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050510] to-transparent" />
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#050510] to-transparent" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#050510] to-transparent" />
    </div>
  );
}
